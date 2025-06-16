import React from 'react';
import htm from 'htm';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

const NOTIFICATION_TEMPLATES = {
    Advisory: {
        prefix: 'ADV',
        title: 'Product Advisory: [Product Name]',
        body: 'Dear [Customer Name],\n\nThis letter is to inform you of a product advisory for [Product Name], lot number [Lot Number].\n\n[Describe advisory details here.]\n\nWe apologize for any inconvenience.\n\nSincerely,\nThe Quality Team',
    },
    Recall: {
        prefix: 'REC',
        title: 'URGENT: Product Recall Notice for [Product Name]',
        body: 'Dear [Customer Name],\n\nThis is an URGENT product recall notice for [Product Name], lot number [Lot Number].\n\nPlease cease use and distribution of the affected product immediately.\n\n[Provide instructions for return or disposal here.]\n\nYour safety is our highest priority. We apologize for this inconvenience and appreciate your cooperation.\n\nSincerely,\nThe Quality Team',
    },
    Alert: {
        prefix: 'ALR',
        title: 'Important Safety Alert: [Product Name]',
        body: 'Dear [Customer Name],\n\nWe are issuing an important safety alert concerning [Product Name], lot number [Lot Number].\n\n[Describe the safety concern and recommended actions here.]\n\nYour immediate attention to this matter is appreciated.\n\nSincerely,\nThe Quality Team',
    },
    Notification: {
        prefix: 'NOT',
        title: 'Important Notification Regarding [Product Name]',
        body: 'Dear [Customer Name],\n\nThis is an important notification regarding [Product Name].\n\n[Provide notification details here.]\n\nThank you for your attention to this matter.\n\nSincerely,\nThe Quality Team',
    },
    Custom: {
        prefix: 'CUS',
        title: 'A Message Regarding [Product Name]',
        body: 'Dear [Customer Name],\n\n[Enter custom message here.]\n\nSincerely,\nThe Quality Team',
    },
};

export const NotificationGenerator = ({ title, storageKey, initialData }) => {
    const [data, setData] = useState(initialData);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            const parsedData = storedData ? JSON.parse(storedData) : initialData;
            // Ensure images array exists for new and old data structures
            if (!parsedData.images) {
                parsedData.images = [];
            }
            // Simple migration for old imageUrl
            if (parsedData.imageUrl) {
                // To avoid breaking on old URL-based images, we just show it's deprecated.
                // New system uses file uploads (data URLs).
                console.warn("Found deprecated 'imageUrl'. Please re-upload images using the new system.");
                delete parsedData.imageUrl;
            }
            setData(parsedData);
        } catch (error) {
            console.error("Failed to load notification generator data", error);
            setData(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setData(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save notification generator data", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        persistData({ ...data, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                persistData({ ...data, logoUrl: event.target.result });
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert('Please select a PNG or JPG file for the logo.');
        }
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        const template = NOTIFICATION_TEMPLATES[newType];
        if (template) {
            persistData({ 
                ...data, 
                notificationType: newType,
                title: template.title,
                body: template.body,
                controlNumberPrefix: template.prefix,
            });
        }
    };
    
    const parseRecipients = useCallback(() => {
        if (!data.recipients) return [];
        const results = Papa.parse(data.recipients.trim(), {
            header: true,
            skipEmptyLines: true,
        });

        if (results.errors.length) {
            console.error("CSV parsing errors:", results.errors);
            alert(`Error parsing recipients CSV: ${results.errors[0].message}`);
            return [];
        }
        return results.data;
    }, [data.recipients]);

    const recipients = useMemo(() => parseRecipients(), [parseRecipients]);

    const replacePlaceholders = (text, recipient) => {
        if (!text || !recipient) return text || '';
        return text.replace(/\[([^\]]+)\]/g, (match, placeholder) => {
            return recipient[placeholder] || match;
        });
    };

    const handleAddImage = () => {
        persistData({
            ...data,
            images: [...(data.images || []), { id: Date.now(), dataUrl: null, position: 'Top of Body', fileType: null }]
        });
    };

    const handleImageFileChange = (e, id) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const updatedImages = (data.images || []).map(img => 
                    img.id === id ? { ...img, dataUrl: event.target.result, fileType: file.type } : img
                );
                persistData({ ...data, images: updatedImages });
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert('Please select a PNG or JPG file.');
        }
    };

    const handleImagePositionChange = (e, id) => {
        const newPosition = e.target.value;
        const updatedImages = (data.images || []).map(img => 
            img.id === id ? { ...img, position: newPosition } : img
        );
        persistData({ ...data, images: updatedImages });
    };

    const handleRemoveImage = (id) => {
        const updatedImages = (data.images || []).filter(img => img.id !== id);
        persistData({ ...data, images: updatedImages });
    };
    
    const addImageToPDF = async (doc, imageData, yPos, { MARGIN, PAGE_WIDTH, PAGE_HEIGHT, TEXT_WIDTH }) => {
        if (!imageData.dataUrl) return yPos;

        try {
            const imgProps = doc.getImageProperties(imageData.dataUrl);
            const aspect = imgProps.width / imgProps.height;
            const imgWidth = Math.min(TEXT_WIDTH, 180);
            const imgHeight = imgWidth / aspect;

            if (yPos + imgHeight > PAGE_HEIGHT - MARGIN) {
                doc.addPage();
                yPos = MARGIN;
            }
            doc.addImage(imageData.dataUrl, imageData.fileType, MARGIN, yPos, imgWidth, imgHeight);
            return yPos + imgHeight + 5;
        } catch (e) {
            console.error("Could not add image to PDF", e);
            return yPos;
        }
    };

    const handleGeneratePDF = useCallback(async () => {
        if (recipients.length === 0) {
            alert('Please provide recipient data in CSV format.');
            return;
        }

        setIsGenerating(true);
        const doc = new jsPDF({
            unit: 'mm',
            format: 'a4',
        });
        let firstPage = true;
        let currentControlNumber = data.lastControlNumber || 0;
        const MARGIN = 15;
        const FONT_SIZE_TITLE = 16;
        const FONT_SIZE_BODY = 12;
        const FONT_SIZE_HEADER = 10;
        const PAGE_WIDTH = doc.internal.pageSize.getWidth();
        const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
        const TEXT_WIDTH = PAGE_WIDTH - MARGIN * 2;
        const pdfContext = { MARGIN, PAGE_WIDTH, PAGE_HEIGHT, TEXT_WIDTH };

        const images = data.images || [];

        for (const recipient of recipients) {
            if (!firstPage) {
                doc.addPage();
            }
            firstPage = false;
            
            currentControlNumber++;
            const controlNumber = `${data.controlNumberPrefix}-${String(currentControlNumber).padStart(4, '0')}`;
            
            // Header
            let yPos = MARGIN;
            if (data.logoUrl) {
                try {
                    const imgProps = doc.getImageProperties(data.logoUrl);
                    const logoHeight = 15;
                    const logoWidth = (imgProps.width * logoHeight) / imgProps.height;
                    doc.addImage(data.logoUrl, 'PNG', MARGIN, MARGIN, logoWidth, logoHeight);
                    yPos += logoHeight + 5; // move other header content down
                } catch(e) {
                    console.error("Error adding logo to PDF", e);
                }
            }
            
            doc.setFontSize(FONT_SIZE_HEADER);
            doc.text(`Control Number: ${controlNumber}`, MARGIN, MARGIN + 5);
            doc.text(new Date().toLocaleDateString(), PAGE_WIDTH - MARGIN, MARGIN + 5, { align: 'right' });
            
            // Title
            yPos = Math.max(yPos, MARGIN + 20);
            doc.setFontSize(FONT_SIZE_TITLE);
            doc.setFont(undefined, 'bold');
            const mailTitle = replacePlaceholders(data.title, recipient);
            const splitTitle = doc.splitTextToSize(mailTitle, TEXT_WIDTH);
            doc.text(splitTitle, MARGIN, yPos);
            yPos += (splitTitle.length * (FONT_SIZE_TITLE * 0.5)) + 5;

            // Images Below Title
            for (const image of images.filter(img => img.position === 'Below Title')) {
                yPos = await addImageToPDF(doc, image, yPos, pdfContext);
            }
            
            // Images Top of Body
            yPos += 5;
            for (const image of images.filter(img => img.position === 'Top of Body')) {
                yPos = await addImageToPDF(doc, image, yPos, pdfContext);
            }

            // Body
            yPos += 5;
            doc.setFontSize(FONT_SIZE_BODY);
            doc.setFont(undefined, 'normal');
            const bodyText = replacePlaceholders(data.body, recipient);
            const splitBody = doc.splitTextToSize(bodyText, TEXT_WIDTH);

            let remainingBody = [...splitBody];
            while (remainingBody.length > 0) {
                const spaceLeft = PAGE_HEIGHT - yPos - MARGIN;
                const linesThatFit = Math.max(1, Math.floor(spaceLeft / (FONT_SIZE_BODY * 0.45)));
                const linesToPrint = remainingBody.splice(0, linesThatFit);
                
                if (yPos + linesToPrint.length * (FONT_SIZE_BODY * 0.45) > PAGE_HEIGHT - MARGIN && yPos > MARGIN) {
                    doc.addPage();
                    yPos = MARGIN;
                }
                
                doc.text(linesToPrint, MARGIN, yPos);
                yPos += linesToPrint.length * (FONT_SIZE_BODY * 0.45);
            }
            
            // Images Bottom of Body
            for (const image of images.filter(img => img.position === 'Bottom of Body')) {
                yPos = await addImageToPDF(doc, image, yPos, pdfContext);
            }
        }

        doc.save(`Notifications-${data.controlNumberPrefix}-${Date.now()}.pdf`);
        persistData({ ...data, lastControlNumber: currentControlNumber });
        setIsGenerating(false);
    }, [data, recipients, persistData]);

    const handleGenerateXLSX = useCallback(() => {
        if (recipients.length === 0) {
            alert('Please provide recipient data in CSV format.');
            return;
        }

        setIsGenerating(true);
        let currentControlNumber = data.lastControlNumber || 0;

        const exportData = recipients.map(recipient => {
            currentControlNumber++;
            const controlNumber = `${data.controlNumberPrefix}-${String(currentControlNumber).padStart(4, '0')}`;
            return {
                'Control Number': controlNumber,
                ...recipient
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Generated Notifications");
        XLSX.writeFile(workbook, `Notification-Log-${data.controlNumberPrefix}-${Date.now()}.xlsx`);

        persistData({ ...data, lastControlNumber: currentControlNumber });
        setIsGenerating(false);
    }, [data, recipients, persistData]);

    const previewRecipient = recipients[0] || {};
    const previewTitle = replacePlaceholders(data.title, previewRecipient);
    const previewBody = replacePlaceholders(data.body, previewRecipient);
    const positionOptions = [
        { value: 'Below Title', label: 'Below Title' },
        { value: 'Top of Body', label: 'Top of Body' },
        { value: 'Bottom of Body', label: 'Bottom of Body' },
    ];

    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <div className="notification-generator-layout">
                <div className="notification-controls">
                    <h4>Configuration & Data</h4>
                    <form className="notification-form">
                        <div className="form-group">
                            <label htmlFor="logo-upload">Company Logo (PNG/JPG)</label>
                            <input id="logo-upload" type="file" name="logo" className="form-control" accept="image/png, image/jpeg" onChange=${handleLogoChange} />
                            ${data.logoUrl && html`<img src=${data.logoUrl} alt="Company logo preview" style=${{ maxWidth: '150px', maxHeight: '75px', height: 'auto', marginTop: '1rem', border: '1px solid var(--border-color)', padding: '0.5rem', objectFit: 'contain' }} />`}
                        </div>
                        <div className="form-group">
                            <label htmlFor="notification-type">Notification Type</label>
                            <select id="notification-type" name="notificationType" className="form-control" value=${data.notificationType} onChange=${handleTypeChange}>
                                ${Object.keys(NOTIFICATION_TEMPLATES).map(type => html`<option key=${type} value=${type}>${type}</option>`)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="control-number-prefix">Control Number Prefix</label>
                            <input id="control-number-prefix" type="text" name="controlNumberPrefix" className="form-control" value=${data.controlNumberPrefix} onInput=${handleInputChange} />
                            <small>Last control number used: ${data.lastControlNumber || 0}</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="notification-title">Notification Title</label>
                            <input id="notification-title" type="text" name="title" className="form-control" value=${data.title} onInput=${handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Additional Images</label>
                            <div className="image-list">
                                ${(data.images || []).map((image, index) => html`
                                    <div key=${image.id} className="image-item">
                                        <div className="image-item-controls">
                                            <input type="file" className="form-control" accept="image/png, image/jpeg" onChange=${e => handleImageFileChange(e, image.id)} />
                                            <select className="form-control" value=${image.position} onChange=${e => handleImagePositionChange(e, image.id)}>
                                                ${positionOptions.map(opt => html`<option key=${opt.value} value=${opt.value}>${opt.label}</option>`)}
                                            </select>
                                        </div>
                                        <button type="button" className="control-btn" onClick=${() => handleRemoveImage(image.id)}>Remove</button>
                                        ${image.dataUrl && html`
                                            <div className="image-item-preview">
                                                <img src=${image.dataUrl} alt="Additional image preview" />
                                            </div>
                                        `}
                                    </div>
                                `)}
                            </div>
                            <button type="button" className="control-btn" style=${{ marginTop: '1rem', alignSelf: 'flex-start' }} onClick=${handleAddImage}>Add Image</button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="notification-body">Notification Body</label>
                            <textarea id="notification-body" name="body" className="form-control" value=${data.body} onInput=${handleInputChange}></textarea>
                            <small>Use placeholders like [ColumnName] to merge data from recipients.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="notification-recipients">Recipients (CSV Format)</label>
                            <textarea id="notification-recipients" name="recipients" className="form-control" value=${data.recipients} onInput=${handleInputChange}></textarea>
                            <small>First line must be headers. E.g., Customer Name,Product Name,Address</small>
                        </div>
                    </form>
                    <div className="notification-actions">
                        <button className="btn" onClick=${handleGeneratePDF} disabled=${isGenerating || recipients.length === 0}>${isGenerating ? 'Generating...' : `Generate ${recipients.length} PDF(s)`}</button>
                        <button className="control-btn" onClick=${handleGenerateXLSX} disabled=${isGenerating || recipients.length === 0}>${isGenerating ? 'Generating...' : `Generate XLSX Log`}</button>
                    </div>
                </div>
                <div className="notification-preview-container">
                    <h4>Live Preview (First Recipient)</h4>
                    <div className="notification-preview">
                        <div className="notification-preview-header" style=${{ alignItems: 'flex-start', display: 'flex' }}>
                            ${data.logoUrl && html`<img src=${data.logoUrl} alt="Company logo preview" style=${{ maxWidth: '100px', maxHeight: '50px', height: 'auto', marginRight: '1rem', flexShrink: 0 }} />`}
                            <div style=${{flexGrow: 1, textAlign: 'right'}}>
                                <p><strong>To:</strong> ${previewRecipient['Customer Name'] || 'N/A'}</p>
                                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <h5>${previewTitle}</h5>
                        ${(data.images || []).filter(img => img.position === 'Below Title' && img.dataUrl).map(img => html`<img key=${img.id} src=${img.dataUrl} alt="Image preview" style=${{ maxWidth: '100%', height: 'auto', margin: '1rem 0' }}/>`)}
                        ${(data.images || []).filter(img => img.position === 'Top of Body' && img.dataUrl).map(img => html`<img key=${img.id} src=${img.dataUrl} alt="Image preview" style=${{ maxWidth: '100%', height: 'auto', margin: '1rem 0' }}/>`)}
                        <p>${previewBody}</p>
                        ${(data.images || []).filter(img => img.position === 'Bottom of Body' && img.dataUrl).map(img => html`<img key=${img.id} src=${img.dataUrl} alt="Image preview" style=${{ maxWidth: '100%', height: 'auto', margin: '1rem 0' }}/>`)}
                    </div>
                </div>
            </div>
        </div>
    `;
};
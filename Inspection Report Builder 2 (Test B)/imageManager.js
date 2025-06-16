// Manages image uploads, previews, comments, and persistence in IndexedDB.
import { DBManager } from './dbManager.js';
import JSZip from 'jszip';

export const ImageManager = {
    previewsContainer: null,
    
    async init() {
        this.previewsContainer = document.getElementById('image-previews');
        if (!this.previewsContainer) return;

        await this.loadImagesFromDB();

        const dropZone = document.getElementById('image-drop-zone');
        const fileInput = document.getElementById('image-upload-input');
        const zipBtn = document.getElementById('zip-images-btn');
        const deleteAllBtn = document.getElementById('delete-all-images-btn');
        const perRowSelector = document.getElementById('images-per-row');
        
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
        });

        dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
        
        this.previewsContainer.addEventListener('input', this.handleDetailsChange.bind(this));
        this.previewsContainer.addEventListener('click', this.handleControlsClick.bind(this));
        
        if (zipBtn) {
            zipBtn.addEventListener('click', this.zipAndDownloadImages.bind(this));
        }
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', this.deleteAllImages.bind(this));
        }

        if (perRowSelector) {
            const updateImageGrid = () => {
                const value = perRowSelector.value;
                if (value === 'auto') {
                    this.previewsContainer.style.setProperty('--grid-template-columns', 'repeat(auto-fill, minmax(250px, 1fr))');
                } else {
                    this.previewsContainer.style.setProperty('--grid-template-columns', `repeat(${value}, 1fr)`);
                }
            };
            perRowSelector.addEventListener('change', updateImageGrid);
            // Set initial value on load
            updateImageGrid();
        }

        this.setupDragAndDrop();
    },

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    },

    async handleFiles(files) {
        const imageFiles = [...files].filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) return;
        
        const allImages = await DBManager.getAllData();
        let currentMaxOrder = allImages.length > 0 ? Math.max(...allImages.map(img => img.order)) : -1;

        for (const file of imageFiles) {
            currentMaxOrder++;
            const imageData = {
                id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                file: file,
                title: '',
                comment: '',
                order: currentMaxOrder,
                filename: file.name
            };
            
            await DBManager.saveData(imageData);
            this.createPreview(imageData);
        }
    },

    createPreview(imageData) {
        const imageUrl = URL.createObjectURL(imageData.file);
        
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.dataset.id = imageData.id;
        previewItem.draggable = true;
        
        previewItem.innerHTML = `
            <img src="${imageUrl}" alt="${imageData.filename}">
            <div class="image-details">
                <div class="image-filename">${imageData.filename}</div>
                <input type="text" class="title-input" placeholder="Add a title..." value="${imageData.title || ''}">
                <textarea class="comment-input" placeholder="Add a comment...">${imageData.comment || ''}</textarea>
                <div class="image-controls">
                    <button type="button" class="image-delete-btn">Delete</button>
                </div>
            </div>
        `;
        
        this.previewsContainer.appendChild(previewItem);
    },
    
    async loadImagesFromDB() {
        const images = await DBManager.getAllData();
        this.previewsContainer.innerHTML = '';
        images.forEach(image => this.createPreview(image));
    },
    
    handleDetailsChange(e) {
        const target = e.target;
        const previewItem = target.closest('.image-preview-item');
        if (!previewItem) return;

        const id = previewItem.dataset.id;
        let dataToUpdate = null;

        if (target.classList.contains('comment-input')) {
            dataToUpdate = { comment: target.value };
        } else if (target.classList.contains('title-input')) {
            dataToUpdate = { title: target.value };
        }
        
        if (dataToUpdate) {
            DBManager.updateData(id, dataToUpdate);
        }
    },
    
    async handleControlsClick(e) {
        if(e.target.classList.contains('image-delete-btn')) {
            const previewItem = e.target.closest('.image-preview-item');
            const id = previewItem.dataset.id;
            
            if (confirm('Are you sure you want to delete this image?')) {
                await DBManager.deleteData(id);
                previewItem.remove();
                await this.updateOrderFromDOM();
            }
        }
    },

    async zipAndDownloadImages() {
        const images = await DBManager.getAllData();
        if (images.length === 0) {
            alert('There are no images to zip.');
            return;
        }

        const zip = new JSZip();
        images.forEach(image => {
            // Create a file name that is unique and descriptive
            const cleanTitle = (image.title || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            
            const parts = image.filename.split('.');
            const extension = parts.length > 1 ? parts.pop() : '';
            const baseName = parts.join('.');

            const finalFilename = `${String(image.order + 1).padStart(2, '0')}_${cleanTitle || baseName}${extension ? '.' + extension : ''}`;
            
            zip.file(finalFilename, image.file);
        });

        try {
            const blob = await zip.generateAsync({ type: "blob" });
            const defaultFilename = `inspection_images_${new Date().toISOString().split('T')[0]}.zip`;
            
            // Use the download manager
            if (window.showDownloadManager) {
                window.showDownloadManager(blob, defaultFilename, 'zip');
            } else {
                // Fallback to direct download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = defaultFilename;
                link.style.position = 'absolute';
                link.style.left = '-9999px';
                link.style.top = '0';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }
        } catch (error) {
            console.error('Error zipping images:', error);
            alert('An error occurred while zipping the images.');
        }
    },

    async deleteAllImages() {
        if (confirm('Are you sure you want to delete ALL images? This action cannot be undone.')) {
            await DBManager.clearAllData();
            while (this.previewsContainer.firstChild) {
                this.previewsContainer.removeChild(this.previewsContainer.lastChild);
            }
            alert('All images have been deleted.');
        }
    },

    setupDragAndDrop() {
        let dragSrcEl = null;

        this.previewsContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('image-preview-item')) {
                dragSrcEl = e.target;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
                e.target.classList.add('dragging');
            }
        });

        this.previewsContainer.addEventListener('dragenter', (e) => {
            const target = e.target.closest('.image-preview-item');
            if (target && target !== dragSrcEl) {
                target.classList.add('drag-over');
            }
        });

        this.previewsContainer.addEventListener('dragleave', (e) => {
            const target = e.target.closest('.image-preview-item');
            if (target) {
                target.classList.remove('drag-over');
            }
        });

        this.previewsContainer.addEventListener('dragover', this.preventDefaults);

        this.previewsContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const target = e.target.closest('.image-preview-item');
            if (target && target !== dragSrcEl && dragSrcEl) {
                target.classList.remove('drag-over');

                // Swap the dragged element with the drop target element.
                // This gives the feeling of the target moving out of the way
                // to the dragged element's original position.
                const parent = dragSrcEl.parentNode;
                
                // Create placeholders to mark positions
                const placeholder1 = document.createElement('div');
                const placeholder2 = document.createElement('div');

                // Replace original nodes with placeholders
                parent.replaceChild(placeholder1, dragSrcEl);
                parent.replaceChild(placeholder2, target);

                // Now, insert the nodes back in each other's original spot
                parent.replaceChild(target, placeholder1);
                parent.replaceChild(dragSrcEl, placeholder2);
                
                this.updateOrderFromDOM();
            }
        });

        this.previewsContainer.addEventListener('dragend', (e) => {
            const target = e.target.closest('.image-preview-item');
            if (target) {
                target.classList.remove('dragging');
            }
            const allItems = this.previewsContainer.querySelectorAll('.image-preview-item');
            allItems.forEach(item => item.classList.remove('drag-over'));
            dragSrcEl = null;
        });
    },

    async updateOrderFromDOM() {
        const items = this.previewsContainer.querySelectorAll('.image-preview-item');
        for (let i = 0; i < items.length; i++) {
            const id = items[i].dataset.id;
            await DBManager.updateData(id, { order: i });
        }
    }
};
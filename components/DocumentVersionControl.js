import React from 'react';
import htm from 'htm';
import { DocumentControls } from './DocumentControls.js';
import { DocumentTable } from './DocumentTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * DocumentVersionControl Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const DocumentVersionControl = ({ title, storageKey, initialData }) => {
    const [documents, setDocuments] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        documentName: true,
        version: true,
        status: true,
        documentType: true,
        author: true,
        dateCreated: true,
        dateModified: true,
        approvalDate: false,
        nextReviewDate: true,
        changeSummary: false,
        filePath: false,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setDocuments(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load document version control data", error);
            setDocuments(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setDocuments(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save document version control data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newDocument = {
            id: `doc-${Date.now()}`,
            documentName: 'New Document',
            version: '1.0',
            status: 'Draft',
            documentType: '',
            author: '',
            dateCreated: new Date().toISOString().split('T')[0],
            dateModified: new Date().toISOString().split('T')[0],
            approvalDate: '',
            nextReviewDate: '',
            changeSummary: '',
            filePath: '',
            notes: ''
        };
        persistData([newDocument, ...documents]);
    }, [documents, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = documents.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [documents, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this document record?')) {
            const newItems = documents.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [documents, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of documents.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredDocuments = useMemo(() => {
        return documents.filter(document => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = document[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [documents, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${DocumentControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredDocuments}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${DocumentTable}
                documents=${filteredDocuments}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};
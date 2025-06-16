export const jsonToXML = (items, rootElementName = 'items', itemElementName = 'item') => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElementName}>\n`;

    items.forEach(item => {
        xml += `  <${itemElementName}>\n`;
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const value = item[key];
                const escapedValue = (value === null || value === undefined) ? '' : String(value).replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;')
                   .replace(/'/g, '&apos;');
                xml += `    <${key}>${escapedValue}</${key}>\n`;
            }
        }
        xml += `  </${itemElementName}>\n`;
    });

    xml += `</${rootElementName}>`;
    return xml;
};


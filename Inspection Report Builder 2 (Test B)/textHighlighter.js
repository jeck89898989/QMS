// Text selection and highlighting functionality
export const TextHighlighter = {
    selectedText: '',
    selectedRange: null,
    
    init() {
        document.addEventListener('contextmenu', this.handleRightClick.bind(this));
        document.addEventListener('click', this.hideContextMenu.bind(this));
        document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
    },
    
    handleSelectionChange() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            this.selectedText = selection.toString();
            this.selectedRange = selection.getRangeAt(0).cloneRange();
        }
    },
    
    handleRightClick(e) {
        if (this.selectedText.trim().length > 0) {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        }
    },
    
    showContextMenu(x, y) {
        this.hideContextMenu();
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.id = 'text-context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        
        menu.innerHTML = `
            <div class="context-menu-item" onclick="TextHighlighter.addHighlight('yellow')">Highlight Yellow</div>
            <div class="context-menu-item" onclick="TextHighlighter.addHighlight('green')">Highlight Green</div>
            <div class="context-menu-item" onclick="TextHighlighter.addHighlight('blue')">Highlight Blue</div>
            <div class="context-menu-item" onclick="TextHighlighter.addHighlight('pink')">Highlight Pink</div>
            <div class="context-menu-item" onclick="TextHighlighter.addHighlight('orange')">Highlight Orange</div>
            <div class="context-menu-item">
                Font Color: <input type="color" class="color-picker" onchange="TextHighlighter.changeFontColor(this.value)">
            </div>
            <div class="context-menu-item">
                Highlight Color: <input type="color" class="color-picker" onchange="TextHighlighter.addCustomHighlight(this.value)">
            </div>
            <div class="context-menu-item" onclick="TextHighlighter.removeFormatting()">Remove Formatting</div>
        `;
        
        document.body.appendChild(menu);
    },
    
    hideContextMenu() {
        const existingMenu = document.getElementById('text-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    },
    
    addHighlight(color) {
        if (this.selectedRange) {
            const span = document.createElement('span');
            span.className = `highlight-${color}`;
            try {
                this.selectedRange.surroundContents(span);
            } catch (e) {
                span.innerHTML = this.selectedRange.toString();
                this.selectedRange.deleteContents();
                this.selectedRange.insertNode(span);
            }
        }
        this.hideContextMenu();
        this.clearSelection();
    },
    
    addCustomHighlight(color) {
        if (this.selectedRange) {
            const span = document.createElement('span');
            span.style.backgroundColor = color;
            try {
                this.selectedRange.surroundContents(span);
            } catch (e) {
                span.innerHTML = this.selectedRange.toString();
                this.selectedRange.deleteContents();
                this.selectedRange.insertNode(span);
            }
        }
        this.hideContextMenu();
        this.clearSelection();
    },
    
    changeFontColor(color) {
        if (this.selectedRange) {
            const span = document.createElement('span');
            span.style.color = color;
            try {
                this.selectedRange.surroundContents(span);
            } catch (e) {
                span.innerHTML = this.selectedRange.toString();
                this.selectedRange.deleteContents();
                this.selectedRange.insertNode(span);
            }
        }
        this.hideContextMenu();
        this.clearSelection();
    },
    
    removeFormatting() {
        if (this.selectedRange) {
            const content = this.selectedRange.toString();
            this.selectedRange.deleteContents();
            this.selectedRange.insertNode(document.createTextNode(content));
        }
        this.hideContextMenu();
        this.clearSelection();
    },
    
    clearSelection() {
        window.getSelection().removeAllRanges();
        this.selectedText = '';
        this.selectedRange = null;
    }
};
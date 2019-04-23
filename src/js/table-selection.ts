/*!
 * TableSelection library v0.9.3 (https://github.com/PXLWidgets/table-selection)
 * Copyright (c) 2019 Wouter Smit
 * Licensed under MIT (https://github.com/PXLWidgets/table-selection/blob/master/LICENSE)
*/

interface ITableRowRange {
    start: HTMLTableRowElement;
    end: HTMLTableRowElement;
}

interface ITableCellRange {
    start: HTMLTableCellElement;
    end: HTMLTableCellElement;
}

interface ISelectionSnapshot {
    trs: ITableRowRange;
    tds: ITableCellRange;
    cells?: HTMLTableCellElement[];
}

export class TableSelection {

    protected selector: string;
    protected selectedClass: string;

    protected selection: ISelectionSnapshot | null;
    protected nativeSelection: Selection | null;

    constructor(selector = '.table-selection', selectedClass = 'selected') {
        this.selector = selector;
        this.selectedClass = selectedClass;

        this.selection = null;
        this.nativeSelection = null;

        this.setEventHandlers();
    }

    public setEventHandlers() {
        document.addEventListener('selectionchange', this.selectionChangeHandler.bind(this));
        document.addEventListener('copy', this.copyHandler.bind(this));
    }

    public selectionChangeHandler() {
        this.deselect();
        this.nativeSelection = window.getSelection ? getSelection() : null;

        if (! this.nativeSelection) {
            return;
        }

        this.getSelection();
        this.showSelection();
    }

    public getSelection() {
        const tds = this.getSelectionTds();

        if ( ! tds) {
            return null;
        }

        const firstElement: HTMLElement = tds.start as HTMLElement;

        if ( ! firstElement.closest(this.selector)) {
            return null;
        }

        const trs = this.getSelectionTrs(tds);

        if ( !trs ) {
            return null;
        }

        this.selection = {
            tds,
            trs,
        };

        this.selection.cells = this.getCellsInSelectionRange(this.selection);

        return this.selection;
    }

    public getCellsInSelectionRange(selection: ISelectionSnapshot) {

        const tbody = (selection.trs.start.parentElement as HTMLTableSectionElement);
        const hasThead = tbody.previousElementSibling && tbody.previousElementSibling.matches('thead');

        const trStartIndex = selection.trs.start.rowIndex - (hasThead ? 1 : 0);
        const trEndIndex = selection.trs.end.rowIndex - (hasThead ? 1 : 0);

        const tdStartIndex = selection.tds.start.cellIndex;
        const tdEndIndex = selection.tds.end.cellIndex;

        const trs: HTMLTableRowElement[] = Array
            .from(tbody.rows)
            .slice(trStartIndex, trEndIndex + 1)
        ;

        let cellsInRange: HTMLTableCellElement[] = [];

        trs.forEach((tr) => {
            const tds = Array
                .from(tr.cells)
                .slice(tdStartIndex, tdEndIndex + 1);

            cellsInRange = cellsInRange.concat(tds);
        });

        return cellsInRange;
    }

    public getSelectionTrs(tds: ITableCellRange): ITableRowRange | null {
        if (! tds.start || ! tds.end) {
            return null;
        }

        let start = tds.start.closest('tr') as HTMLTableRowElement;
        let end = tds.end.closest('tr') as HTMLTableRowElement;

        if (start.rowIndex > end.rowIndex) {
            [end, start] = [start, end];
        }

        return {start, end};
    }

    public getSelectionTds(): ITableCellRange | null {
        if ( ! this.nativeSelection) {
            return null;
        }

        let startNode = this.nativeSelection.anchorNode as Node | HTMLElement | null;
        let endNode   = this.nativeSelection.focusNode as Node | HTMLElement | null;

        if (! startNode || ! endNode) {
            return null;
        }

        if (startNode.nodeType !== 1) {
            startNode = startNode.parentElement as HTMLElement;
        }

        if (endNode.nodeType !== 1) {
            endNode = endNode.parentElement as HTMLElement;
        }

        startNode = (startNode as HTMLElement).closest('td') as HTMLTableCellElement | null;
        endNode = (endNode as HTMLElement).closest('td') as HTMLTableCellElement | null;

        if (! startNode || ! endNode) {
            return null;
        }

        let start: HTMLTableCellElement = startNode as HTMLTableCellElement;
        let end: HTMLTableCellElement = endNode as HTMLTableCellElement;

        if (start.cellIndex > end.cellIndex) {
            [end, start] = [start, end];
        }

        return {start, end};
    }

    public showSelection() {
        if (! this.selection || ! this.selection.cells) {
            return;
        }

        this.selection.cells.forEach((cell) => {
            cell.classList.add(this.selectedClass);
        });
    }

    public hideSelection() {
        if (! this.selection || ! this.selection.cells) {
            return;
        }

        this.selection.cells.forEach((cell) => {
            cell.classList.remove(this.selectedClass);
        });
    }

    public deselect() {
        if (! this.selection) {
            return;
        }

        this.hideSelection();
        this.selection = null;
        this.nativeSelection = null;
    }

    public getSelectionText(): string | null {
        if (! this.selection || ! this.selection.cells) {
            return null;
        }

        const rowData = {};
        const data = [];

        this.selection.cells.forEach((cell) => {
            if (! cell.parentElement) {
                return;
            }
            const rowIndex = (cell.parentElement as HTMLTableRowElement).rowIndex;
            rowData[rowIndex] = rowData[rowIndex] || [];
            rowData[rowIndex].push(cell.innerText);
        });

        for (const i in rowData) {
            if (! rowData.hasOwnProperty(i)) {
                continue;
            }
            data.push(rowData[i].join('\t'));
        }

        return data.join('\n');
    }

    public copyHandler(e: ClipboardEvent) {
        if ( ! this.selection) {
            return;
        }

        const selectionText = this.getSelectionText();

        if ( ! selectionText) {
            return;
        }

        e.clipboardData.setData('text/plain', selectionText);
        e.preventDefault();
    }

}

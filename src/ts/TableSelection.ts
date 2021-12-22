/*!
 * TableSelection library v1.0.0 (https://github.com/PXLWidgets/table-selection)
 * Copyright (c) 2019 Wouter Smit
 * Licensed under MIT (https://github.com/PXLWidgets/table-selection/blob/master/LICENSE)
*/

import { TableSelectionConfig } from './interfaces/TableSelectionConfig';
import { TableSelectionRange } from './interfaces/TableSelectionRange';
import { TableSelectionTableElements } from './interfaces/TableSelectionTableElements';

export class TableSelection {

    config: TableSelectionConfig = {
        selector: '.table-selection',
        selectionCssMode: 'style',
        selectionCssClass: 'selected',
    };

    range: TableSelectionRange | null = null;
    elements: TableSelectionTableElements;

    constructor(config: TableSelectionConfig = {}) {
        this.config = { ...this.config, ...config };

        // Hide default selection
        const styles = document.createElement('style');
        styles.innerHTML = `${this.config.selector} *::selection {
            background: transparent;
            color: inherit;
        }`;
        document.head.appendChild(styles);

        document.addEventListener('selectionchange', () => this.onSelectionChange());
        document.addEventListener('copy', (e) => this.copyToClipboard(e));
    }

    protected onSelectionChange(): void {
        const selection = getSelection();

        this.deselect();
        if (! selection || selection.isCollapsed) {
            return;
        }

        const startCell: HTMLTableCellElement | null = this.getCellElementFromNode(selection.anchorNode);
        const endCell: HTMLTableCellElement | null = this.getCellElementFromNode(selection.focusNode);

        if (! startCell || ! endCell) {
            return;
        }

        const startTableElements = this.getTableElementsFromCellElement(startCell);
        const endTableElements = this.getTableElementsFromCellElement(endCell);
        if (! startTableElements || ! endTableElements) {
            return;
        }

        const isSameTable = startTableElements.table === endTableElements.table;
        if (! isSameTable) {
            return;
        }

        this.elements = startTableElements;

        this.getRangeByStartAndEndElement(startCell, endCell);
        this.getRowElements();
        this.getRowsAndCells();

        if (this.range) {
            this.select();
        } else {
            this.deselect();
        }
    }

    protected getRangeByStartAndEndElement(
        startCellElement: HTMLTableCellElement,
        endCellElement: HTMLTableCellElement,
    ): void {

        const startRowElement: HTMLTableRowElement | null = startCellElement.parentElement as HTMLTableRowElement;
        const endRowElement: HTMLTableRowElement | null = endCellElement.parentElement as HTMLTableRowElement;

        if (! startRowElement || ! endRowElement) {
            return;
        }

        this.range = {
            start: {
                row: startRowElement.rowIndex + 1,
                cell: startCellElement.cellIndex + 1,
            },
            end: {
                row: endRowElement.rowIndex + 1,
                cell: endCellElement.cellIndex + 1,
            },
            rowElements: [],
            rows: [],
            cells: [],
        };

        // Flip start/end if end > start
        if (this.range.start.cell > this.range.end.cell) {
            [this.range.start.cell, this.range.end.cell] = [this.range.end.cell, this.range.start.cell];
        }
        if (this.range.start.row > this.range.end.row) {
            [this.range.start.row, this.range.end.row] = [this.range.end.row, this.range.start.row];
        }
    }

    protected getRowElements(): void {
        if (! this.range || ! this.elements.table) {
            return;
        }

        const numTableHeaders = this.elements.table.querySelectorAll('thead tr').length;
        let theadRows: HTMLTableRowElement[] = [];
        let tbodyRows: HTMLTableRowElement[] = [];

        const theadStart = this.range.start.row <= numTableHeaders
            ? Math.min(numTableHeaders, this.range.start.row)
            : null;
        const theadEnd = this.range.start.row <= numTableHeaders
            ? Math.min(numTableHeaders, this.range.end.row)
            : null;

        const tbodyStart = this.range.end.row > numTableHeaders
            ? Math.max(1, this.range.start.row - numTableHeaders)
            : null;
        const tbodyEnd = this.range.end.row > numTableHeaders
            ? Math.max(1, this.range.end.row - numTableHeaders)
            : null;

        if (theadStart) {
            theadRows = Array.from(this.elements.table.querySelectorAll(
                `thead tr:nth-of-type(n+${theadStart}):nth-of-type(-n+${theadEnd})`,
            ));
        }

        if (tbodyStart) {
            tbodyRows = Array.from(this.elements.table.querySelectorAll(
                `tbody tr:nth-of-type(n+${tbodyStart}):nth-of-type(-n+${tbodyEnd})`,
            ));
        }

        this.range.rowElements = [...theadRows, ...tbodyRows];
    }

    protected getRowsAndCells(): void {
        if (! this.range || ! this.range.rowElements) {
            return;
        }

        let cells: HTMLTableCellElement[] = [];
        this.range.rowElements.forEach((row: HTMLTableRowElement, i: number) => {
            if (! this.range) {
                return;
            }

            const cellsInRow = Array.from(row.querySelectorAll(
                [
                    `td:nth-of-type(n+${this.range.start.cell}):nth-of-type(-n+${this.range.end.cell})`,
                    `th:nth-of-type(n+${this.range.start.cell}):nth-of-type(-n+${this.range.end.cell})`,
                ].join(',')
            )) as HTMLTableCellElement[];

            cells = [...cells, ...cellsInRow];
            this.range.rows[i] = cellsInRow;
        });

        this.range.cells = cells;

    }

    protected getCellElementFromNode(inputNode: Node | null): HTMLTableCellElement | null {
        if (! inputNode) {
            return null;
        }

        const element: HTMLTableCellElement | null = inputNode.nodeName === '#text'
            ? (inputNode.parentElement as HTMLTableCellElement).closest('td,th')
            : (inputNode as HTMLTableCellElement);

        if (! element || ! ['TD', 'TH'].includes(element.tagName)) {
            return null;
        }

        return element;
    }

    protected getTableElementsFromCellElement(cellElement: HTMLTableCellElement): TableSelectionTableElements | null {
        if (! cellElement || ! cellElement.parentElement || ! cellElement.parentElement.parentElement) {
            return null;
        }

        const tHeadOrBody = cellElement.parentElement.parentElement;
        const table: HTMLTableElement = ['TBODY', 'THEAD'].includes(tHeadOrBody.tagName)
            ? (tHeadOrBody.parentElement as HTMLTableElement)
            : (tHeadOrBody as HTMLTableElement);

        if (! table || ! this.config.selector || ! table.matches(this.config.selector)) {
            return null;
        }

        return {
            table,
            thead: table.querySelector('thead') as HTMLTableSectionElement,
            tbody: table.querySelector('tbody') as HTMLTableSectionElement,
        };
    }

    protected select(): void {
        if (this.range && this.range.cells) {
            this.range.cells.forEach((cellElement) => {
                if (this.config.selectionCssMode === 'cssClass' && this.config.selectionCssClass) {
                    cellElement.classList.add(this.config.selectionCssClass);
                } else {
                    cellElement.style.backgroundColor = 'var(--table-selection-background-color, Highlight)';
                    cellElement.style.color = 'var(--table-selection-color, HighlightText)';
                }
            });
        }
    }

    protected deselect(): void {
        if (this.range && this.range.cells) {
            this.range.cells.forEach((cellElement) => {
                if (this.config.selectionCssMode === 'cssClass' && this.config.selectionCssClass) {
                    cellElement.classList.remove(this.config.selectionCssClass);
                } else {
                    cellElement.style.removeProperty('background-color');
                    cellElement.style.removeProperty('color');
                }
            });
            this.range = null;
        }
    }

    protected copyToClipboard(e: ClipboardEvent): void {
        if (! this.range || ! this.range.rows || ! e.clipboardData) {
            return;
        }

        const selectionText = (this.range.rows as HTMLTableCellElement[][])
            .map((row) => row.map((cell) => cell.innerText).join('\t'))
            .join('\r\n');

        if (! selectionText) {
            return;
        }

        e.clipboardData.setData('text/plain', selectionText);
        e.preventDefault();
    }

}

/*!
 * TableSelection library v0.9.1 (https://github.com/PXLWidgets/table-selection)
 * Copyright (c) 2018 Wouter Smit
 * Licensed under MIT (https://github.com/PXLWidgets/table-selection/blob/master/LICENSE)
*/

class TableSelection {

    constructor(selector = ".table-selection", selectedClass = "selected") {
        this.selector = selector;
        this.selectedClass = selectedClass;

        this.selection = null;
        this.nativeSelection = null;

        this.setEventHandlers();
    }

    static initialize(selector = ".table-selection", selectedClass = "selected") {
        return new TableSelection(selector, selectedClass);
    }

    setEventHandlers() {
        document.addEventListener("selectionchange", this.selectionChangeHandler.bind(this));
        document.addEventListener("copy", this.copyHandler.bind(this));
    }

    selectionChangeHandler() {
        this.deselect();
        this.nativeSelection = window.getSelection ? getSelection() : null;

        if (!this.nativeSelection) {
            return;
        }

        this.getSelection();
        this.showSelection();
    }

    getSelection() {
        const tds = this.getSelectionTds();

        if (!tds || !tds.start.closest(this.selector)) {
            return;
        }

        const trs = this.getSelectionTrs(tds);

        this.selection = {
            tds: tds,
            trs: trs,
        };

        this.selection.cells = this.getCellsInSelectionRange(this.selection);

        return this.selection;
    }

    getCellsInSelectionRange(selection) {

        const tbody = selection.trs.start.parentElement;
        const hasThead = tbody.previousElementSibling && tbody.previousElementSibling.matches("thead");

        const trStartIndex = selection.trs.start.rowIndex - (hasThead ? 1 : 0);
        const trEndIndex = selection.trs.end.rowIndex - (hasThead ? 1 : 0);

        const tdStartIndex = selection.tds.start.cellIndex;
        const tdEndIndex = selection.tds.end.cellIndex;

        const trs = Array
            .from(tbody.rows)
            .slice(trStartIndex, trEndIndex + 1)
        ;

        let cells = [];
        trs.forEach(tr => {
            const tds = Array
                .from(tr.cells)
                .slice(tdStartIndex, tdEndIndex + 1);

            cells = cells.concat(tds);
        });

        return cells;
    }

    getSelectionTds() {
        let start = this.nativeSelection.anchorNode;
        let end = this.nativeSelection.focusNode;

        if (!start || !end) {
            return;
        }

        if (start.nodeType !== 1) {
            start = start.parentElement;
        }

        if (end.nodeType !== 1) {
            end = end.parentElement;
        }

        start = start.closest("td");
        end = end.closest("td");

        if (!start || !end) {
            return;
        }

        if (start.cellIndex > end.cellIndex) {
            [end, start] = [start, end];
        }

        return {start, end};
    }

    getSelectionTrs(tds) {
        if (!tds.start || !tds.end) {
            return;
        }

        let start = tds.start.closest("tr");
        let end = tds.end.closest("tr");

        if (start.rowIndex > end.rowIndex) {
            [end, start] = [start, end];
        }

        return {start, end};
    }

    showSelection() {
        if (!this.selection) {
            return;
        }

        this.selection.cells.forEach(cell => {
            cell.classList.add(this.selectedClass);
        });
    }

    hideSelection() {
        if (!this.selection) {
            return;
        }

        this.selection.cells.forEach(cell => {
            cell.classList.remove(this.selectedClass);
        });
    }

    deselect() {
        if (!this.selection) {
            return;
        }

        this.hideSelection();
        this.selection = null;
        this.nativeSelection = null;
    }

    getSelectionText() {
        let rowData = {};
        let data = [];

        this.selection.cells.forEach(cell => {
            const rowIndex = cell.parentElement.rowIndex;
            rowData[rowIndex] = rowData[rowIndex] || [];
            rowData[rowIndex].push(cell.innerText);
        });

        for (const i in rowData) {
            if (!rowData.hasOwnProperty(i)) {
                continue;
            }
            data.push(rowData[i].join("\t"));
        }

        return data.join("\n");
    }

    copyHandler(e) {
        if (!this.selection) {
            return;
        }
        e.clipboardData.setData("text/plain", this.getSelectionText());
        e.preventDefault();
    }

}

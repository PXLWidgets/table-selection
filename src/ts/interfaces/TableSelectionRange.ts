export interface TableSelectionRange {
    start: {
        row: number;
        cell: number;
    };
    end: {
        row: number;
        cell: number;
    };
    rowElements?: HTMLTableRowElement[],
    rows: HTMLTableCellElement[][],
    cells: HTMLTableCellElement[],
}

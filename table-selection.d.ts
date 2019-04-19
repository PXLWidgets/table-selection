declare const TableSelection: TableSelection.IStatic;
export default TableSelection;
export as namespace TableSelection;

/* tslint:disable:interface-name */
/* tslint:disable:no-empty-interface */

declare namespace TableSelection {

    interface IStatic {
        initialize(selector?: string, selectedClass?: string): SelectableTable
    }

    interface SelectableTable {
        // readonly table: HTMLTableElement;
    }

    // Public object interfaces go here
}

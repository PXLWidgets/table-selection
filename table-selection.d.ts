import { TableSelectionConfig } from './src/interfaces/TableSelectionConfig';

declare const TableSelection: TableSelection.IStatic;
export default TableSelection;
export as namespace TableSelection;

/* tslint:disable:interface-name */
/* tslint:disable:no-empty-interface */

declare namespace TableSelection {

    interface IStatic {
        initialize(config: TableSelectionConfig): SelectableTable;
    }

    interface SelectableTable {
        // readonly table: HTMLTableElement;
    }

    // Public object interfaces go here
}

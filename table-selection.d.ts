declare const TableSelection: TableSelection.IStatic;
export default TableSelection;
export as namespace TableSelection;

import { TableSelection as TableSelectionImplementation } from './src/js/table-selection';

declare namespace TableSelection {

    interface IStatic {
        staticMethod(selector: string, activeClass: string): TableSelectionImplementation;
    }

    // Public object interfaces go here
}

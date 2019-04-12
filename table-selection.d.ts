declare const TableSelection: TableSelection.Static;
export default TableSelection;
export as namespace TableSelection;

import { TableSelection } from './js/TableSelection';

declare namespace TableSelection {

    interface Static {
        staticMethod(selector: string): TableSelection;
    }

    // Public object interfaces go here
}

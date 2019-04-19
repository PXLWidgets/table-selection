import ITableSelection from '../table-selection';
import IStatic = ITableSelection.IStatic;

import { TableSelection } from './js/table-selection';

// IStatic should be implemented by default export as well:
const defaultNamespace: IStatic = { initialize };

export default defaultNamespace;

export function initialize(selector?: string, selectedClass?: string) {
    return new TableSelection(selector, selectedClass);
}

import PublicInterface from '../table-selection';

import IStatic = PublicInterface.Static;

// IStatic should be implemented by named exports:
export function staticMethod() { return 0; }

// IStatic should be implemented by default export as well:
const defaultNamespace: IStatic = { staticMethod };
export default defaultNamespace;

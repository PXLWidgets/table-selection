# TableSelection
Adds **rectangular selection** to **HTML tables** to allow copy of specific columns and rows without copying contents of other cells in range.

![](examples/table-selection-demo.gif)

<br/>

- Supports horizontal, vertical and rectangular selections.
- Includes **clipboard** support with table formatting for **Excel** or other **spreadsheet** software!
- It even works on **mobile**!
- Tested and working in Chrome, Firefox, Edge, Mobile Chrome and Samsung Browser

<br/>

## Table of contents
- [Installation](#installation)
    - [Using precompiled js + css](#installation-precompiled)
    - [Using a module loader](#installation-module-loader)
    - [SASS / SCSS / LESS](#installation-styles)
- [Usage](#usage)
- [API](#api)
- [Demo](#demo)
- [License (it's free!)](#license)

<br/>

<a name="installation"></a>
## Installation
- Run `npm i @pxlwidgets/table-selection` or download the sources.

<a name="installation-precompiled"></a>
##### Using the precompiled js and css files

- Include `dist/js/table-selection.js` or `dist/js/table-selection.min.js` in your project or import using a module loader (more info below).
- Include `dist/css/table-selection.css` or `dist/css/table-selection.min.css` in your project (or use the provided LESS or SCSS file).


<a name="installation-module-loader"></a>
##### Using a module loader

The package includes files for integration in **Typescript** and **ES6** projects:

```import {TableSelection} from @pxlwidgets/table-selection;```<br/>


<a name="installation-styles"></a>
##### SASS / SCSS / LESS

The package also includes LESS and SASS (SCSS) sources:

SCSS:<br/>
```@import '~/@pxlwidgets/table-selection'```<br/>

LESS:<br/>
```@include 'node_modules/@pxlwidgets/table-selection/dist/less/table-selection.less'```

<br/>

<a name="usage"></a>
## Usage
- Add `.table-selection` class to the table(s) you want to apply the selection functionality on.
- Initialize the script using `new TableSelection()` or `TableSelection.initialize()`.

> **Note**<br>
> You can use a different DOM selector, but you'll need to change the CSS styles accordingly and pass in your custom selector when creating the Javascript instance.

<br/>

<a name="api"></a>
## Javascript API
The constructor takes two arguments, which are both optional.

```constructor(selector: string = '.table-selection', selectedClass: string = 'selected')```

Parameter | Type | Required | Default | Description
---|---|---|---|---
`selector` | `string` | No | `".table-selection"` | sets the DOM selector to apply the functionality to. This should point to one or more table elements on your page. E.g. `table` or `.table`.
`selectedClass` | `string` | No | `"selected"` | sets the CSS class to apply to 'selected' table cells. E.g. `active`, `selected` or `highlighted`.


Example usage of the constructor:<br/>

```new TableSelection();```<br/>

```new TableSelection('table');```<br/>

```new TableSelection('table', 'active'');```


The constructor can also be called in a static way:
```TableSelection.initialize(selector: string = '.table-selection', selectedClass: string = 'selected')```

For example:<br/>

```TableSelection.initialize();```<br/>

```TableSelection.initialize('table');```<br/>

```TableSelection.initialize('table', 'active'');```<br/>

<br/>

<a name="demo"></a>
## Demo
[View live example on Codepen](https://codepen.io/opznhaarlems/pen/KoMarx)

<br/>

<a name="license"></a>
## License
MIT License

Copyright (c) 2019 Wouter Smit
Copyright (c) 2019 PXL.Widgets B.V.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

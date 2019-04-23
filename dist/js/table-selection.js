(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TableSelection"] = factory();
	else
		root["TableSelection"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var table_selection_1 = __webpack_require__(1);
// IStatic should be implemented by default export as well:
var defaultNamespace = { initialize: initialize };
exports.default = defaultNamespace;
function initialize(selector, selectedClass) {
    return new table_selection_1.TableSelection(selector, selectedClass);
}
exports.initialize = initialize;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*!
 * TableSelection library v0.9.3 (https://github.com/PXLWidgets/table-selection)
 * Copyright (c) 2019 Wouter Smit
 * Licensed under MIT (https://github.com/PXLWidgets/table-selection/blob/master/LICENSE)
*/
Object.defineProperty(exports, "__esModule", { value: true });
var TableSelection = /** @class */ (function () {
    function TableSelection(selector, selectedClass) {
        if (selector === void 0) { selector = '.table-selection'; }
        if (selectedClass === void 0) { selectedClass = 'selected'; }
        this.selector = selector;
        this.selectedClass = selectedClass;
        this.selection = null;
        this.nativeSelection = null;
        this.setEventHandlers();
    }
    TableSelection.prototype.setEventHandlers = function () {
        document.addEventListener('selectionchange', this.selectionChangeHandler.bind(this));
        document.addEventListener('copy', this.copyHandler.bind(this));
    };
    TableSelection.prototype.selectionChangeHandler = function () {
        this.deselect();
        this.nativeSelection = window.getSelection ? getSelection() : null;
        if (!this.nativeSelection) {
            return;
        }
        this.getSelection();
        this.showSelection();
    };
    TableSelection.prototype.getSelection = function () {
        var tds = this.getSelectionTds();
        if (!tds) {
            return null;
        }
        var firstElement = tds.start;
        if (!firstElement.closest(this.selector)) {
            return null;
        }
        var trs = this.getSelectionTrs(tds);
        if (!trs) {
            return null;
        }
        this.selection = {
            tds: tds,
            trs: trs,
        };
        this.selection.cells = this.getCellsInSelectionRange(this.selection);
        return this.selection;
    };
    TableSelection.prototype.getCellsInSelectionRange = function (selection) {
        var tbody = selection.trs.start.parentElement;
        var hasThead = tbody.previousElementSibling && tbody.previousElementSibling.matches('thead');
        var trStartIndex = selection.trs.start.rowIndex - (hasThead ? 1 : 0);
        var trEndIndex = selection.trs.end.rowIndex - (hasThead ? 1 : 0);
        var tdStartIndex = selection.tds.start.cellIndex;
        var tdEndIndex = selection.tds.end.cellIndex;
        var trs = Array
            .from(tbody.rows)
            .slice(trStartIndex, trEndIndex + 1);
        var cellsInRange = [];
        trs.forEach(function (tr) {
            var tds = Array
                .from(tr.cells)
                .slice(tdStartIndex, tdEndIndex + 1);
            cellsInRange = cellsInRange.concat(tds);
        });
        return cellsInRange;
    };
    TableSelection.prototype.getSelectionTrs = function (tds) {
        var _a;
        if (!tds.start || !tds.end) {
            return null;
        }
        var start = tds.start.closest('tr');
        var end = tds.end.closest('tr');
        if (start.rowIndex > end.rowIndex) {
            _a = [start, end], end = _a[0], start = _a[1];
        }
        return { start: start, end: end };
    };
    TableSelection.prototype.getSelectionTds = function () {
        var _a;
        if (!this.nativeSelection) {
            return null;
        }
        var startNode = this.nativeSelection.anchorNode;
        var endNode = this.nativeSelection.focusNode;
        if (!startNode || !endNode) {
            return null;
        }
        if (startNode.nodeType !== 1) {
            startNode = startNode.parentElement;
        }
        if (endNode.nodeType !== 1) {
            endNode = endNode.parentElement;
        }
        startNode = startNode.closest('td');
        endNode = endNode.closest('td');
        if (!startNode || !endNode) {
            return null;
        }
        var start = startNode;
        var end = endNode;
        if (start.cellIndex > end.cellIndex) {
            _a = [start, end], end = _a[0], start = _a[1];
        }
        return { start: start, end: end };
    };
    TableSelection.prototype.showSelection = function () {
        var _this = this;
        if (!this.selection || !this.selection.cells) {
            return;
        }
        this.selection.cells.forEach(function (cell) {
            cell.classList.add(_this.selectedClass);
        });
    };
    TableSelection.prototype.hideSelection = function () {
        var _this = this;
        if (!this.selection || !this.selection.cells) {
            return;
        }
        this.selection.cells.forEach(function (cell) {
            cell.classList.remove(_this.selectedClass);
        });
    };
    TableSelection.prototype.deselect = function () {
        if (!this.selection) {
            return;
        }
        this.hideSelection();
        this.selection = null;
        this.nativeSelection = null;
    };
    TableSelection.prototype.getSelectionText = function () {
        if (!this.selection || !this.selection.cells) {
            return null;
        }
        var rowData = {};
        var data = [];
        this.selection.cells.forEach(function (cell) {
            if (!cell.parentElement) {
                return;
            }
            var rowIndex = cell.parentElement.rowIndex;
            rowData[rowIndex] = rowData[rowIndex] || [];
            rowData[rowIndex].push(cell.innerText);
        });
        for (var i in rowData) {
            if (!rowData.hasOwnProperty(i)) {
                continue;
            }
            data.push(rowData[i].join('\t'));
        }
        return data.join('\n');
    };
    TableSelection.prototype.copyHandler = function (e) {
        if (!this.selection) {
            return;
        }
        var selectionText = this.getSelectionText();
        if (!selectionText) {
            return;
        }
        e.clipboardData.setData('text/plain', selectionText);
        e.preventDefault();
    };
    return TableSelection;
}());
exports.TableSelection = TableSelection;


/***/ })
/******/ ]);
});
//# sourceMappingURL=table-selection.js.map

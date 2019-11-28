(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(
            require('@atomic-reactor/reactium-ui'),
            require('object-path'),
            require('react'),
            require('reactium-core/sdk'),
        );
    else if (typeof define === 'function' && define.amd)
        define([
            '@atomic-reactor/reactium-ui',
            'object-path',
            'react',
            'reactium-core/sdk',
        ], factory);
    else if (typeof exports === 'object')
        exports['reset'] = factory(
            require('@atomic-reactor/reactium-ui'),
            require('object-path'),
            require('react'),
            require('reactium-core/sdk'),
        );
    else
        root['reset'] = factory(
            root['@atomic-reactor/reactium-ui'],
            root['object-path'],
            root['react'],
            root['reactium-core/sdk'],
        );
})(window, function(
    __WEBPACK_EXTERNAL_MODULE__atomic_reactor_reactium_ui__,
    __WEBPACK_EXTERNAL_MODULE_object_path__,
    __WEBPACK_EXTERNAL_MODULE_react__,
    __WEBPACK_EXTERNAL_MODULE_reactium_core_sdk__,
) {
    return /******/ (function(modules) {
        // webpackBootstrap
        /******/ // The module cache
        /******/ var installedModules = {}; // The require function
        /******/
        /******/ /******/ function __webpack_require__(moduleId) {
            /******/
            /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) {
                /******/ return installedModules[moduleId].exports;
                /******/
            } // Create a new module (and put it into the cache)
            /******/ /******/ var module = (installedModules[moduleId] = {
                /******/ i: moduleId,
                /******/ l: false,
                /******/ exports: {},
                /******/
            }); // Execute the module function
            /******/
            /******/ /******/ modules[moduleId].call(
                module.exports,
                module,
                module.exports,
                __webpack_require__,
            ); // Flag the module as loaded
            /******/
            /******/ /******/ module.l = true; // Return the exports of the module
            /******/
            /******/ /******/ return module.exports;
            /******/
        } // expose the modules object (__webpack_modules__)
        /******/
        /******/
        /******/ /******/ __webpack_require__.m = modules; // expose the module cache
        /******/
        /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
        /******/
        /******/ /******/ __webpack_require__.d = function(
            exports,
            name,
            getter,
        ) {
            /******/ if (!__webpack_require__.o(exports, name)) {
                /******/ Object.defineProperty(exports, name, {
                    enumerable: true,
                    get: getter,
                });
                /******/
            }
            /******/
        }; // define __esModule on exports
        /******/
        /******/ /******/ __webpack_require__.r = function(exports) {
            /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/ Object.defineProperty(exports, Symbol.toStringTag, {
                    value: 'Module',
                });
                /******/
            }
            /******/ Object.defineProperty(exports, '__esModule', {
                value: true,
            });
            /******/
        }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
        /******/
        /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
            value,
            mode,
        ) {
            /******/ if (mode & 1) value = __webpack_require__(value);
            /******/ if (mode & 8) return value;
            /******/ if (
                mode & 4 &&
                typeof value === 'object' &&
                value &&
                value.__esModule
            )
                return value;
            /******/ var ns = Object.create(null);
            /******/ __webpack_require__.r(ns);
            /******/ Object.defineProperty(ns, 'default', {
                enumerable: true,
                value: value,
            });
            /******/ if (mode & 2 && typeof value != 'string')
                for (var key in value)
                    __webpack_require__.d(
                        ns,
                        key,
                        function(key) {
                            return value[key];
                        }.bind(null, key),
                    );
            /******/ return ns;
            /******/
        }; // getDefaultExport function for compatibility with non-harmony modules
        /******/
        /******/ /******/ __webpack_require__.n = function(module) {
            /******/ var getter =
                module && module.__esModule
                    ? /******/ function getDefault() {
                          return module['default'];
                      }
                    : /******/ function getModuleExports() {
                          return module;
                      };
            /******/ __webpack_require__.d(getter, 'a', getter);
            /******/ return getter;
            /******/
        }; // Object.prototype.hasOwnProperty.call
        /******/
        /******/ /******/ __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }; // __webpack_public_path__
        /******/
        /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
        /******/
        /******/
        /******/ /******/ return __webpack_require__(
            (__webpack_require__.s =
                './src/app/components/plugin-src/reset/umd.js'),
        );
        /******/
    })(
        /************************************************************************/
        /******/ {
            /***/ './src/app/components/plugin-src/reset/BigRed.js':
                /*!*******************************************************!*\
  !*** ./src/app/components/plugin-src/reset/BigRed.js ***!
  \*******************************************************/
                /*! exports provided: default */
                /***/ function(
                    module,
                    __webpack_exports__,
                    __webpack_require__,
                ) {
                    'use strict';
                    __webpack_require__.r(__webpack_exports__);
                    /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                        /*! react */ 'react',
                    );
                    /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                        react__WEBPACK_IMPORTED_MODULE_0__,
                    );
                    /* harmony import */ var _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                        /*! @atomic-reactor/reactium-ui */ '@atomic-reactor/reactium-ui',
                    );
                    /* harmony import */ var _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
                        _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__,
                    );
                    /* harmony import */ var reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                        /*! reactium-core/sdk */ 'reactium-core/sdk',
                    );
                    /* harmony import */ var reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
                        reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__,
                    );
                    /* harmony import */ var object_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                        /*! object-path */ 'object-path',
                    );
                    /* harmony import */ var object_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
                        object_path__WEBPACK_IMPORTED_MODULE_3__,
                    );

                    var BigRed = function BigRed(props) {
                        var tools = Object(
                            reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__[
                                'useHandle'
                            ],
                        )('AdminTools');
                        var Modal = object_path__WEBPACK_IMPORTED_MODULE_3___default.a.get(
                            tools,
                            'Modal',
                        );
                        var Toast = object_path__WEBPACK_IMPORTED_MODULE_3___default.a.get(
                            tools,
                            'Toast',
                        );
                        var ConfirmBox = Object(
                            reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__[
                                'useHookComponent'
                            ],
                        )('ConfirmBox');

                        var title = Object(
                            reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__[
                                '__'
                            ],
                        )('Actinium Reset');

                        var dialogSettings = {
                            header: {
                                title: title,
                            },
                            dismissable: false,
                        };

                        var confirm = function confirm() {
                            return regeneratorRuntime.async(
                                function confirm$(_context) {
                                    while (1) {
                                        switch (
                                            (_context.prev = _context.next)
                                        ) {
                                            case 0:
                                                _context.prev = 0;
                                                _context.next = 3;
                                                return regeneratorRuntime.awrap(
                                                    reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.Cloud.run(
                                                        'reset-actinium',
                                                    ),
                                                );

                                            case 3:
                                                Toast.show({
                                                    type: Toast.TYPE.SUCCESS,
                                                    message: Object(
                                                        reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__[
                                                            '__'
                                                        ],
                                                    )(
                                                        'Success! You should restart Actinium.',
                                                    ),
                                                    icon: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                                        _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__[
                                                            'Icon'
                                                        ].Feather.Check,
                                                        {
                                                            style: {
                                                                marginRight: 12,
                                                            },
                                                        },
                                                    ),
                                                });
                                                _context.next = 10;
                                                break;

                                            case 6:
                                                _context.prev = 6;
                                                _context.t0 = _context['catch'](
                                                    0,
                                                );
                                                Toast.show({
                                                    type: Toast.TYPE.ERROR,
                                                    message: Object(
                                                        reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__[
                                                            '__'
                                                        ],
                                                    )(
                                                        'Error resetting actinium!',
                                                    ),
                                                    icon: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                                        _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__[
                                                            'Icon'
                                                        ].Feather.AlertOctagon,
                                                        {
                                                            style: {
                                                                marginRight: 12,
                                                            },
                                                        },
                                                    ),
                                                });
                                                console.error(_context.t0);

                                            case 10:
                                                Modal.dismiss();

                                            case 11:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                },
                                null,
                                null,
                                [[0, 6]],
                            );
                        };

                        var showModal = function showModal() {
                            return Modal.show(
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    ConfirmBox,
                                    {
                                        message: Object(
                                            reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__[
                                                '__'
                                            ],
                                        )(
                                            'Are you sure? This is a destructive operation.',
                                        ),
                                        onCancel: function onCancel() {
                                            return Modal.hide();
                                        },
                                        onConfirm: confirm,
                                        title: title,
                                    },
                                ),
                            );
                        };

                        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__[
                                'Dialog'
                            ],
                            dialogSettings,
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                'div',
                                {
                                    className: 'plugin-settings-reset',
                                },
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__[
                                        'Button'
                                    ],
                                    {
                                        color:
                                            _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__[
                                                'Button'
                                            ].ENUMS.COLOR.DANGER,
                                        size:
                                            _atomic_reactor_reactium_ui__WEBPACK_IMPORTED_MODULE_1__[
                                                'Button'
                                            ].ENUMS.SIZE.LG,
                                        onClick: showModal,
                                    },
                                    Object(
                                        reactium_core_sdk__WEBPACK_IMPORTED_MODULE_2__[
                                            '__'
                                        ],
                                    )('Reset Actinium'),
                                ),
                            ),
                        );
                    };

                    /* harmony default export */ __webpack_exports__[
                        'default'
                    ] = BigRed;

                    /***/
                },

            /***/ './src/app/components/plugin-src/reset/index.js':
                /*!******************************************************!*\
  !*** ./src/app/components/plugin-src/reset/index.js ***!
  \******************************************************/
                /*! no exports provided */
                /***/ function(
                    module,
                    __webpack_exports__,
                    __webpack_require__,
                ) {
                    'use strict';
                    __webpack_require__.r(__webpack_exports__);
                    /* harmony import */ var reactium_core_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                        /*! reactium-core/sdk */ 'reactium-core/sdk',
                    );
                    /* harmony import */ var reactium_core_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                        reactium_core_sdk__WEBPACK_IMPORTED_MODULE_0__,
                    );
                    /* harmony import */ var _BigRed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                        /*! ./BigRed */ './src/app/components/plugin-src/reset/BigRed.js',
                    );

                    var registerResetPlugin = function registerResetPlugin() {
                        return regeneratorRuntime.async(
                            function registerResetPlugin$(_context) {
                                while (1) {
                                    switch ((_context.prev = _context.next)) {
                                        case 0:
                                            _context.next = 2;
                                            return regeneratorRuntime.awrap(
                                                reactium_core_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.Plugin.register(
                                                    'reset-plugin',
                                                ),
                                            );

                                        case 2:
                                            reactium_core_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.Plugin.addComponent(
                                                {
                                                    id: 'RESET-PLUGIN-SETTINGS',
                                                    zone:
                                                        'plugin-settings-Reset',
                                                    component:
                                                        _BigRed__WEBPACK_IMPORTED_MODULE_1__[
                                                            'default'
                                                        ],
                                                    order: 0,
                                                },
                                            );

                                        case 3:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            },
                        );
                    };

                    registerResetPlugin();

                    /***/
                },

            /***/ './src/app/components/plugin-src/reset/umd.js':
                /*!****************************************************!*\
  !*** ./src/app/components/plugin-src/reset/umd.js ***!
  \****************************************************/
                /*! no static exports found */
                /***/ function(module, exports, __webpack_require__) {
                    __webpack_require__(
                        /*! ./index */ './src/app/components/plugin-src/reset/index.js',
                    );

                    /***/
                },

            /***/ '@atomic-reactor/reactium-ui':
                /*!**********************************************!*\
  !*** external "@atomic-reactor/reactium-ui" ***!
  \**********************************************/
                /*! no static exports found */
                /***/ function(module, exports) {
                    module.exports = __WEBPACK_EXTERNAL_MODULE__atomic_reactor_reactium_ui__;

                    /***/
                },

            /***/ 'object-path':
                /*!******************************!*\
  !*** external "object-path" ***!
  \******************************/
                /*! no static exports found */
                /***/ function(module, exports) {
                    module.exports = __WEBPACK_EXTERNAL_MODULE_object_path__;

                    /***/
                },

            /***/ react:
                /*!************************!*\
  !*** external "react" ***!
  \************************/
                /*! no static exports found */
                /***/ function(module, exports) {
                    module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

                    /***/
                },

            /***/ 'reactium-core/sdk':
                /*!************************************!*\
  !*** external "reactium-core/sdk" ***!
  \************************************/
                /*! no static exports found */
                /***/ function(module, exports) {
                    module.exports = __WEBPACK_EXTERNAL_MODULE_reactium_core_sdk__;

                    /***/
                },

            /******/
        },
    );
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXNldC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcmVzZXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmVzZXQvLi9zcmMvYXBwL2NvbXBvbmVudHMvcGx1Z2luLXNyYy9yZXNldC9CaWdSZWQuanMiLCJ3ZWJwYWNrOi8vcmVzZXQvLi9zcmMvYXBwL2NvbXBvbmVudHMvcGx1Z2luLXNyYy9yZXNldC9pbmRleC5qcyIsIndlYnBhY2s6Ly9yZXNldC8uL3NyYy9hcHAvY29tcG9uZW50cy9wbHVnaW4tc3JjL3Jlc2V0L3VtZC5qcyIsIndlYnBhY2s6Ly9yZXNldC9leHRlcm5hbCBcIkBhdG9taWMtcmVhY3Rvci9yZWFjdGl1bS11aVwiIiwid2VicGFjazovL3Jlc2V0L2V4dGVybmFsIFwib2JqZWN0LXBhdGhcIiIsIndlYnBhY2s6Ly9yZXNldC9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vcmVzZXQvZXh0ZXJuYWwgXCJyZWFjdGl1bS1jb3JlL3Nka1wiIl0sIm5hbWVzIjpbIkJpZ1JlZCIsInByb3BzIiwidG9vbHMiLCJ1c2VIYW5kbGUiLCJNb2RhbCIsIm9wIiwiZ2V0IiwiVG9hc3QiLCJDb25maXJtQm94IiwidXNlSG9va0NvbXBvbmVudCIsInRpdGxlIiwiX18iLCJkaWFsb2dTZXR0aW5ncyIsImhlYWRlciIsImRpc21pc3NhYmxlIiwiY29uZmlybSIsIlJlYWN0aXVtIiwiQ2xvdWQiLCJydW4iLCJzaG93IiwidHlwZSIsIlRZUEUiLCJTVUNDRVNTIiwibWVzc2FnZSIsImljb24iLCJtYXJnaW5SaWdodCIsIkVSUk9SIiwiY29uc29sZSIsImVycm9yIiwiZGlzbWlzcyIsInNob3dNb2RhbCIsImhpZGUiLCJCdXR0b24iLCJFTlVNUyIsIkNPTE9SIiwiREFOR0VSIiwiU0laRSIsIkxHIiwicmVnaXN0ZXJSZXNldFBsdWdpbiIsIlBsdWdpbiIsInJlZ2lzdGVyIiwiYWRkQ29t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QUFPLENBQUMsZ0VBQVIsQzs7Ozs7Ozs7Ozs7QUNBQSx5RTs7Ozs7Ozs7Ozs7QUNBQSx5RDs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7Ozs7QUNBQSwrRCIsImZpbGUiOiJyZXNldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIkBhdG9taWMtcmVhY3Rvci9yZWFjdGl1bS11aVwiKSwgcmVxdWlyZShcIm9iamVjdC1wYXRoXCIpLCByZXF1aXJlKFwicmVhY3RcIiksIHJlcXVpcmUoXCJyZWFjdGl1bS1jb3JlL3Nka1wiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJAYXRvbWljLXJlYWN0b3IvcmVhY3RpdW0tdWlcIiwgXCJvYmplY3QtcGF0aFwiLCBcInJlYWN0XCIsIFwicmVhY3RpdW0tY29yZS9zZGtcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wicmVzZXRcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJAYXRvbWljLXJlYWN0b3IvcmVhY3RpdW0tdWlcIiksIHJlcXVpcmUoXCJvYmplY3QtcGF0aFwiKSwgcmVxdWlyZShcInJlYWN0XCIpLCByZXF1aXJlKFwicmVhY3RpdW0tY29yZS9zZGtcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInJlc2V0XCJdID0gZmFjdG9yeShyb290W1wiQGF0b21pYy1yZWFjdG9yL3JlYWN0aXVtLXVpXCJdLCByb290W1wib2JqZWN0LXBhdGhcIl0sIHJvb3RbXCJyZWFjdFwiXSwgcm9vdFtcInJlYWN0aXVtLWNvcmUvc2RrXCJdKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fYXRvbWljX3JlYWN0b3JfcmVhY3RpdW1fdWlfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9vYmplY3RfcGF0aF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3JlYWN0X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfcmVhY3RpdW1fY29yZV9zZGtfXykge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2FwcC9jb21wb25lbnRzL3BsdWdpbi1zcmMvcmVzZXQvdW1kLmpzXCIpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEljb24sIERpYWxvZywgQnV0dG9uIH0gZnJvbSAnQGF0b21pYy1yZWFjdG9yL3JlYWN0aXVtLXVpJztcbmltcG9ydCBSZWFjdGl1bSwgeyBfXywgdXNlSGFuZGxlLCB1c2VIb29rQ29tcG9uZW50IH0gZnJvbSAncmVhY3RpdW0tY29yZS9zZGsnO1xuaW1wb3J0IG9wIGZyb20gJ29iamVjdC1wYXRoJztcblxuY29uc3QgQmlnUmVkID0gcHJvcHMgPT4ge1xuICAgIGNvbnN0IHRvb2xzID0gdXNlSGFuZGxlKCdBZG1pblRvb2xzJyk7XG4gICAgY29uc3QgTW9kYWwgPSBvcC5nZXQodG9vbHMsICdNb2RhbCcpO1xuICAgIGNvbnN0IFRvYXN0ID0gb3AuZ2V0KHRvb2xzLCAnVG9hc3QnKTtcbiAgICBjb25zdCBDb25maXJtQm94ID0gdXNlSG9va0NvbXBvbmVudCgnQ29uZmlybUJveCcpO1xuICAgIGNvbnN0IHRpdGxlID0gX18oJ0FjdGluaXVtIFJlc2V0Jyk7XG4gICAgY29uc3QgZGlhbG9nU2V0dGluZ3MgPSB7XG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgIH0sXG4gICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgY29uc3QgY29uZmlybSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IFJlYWN0aXVtLkNsb3VkLnJ1bigncmVzZXQtYWN0aW5pdW0nKTtcbiAgICAgICAgICAgIFRvYXN0LnNob3coe1xuICAgICAgICAgICAgICAgIHR5cGU6IFRvYXN0LlRZUEUuU1VDQ0VTUyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBfXygnU3VjY2VzcyEgWW91IHNob3VsZCByZXN0YXJ0IEFjdGluaXVtLicpLFxuICAgICAgICAgICAgICAgIGljb246IDxJY29uLkZlYXRoZXIuQ2hlY2sgc3R5bGU9e3sgbWFyZ2luUmlnaHQ6IDEyIH19IC8+LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBUb2FzdC5zaG93KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBUb2FzdC5UWVBFLkVSUk9SLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IF9fKCdFcnJvciByZXNldHRpbmcgYWN0aW5pdW0hJyksXG4gICAgICAgICAgICAgICAgaWNvbjogPEljb24uRmVhdGhlci5BbGVydE9jdGFnb24gc3R5bGU9e3sgbWFyZ2luUmlnaHQ6IDEyIH19IC8+LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE1vZGFsLmRpc21pc3MoKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2hvd01vZGFsID0gKCkgPT5cbiAgICAgICAgTW9kYWwuc2hvdyhcbiAgICAgICAgICAgIDxDb25maXJtQm94XG4gICAgICAgICAgICAgICAgbWVzc2FnZT17X18oJ0FyZSB5b3Ugc3VyZT8gVGhpcyBpcyBhIGRlc3RydWN0aXZlIG9wZXJhdGlvbi4nKX1cbiAgICAgICAgICAgICAgICBvbkNhbmNlbD17KCkgPT4gTW9kYWwuaGlkZSgpfVxuICAgICAgICAgICAgICAgIG9uQ29uZmlybT17Y29uZmlybX1cbiAgICAgICAgICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgICAgICAvPixcbiAgICAgICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxEaWFsb2cgey4uLmRpYWxvZ1NldHRpbmdzfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwbHVnaW4tc2V0dGluZ3MtcmVzZXQnPlxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgY29sb3I9e0J1dHRvbi5FTlVNUy5DT0xPUi5EQU5HRVJ9XG4gICAgICAgICAgICAgICAgICAgIHNpemU9e0J1dHRvbi5FTlVNUy5TSVpFLkxHfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtzaG93TW9kYWx9PlxuICAgICAgICAgICAgICAgICAgICB7X18oJ1Jlc2V0IEFjdGluaXVtJyl9XG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EaWFsb2c+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJpZ1JlZDtcbiIsImltcG9ydCBSZWFjdGl1bSBmcm9tICdyZWFjdGl1bS1jb3JlL3Nkayc7XG5pbXBvcnQgQmlnUmVkIGZyb20gJy4vQmlnUmVkJztcblxuY29uc3QgcmVnaXN0ZXJSZXNldFBsdWdpbiA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBSZWFjdGl1bS5QbHVnaW4ucmVnaXN0ZXIoJ3Jlc2V0LXBsdWdpbicpO1xuXG4gICAgUmVhY3RpdW0uUGx1Z2luLmFkZENvbXBvbmVudCh7XG4gICAgICAgIGlkOiAnUkVTRVQtUExVR0lOLVNFVFRJTkdTJyxcbiAgICAgICAgem9uZTogJ3BsdWdpbi1zZXR0aW5ncy1SZXNldCcsXG4gICAgICAgIGNvbXBvbmVudDogQmlnUmVkLFxuICAgICAgICBvcmRlcjogMCxcbiAgICB9KTtcbn07XG5cbnJlZ2lzdGVyUmVzZXRQbHVnaW4oKTtcbiIsInJlcXVpcmUoJy4vaW5kZXgnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fYXRvbWljX3JlYWN0b3JfcmVhY3RpdW1fdWlfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfb2JqZWN0X3BhdGhfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfcmVhY3RfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfcmVhY3RpdW1fY29yZV9zZGtfXzsiXSwic291cmNlUm9vdCI6IiJ9

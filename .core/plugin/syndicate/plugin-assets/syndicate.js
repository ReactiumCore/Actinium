!(function(e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t(
              require('reactium-core/sdk'),
              require('react'),
              require('object-path'),
              require('copy-to-clipboard'),
          ))
        : 'function' == typeof define && define.amd
        ? define([
              'reactium-core/sdk',
              'react',
              'object-path',
              'copy-to-clipboard',
          ], t)
        : 'object' == typeof exports
        ? (exports.syndicate = t(
              require('reactium-core/sdk'),
              require('react'),
              require('object-path'),
              require('copy-to-clipboard'),
          ))
        : (e.syndicate = t(
              e['reactium-core/sdk'],
              e.react,
              e['object-path'],
              e['copy-to-clipboard'],
          ));
})(window, function(e, t, n, r) {
    return (function(e) {
        var t = {};
        function n(r) {
            if (t[r]) return t[r].exports;
            var a = (t[r] = { i: r, l: !1, exports: {} });
            return e[r].call(a.exports, a, a.exports, n), (a.l = !0), a.exports;
        }
        return (
            (n.m = e),
            (n.c = t),
            (n.d = function(e, t, r) {
                n.o(e, t) ||
                    Object.defineProperty(e, t, { enumerable: !0, get: r });
            }),
            (n.r = function(e) {
                'undefined' != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, {
                        value: 'Module',
                    }),
                    Object.defineProperty(e, '__esModule', { value: !0 });
            }),
            (n.t = function(e, t) {
                if ((1 & t && (e = n(e)), 8 & t)) return e;
                if (4 & t && 'object' == typeof e && e && e.__esModule)
                    return e;
                var r = Object.create(null);
                if (
                    (n.r(r),
                    Object.defineProperty(r, 'default', {
                        enumerable: !0,
                        value: e,
                    }),
                    2 & t && 'string' != typeof e)
                )
                    for (var a in e)
                        n.d(
                            r,
                            a,
                            function(t) {
                                return e[t];
                            }.bind(null, a),
                        );
                return r;
            }),
            (n.n = function(e) {
                var t =
                    e && e.__esModule
                        ? function() {
                              return e.default;
                          }
                        : function() {
                              return e;
                          };
                return n.d(t, 'a', t), t;
            }),
            (n.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (n.p = ''),
            n((n.s = 4))
        );
    })([
        function(t, n) {
            t.exports = e;
        },
        function(e, n) {
            e.exports = t;
        },
        function(e, t) {
            e.exports = n;
        },
        function(e, t) {
            e.exports = r;
        },
        function(e, t, n) {
            n(5);
        },
        function(e, t, n) {
            'use strict';
            n.r(t);
            var r = n(0),
                a = n.n(r),
                o = n(1),
                c = n.n(o),
                i = n(2),
                l = n.n(i),
                u = n(3),
                s = n.n(u);
            function p(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t &&
                        (r = r.filter(function(t) {
                            return Object.getOwnPropertyDescriptor(
                                e,
                                t,
                            ).enumerable;
                        })),
                        n.push.apply(n, r);
                }
                return n;
            }
            function d(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                        ? p(Object(n), !0).forEach(function(t) {
                              f(e, t, n[t]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(n),
                          )
                        : p(Object(n)).forEach(function(t) {
                              Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(n, t),
                              );
                          });
                }
                return e;
            }
            function f(e, t, n) {
                return (
                    t in e
                        ? Object.defineProperty(e, t, {
                              value: n,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                          })
                        : (e[t] = n),
                    e
                );
            }
            function m(e, t, n, r, a, o, c) {
                try {
                    var i = e[o](c),
                        l = i.value;
                } catch (e) {
                    return void n(e);
                }
                i.done ? t(l) : Promise.resolve(l).then(r, a);
            }
            function y(e) {
                return function() {
                    var t = this,
                        n = arguments;
                    return new Promise(function(r, a) {
                        var o = e.apply(t, n);
                        function c(e) {
                            m(o, r, a, c, i, 'next', e);
                        }
                        function i(e) {
                            m(o, r, a, c, i, 'throw', e);
                        }
                        c(void 0);
                    });
                };
            }
            function b(e, t) {
                return (
                    (function(e) {
                        if (Array.isArray(e)) return e;
                    })(e) ||
                    (function(e, t) {
                        if (
                            'undefined' == typeof Symbol ||
                            !(Symbol.iterator in Object(e))
                        )
                            return;
                        var n = [],
                            r = !0,
                            a = !1,
                            o = void 0;
                        try {
                            for (
                                var c, i = e[Symbol.iterator]();
                                !(r = (c = i.next()).done) &&
                                (n.push(c.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (a = !0), (o = e);
                        } finally {
                            try {
                                r || null == i.return || i.return();
                            } finally {
                                if (a) throw o;
                            }
                        }
                        return n;
                    })(e, t) ||
                    (function(e, t) {
                        if (!e) return;
                        if ('string' == typeof e) return v(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name);
                        if ('Map' === n || 'Set' === n) return Array.from(n);
                        if (
                            'Arguments' === n ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        )
                            return v(e, t);
                    })(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function v(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var g = function() {},
                O = function(e) {
                    var t = e.onSave,
                        n = void 0 === t ? g : t,
                        a = e.onCancel,
                        i = void 0 === a ? g : a,
                        l = Object(r.useHookComponent)('ReactiumUI'),
                        u = l.Dialog,
                        s = l.Button,
                        p = b(Object(o.useState)(''), 2),
                        d = p[0],
                        f = p[1],
                        m = Object(r.__)('Client Name');
                    return c.a.createElement(
                        u,
                        { header: { title: Object(r.__)('New Client') } },
                        c.a.createElement(
                            'div',
                            { className: 'syndicate-new' },
                            c.a.createElement(
                                'div',
                                { className: 'syndicate-new-name form-group' },
                                c.a.createElement(
                                    'label',
                                    null,
                                    c.a.createElement('span', null, m),
                                    c.a.createElement('input', {
                                        type: 'text',
                                        onChange: function(e) {
                                            return f(e.target.value);
                                        },
                                        placeholder: m,
                                    }),
                                ),
                            ),
                            c.a.createElement(
                                'div',
                                { className: 'syndicate-new-controls' },
                                c.a.createElement(
                                    s,
                                    {
                                        size: 'sm',
                                        type: 'button',
                                        color: 'danger',
                                        onClick: i,
                                    },
                                    Object(r.__)('Cancel'),
                                ),
                                c.a.createElement(
                                    s,
                                    {
                                        size: 'sm',
                                        type: 'button',
                                        color: 'primary',
                                        onClick: function() {
                                            return n(d);
                                        },
                                        disabled: !d || !d.length,
                                    },
                                    Object(r.__)('Save'),
                                ),
                            ),
                        ),
                    );
                },
                h = function() {
                    var e,
                        t = b(Object(o.useState)(!0), 2),
                        n = t[0],
                        i = t[1],
                        u = b(Object(o.useState)({}), 2),
                        p = u[0],
                        m = u[1],
                        v = Object(r.useHookComponent)('ReactiumUI'),
                        g = v.Spinner,
                        h = v.Button,
                        E = v.Icon,
                        j = v.DataTable,
                        S = Object(r.useHookComponent)('ConfirmBox'),
                        C =
                            ((e = Object(r.useHandle)('AdminTools')),
                            l.a.get(e, 'Modal')),
                        _ = (function() {
                            var e = Object(r.useHandle)('AdminTools');
                            return l.a.get(e, 'Toast');
                        })();
                    Object(r.useAsyncEffect)(
                        (function() {
                            var e = y(
                                regeneratorRuntime.mark(function e(t) {
                                    var n;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    return (
                                                        (e.next = 2),
                                                        a.a.Syndicate.Client.list()
                                                    );
                                                case 2:
                                                    (n = e.sent),
                                                        t &&
                                                            (m(
                                                                l.a.get(
                                                                    n,
                                                                    'results',
                                                                    {},
                                                                ),
                                                            ),
                                                            i(!1));
                                                case 4:
                                                case 'end':
                                                    return e.stop();
                                            }
                                    }, e);
                                }),
                            );
                            return function(t) {
                                return e.apply(this, arguments);
                            };
                        })(),
                        [],
                    );
                    var w = (function() {
                            var e = y(
                                regeneratorRuntime.mark(function e(t) {
                                    var n, o;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    return (
                                                        (e.next = 2),
                                                        a.a.Syndicate.Client.create(
                                                            { client: t },
                                                        )
                                                    );
                                                case 2:
                                                    (n = e.sent),
                                                        (o = d(
                                                            f(
                                                                {},
                                                                n.objectId,
                                                                n,
                                                            ),
                                                            p,
                                                        )),
                                                        m(o),
                                                        _.show({
                                                            icon:
                                                                'Feather.Check',
                                                            message: Object(
                                                                r.__,
                                                            )('Client Created'),
                                                            type: _.TYPE.INFO,
                                                        }),
                                                        C.hide();
                                                case 7:
                                                case 'end':
                                                    return e.stop();
                                            }
                                    }, e);
                                }),
                            );
                            return function(t) {
                                return e.apply(this, arguments);
                            };
                        })(),
                        k = function(e) {
                            return y(
                                regeneratorRuntime.mark(function t() {
                                    var n;
                                    return regeneratorRuntime.wrap(function(t) {
                                        for (;;)
                                            switch ((t.prev = t.next)) {
                                                case 0:
                                                    return (
                                                        (t.next = 2),
                                                        a.a.Syndicate.Client.delete(
                                                            e,
                                                        )
                                                    );
                                                case 2:
                                                    (n = d({}, p)),
                                                        l.a.del(n, e.objectId),
                                                        m(n),
                                                        _.show({
                                                            icon:
                                                                'Feather.Check',
                                                            message: Object(
                                                                r.__,
                                                            )('Deleted Client'),
                                                            type: _.TYPE.INFO,
                                                        }),
                                                        C.hide();
                                                case 7:
                                                case 'end':
                                                    return t.stop();
                                            }
                                    }, t);
                                }),
                            );
                        },
                        N = function(e) {
                            return function() {
                                C.show(
                                    c.a.createElement(S, {
                                        message: Object(r.__)('Are you sure?'),
                                        onCancel: function() {
                                            return C.hide();
                                        },
                                        onConfirm: k(e),
                                        title: Object(r.__)(
                                            'Delete %client',
                                        ).replace(
                                            '%client',
                                            l.a.get(e, 'client', ''),
                                        ),
                                    }),
                                );
                            };
                        },
                        I = function(e) {
                            return function() {
                                s()(e),
                                    _.show({
                                        icon: 'Feather.Check',
                                        message: Object(r.__)('Token Copied'),
                                        type: _.TYPE.INFO,
                                    });
                            };
                        },
                        A = function(e) {
                            var t = Object(r.__)('Copy Token'),
                                n = Object(r.__)('Delete');
                            return d({}, e, {
                                token: c.a.createElement(
                                    'div',
                                    {
                                        className: 'token-column',
                                        'data-tooltip': t,
                                        'data-align': 'left',
                                        'data-vertical-align': 'top',
                                        onClick: I(e.token),
                                    },
                                    c.a.createElement(E, {
                                        name: 'Feather.Copy',
                                        size: 18,
                                    }),
                                    c.a.createElement(
                                        'span',
                                        { className: 'ml-xs-8' },
                                        e.token,
                                    ),
                                ),
                                copy: c.a.createElement(
                                    h,
                                    {
                                        color: h.ENUMS.COLOR.CLEAR,
                                        size: h.ENUMS.SIZE.XS,
                                        'data-tooltip': t,
                                        'data-align': 'center',
                                        'data-vertical-align': 'top',
                                        onClick: I(e.token),
                                    },
                                    c.a.createElement(E, {
                                        name: 'Feather.Copy',
                                        size: 18,
                                    }),
                                    c.a.createElement(
                                        'span',
                                        { className: 'sr-only' },
                                        t,
                                    ),
                                ),
                                delete: c.a.createElement(
                                    h,
                                    {
                                        color: h.ENUMS.COLOR.DANGER,
                                        size: h.ENUMS.SIZE.XS,
                                        'data-tooltip': n,
                                        'data-align': 'center',
                                        'data-vertical-align': 'top',
                                        onClick: N(e),
                                    },
                                    c.a.createElement(E, {
                                        name: 'Feather.X',
                                        size: 18,
                                    }),
                                    c.a.createElement(
                                        'span',
                                        { className: 'sr-only' },
                                        n,
                                    ),
                                ),
                            });
                        };
                    return c.a.createElement(
                        'div',
                        { className: 'syndicate-clients' },
                        c.a.createElement(
                            'div',
                            { className: 'syndicate-clients-header' },
                            c.a.createElement(
                                'h2',
                                { className: 'h3' },
                                Object(r.__)('Syndication Clients'),
                            ),
                            c.a.createElement(
                                h,
                                {
                                    appearance: h.ENUMS.APPEARANCE.PILL,
                                    className: 'mr-xs-24',
                                    color: h.ENUMS.COLOR.PRIMARY,
                                    outline: !0,
                                    size: h.ENUMS.SIZE.XS,
                                    onClick: function() {
                                        C.show(
                                            c.a.createElement(O, {
                                                onCancel: function() {
                                                    return C.hide();
                                                },
                                                onSave: w,
                                            }),
                                        );
                                    },
                                },
                                c.a.createElement(E, {
                                    name: 'Feather.Plus',
                                    size: 18,
                                }),
                                c.a.createElement(
                                    'span',
                                    null,
                                    Object(r.__)('New Client'),
                                ),
                            ),
                        ),
                        n
                            ? c.a.createElement(
                                  'div',
                                  { className: 'syndicate-loading' },
                                  c.a.createElement(g, null),
                              )
                            : c.a.createElement(j, {
                                  scrollable: !0,
                                  columns: {
                                      client: {
                                          label: Object(r.__)('Client'),
                                          verticalAlign:
                                              j.ENUMS.VERTICAL_ALIGN.MIDDLE,
                                          width: 100,
                                      },
                                      token: {
                                          label: Object(r.__)('Token'),
                                          verticalAlign:
                                              j.ENUMS.VERTICAL_ALIGN.MIDDLE,
                                      },
                                      delete: {
                                          label: null,
                                          verticalAlign:
                                              j.ENUMS.VERTICAL_ALIGN.MIDDLE,
                                          textAlign: j.ENUMS.TEXT_ALIGN.RIGHT,
                                          width: 90,
                                      },
                                  },
                                  data: Object.values(p).map(A),
                              }),
                    );
                };
            function E(e, t, n, r, a, o, c) {
                try {
                    var i = e[o](c),
                        l = i.value;
                } catch (e) {
                    return void n(e);
                }
                i.done ? t(l) : Promise.resolve(l).then(r, a);
            }
            function j(e, t) {
                return (
                    (function(e) {
                        if (Array.isArray(e)) return e;
                    })(e) ||
                    (function(e, t) {
                        if (
                            'undefined' == typeof Symbol ||
                            !(Symbol.iterator in Object(e))
                        )
                            return;
                        var n = [],
                            r = !0,
                            a = !1,
                            o = void 0;
                        try {
                            for (
                                var c, i = e[Symbol.iterator]();
                                !(r = (c = i.next()).done) &&
                                (n.push(c.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (a = !0), (o = e);
                        } finally {
                            try {
                                r || null == i.return || i.return();
                            } finally {
                                if (a) throw o;
                            }
                        }
                        return n;
                    })(e, t) ||
                    (function(e, t) {
                        if (!e) return;
                        if ('string' == typeof e) return S(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name);
                        if ('Map' === n || 'Set' === n) return Array.from(n);
                        if (
                            'Arguments' === n ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        )
                            return S(e, t);
                    })(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function S(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var C = function() {
                    var e = Object(r.useHookComponent)('SettingEditor'),
                        t = Object(r.useHookComponent)('ReactiumUI').Spinner,
                        n = j(Object(o.useState)([]), 2),
                        i = n[0],
                        u = n[1];
                    if (
                        (Object(r.useAsyncEffect)(
                            (function() {
                                var e,
                                    t =
                                        ((e = regeneratorRuntime.mark(
                                            function e(t) {
                                                var n;
                                                return regeneratorRuntime.wrap(
                                                    function(e) {
                                                        for (;;)
                                                            switch (
                                                                (e.prev =
                                                                    e.next)
                                                            ) {
                                                                case 0:
                                                                    return (
                                                                        (e.next = 2),
                                                                        a.a.ContentType.types()
                                                                    );
                                                                case 2:
                                                                    (n =
                                                                        e.sent),
                                                                        t() &&
                                                                            u(
                                                                                n,
                                                                            );
                                                                case 4:
                                                                case 'end':
                                                                    return e.stop();
                                                            }
                                                    },
                                                    e,
                                                );
                                            },
                                        )),
                                        function() {
                                            var t = this,
                                                n = arguments;
                                            return new Promise(function(r, a) {
                                                var o = e.apply(t, n);
                                                function c(e) {
                                                    E(o, r, a, c, i, 'next', e);
                                                }
                                                function i(e) {
                                                    E(
                                                        o,
                                                        r,
                                                        a,
                                                        c,
                                                        i,
                                                        'throw',
                                                        e,
                                                    );
                                                }
                                                c(void 0);
                                            });
                                        });
                                return function(e) {
                                    return t.apply(this, arguments);
                                };
                            })(),
                            [],
                        ),
                        !i.length)
                    )
                        return c.a.createElement(
                            'div',
                            { className: 'syndicate-loading' },
                            c.a.createElement(t, null),
                        );
                    var s = i.reduce(function(e, t) {
                        var n = l.a.get(t, 'machineName'),
                            a = l.a.get(t, 'meta.label', l.a.get(t, 'type', n)),
                            o = {
                                type: 'toggle',
                                label: a,
                                tooltip: Object(r.__)(
                                    'Syndicate %type',
                                ).replace('%type', a),
                                required: !1,
                            };
                        return l.a.set(e, ['Syndicate.types.'.concat(n)], o), e;
                    }, {});
                    return c.a.createElement(e, {
                        settings: {
                            title: Object(r.__)('Syndication Types'),
                            group: 'Syndicate',
                            inputs: s,
                        },
                    });
                },
                _ = [
                    {
                        capability: 'SyndicateClient.create',
                        title: Object(r.__)('Create a client'),
                        tooltip: Object(r.__)('Create a syndication client.'),
                    },
                    {
                        capability: 'SyndicateClient.retrieve',
                        title: Object(r.__)('View any client'),
                        tooltip: Object(r.__)(
                            'Able to view and retrieve refresh token for any syndication client.',
                        ),
                    },
                    {
                        capability: 'SyndicateClient.delete',
                        title: Object(r.__)('Delete any client'),
                        tooltip: Object(r.__)(
                            'Delete a client, preventing access to syndicated content.',
                        ),
                    },
                ],
                w = function() {
                    var e = Object(r.useHookComponent)('CapabilityEditor'),
                        t = Object(r.useHookComponent)('ReactiumUI').Tabs;
                    return c.a.createElement(
                        'div',
                        { className: 'syndication-settings' },
                        c.a.createElement(t, {
                            activeTab: 0,
                            collapsible: !1,
                            data: [
                                {
                                    id: 'types',
                                    tab: Object(r.__)('Types'),
                                    content: c.a.createElement(C, null),
                                },
                                {
                                    id: 'clients',
                                    tab: Object(r.__)('Clients'),
                                    content: c.a.createElement(h, null),
                                },
                            ],
                        }),
                        c.a.createElement(e, { capabilities: _ }),
                        c.a.createElement(r.Zone, {
                            zone: 'syndication-settings',
                        }),
                    );
                },
                k = function(e) {
                    var t = Object(r.useHookComponent)('MenuItem');
                    return c.a.createElement(t, {
                        route: '/admin/plugins/Syndicate',
                        label: Object(r.__)('Syndicate'),
                    });
                },
                N = {};
            [
                { key: 'Client.create', value: 'syndicate-client-create' },
                { key: 'Client.retrieve', value: 'syndicate-client-retrieve' },
                { key: 'Client.list', value: 'syndicate-clients' },
                { key: 'Client.delete', value: 'syndicate-client-delete' },
            ].forEach(function(e) {
                var t = e.key,
                    n = e.value;
                return l.a.set(N, t, function(e) {
                    return a.a.Cloud.run(n, e);
                });
            });
            var I = N;
            function A(e, t, n, r, a, o, c) {
                try {
                    var i = e[o](c),
                        l = i.value;
                } catch (e) {
                    return void n(e);
                }
                i.done ? t(l) : Promise.resolve(l).then(r, a);
            }
            (function() {
                var e,
                    t =
                        ((e = regeneratorRuntime.mark(function e() {
                            var t;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;)
                                    switch ((e.prev = e.next)) {
                                        case 0:
                                            return (
                                                (e.next = 2),
                                                a.a.Plugin.register('syndicate')
                                            );
                                        case 2:
                                            return (
                                                (e.next = 4),
                                                a.a.Capability.check(
                                                    [
                                                        'Setting.create',
                                                        'Setting.update',
                                                        'Setting.retrieve',
                                                    ],
                                                    !1,
                                                )
                                            );
                                        case 4:
                                            (t = e.sent),
                                                (a.a.Syndicate = I),
                                                t &&
                                                    (a.a.Zone.addComponent({
                                                        id:
                                                            'SYNDICATE-PLUGIN-SETTINGS-ALL',
                                                        zone:
                                                            'plugin-settings-Syndicate',
                                                        component: w,
                                                        order: 0,
                                                    }),
                                                    a.a.Zone.addComponent({
                                                        id:
                                                            'SYNDICATE-PLUGIN-SIDEBAR-WIDGET',
                                                        zone:
                                                            'admin-sidebar-settings',
                                                        component: k,
                                                        order: 0,
                                                    }));
                                        case 7:
                                        case 'end':
                                            return e.stop();
                                    }
                            }, e);
                        })),
                        function() {
                            var t = this,
                                n = arguments;
                            return new Promise(function(r, a) {
                                var o = e.apply(t, n);
                                function c(e) {
                                    A(o, r, a, c, i, 'next', e);
                                }
                                function i(e) {
                                    A(o, r, a, c, i, 'throw', e);
                                }
                                c(void 0);
                            });
                        });
                return function() {
                    return t.apply(this, arguments);
                };
            })()();
        },
    ]);
});

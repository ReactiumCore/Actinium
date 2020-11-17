!(function(e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t(
              require('reactium-core/sdk'),
              require('react'),
              require('object-path'),
              require('shallow-equals'),
              require('underscore'),
          ))
        : 'function' == typeof define && define.amd
        ? define([
              'reactium-core/sdk',
              'react',
              'object-path',
              'shallow-equals',
              'underscore',
          ], t)
        : 'object' == typeof exports
        ? (exports['syndicate-client'] = t(
              require('reactium-core/sdk'),
              require('react'),
              require('object-path'),
              require('shallow-equals'),
              require('underscore'),
          ))
        : (e['syndicate-client'] = t(
              e['reactium-core/sdk'],
              e.react,
              e['object-path'],
              e['shallow-equals'],
              e.underscore,
          ));
})(window, function(e, t, n, r, o) {
    return (function(e) {
        var t = {};
        function n(r) {
            if (t[r]) return t[r].exports;
            var o = (t[r] = { i: r, l: !1, exports: {} });
            return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
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
                    for (var o in e)
                        n.d(
                            r,
                            o,
                            function(t) {
                                return e[t];
                            }.bind(null, o),
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
            n((n.s = 5))
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
        function(e, t) {
            e.exports = o;
        },
        function(e, t, n) {
            n(6);
        },
        function(e, t, n) {
            'use strict';
            n.r(t);
            var r = n(0),
                o = n.n(r),
                a = n(1),
                i = n.n(a),
                c = {
                    title: Object(r.__)('Syndicate Client Settings'),
                    group: 'SyndicateClient',
                    inputs: {
                        'SyndicateClient.appId': {
                            type: 'text',
                            label: Object(r.__)('Syndicate Host App ID'),
                            tooltip: Object(r.__)(
                                'The Application ID of the syndication root site (e.g. Actinium).',
                            ),
                            required: !0,
                        },
                        'SyndicateClient.host': {
                            type: 'text',
                            label: Object(r.__)('Syndicate Host'),
                            tooltip: Object(r.__)(
                                'The API URL for the syndication root site.',
                            ),
                            required: !0,
                        },
                        'SyndicateClient.token': {
                            type: 'text',
                            label: Object(r.__)('Client Refresh Token'),
                            tooltip: Object(r.__)(
                                'The refresh token of this syndication client.',
                            ),
                            required: !0,
                        },
                        'SyndicateClient.enable': {
                            type: 'toggle',
                            label: Object(r.__)('Client Sync Enabled'),
                            tooltip: Object(r.__)(
                                'Enable or disable sychronizing to this satellite.',
                            ),
                            required: !1,
                        },
                        'SyndicateClient.cron': {
                            type: 'text',
                            label: Object(r.__)('Client Sync Schedule'),
                            tooltip: Object(r.__)(
                                'The node-cron schedule of the updated (e.g. */30 * * * *).',
                            ),
                            required: !1,
                        },
                    },
                },
                u = [
                    {
                        capability: 'setting.SyndicateClient-get',
                        title: Object(r.__)(
                            'View Syndication client settings.',
                        ),
                        tooltip: Object(r.__)(
                            'Able to see Syndicate Client plugin settings, but not necessarily change them.',
                        ),
                    },
                    {
                        capability: 'setting.SyndicateClient-set',
                        title: Object(r.__)(
                            'Edit Syndication Client Plugin Settings',
                        ),
                        tooltip: Object(r.__)(
                            'Provides ability to configure settings for the Syndicate Client plugin.',
                        ),
                    },
                ],
                s = function() {
                    var e = Object(r.useHookComponent)('SettingEditor'),
                        t = Object(r.useHookComponent)('CapabilityEditor');
                    return i.a.createElement(
                        'div',
                        { className: 'syndicate-client-settings' },
                        i.a.createElement(e, { settings: c }),
                        i.a.createElement(t, { capabilities: u }),
                        i.a.createElement(r.Zone, {
                            zone: 'syndicate-client-settings',
                        }),
                    );
                },
                l = n(2),
                f = n.n(l),
                d = n(3),
                p = n.n(d);
            function y(e, t, n, r, o, a, i) {
                try {
                    var c = e[a](i),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o);
            }
            function b(e, t) {
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
            function m(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                        ? b(Object(n), !0).forEach(function(t) {
                              g(e, t, n[t]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(n),
                          )
                        : b(Object(n)).forEach(function(t) {
                              Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(n, t),
                              );
                          });
                }
                return e;
            }
            function g(e, t, n) {
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
            function v(e, t) {
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
                            o = !1,
                            a = void 0;
                        try {
                            for (
                                var i, c = e[Symbol.iterator]();
                                !(r = (i = c.next()).done) &&
                                (n.push(i.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (o = !0), (a = e);
                        } finally {
                            try {
                                r || null == c.return || c.return();
                            } finally {
                                if (o) throw a;
                            }
                        }
                        return n;
                    })(e, t) ||
                    (function(e, t) {
                        if (!e) return;
                        if ('string' == typeof e) return h(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name);
                        if ('Map' === n || 'Set' === n) return Array.from(e);
                        if (
                            'Arguments' === n ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        )
                            return h(e, t);
                    })(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function h(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var O = function(e, t) {
                    return (
                        f.a.get(e, 'groupName') === f.a.get(t, 'groupName') &&
                        p()(
                            f.a.get(e, 'settingGroup'),
                            f.a.get(t, 'settingGroup'),
                        )
                    );
                },
                j = Object(a.memo)(function(e) {
                    var t,
                        n = e.settingGroup,
                        c = Object(r.useHookComponent)('ReactiumUI'),
                        u = c.Spinner,
                        s = c.Alert,
                        l = c.Icon,
                        d = c.Button,
                        p = v(
                            Object(a.useState)({
                                loading: !0,
                                valid: !1,
                                forceUpdated: new Date(),
                            }),
                            2,
                        ),
                        b = p[0],
                        g = p[1],
                        h = function(e) {
                            g(m(m({}, b), e));
                        },
                        O =
                            ((t = n),
                            {
                                appId: f.a.get(t, 'appId'),
                                host: f.a.get(t, 'host'),
                                token: f.a.get(t, 'token'),
                            }),
                        j = O.appId,
                        S = O.host,
                        C = O.token;
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
                                                                    if (!C) {
                                                                        e.next = 6;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        h({
                                                                            loading: !0,
                                                                        }),
                                                                        (e.next = 4),
                                                                        o.a.Cloud.run(
                                                                            'syndicate-satellite-test',
                                                                        )
                                                                    );
                                                                case 4:
                                                                    (n =
                                                                        e.sent),
                                                                        t() &&
                                                                            h({
                                                                                loading: !1,
                                                                                valid: n,
                                                                            });
                                                                case 6:
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
                                            return new Promise(function(r, o) {
                                                var a = e.apply(t, n);
                                                function i(e) {
                                                    y(a, r, o, i, c, 'next', e);
                                                }
                                                function c(e) {
                                                    y(
                                                        a,
                                                        r,
                                                        o,
                                                        i,
                                                        c,
                                                        'throw',
                                                        e,
                                                    );
                                                }
                                                i(void 0);
                                            });
                                        });
                                return function(e) {
                                    return t.apply(this, arguments);
                                };
                            })(),
                            [j, S, C, b.forceUpdated],
                        ),
                        !(j && S && C))
                    )
                        return null;
                    if (b.loading)
                        return i.a.createElement(
                            'div',
                            {
                                style: {
                                    display: 'flex',
                                    height: '60px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            },
                            i.a.createElement(u, null),
                        );
                    var w = {
                        success: Object(r.__)('Connection test successful.'),
                        failure: Object(r.__)('Connection test failed.'),
                    };
                    return i.a.createElement(
                        'div',
                        { className: 'p-xs-20' },
                        i.a.createElement(
                            s,
                            {
                                dismissable: !0,
                                color: b.valid
                                    ? s.ENUMS.COLOR.SUCCESS
                                    : s.ENUMS.COLOR.DANGER,
                                icon: i.a.createElement(l, {
                                    name: b.valid
                                        ? 'Feather.Check'
                                        : 'Feather.AlertOctagon',
                                }),
                            },
                            b.valid ? w.success : w.failure,
                            i.a.createElement(
                                d,
                                {
                                    className: 'ml-xs-16',
                                    size: 'xs',
                                    appearance: 'pill',
                                    onClick: function() {
                                        h({ forceUpdated: new Date() });
                                    },
                                },
                                Object(r.__)('Refresh'),
                            ),
                        ),
                    );
                }, O);
            function S(e) {
                return (
                    (function(e) {
                        if (Array.isArray(e)) return k(e);
                    })(e) ||
                    (function(e) {
                        if (
                            'undefined' != typeof Symbol &&
                            Symbol.iterator in Object(e)
                        )
                            return Array.from(e);
                    })(e) ||
                    P(e) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function C(e, t, n, r, o, a, i) {
                try {
                    var c = e[a](i),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o);
            }
            function w(e) {
                return function() {
                    var t = this,
                        n = arguments;
                    return new Promise(function(r, o) {
                        var a = e.apply(t, n);
                        function i(e) {
                            C(a, r, o, i, c, 'next', e);
                        }
                        function c(e) {
                            C(a, r, o, i, c, 'throw', e);
                        }
                        i(void 0);
                    });
                };
            }
            function E(e, t) {
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
            function _(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                        ? E(Object(n), !0).forEach(function(t) {
                              x(e, t, n[t]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(n),
                          )
                        : E(Object(n)).forEach(function(t) {
                              Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(n, t),
                              );
                          });
                }
                return e;
            }
            function x(e, t, n) {
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
            function I(e, t) {
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
                            o = !1,
                            a = void 0;
                        try {
                            for (
                                var i, c = e[Symbol.iterator]();
                                !(r = (i = c.next()).done) &&
                                (n.push(i.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (o = !0), (a = e);
                        } finally {
                            try {
                                r || null == c.return || c.return();
                            } finally {
                                if (o) throw a;
                            }
                        }
                        return n;
                    })(e, t) ||
                    P(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function P(e, t) {
                if (e) {
                    if ('string' == typeof e) return k(e, t);
                    var n = Object.prototype.toString.call(e).slice(8, -1);
                    return (
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name),
                        'Map' === n || 'Set' === n
                            ? Array.from(e)
                            : 'Arguments' === n ||
                              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                            ? k(e, t)
                            : void 0
                    );
                }
            }
            function k(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var A = function(e, t) {
                    return (
                        f.a.get(e, 'groupName') === f.a.get(t, 'groupName') &&
                        p()(
                            f.a.get(e, 'settingGroup'),
                            f.a.get(t, 'settingGroup'),
                        )
                    );
                },
                T = { label: '', count: [0, 0] },
                N = Object(a.memo)(function(e) {
                    var t,
                        n = e.settingGroup,
                        c = Object(r.useHandle)('AdminTools'),
                        u =
                            (f.a.get(c, 'Toast'),
                            Object(r.useHookComponent)('ReactiumUI')),
                        s = u.Icon,
                        l = u.Button,
                        d = I(
                            Object(a.useState)({
                                loading: !0,
                                valid: !1,
                                forceUpdated: new Date(),
                            }),
                            2,
                        ),
                        p = d[0],
                        y = d[1],
                        b = I(
                            Object(a.useState)({
                                syncStatus: 'end',
                                syncContext: T,
                            }),
                            2,
                        ),
                        m = b[0],
                        g = b[1],
                        v = function(e) {
                            y(_(_({}, p), e));
                        },
                        h =
                            ((t = n),
                            {
                                appId: f.a.get(t, 'appId'),
                                host: f.a.get(t, 'host'),
                                token: f.a.get(t, 'token'),
                            }),
                        O = h.appId,
                        j = h.host,
                        C = h.token;
                    Object(r.useAsyncEffect)(
                        (function() {
                            var e = w(
                                regeneratorRuntime.mark(function e(t) {
                                    var n;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    if (!C) {
                                                        e.next = 6;
                                                        break;
                                                    }
                                                    return (
                                                        v({ loading: !0 }),
                                                        (e.next = 4),
                                                        o.a.Cloud.run(
                                                            'syndicate-satellite-test',
                                                        )
                                                    );
                                                case 4:
                                                    (n = e.sent),
                                                        t() &&
                                                            v({
                                                                loading: !1,
                                                                valid: n,
                                                            });
                                                case 6:
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
                        [O, j, C, p.forceUpdated],
                    );
                    var E = {
                        end: Object(r.__)('Sync Content'),
                        begin: Object(r.__)('Starting...'),
                        taxonomies: Object(r.__)('Syncing Taxonomies...'),
                        media: Object(r.__)('Syncing Media...'),
                        types: Object(r.__)('Syncing Types...'),
                        content: Object(r.__)('Syncing %context...'),
                        relations: Object(r.__)('Syncing %context...'),
                    };
                    o.a.Hook.runSync('syndicate-client-status-labels', E);
                    var x = (function() {
                            var e = w(
                                regeneratorRuntime.mark(function e() {
                                    var t, n, r, a;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    return (
                                                        (e.next = 2),
                                                        o.a.Cloud.run(
                                                            'syndicate-satellite-sync',
                                                        )
                                                    );
                                                case 2:
                                                    (t = e.sent),
                                                        (n = t.syncStatus),
                                                        (r =
                                                            void 0 === n
                                                                ? 'end'
                                                                : n),
                                                        (a = t.syncContext),
                                                        g({
                                                            syncStatus: r,
                                                            syncContext:
                                                                void 0 === a
                                                                    ? T
                                                                    : a,
                                                        });
                                                case 8:
                                                case 'end':
                                                    return e.stop();
                                            }
                                    }, e);
                                }),
                            );
                            return function() {
                                return e.apply(this, arguments);
                            };
                        })(),
                        P = m.syncStatus,
                        k = m.syncContext;
                    if (
                        (Object(r.useAsyncEffect)(
                            (function() {
                                var e = w(
                                    regeneratorRuntime.mark(function e(t) {
                                        var n;
                                        return regeneratorRuntime.wrap(function(
                                            e,
                                        ) {
                                            for (;;)
                                                switch ((e.prev = e.next)) {
                                                    case 0:
                                                        if ('end' === P) {
                                                            e.next = 3;
                                                            break;
                                                        }
                                                        return (
                                                            (n = setInterval(
                                                                w(
                                                                    regeneratorRuntime.mark(
                                                                        function e() {
                                                                            var n,
                                                                                r,
                                                                                a,
                                                                                i,
                                                                                c;
                                                                            return regeneratorRuntime.wrap(
                                                                                function(
                                                                                    e,
                                                                                ) {
                                                                                    for (;;)
                                                                                        switch (
                                                                                            (e.prev =
                                                                                                e.next)
                                                                                        ) {
                                                                                            case 0:
                                                                                                return (
                                                                                                    (e.next = 2),
                                                                                                    o.a.Cloud.run(
                                                                                                        'syndicate-satellite-status',
                                                                                                    )
                                                                                                );
                                                                                            case 2:
                                                                                                (n =
                                                                                                    e.sent),
                                                                                                    (r =
                                                                                                        n.syncStatus),
                                                                                                    (a =
                                                                                                        void 0 ===
                                                                                                        r
                                                                                                            ? 'end'
                                                                                                            : r),
                                                                                                    (i =
                                                                                                        n.syncContext),
                                                                                                    (c =
                                                                                                        void 0 ===
                                                                                                        i
                                                                                                            ? T
                                                                                                            : i),
                                                                                                    t() &&
                                                                                                        g(
                                                                                                            {
                                                                                                                syncStatus: a,
                                                                                                                syncContext: c,
                                                                                                            },
                                                                                                        );
                                                                                            case 8:
                                                                                            case 'end':
                                                                                                return e.stop();
                                                                                        }
                                                                                },
                                                                                e,
                                                                            );
                                                                        },
                                                                    ),
                                                                ),
                                                                500,
                                                            )),
                                                            e.abrupt(
                                                                'return',
                                                                function() {
                                                                    return clearInterval(
                                                                        n,
                                                                    );
                                                                },
                                                            )
                                                        );
                                                    case 3:
                                                    case 'end':
                                                        return e.stop();
                                                }
                                        },
                                        e);
                                    }),
                                );
                                return function(t) {
                                    return e.apply(this, arguments);
                                };
                            })(),
                            [P].concat(S(f.a.get(k, 'count', T.count))),
                        ),
                        !(O && j && C))
                    )
                        return null;
                    p.loading || p.valid;
                    var A = f.a.get(k, 'label', ''),
                        N = I(f.a.get(k, 'count', [0, 0]), 2),
                        D = N[0],
                        R = N[1];
                    return i.a.createElement(
                        'div',
                        { className: 'm-xs-20' },
                        i.a.createElement(
                            l,
                            {
                                size: 'md',
                                color: 'end' === P ? 'danger' : 'clear',
                                onClick: function() {
                                    return x();
                                },
                                disabled: 'end' !== P,
                            },
                            'end' !== P &&
                                i.a.createElement(
                                    'div',
                                    {
                                        className: 'mr-xs-8',
                                        style: {
                                            width: '20px',
                                            height: '20px',
                                        },
                                    },
                                    i.a.createElement(s, {
                                        name: 'Feather.DownloadCloud',
                                    }),
                                ),
                            ' ',
                            f.a
                                .get(E, [P], E.start)
                                .replace(
                                    '%context',
                                    ''
                                        .concat(A, ' ')
                                        .concat(
                                            R > 0 &&
                                                ''.concat(D, '/').concat(R),
                                        ),
                                ),
                        ),
                    );
                }, A),
                D = function(e) {
                    var t = Object(r.useHookComponent)('MenuItem');
                    return i.a.createElement(t, {
                        route: '/admin/plugins/SyndicateClient',
                        label: Object(r.__)('Syndicate Client'),
                    });
                },
                R = n(4),
                q = n.n(R);
            function U(e, t, n, r, o, a, i) {
                try {
                    var c = e[a](i),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o);
            }
            function H(e, t) {
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
            function z(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                        ? H(Object(n), !0).forEach(function(t) {
                              L(e, t, n[t]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(n),
                          )
                        : H(Object(n)).forEach(function(t) {
                              Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(n, t),
                              );
                          });
                }
                return e;
            }
            function L(e, t, n) {
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
            function M(e, t) {
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
                            o = !1,
                            a = void 0;
                        try {
                            for (
                                var i, c = e[Symbol.iterator]();
                                !(r = (i = c.next()).done) &&
                                (n.push(i.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (o = !0), (a = e);
                        } finally {
                            try {
                                r || null == c.return || c.return();
                            } finally {
                                if (o) throw a;
                            }
                        }
                        return n;
                    })(e, t) ||
                    (function(e, t) {
                        if (!e) return;
                        if ('string' == typeof e) return G(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name);
                        if ('Map' === n || 'Set' === n) return Array.from(e);
                        if (
                            'Arguments' === n ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        )
                            return G(e, t);
                    })(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function G(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var B = function(e) {
                var t = e.editor,
                    n = Object(r.useHandle)('AdminTools'),
                    o = f.a.get(n, 'Modal'),
                    c = Object(a.useRef)(),
                    u = Object(r.useHookComponent)('ElementDialog'),
                    s = Object(r.useHookComponent)('Revisions'),
                    l = Object(r.useHookComponent)('ReactiumUI'),
                    d = l.Button,
                    p = l.Toggle,
                    y = (l.Alert, l.Icon),
                    b = f.a.get(t, 'value', {}),
                    m = {
                        on: Object(r.__)('Turn off synchronization'),
                        off: Object(r.__)('Turn on synchronization'),
                    },
                    g = M(Object(a.useState)(f.a.get(b, 'meta.syndicate')), 2),
                    v = g[0],
                    h = g[1],
                    O = !0 === f.a.get(v, 'manual', !1),
                    j = m[!1 === O ? 'on' : 'off'],
                    S = function(e) {
                        h(f.a.get(e.value, 'meta.syndicate'));
                    };
                if (
                    (Object(a.useEffect)(
                        function() {
                            return (
                                t.addEventListener('clean', S),
                                t.addEventListener('save-success', S),
                                function() {
                                    t.addEventListener('clean', S),
                                        t.addEventListener('save-success', S);
                                }
                            );
                        },
                        [t],
                    ),
                    void 0 === v)
                )
                    return null;
                var C = f.a.get(
                        b,
                        ['branches', f.a.get(b, 'history.branch'), 'history'],
                        [],
                    ),
                    w = f.a.get(b, 'branches.syndicate.history', []),
                    E =
                        f.a.get(C, 0) !== f.a.get(w, 0) ||
                        C.length !== w.length ||
                        q.a.difference(w, C).length > 0,
                    _ = (function() {
                        var e,
                            n =
                                ((e = regeneratorRuntime.mark(function e() {
                                    var n;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;)
                                            switch ((e.prev = e.next)) {
                                                case 0:
                                                    return (
                                                        o.show(
                                                            i.a.createElement(
                                                                s,
                                                                {
                                                                    ref: c,
                                                                    startingContent:
                                                                        t.value,
                                                                    onClose: function() {
                                                                        return o.hide();
                                                                    },
                                                                    editor: t,
                                                                },
                                                            ),
                                                        ),
                                                        (e.next = 3),
                                                        new Promise(function(
                                                            e,
                                                        ) {
                                                            var t = setInterval(
                                                                function() {
                                                                    c.current &&
                                                                        (clearInterval(
                                                                            t,
                                                                        ),
                                                                        e(
                                                                            c.current,
                                                                        ));
                                                                },
                                                                100,
                                                            );
                                                        })
                                                    );
                                                case 3:
                                                    (n = e.sent).setBranch(
                                                        'syndicate',
                                                        'compare',
                                                    ),
                                                        n.navTo('branches');
                                                case 6:
                                                case 'end':
                                                    return e.stop();
                                            }
                                    }, e);
                                })),
                                function() {
                                    var t = this,
                                        n = arguments;
                                    return new Promise(function(r, o) {
                                        var a = e.apply(t, n);
                                        function i(e) {
                                            U(a, r, o, i, c, 'next', e);
                                        }
                                        function c(e) {
                                            U(a, r, o, i, c, 'throw', e);
                                        }
                                        i(void 0);
                                    });
                                });
                        return function() {
                            return n.apply(this, arguments);
                        };
                    })();
                return i.a.createElement(
                    u,
                    {
                        editor: t,
                        pref: 'admin.dialog.syndicate.editor',
                        title: Object(r.__)('Syndication'),
                        helpText: Object(r.__)(
                            'Use to toggle manual synchronization on this content.',
                        ),
                    },
                    i.a.createElement(
                        'div',
                        { className: 'p-xs-20' },
                        i.a.createElement(
                            'div',
                            { className: 'form-group mb-xs-8' },
                            i.a.createElement(
                                'label',
                                null,
                                i.a.createElement('span', null, j),
                                i.a.createElement(p, {
                                    value: !0,
                                    checked: !1 === O,
                                    onChange: function(e) {
                                        var n = {
                                            meta: z(
                                                z({}, f.a.get(b, 'meta', {})),
                                                {},
                                                {
                                                    syndicate: z(
                                                        z({}, v),
                                                        {},
                                                        {
                                                            manual:
                                                                !1 ===
                                                                e.target
                                                                    .checked,
                                                        },
                                                    ),
                                                },
                                            ),
                                        };
                                        t.save(n);
                                    },
                                }),
                            ),
                        ),
                        !0 === O &&
                            E &&
                            i.a.createElement(
                                d,
                                {
                                    size: 'sm',
                                    appearance: 'pill',
                                    onClick: _,
                                    type: 'button',
                                },
                                i.a.createElement(y, {
                                    name: 'Feather.GitBranch',
                                    className: 'mr-xs-8',
                                }),
                                Object(r.__)('Merge Changes'),
                            ),
                    ),
                );
            };
            function Z(e, t, n, r, o, a, i) {
                try {
                    var c = e[a](i),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o);
            }
            (function() {
                var e,
                    t =
                        ((e = regeneratorRuntime.mark(function e() {
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;)
                                    switch ((e.prev = e.next)) {
                                        case 0:
                                            return (
                                                (e.next = 2),
                                                o.a.Plugin.register(
                                                    'syndicate-client',
                                                )
                                            );
                                        case 2:
                                            return (
                                                (e.next = 4),
                                                o.a.Capability.check(
                                                    [
                                                        'setting.create',
                                                        'setting.update',
                                                        'setting.syndicateClient-get',
                                                        'setting.syndicateClient-set',
                                                    ],
                                                    !1,
                                                )
                                            );
                                        case 4:
                                            e.sent &&
                                                (o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-ALL',
                                                    zone: [
                                                        'plugin-settings-SyndicateClient',
                                                    ],
                                                    component: s,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SIDEBAR-WIDGET',
                                                    zone: [
                                                        'admin-sidebar-settings',
                                                    ],
                                                    component: D,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-CHECK',
                                                    zone: [
                                                        'settings-editor-SyndicateClient',
                                                    ],
                                                    component: j,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-SYNC',
                                                    zone: [
                                                        'settings-editor-SyndicateClient',
                                                    ],
                                                    component: N,
                                                    order:
                                                        o.a.Enums.priority
                                                            .lowest,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id: '',
                                                    zone: [
                                                        'admin-content-sidebar',
                                                    ],
                                                    component: B,
                                                    order:
                                                        o.a.Enums.priority
                                                            .highest,
                                                }));
                                        case 6:
                                        case 'end':
                                            return e.stop();
                                    }
                            }, e);
                        })),
                        function() {
                            var t = this,
                                n = arguments;
                            return new Promise(function(r, o) {
                                var a = e.apply(t, n);
                                function i(e) {
                                    Z(a, r, o, i, c, 'next', e);
                                }
                                function c(e) {
                                    Z(a, r, o, i, c, 'throw', e);
                                }
                                i(void 0);
                            });
                        });
                return function() {
                    return t.apply(this, arguments);
                };
            })()();
        },
    ]);
});

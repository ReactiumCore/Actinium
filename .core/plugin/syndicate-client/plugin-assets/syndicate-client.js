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
            function m(e, t, n) {
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
            function g(e, t) {
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
            var h = Object(a.memo)(
                function(e) {
                    var t,
                        n = e.settingGroup,
                        c = Object(r.useHookComponent)('ReactiumUI'),
                        u = c.Spinner,
                        s = c.Alert,
                        l = c.Icon,
                        d = c.Button,
                        p = g(
                            Object(a.useState)({
                                loading: !0,
                                valid: !1,
                                forceUpdated: new Date(),
                            }),
                            2,
                        ),
                        v = p[0],
                        h = p[1],
                        O = function(e) {
                            h(
                                (function(e) {
                                    for (var t = 1; t < arguments.length; t++) {
                                        var n =
                                            null != arguments[t]
                                                ? arguments[t]
                                                : {};
                                        t % 2
                                            ? b(Object(n), !0).forEach(function(
                                                  t,
                                              ) {
                                                  m(e, t, n[t]);
                                              })
                                            : Object.getOwnPropertyDescriptors
                                            ? Object.defineProperties(
                                                  e,
                                                  Object.getOwnPropertyDescriptors(
                                                      n,
                                                  ),
                                              )
                                            : b(Object(n)).forEach(function(t) {
                                                  Object.defineProperty(
                                                      e,
                                                      t,
                                                      Object.getOwnPropertyDescriptor(
                                                          n,
                                                          t,
                                                      ),
                                                  );
                                              });
                                    }
                                    return e;
                                })({}, v, {}, e),
                            );
                        },
                        j =
                            ((t = n),
                            {
                                appId: f.a.get(t, 'appId'),
                                host: f.a.get(t, 'host'),
                                token: f.a.get(t, 'token'),
                            }),
                        S = j.appId,
                        C = j.host,
                        w = j.token;
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
                                                                    if (!w) {
                                                                        e.next = 6;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        O({
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
                                                                            O({
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
                            [S, C, w, v.forceUpdated],
                        ),
                        !(S && C && w))
                    )
                        return null;
                    if (v.loading)
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
                    var x = {
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
                                color: v.valid
                                    ? s.ENUMS.COLOR.SUCCESS
                                    : s.ENUMS.COLOR.DANGER,
                                icon: i.a.createElement(l, {
                                    name: v.valid
                                        ? 'Feather.Check'
                                        : 'Feather.AlertOctagon',
                                }),
                            },
                            v.valid ? x.success : x.failure,
                            i.a.createElement(
                                d,
                                {
                                    className: 'ml-xs-16',
                                    size: 'xs',
                                    appearance: 'pill',
                                    onClick: function() {
                                        O({ forceUpdated: new Date() });
                                    },
                                },
                                Object(r.__)('Refresh'),
                            ),
                        ),
                    );
                },
                function(e, t) {
                    return (
                        f.a.get(e, 'groupName') === f.a.get(t, 'groupName') &&
                        p()(
                            f.a.get(e, 'settingGroup'),
                            f.a.get(t, 'settingGroup'),
                        )
                    );
                },
            );
            function O(e) {
                return (
                    (function(e) {
                        if (Array.isArray(e)) return _(e);
                    })(e) ||
                    (function(e) {
                        if (
                            'undefined' != typeof Symbol &&
                            Symbol.iterator in Object(e)
                        )
                            return Array.from(e);
                    })(e) ||
                    E(e) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function j(e, t, n, r, o, a, i) {
                try {
                    var c = e[a](i),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o);
            }
            function S(e) {
                return function() {
                    var t = this,
                        n = arguments;
                    return new Promise(function(r, o) {
                        var a = e.apply(t, n);
                        function i(e) {
                            j(a, r, o, i, c, 'next', e);
                        }
                        function c(e) {
                            j(a, r, o, i, c, 'throw', e);
                        }
                        i(void 0);
                    });
                };
            }
            function C(e, t) {
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
            function w(e, t, n) {
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
            function x(e, t) {
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
                    E(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function E(e, t) {
                if (e) {
                    if ('string' == typeof e) return _(e, t);
                    var n = Object.prototype.toString.call(e).slice(8, -1);
                    return (
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name),
                        'Map' === n || 'Set' === n
                            ? Array.from(n)
                            : 'Arguments' === n ||
                              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                            ? _(e, t)
                            : void 0
                    );
                }
            }
            function _(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var I = { label: '', count: [0, 0] },
                P = Object(a.memo)(
                    function(e) {
                        var t,
                            n = e.settingGroup,
                            c = Object(r.useHookComponent)('ReactiumUI'),
                            u = c.Icon,
                            s = c.Button,
                            l = x(
                                Object(a.useState)({
                                    loading: !0,
                                    valid: !1,
                                    forceUpdated: new Date(),
                                }),
                                2,
                            ),
                            d = l[0],
                            p = l[1],
                            y = x(
                                Object(a.useState)({
                                    syncStatus: 'idle',
                                    syncContext: I,
                                }),
                                2,
                            ),
                            b = y[0],
                            m = y[1],
                            g = function(e) {
                                p(
                                    (function(e) {
                                        for (
                                            var t = 1;
                                            t < arguments.length;
                                            t++
                                        ) {
                                            var n =
                                                null != arguments[t]
                                                    ? arguments[t]
                                                    : {};
                                            t % 2
                                                ? C(Object(n), !0).forEach(
                                                      function(t) {
                                                          w(e, t, n[t]);
                                                      },
                                                  )
                                                : Object.getOwnPropertyDescriptors
                                                ? Object.defineProperties(
                                                      e,
                                                      Object.getOwnPropertyDescriptors(
                                                          n,
                                                      ),
                                                  )
                                                : C(Object(n)).forEach(function(
                                                      t,
                                                  ) {
                                                      Object.defineProperty(
                                                          e,
                                                          t,
                                                          Object.getOwnPropertyDescriptor(
                                                              n,
                                                              t,
                                                          ),
                                                      );
                                                  });
                                        }
                                        return e;
                                    })({}, d, {}, e),
                                );
                            },
                            v =
                                ((t = n),
                                {
                                    appId: f.a.get(t, 'appId'),
                                    host: f.a.get(t, 'host'),
                                    token: f.a.get(t, 'token'),
                                }),
                            h = v.appId,
                            j = v.host,
                            E = v.token;
                        Object(r.useAsyncEffect)(
                            (function() {
                                var e = S(
                                    regeneratorRuntime.mark(function e(t) {
                                        var n;
                                        return regeneratorRuntime.wrap(function(
                                            e,
                                        ) {
                                            for (;;)
                                                switch ((e.prev = e.next)) {
                                                    case 0:
                                                        if (!E) {
                                                            e.next = 6;
                                                            break;
                                                        }
                                                        return (
                                                            g({ loading: !0 }),
                                                            (e.next = 4),
                                                            o.a.Cloud.run(
                                                                'syndicate-satellite-test',
                                                            )
                                                        );
                                                    case 4:
                                                        (n = e.sent),
                                                            t() &&
                                                                g({
                                                                    loading: !1,
                                                                    valid: n,
                                                                });
                                                    case 6:
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
                            [h, j, E, d.forceUpdated],
                        );
                        var _ = {
                                idle: Object(r.__)('Sync Content'),
                                start: Object(r.__)('Syncing...'),
                                begin: Object(r.__)('Syncing Taxonomies...'),
                                'after-taxonomies': Object(r.__)(
                                    'Syncing Media...',
                                ),
                                'after-media': Object(r.__)('Syncing Types...'),
                                'after-types': Object(r.__)(
                                    'Syncing %context...',
                                ),
                                end: Object(r.__)('Finishing...'),
                            },
                            P = b.syncStatus,
                            k = b.syncContext;
                        Object(r.useAsyncEffect)(
                            (function() {
                                var e = S(
                                    regeneratorRuntime.mark(function e(t) {
                                        var n;
                                        return regeneratorRuntime.wrap(function(
                                            e,
                                        ) {
                                            for (;;)
                                                switch ((e.prev = e.next)) {
                                                    case 0:
                                                        if ('idle' !== P) {
                                                            e.next = 2;
                                                            break;
                                                        }
                                                        return e.abrupt(
                                                            'return',
                                                        );
                                                    case 2:
                                                        if ('end' !== P) {
                                                            e.next = 8;
                                                            break;
                                                        }
                                                        return (
                                                            (e.next = 5),
                                                            o.a.Cloud.run(
                                                                'syndicate-satellite-sync-reset',
                                                            )
                                                        );
                                                    case 5:
                                                        t() &&
                                                            m({
                                                                syncStatus:
                                                                    'idle',
                                                                syncContext: I,
                                                            }),
                                                            (e.next = 10);
                                                        break;
                                                    case 8:
                                                        return (
                                                            (n = setInterval(
                                                                S(
                                                                    regeneratorRuntime.mark(
                                                                        function e() {
                                                                            var n,
                                                                                r,
                                                                                a;
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
                                                                                                        'syndicate-satellite-sync',
                                                                                                    )
                                                                                                );
                                                                                            case 2:
                                                                                                (n =
                                                                                                    e.sent),
                                                                                                    (r =
                                                                                                        n.syncStatus),
                                                                                                    (a =
                                                                                                        n.syncContext),
                                                                                                    t() &&
                                                                                                        m(
                                                                                                            {
                                                                                                                syncStatus: r,
                                                                                                                syncContext: a,
                                                                                                            },
                                                                                                        );
                                                                                            case 6:
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
                                                    case 10:
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
                            [P].concat(O(f.a.get(k, 'count', I.count))),
                        );
                        var A = (function() {
                            var e = S(
                                regeneratorRuntime.mark(function e() {
                                    var t, n, r;
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
                                                        (r = t.syncContext),
                                                        m({
                                                            syncStatus: n,
                                                            syncContext: r,
                                                        });
                                                case 6:
                                                case 'end':
                                                    return e.stop();
                                            }
                                    }, e);
                                }),
                            );
                            return function() {
                                return e.apply(this, arguments);
                            };
                        })();
                        if (!(h && j && E)) return null;
                        d.loading || d.valid;
                        var T = f.a.get(k, 'label', ''),
                            N = x(f.a.get(k, 'count', [0, 0]), 2),
                            D = N[0],
                            R = N[1];
                        return i.a.createElement(
                            'div',
                            { className: 'm-xs-20' },
                            i.a.createElement(
                                s,
                                {
                                    size: 'md',
                                    color: 'idle' === P ? 'danger' : 'clear',
                                    onClick: function() {
                                        return A();
                                    },
                                    disabled: 'idle' !== P,
                                },
                                'idle' !== P &&
                                    i.a.createElement(
                                        'div',
                                        {
                                            className: 'mr-xs-8',
                                            style: {
                                                width: '20px',
                                                height: '20px',
                                            },
                                        },
                                        i.a.createElement(u, {
                                            name: 'Feather.DownloadCloud',
                                        }),
                                    ),
                                ' ',
                                f.a
                                    .get(_, [P], _.start)
                                    .replace(
                                        '%context',
                                        ''
                                            .concat(T, ' ')
                                            .concat(
                                                R > 0 &&
                                                    ''.concat(D, '/').concat(R),
                                            ),
                                    ),
                            ),
                        );
                    },
                    function(e, t) {
                        return (
                            f.a.get(e, 'groupName') ===
                                f.a.get(t, 'groupName') &&
                            p()(
                                f.a.get(e, 'settingGroup'),
                                f.a.get(t, 'settingGroup'),
                            )
                        );
                    },
                ),
                k = function(e) {
                    var t = Object(r.useHookComponent)('MenuItem');
                    return i.a.createElement(t, {
                        route: '/admin/plugins/SyndicateClient',
                        label: Object(r.__)('Syndicate Client'),
                    });
                },
                A = n(4),
                T = n.n(A);
            function N(e, t, n, r, o, a, i) {
                try {
                    var c = e[a](i),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o);
            }
            function D(e, t) {
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
            function R(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                        ? D(Object(n), !0).forEach(function(t) {
                              q(e, t, n[t]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(n),
                          )
                        : D(Object(n)).forEach(function(t) {
                              Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(n, t),
                              );
                          });
                }
                return e;
            }
            function q(e, t, n) {
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
            function U(e, t) {
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
                        if ('string' == typeof e) return z(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name);
                        if ('Map' === n || 'Set' === n) return Array.from(n);
                        if (
                            'Arguments' === n ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        )
                            return z(e, t);
                    })(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function z(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var L = function(e) {
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
                    g = U(Object(a.useState)(f.a.get(b, 'meta.syndicate')), 2),
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
                    x =
                        f.a.get(C, 0) !== f.a.get(w, 0) ||
                        C.length !== w.length ||
                        T.a.difference(w, C).length > 0,
                    E = (function() {
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
                                            N(a, r, o, i, c, 'next', e);
                                        }
                                        function c(e) {
                                            N(a, r, o, i, c, 'throw', e);
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
                                            meta: R(
                                                {},
                                                f.a.get(b, 'meta', {}),
                                                {
                                                    syndicate: R({}, v, {
                                                        manual:
                                                            !1 ===
                                                            e.target.checked,
                                                    }),
                                                },
                                            ),
                                        };
                                        t.save(n);
                                    },
                                }),
                            ),
                        ),
                        !0 === O &&
                            x &&
                            i.a.createElement(
                                d,
                                {
                                    size: 'sm',
                                    appearance: 'pill',
                                    onClick: E,
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
            function M(e, t, n, r, o, a, i) {
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
                                                        'Setting.create',
                                                        'Setting.update',
                                                        'setting.SyndicateClient-get',
                                                        'setting.SyndicateClient-set',
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
                                                    component: k,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-CHECK',
                                                    zone: [
                                                        'settings-editor-SyndicateClient',
                                                    ],
                                                    component: h,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-SYNC',
                                                    zone: [
                                                        'settings-editor-SyndicateClient',
                                                    ],
                                                    component: P,
                                                    order:
                                                        o.a.Enums.priority
                                                            .lowest,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id: '',
                                                    zone: [
                                                        'admin-content-sidebar',
                                                    ],
                                                    component: L,
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
                                    M(a, r, o, i, c, 'next', e);
                                }
                                function c(e) {
                                    M(a, r, o, i, c, 'throw', e);
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

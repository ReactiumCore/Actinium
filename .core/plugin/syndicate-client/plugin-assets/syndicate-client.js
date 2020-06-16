!(function(e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t(
              require('reactium-core/sdk'),
              require('react'),
              require('object-path'),
              require('shallow-equals'),
          ))
        : 'function' == typeof define && define.amd
        ? define([
              'reactium-core/sdk',
              'react',
              'object-path',
              'shallow-equals',
          ], t)
        : 'object' == typeof exports
        ? (exports['syndicate-client'] = t(
              require('reactium-core/sdk'),
              require('react'),
              require('object-path'),
              require('shallow-equals'),
          ))
        : (e['syndicate-client'] = t(
              e['reactium-core/sdk'],
              e.react,
              e['object-path'],
              e['shallow-equals'],
          ));
})(window, function(e, t, n, r) {
    return (function(e) {
        var t = {};
        function n(r) {
            if (t[r]) return t[r].exports;
            var i = (t[r] = { i: r, l: !1, exports: {} });
            return e[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
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
                    for (var i in e)
                        n.d(
                            r,
                            i,
                            function(t) {
                                return e[t];
                            }.bind(null, i),
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
                i = n.n(r),
                o = n(1),
                a = n.n(o),
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
                l = function() {
                    var e = Object(r.useHookComponent)('SettingEditor'),
                        t = Object(r.useHookComponent)('CapabilityEditor');
                    return a.a.createElement(
                        'div',
                        { className: 'syndicate-client-settings' },
                        a.a.createElement(e, { settings: c }),
                        a.a.createElement(t, { capabilities: u }),
                        a.a.createElement(r.Zone, {
                            zone: 'syndicate-client-settings',
                        }),
                    );
                },
                s = n(2),
                d = n.n(s),
                p = n(3),
                f = n.n(p);
            function y(e, t, n, r, i, o, a) {
                try {
                    var c = e[o](a),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, i);
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
            function m(e, t) {
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
                            i = !1,
                            o = void 0;
                        try {
                            for (
                                var a, c = e[Symbol.iterator]();
                                !(r = (a = c.next()).done) &&
                                (n.push(a.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (i = !0), (o = e);
                        } finally {
                            try {
                                r || null == c.return || c.return();
                            } finally {
                                if (i) throw o;
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
                        if ('Map' === n || 'Set' === n) return Array.from(n);
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
            var O = Object(o.memo)(
                    function(e) {
                        var t,
                            n = e.settingGroup,
                            c = Object(r.useHookComponent)('ReactiumUI'),
                            u = c.Spinner,
                            l = c.Alert,
                            s = c.Icon,
                            p = c.Button,
                            f = m(
                                Object(o.useState)({
                                    loading: !0,
                                    valid: !1,
                                    forceUpdated: new Date(),
                                }),
                                2,
                            ),
                            h = f[0],
                            O = f[1],
                            j = function(e) {
                                O(
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
                                                ? b(Object(n), !0).forEach(
                                                      function(t) {
                                                          g(e, t, n[t]);
                                                      },
                                                  )
                                                : Object.getOwnPropertyDescriptors
                                                ? Object.defineProperties(
                                                      e,
                                                      Object.getOwnPropertyDescriptors(
                                                          n,
                                                      ),
                                                  )
                                                : b(Object(n)).forEach(function(
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
                                    })({}, h, {}, e),
                                );
                            },
                            S =
                                ((t = n),
                                {
                                    appId: d.a.get(t, 'appId'),
                                    host: d.a.get(t, 'host'),
                                    token: d.a.get(t, 'token'),
                                }),
                            v = S.appId,
                            C = S.host,
                            _ = S.token;
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
                                                                        if (
                                                                            !_
                                                                        ) {
                                                                            e.next = 6;
                                                                            break;
                                                                        }
                                                                        return (
                                                                            j({
                                                                                loading: !0,
                                                                            }),
                                                                            (e.next = 4),
                                                                            i.a.Cloud.run(
                                                                                'syndicate-satellite-test',
                                                                            )
                                                                        );
                                                                    case 4:
                                                                        (n =
                                                                            e.sent),
                                                                            t &&
                                                                                j(
                                                                                    {
                                                                                        loading: !1,
                                                                                        valid: n,
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
                                            )),
                                            function() {
                                                var t = this,
                                                    n = arguments;
                                                return new Promise(function(
                                                    r,
                                                    i,
                                                ) {
                                                    var o = e.apply(t, n);
                                                    function a(e) {
                                                        y(
                                                            o,
                                                            r,
                                                            i,
                                                            a,
                                                            c,
                                                            'next',
                                                            e,
                                                        );
                                                    }
                                                    function c(e) {
                                                        y(
                                                            o,
                                                            r,
                                                            i,
                                                            a,
                                                            c,
                                                            'throw',
                                                            e,
                                                        );
                                                    }
                                                    a(void 0);
                                                });
                                            });
                                    return function(e) {
                                        return t.apply(this, arguments);
                                    };
                                })(),
                                [v, C, _, h.forceUpdated],
                            ),
                            !(v && C && _))
                        )
                            return null;
                        if (h.loading)
                            return a.a.createElement(
                                'div',
                                {
                                    style: {
                                        display: 'flex',
                                        height: '60px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                },
                                a.a.createElement(u, null),
                            );
                        var E = {
                            success: Object(r.__)(
                                'Connection test successful.',
                            ),
                            failure: Object(r.__)('Connection test failed.'),
                        };
                        return a.a.createElement(
                            l,
                            {
                                dismissable: !0,
                                color: h.valid
                                    ? l.ENUMS.COLOR.SUCCESS
                                    : l.ENUMS.COLOR.DANGER,
                                icon: a.a.createElement(s, {
                                    name: h.valid
                                        ? 'Feather.Check'
                                        : 'Feather.AlertOctagon',
                                }),
                            },
                            h.valid ? E.success : E.failure,
                            a.a.createElement(
                                p,
                                {
                                    className: 'ml-xs-16',
                                    size: 'xs',
                                    appearance: 'pill',
                                    onClick: function() {
                                        j({ forceUpdated: new Date() });
                                    },
                                },
                                Object(r.__)('Refresh'),
                            ),
                        );
                    },
                    function(e, t) {
                        return (
                            d.a.get(e, 'groupName') ===
                                d.a.get(t, 'groupName') &&
                            f()(
                                d.a.get(e, 'settingGroup'),
                                d.a.get(t, 'settingGroup'),
                            )
                        );
                    },
                ),
                j = function(e) {
                    var t = Object(r.useHookComponent)('MenuItem');
                    return a.a.createElement(t, {
                        route: '/admin/plugins/SyndicateClient',
                        label: Object(r.__)('Syndicate Client'),
                    });
                };
            function S(e, t, n, r, i, o, a) {
                try {
                    var c = e[o](a),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, i);
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
                                                i.a.Plugin.register(
                                                    'syndicate-client',
                                                )
                                            );
                                        case 2:
                                            return (
                                                (e.next = 4),
                                                i.a.Capability.check(
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
                                                (i.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-ALL',
                                                    zone:
                                                        'plugin-settings-SyndicateClient',
                                                    component: l,
                                                    order: 0,
                                                }),
                                                i.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SIDEBAR-WIDGET',
                                                    zone:
                                                        'admin-sidebar-settings',
                                                    component: j,
                                                    order: 0,
                                                }),
                                                i.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-CHECK',
                                                    zone:
                                                        'settings-editor-SyndicateClient',
                                                    component: O,
                                                    order: 0,
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
                            return new Promise(function(r, i) {
                                var o = e.apply(t, n);
                                function a(e) {
                                    S(o, r, i, a, c, 'next', e);
                                }
                                function c(e) {
                                    S(o, r, i, a, c, 'throw', e);
                                }
                                a(void 0);
                            });
                        });
                return function() {
                    return t.apply(this, arguments);
                };
            })()();
        },
    ]);
});

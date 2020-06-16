!(function(e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t(require('reactium-core/sdk'), require('react')))
        : 'function' == typeof define && define.amd
        ? define(['reactium-core/sdk', 'react'], t)
        : 'object' == typeof exports
        ? (exports['syndicate-client'] = t(
              require('reactium-core/sdk'),
              require('react'),
          ))
        : (e['syndicate-client'] = t(e['reactium-core/sdk'], e.react));
})(window, function(e, t) {
    return (function(e) {
        var t = {};
        function n(i) {
            if (t[i]) return t[i].exports;
            var o = (t[i] = { i: i, l: !1, exports: {} });
            return e[i].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
        }
        return (
            (n.m = e),
            (n.c = t),
            (n.d = function(e, t, i) {
                n.o(e, t) ||
                    Object.defineProperty(e, t, { enumerable: !0, get: i });
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
                var i = Object.create(null);
                if (
                    (n.r(i),
                    Object.defineProperty(i, 'default', {
                        enumerable: !0,
                        value: e,
                    }),
                    2 & t && 'string' != typeof e)
                )
                    for (var o in e)
                        n.d(
                            i,
                            o,
                            function(t) {
                                return e[t];
                            }.bind(null, o),
                        );
                return i;
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
            n((n.s = 2))
        );
    })([
        function(t, n) {
            t.exports = e;
        },
        function(e, n) {
            e.exports = t;
        },
        function(e, t, n) {
            n(3);
        },
        function(e, t, n) {
            'use strict';
            n.r(t);
            var i = n(0),
                o = n.n(i),
                r = n(1),
                c = n.n(r),
                a = {
                    title: Object(i.__)('Syndicate Client Settings'),
                    group: 'SyndicateClient',
                    inputs: {
                        'SyndicateClient.appId': {
                            type: 'text',
                            label: Object(i.__)('Syndicate Host App ID'),
                            tooltip: Object(i.__)(
                                'The Application ID of the syndication root site (e.g. Actinium).',
                            ),
                            required: !0,
                        },
                        'SyndicateClient.host': {
                            type: 'text',
                            label: Object(i.__)('Syndicate Host'),
                            tooltip: Object(i.__)(
                                'The API URL for the syndication root site.',
                            ),
                            required: !0,
                        },
                        'SyndicateClient.token': {
                            type: 'text',
                            label: Object(i.__)('Client Refresh Token'),
                            tooltip: Object(i.__)(
                                'The refresh token of this syndication client.',
                            ),
                            required: !0,
                        },
                        'SyndicateClient.enable': {
                            type: 'toggle',
                            label: Object(i.__)('Client Sync Enabled'),
                            tooltip: Object(i.__)(
                                'Enable or disable sychronizing to this satellite.',
                            ),
                            required: !0,
                        },
                        'SyndicateClient.cron': {
                            type: 'text',
                            label: Object(i.__)('Client Sync Schedule'),
                            tooltip: Object(i.__)(
                                'The node-cron schedule of the updated (e.g. */30 * * * *).',
                            ),
                            required: !1,
                        },
                    },
                },
                l = [
                    {
                        capability: 'setting.SyndicateClient-get',
                        title: Object(i.__)(
                            'View Syndication client settings.',
                        ),
                        tooltip: Object(i.__)(
                            'Able to see Syndicate Client plugin settings, but not necessarily change them.',
                        ),
                    },
                    {
                        capability: 'setting.SyndicateClient-set',
                        title: Object(i.__)(
                            'Edit Syndication Client Plugin Settings',
                        ),
                        tooltip: Object(i.__)(
                            'Provides ability to configure settings for the Syndicate Client plugin.',
                        ),
                    },
                ],
                u = function() {
                    var e = Object(i.useHookComponent)('SettingEditor'),
                        t = Object(i.useHookComponent)('CapabilityEditor');
                    return c.a.createElement(
                        'div',
                        { className: 'syndicate-client-settings' },
                        c.a.createElement(e, { settings: a }),
                        c.a.createElement(t, { capabilities: l }),
                        c.a.createElement(i.Zone, {
                            zone: 'syndicate-client-settings',
                        }),
                    );
                },
                s = function(e) {
                    var t = Object(i.useHookComponent)('MenuItem');
                    return c.a.createElement(t, {
                        route: '/admin/plugins/SyndicateClient',
                        label: Object(i.__)('Syndicate Client'),
                    });
                };
            function d(e, t, n, i, o, r, c) {
                try {
                    var a = e[r](c),
                        l = a.value;
                } catch (e) {
                    return void n(e);
                }
                a.done ? t(l) : Promise.resolve(l).then(i, o);
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
                                                        'setting.SyndicationClient-get',
                                                        'setting.SyndicationClient-set',
                                                    ],
                                                    !1,
                                                )
                                            );
                                        case 4:
                                            e.sent &&
                                                (o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-ALL',
                                                    zone:
                                                        'plugin-settings-SyndicateClient',
                                                    component: u,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SIDEBAR-WIDGET',
                                                    zone:
                                                        'admin-sidebar-settings',
                                                    component: s,
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
                            return new Promise(function(i, o) {
                                var r = e.apply(t, n);
                                function c(e) {
                                    d(r, i, o, c, a, 'next', e);
                                }
                                function a(e) {
                                    d(r, i, o, c, a, 'throw', e);
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

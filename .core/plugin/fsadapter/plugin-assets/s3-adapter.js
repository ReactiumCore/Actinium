!(function(e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t(require('reactium-core/sdk'), require('react')))
        : 'function' == typeof define && define.amd
        ? define(['reactium-core/sdk', 'react'], t)
        : 'object' == typeof exports
        ? (exports['s3-adapter'] = t(
              require('reactium-core/sdk'),
              require('react'),
          ))
        : (e['s3-adapter'] = t(e['reactium-core/sdk'], e.react));
})(window, function(e, t) {
    return (function(e) {
        var t = {};
        function r(n) {
            if (t[n]) return t[n].exports;
            var o = (t[n] = { i: n, l: !1, exports: {} });
            return e[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
        }
        return (
            (r.m = e),
            (r.c = t),
            (r.d = function(e, t, n) {
                r.o(e, t) ||
                    Object.defineProperty(e, t, { enumerable: !0, get: n });
            }),
            (r.r = function(e) {
                'undefined' != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, {
                        value: 'Module',
                    }),
                    Object.defineProperty(e, '__esModule', { value: !0 });
            }),
            (r.t = function(e, t) {
                if ((1 & t && (e = r(e)), 8 & t)) return e;
                if (4 & t && 'object' == typeof e && e && e.__esModule)
                    return e;
                var n = Object.create(null);
                if (
                    (r.r(n),
                    Object.defineProperty(n, 'default', {
                        enumerable: !0,
                        value: e,
                    }),
                    2 & t && 'string' != typeof e)
                )
                    for (var o in e)
                        r.d(
                            n,
                            o,
                            function(t) {
                                return e[t];
                            }.bind(null, o),
                        );
                return n;
            }),
            (r.n = function(e) {
                var t =
                    e && e.__esModule
                        ? function() {
                              return e.default;
                          }
                        : function() {
                              return e;
                          };
                return r.d(t, 'a', t), t;
            }),
            (r.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (r.p = ''),
            r((r.s = 2))
        );
    })([
        function(t, r) {
            t.exports = e;
        },
        function(e, r) {
            e.exports = t;
        },
        function(e, t, r) {
            r(3);
        },
        function(e, t, r) {
            'use strict';
            r.r(t);
            var n = r(0),
                o = r.n(n),
                i = r(1),
                a = r.n(i),
                c = {
                    title: Object(n.__)('S3 Adapter Settings'),
                    group: 'S3Adapter',
                    inputs: {
                        'S3Adapter.bucket': {
                            type: 'text',
                            label: Object(n.__)('Bucket name'),
                            tooltip: Object(n.__)(
                                'The S3 bucket name. See your CDN provider for this setting.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.s3overrides.accessKeyId': {
                            type: 'text',
                            label: Object(n.__)('Access Key Id'),
                            tooltip: Object(n.__)(
                                'The S3 access key id. See your CDN provider for this setting.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.s3overrides.secretAccessKey': {
                            type: 'text',
                            label: Object(n.__)('Secret Access Key'),
                            tooltip: Object(n.__)(
                                'The S3 secret access key. This key is sensitive. See your CDN provider for this setting.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.s3overrides.endpoint': {
                            type: 'text',
                            label: Object(n.__)('Endpoint Hostname'),
                            tooltip: Object(n.__)(
                                'The S3 endpoint hostname, usually excluding the bucket name prefix, for example sfo2.digitaloceanspaces.com or us-west-2.amazonaws.com.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.region': {
                            type: 'text',
                            label: Object(n.__)('Region'),
                            tooltip: Object(n.__)(
                                'The S3 region for your provider, for example sfo2 for DigitalOcean Spaces or us-west-2 for Amazon AWS S3.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.directAccess': {
                            type: 'toggle',
                            label: Object(n.__)('Access Files Directly'),
                            tooltip: Object(n.__)(
                                'If turned on, the URL provided will go directly to your CDN, instead of through the Parse API. If turned off, your Actinium API will serve (proxy) the file from your CDN.',
                            ),
                            defaultValue: !1,
                        },
                        'S3Adapter.baseUrl': {
                            type: 'text',
                            label: Object(n.__)('Base URL'),
                            tooltip: Object(n.__)(
                                'Sets the full base URL used to serve files from your bucket. If your bucket has a CDN URL, or instance, use that here. Example: https://my-bucket.us-west-2.amazonaws.com or https://cdn.example.com.',
                            ),
                            required: !0,
                        },
                    },
                },
                s = [
                    {
                        capability: 'setting.S3Adapter-get',
                        title: Object(n.__)('View S3 Plugin Settings'),
                        tooltip: Object(n.__)(
                            'Able to see S3 File Adapter plugin settings, but not necessarily change them.',
                        ),
                    },
                    {
                        capability: 'setting.S3Adapter-set',
                        title: Object(n.__)('Edit S3 Plugin Settings'),
                        tooltip: Object(n.__)(
                            'Provides ability to configure settings for the S3 File Adapter plugin.',
                        ),
                    },
                ],
                u = function() {
                    var e = Object(n.useHookComponent)('SettingEditor'),
                        t = Object(n.useHookComponent)('CapabilityEditor');
                    return a.a.createElement(
                        'div',
                        { className: 's3-adapter-settings' },
                        a.a.createElement(e, { settings: c }),
                        a.a.createElement(t, { capabilities: s }),
                        a.a.createElement(n.Zone, {
                            zone: 's3-adapter-settings',
                        }),
                    );
                },
                p = function(e) {
                    var t = Object(n.useHookComponent)('MenuItem');
                    return a.a.createElement(t, {
                        route: '/admin/plugins/S3Adapter',
                        label: Object(n.__)('S3 Adapter'),
                    });
                };
            function l(e, t, r, n, o, i, a) {
                try {
                    var c = e[i](a),
                        s = c.value;
                } catch (e) {
                    return void r(e);
                }
                c.done ? t(s) : Promise.resolve(s).then(n, o);
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
                                                o.a.Plugin.register('S3Adapter')
                                            );
                                        case 2:
                                            return (
                                                (e.next = 4),
                                                o.a.Capability.check(
                                                    [
                                                        'Setting.create',
                                                        'Setting.update',
                                                        'setting.S3Adapter-set',
                                                        'Setting.retrieve',
                                                        'setting.S3Adapter-get',
                                                    ],
                                                    !1,
                                                )
                                            );
                                        case 4:
                                            e.sent &&
                                                (o.a.Zone.addComponent({
                                                    id:
                                                        'S3-PLUGIN-SETTINGS-ALL',
                                                    zone:
                                                        'plugin-settings-S3Adapter',
                                                    component: u,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'S3-PLUGIN-SIDEBAR-WIDGET',
                                                    zone:
                                                        'admin-sidebar-settings',
                                                    component: p,
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
                                r = arguments;
                            return new Promise(function(n, o) {
                                var i = e.apply(t, r);
                                function a(e) {
                                    l(i, n, o, a, c, 'next', e);
                                }
                                function c(e) {
                                    l(i, n, o, a, c, 'throw', e);
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

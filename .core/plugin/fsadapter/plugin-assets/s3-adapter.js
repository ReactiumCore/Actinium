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
        function r(o) {
            if (t[o]) return t[o].exports;
            var n = (t[o] = { i: o, l: !1, exports: {} });
            return e[o].call(n.exports, n, n.exports, r), (n.l = !0), n.exports;
        }
        return (
            (r.m = e),
            (r.c = t),
            (r.d = function(e, t, o) {
                r.o(e, t) ||
                    Object.defineProperty(e, t, { enumerable: !0, get: o });
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
                var o = Object.create(null);
                if (
                    (r.r(o),
                    Object.defineProperty(o, 'default', {
                        enumerable: !0,
                        value: e,
                    }),
                    2 & t && 'string' != typeof e)
                )
                    for (var n in e)
                        r.d(
                            o,
                            n,
                            function(t) {
                                return e[t];
                            }.bind(null, n),
                        );
                return o;
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
            var o = r(0),
                n = r.n(o),
                i = r(1),
                a = r.n(i),
                s = {
                    title: Object(o.__)('S3 Adapter Settings'),
                    group: 'S3Adapter',
                    inputs: {
                        'S3Adapter.bucket': {
                            type: 'text',
                            label: Object(o.__)('Bucket name'),
                            tooltip: Object(o.__)(
                                'The S3 bucket name. See your CDN provider for this setting.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.s3overrides.accessKeyId': {
                            type: 'text',
                            label: Object(o.__)('Access Key Id'),
                            tooltip: Object(o.__)(
                                'The S3 access key id. See your CDN provider for this setting.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.s3overrides.secretAccessKey': {
                            type: 'text',
                            label: Object(o.__)('Secret Access Key'),
                            tooltip: Object(o.__)(
                                'The S3 secret access key. This key is sensitive. See your CDN provider for this setting.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.s3overrides.endpoint': {
                            type: 'text',
                            label: Object(o.__)('Endpoint Hostname'),
                            tooltip: Object(o.__)(
                                'The S3 endpoint hostname, usually excluding the bucket name prefix, for example sfo2.digitaloceanspaces.com or us-west-2.amazonaws.com.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.region': {
                            type: 'text',
                            label: Object(o.__)('Region'),
                            tooltip: Object(o.__)(
                                'The S3 region for your provider, for example sfo2 for DigitalOcean Spaces or us-west-2 for Amazon AWS S3.',
                            ),
                            required: !0,
                        },
                        'S3Adapter.directAccess': {
                            type: 'toggle',
                            label: Object(o.__)('Access Files Directly'),
                            tooltip: Object(o.__)(
                                'If turned on, the URL provided will go directly to your CDN, instead of through the Parse API. If turned off, your Actinium API will serve (proxy) the file from your CDN.',
                            ),
                            defaultValue: !1,
                        },
                        'S3Adapter.baseUrl': {
                            type: 'text',
                            label: Object(o.__)('Base URL'),
                            tooltip: Object(o.__)(
                                'Sets the full base URL used to serve files from your bucket. If your bucket has a CDN URL, or instance, use that here. Example: https://my-bucket.us-west-2.amazonaws.com or https://cdn.example.com.',
                            ),
                            required: !0,
                        },
                    },
                },
                c = [
                    {
                        capability: 'setting.S3Adapter-get',
                        title: Object(o.__)('View S3 Plugin Settings'),
                        tooltip: Object(o.__)(
                            'Able to see S3 File Adapter plugin settings, but not necessarily change them.',
                        ),
                    },
                    {
                        capability: 'setting.S3Adapter-set',
                        title: Object(o.__)('Edit S3 Plugin Settings'),
                        tooltip: Object(o.__)(
                            'Provides ability to configure settings for the S3 File Adapter plugin.',
                        ),
                    },
                ],
                u = function() {
                    var e = Object(o.useHookComponent)('SettingEditor'),
                        t = Object(o.useHookComponent)('CapabilityEditor');
                    return a.a.createElement(
                        'div',
                        { className: 's3-adapter-settings' },
                        a.a.createElement(e, { settings: s }),
                        a.a.createElement(t, { capabilities: c }),
                        a.a.createElement(o.Zone, {
                            zone: 's3-adapter-settings',
                        }),
                    );
                },
                p = function(e) {
                    var t = Object(o.useHookComponent)('MenuItem');
                    return a.a.createElement(t, {
                        route: '/admin/plugins/S3Adapter',
                        label: Object(o.__)('S3 Adapter'),
                    });
                };
            regeneratorRuntime.async(function(e) {
                for (;;)
                    switch ((e.prev = e.next)) {
                        case 0:
                            return (
                                (e.next = 2),
                                regeneratorRuntime.awrap(
                                    n.a.Plugin.register('S3Adapter'),
                                )
                            );
                        case 2:
                            n.a.Zone.addComponent({
                                id: 'S3-PLUGIN-SETTINGS-ALL',
                                zone: 'plugin-settings-S3Adapter',
                                component: u,
                                order: 0,
                            }),
                                n.a.Zone.addComponent({
                                    id: 'S3-PLUGIN-SIDEBAR-WIDGET',
                                    zone: 'admin-sidebar-settings',
                                    component: p,
                                    order: 0,
                                });
                        case 4:
                        case 'end':
                            return e.stop();
                    }
            });
        },
    ]);
});

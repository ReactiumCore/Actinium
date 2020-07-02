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
                i = n(1),
                a = n.n(i),
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
                f = n.n(s),
                d = n(3),
                p = n.n(d);
            function y(e, t, n, r, o, i, a) {
                try {
                    var c = e[i](a),
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
                            i = void 0;
                        try {
                            for (
                                var a, c = e[Symbol.iterator]();
                                !(r = (a = c.next()).done) &&
                                (n.push(a.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (o = !0), (i = e);
                        } finally {
                            try {
                                r || null == c.return || c.return();
                            } finally {
                                if (o) throw i;
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
            var v = Object(i.memo)(
                    function(e) {
                        var t,
                            n = e.settingGroup,
                            c = Object(r.useHookComponent)('ReactiumUI'),
                            u = c.Spinner,
                            l = c.Alert,
                            s = c.Icon,
                            d = c.Button,
                            p = g(
                                Object(i.useState)({
                                    loading: !0,
                                    valid: !1,
                                    forceUpdated: new Date(),
                                }),
                                2,
                            ),
                            h = p[0],
                            v = p[1],
                            O = function(e) {
                                v(
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
                                                          m(e, t, n[t]);
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
                            j =
                                ((t = n),
                                {
                                    appId: f.a.get(t, 'appId'),
                                    host: f.a.get(t, 'host'),
                                    token: f.a.get(t, 'token'),
                                }),
                            S = j.appId,
                            C = j.host,
                            _ = j.token;
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
                                                                                O(
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
                                                    o,
                                                ) {
                                                    var i = e.apply(t, n);
                                                    function a(e) {
                                                        y(
                                                            i,
                                                            r,
                                                            o,
                                                            a,
                                                            c,
                                                            'next',
                                                            e,
                                                        );
                                                    }
                                                    function c(e) {
                                                        y(
                                                            i,
                                                            r,
                                                            o,
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
                                [S, C, _, h.forceUpdated],
                            ),
                            !(S && C && _))
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
                O = function(e) {
                    var t = Object(r.useHookComponent)('MenuItem');
                    return a.a.createElement(t, {
                        route: '/admin/plugins/SyndicateClient',
                        label: Object(r.__)('Syndicate Client'),
                    });
                },
                j = n(4),
                S = n.n(j);
            function C(e, t, n, r, o, i, a) {
                try {
                    var c = e[i](a),
                        u = c.value;
                } catch (e) {
                    return void n(e);
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o);
            }
            function _(e, t) {
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
            function E(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                        ? _(Object(n), !0).forEach(function(t) {
                              w(e, t, n[t]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(n),
                          )
                        : _(Object(n)).forEach(function(t) {
                              Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(n, t),
                              );
                          });
                }
                return e;
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
                            i = void 0;
                        try {
                            for (
                                var a, c = e[Symbol.iterator]();
                                !(r = (a = c.next()).done) &&
                                (n.push(a.value), !t || n.length !== t);
                                r = !0
                            );
                        } catch (e) {
                            (o = !0), (i = e);
                        } finally {
                            try {
                                r || null == c.return || c.return();
                            } finally {
                                if (o) throw i;
                            }
                        }
                        return n;
                    })(e, t) ||
                    (function(e, t) {
                        if (!e) return;
                        if ('string' == typeof e) return P(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        'Object' === n &&
                            e.constructor &&
                            (n = e.constructor.name);
                        if ('Map' === n || 'Set' === n) return Array.from(n);
                        if (
                            'Arguments' === n ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        )
                            return P(e, t);
                    })(e, t) ||
                    (function() {
                        throw new TypeError(
                            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                        );
                    })()
                );
            }
            function P(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r;
            }
            var I = function(e) {
                var t = e.editor,
                    n = Object(r.useHandle)('AdminTools'),
                    o = f.a.get(n, 'Modal'),
                    c = Object(i.useRef)(),
                    u = Object(r.useHookComponent)('ElementDialog'),
                    l = Object(r.useHookComponent)('Revisions'),
                    s = Object(r.useHookComponent)('ReactiumUI'),
                    d = s.Button,
                    p = s.Toggle,
                    y = (s.Alert, s.Icon),
                    b = f.a.get(t, 'value', {}),
                    m = {
                        on: Object(r.__)('Turn off synchronization'),
                        off: Object(r.__)('Turn on synchronization'),
                    },
                    g = x(Object(i.useState)(f.a.get(b, 'meta.syndicate')), 2),
                    h = g[0],
                    v = g[1],
                    O = !0 === f.a.get(h, 'manual', !1),
                    j = m[!1 === O ? 'on' : 'off'],
                    _ = function(e) {
                        v(f.a.get(e.value, 'meta.syndicate'));
                    };
                if (
                    (Object(i.useEffect)(
                        function() {
                            return (
                                t.addEventListener('clean', _),
                                t.addEventListener('save-success', _),
                                function() {
                                    t.addEventListener('clean', _),
                                        t.addEventListener('save-success', _);
                                }
                            );
                        },
                        [t],
                    ),
                    void 0 === h)
                )
                    return null;
                var w = f.a.get(
                        b,
                        ['branches', f.a.get(b, 'history.branch'), 'history'],
                        [],
                    ),
                    P = f.a.get(b, 'branches.syndicate.history', []),
                    I =
                        f.a.get(w, 0) !== f.a.get(P, 0) ||
                        w.length !== P.length ||
                        S.a.difference(P, w).length > 0,
                    k = (function() {
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
                                                            a.a.createElement(
                                                                l,
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
                                        var i = e.apply(t, n);
                                        function a(e) {
                                            C(i, r, o, a, c, 'next', e);
                                        }
                                        function c(e) {
                                            C(i, r, o, a, c, 'throw', e);
                                        }
                                        a(void 0);
                                    });
                                });
                        return function() {
                            return n.apply(this, arguments);
                        };
                    })();
                return a.a.createElement(
                    u,
                    {
                        editor: t,
                        pref: 'admin.dialog.syndicate.editor',
                        title: Object(r.__)('Syndication'),
                        helpText: Object(r.__)(
                            'Use to toggle manual synchronization on this content.',
                        ),
                    },
                    a.a.createElement(
                        'div',
                        { className: 'p-xs-20' },
                        a.a.createElement(
                            'div',
                            { className: 'form-group mb-xs-8' },
                            a.a.createElement(
                                'label',
                                null,
                                a.a.createElement('span', null, j),
                                a.a.createElement(p, {
                                    value: !0,
                                    checked: !1 === O,
                                    onChange: function(e) {
                                        var n = {
                                            meta: E(
                                                {},
                                                f.a.get(b, 'meta', {}),
                                                {
                                                    syndicate: E({}, h, {
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
                            I &&
                            a.a.createElement(
                                d,
                                {
                                    size: 'sm',
                                    appearance: 'pill',
                                    onClick: k,
                                    type: 'button',
                                },
                                a.a.createElement(y, {
                                    name: 'Feather.GitBranch',
                                    className: 'mr-xs-8',
                                }),
                                Object(r.__)('Merge Changes'),
                            ),
                    ),
                );
            };
            function k(e, t, n, r, o, i, a) {
                try {
                    var c = e[i](a),
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
                                                    component: l,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SIDEBAR-WIDGET',
                                                    zone: [
                                                        'admin-sidebar-settings',
                                                    ],
                                                    component: O,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id:
                                                        'SYNDICATE-CLIENT-SETTINGS-CHECK',
                                                    zone: [
                                                        'settings-editor-SyndicateClient',
                                                    ],
                                                    component: v,
                                                    order: 0,
                                                }),
                                                o.a.Zone.addComponent({
                                                    id: '',
                                                    zone: [
                                                        'admin-content-sidebar',
                                                    ],
                                                    component: I,
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
                                var i = e.apply(t, n);
                                function a(e) {
                                    k(i, r, o, a, c, 'next', e);
                                }
                                function c(e) {
                                    k(i, r, o, a, c, 'throw', e);
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

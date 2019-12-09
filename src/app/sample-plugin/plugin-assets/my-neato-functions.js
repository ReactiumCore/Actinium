!(function(e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t(require('reactium-core/sdk')))
        : 'function' == typeof define && define.amd
        ? define(['reactium-core/sdk'], t)
        : 'object' == typeof exports
        ? (exports['my-neato-functions'] = t(require('reactium-core/sdk')))
        : (e['my-neato-functions'] = t(e['reactium-core/sdk']));
})(window, function(e) {
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
            r((r.s = 1))
        );
    })([
        function(t, r) {
            t.exports = e;
        },
        function(e, t, r) {
            r(2);
        },
        function(e, t, r) {
            'use strict';
            r.r(t);
            var n = r(0),
                o = r.n(n);
            regeneratorRuntime.async(function(e) {
                for (;;)
                    switch ((e.prev = e.next)) {
                        case 0:
                            return (
                                (e.next = 2),
                                regeneratorRuntime.awrap(
                                    o.a.Plugin.register('my-neato-functions'),
                                )
                            );
                        case 2:
                        case 'end':
                            return e.stop();
                    }
            });
        },
    ]);
});

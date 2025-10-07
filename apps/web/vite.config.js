var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
// Avoid strict TS type issues on CI while keeping HTTPS in local dev.
var makeServer = function () {
    var server = { host: true, port: 5173 };
    // Enable HTTPS only in dev environment
    if (process.env.VERCEL !== '1')
        server.https = true;
    return server;
};
export default defineConfig({
    plugins: [mkcert()],
    base: './',
    server: __assign(__assign({}, makeServer()), { proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        } }),
    preview: { port: 5173 }
});

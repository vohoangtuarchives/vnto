import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { fileURLToPath, URL } from "url";
import { resolve, dirname } from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        include: ['linked-dep'],
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    // The Vue plugin will re-write asset URLs, when referenced
                    // in Single File Components, to point to the Laravel web
                    // server. Setting this to `null` allows the Laravel plugin
                    // to instead re-write asset URLs to point to the Vite
                    // server instead.
                    base: null,

                    // The Vue plugin will parse absolute URLs and treat them
                    // as absolute paths to files on disk. Setting this to
                    // `false` will leave absolute URLs un-touched so they can
                    // reference assets in the public directory as expected.
                    includeAbsolute: false,
                },
            },
        }),
        VueI18nPlugin({
            /* options */
            // locale messages resource pre-compile option
            include: resolve(dirname(fileURLToPath(import.meta.url)), './resources/js/lang/**'),
        }),
    ],
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: [
            { find: '~', replacement: fileURLToPath(new URL('./node_modules', import.meta.url)) },
            { find: '@', replacement: fileURLToPath(new URL('./resources/js', import.meta.url)) },
            { find: '~@', replacement: fileURLToPath(new URL('./resources/js', import.meta.url)) },
            { find: 'assets', replacement: fileURLToPath(new URL('./resources/js/assets', import.meta.url)) }
        ],

    },
});
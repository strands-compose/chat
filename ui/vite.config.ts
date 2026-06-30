import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Vite plugin that deletes all emitted HTML files and the leftover admin
 * directory after the build completes.
 */
function noHtmlEmit(): Plugin {
  let outDir = 'dist';
  return {
    name: 'no-html-emit',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      try {
        for (const entry of readdirSync(outDir, { recursive: true })) {
          if (String(entry).endsWith('.html')) {
            rmSync(resolve(outDir, String(entry)));
          }
        }
        // Remove the admin dir left behind after dashboard.html is deleted.
        rmSync(resolve(outDir, 'admin'), { recursive: true, force: true });
      } catch {
        // outDir absent (e.g. dry-run) — nothing to clean.
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Read the root-level .env (one level above ui/) so URL_PREFIX is available.
  // loadEnv with prefix '' loads all variables, not just VITE_* ones.
  const rootDir = fileURLToPath(new URL('..', import.meta.url));
  const env = loadEnv(mode, rootDir, '');
  const p = env.URL_PREFIX ?? '';

  return {
    plugins: [react(), noHtmlEmit()],
    base: '',
    optimizeDeps: {
      include: ['echarts', 'echarts/core', 'echarts-for-react/lib/core'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: process.env.VITE_OUT_DIR || 'dist',
      sourcemap: false,
      emptyOutDir: true,
      minify: true,
      rollupOptions: {
        input: {
          index: fileURLToPath(new URL('./index.html', import.meta.url)),
          login: fileURLToPath(new URL('./login.html', import.meta.url)),
          admin: fileURLToPath(new URL('./admin/dashboard.html', import.meta.url)),
        },
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'js/[name].js',
          assetFileNames: ({ name }) => {
            if (/\.css$/.test(String(name))) return 'css/[name][extname]';
            if (/\.(woff2?|eot|ttf|otf)$/.test(name ?? '')) return 'fonts/[name][extname]';
            if (/\.(png|jpe?g|gif|svg)$/.test(name ?? '')) return 'img/[name][extname]';
            return 'js/[name][extname]';
          },
          manualChunks: (id: string) => {
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
              return 'react-vendor';
            }
            if (/[\\/]node_modules[\\/](react-markdown|remark-gfm)[\\/]/.test(id)) {
              return 'markdown-vendor';
            }
            if (/[\\/]node_modules[\\/](echarts|zrender|echarts-for-react)[\\/]/.test(id)) {
              return 'echarts-vendor';
            }
          },
        },
      },
    },
    server: {
      proxy: {
        // Regex keys (starting with ^) let us use negative lookaheads.
        // /auth/ covers all backend auth endpoints: /auth/login, /auth/logout, etc.
        [`^${p}/auth/`]: {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
        [`^${p}/api/`]: {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
        // ^/admin(?!/dashboard) proxies all sqladmin routes to FastAPI but
        // leaves /admin/dashboard for Vite — served from admin/dashboard.html
        // with full HMR so the React admin panel can be developed without builds.
        [`^${p}/admin(?!/dashboard)`]: {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
      },
    },
  };
});

import { ConfigEnv, UserConfigExport, Plugin } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { minifyHtml } from 'vite-plugin-html'

const config: UserConfigExport = {
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/common': path.resolve(__dirname, './src/common'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/routes': path.resolve(__dirname, './src/routes'),
      '@/layouts': path.resolve(__dirname, './src/layouts'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/store': path.resolve(__dirname, './src/store')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    cssCodeSplit: true,
    sourcemap: 'inline',
    polyfillDynamicImport: true
    // rollupOptions: {
    //   treeshake: true,
    //   external: ['react', 'react-dom'],
    //   output: {
    //     // Provide global variables to use in the UMD build
    //     // for externalized deps
    //     globals: {
    //       react: 'React',
    //       'react-dom': 'ReactDom'
    //     }
    //   }
    // }
  }
}

export default ({ command, mode }: ConfigEnv) => {
  const envFiles = ['.env', `.env.${mode}`]

  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const k in envConfig) {
      if (Object.prototype.hasOwnProperty.call(envConfig, k)) {
        process.env[k] = envConfig[k]
      }
    }
  }

  // const isBuild = command === 'build'
  // const base = isBuild ? process.env.VITE_STATIC_CDN : '//localhost:3000'

  // 在这里无法使用 import.meta.env 变量
  const _config = {
    ...config,
    base: process.env.VITE_STATIC_CDN,
    plugins: [
      ...(config.plugins as Plugin[]),
      minifyHtml()
      // injectHtml({
      //   injectData: {
      //     injectScript: `<link rel=modulepreload href="${base}/react.production.min-17.0.1.js"><link rel=modulepreload href="${base}/react-dom.production.min-17.0.1.js">`
      //   }
      // })
    ]
  }

  if (command === 'serve') {
    return {
      ..._config,
      server: {
        // 反向代理
        proxy: {
          api: {
            target: process.env.VITE_API_HOST,
            changeOrigin: true,
            rewrite: (path: any) => path.replace(/^\/api/, '')
          }
        }
      }
    }
  }
  return _config
}

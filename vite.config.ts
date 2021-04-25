import { ConfigEnv, UserConfigExport, Plugin } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { injectHtml, minifyHtml } from 'vite-plugin-html'

const config: UserConfigExport = {
  plugins: [
    reactRefresh(),
    legacy({
      targets: [
        'Android >= 39',
        'Chrome >= 50',
        'Safari >= 10.1',
        'iOS >= 10.3',
        '> 1%',
        'not IE 11'
      ]
    })
  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src/')
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
    target: 'es2015',
    cssCodeSplit: true,
    polyfillDynamicImport: true,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // external: ['react', 'react-dom'],
      // output: {
      //   // Provide global variables to use in the UMD build
      //   // for externalized deps
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDom'
      //   }
      // }
    }
  }
}

export default ({ command, mode }: ConfigEnv) => {
  const envFiles = ['.env', `.env.${mode}`]

  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const k in envConfig) {
      if (Object.prototype.hasOwnProperty.call(envConfig, k)) {
        // 解决在构建时无法识别 import.meta.env 变量的问题
        process.env[k] = envConfig[k]
      }
    }
  }

  const isBuild = command === 'build'
  // const base = isBuild ? process.env.VITE_STATIC_CDN : '//localhost:3000'
  // const linkArr = [
  //   '<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>',
  //   '<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>'
  // ]
  // const injectScript = linkArr.join('')

  // 在这里无法使用 import.meta.env 变量
  const _config = {
    ...config,
    base: process.env.VITE_STATIC_CDN,
    plugins: [
      ...(config.plugins as Plugin[]),
      minifyHtml()
      // injectHtml({
      //   injectData: {
      //     injectScript: isBuild ? injectScript : ''
      //   }
      // })
    ]
  }

  console.log(_config)

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

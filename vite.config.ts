import { ConfigEnv, UserConfigExport, Plugin } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import legacy from '@vitejs/plugin-legacy'
import vitePluginImp from 'vite-plugin-imp'
import visualizer from 'rollup-plugin-visualizer'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { minifyHtml } from 'vite-plugin-html'

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
    }),
    // antd-mobile 按需引入
    vitePluginImp({
      libList: [
        {
          libName: 'antd-mobile',
          style: (name) => `antd-mobile/es/${name}/style`,
          libDirectory: 'es'
        }
      ]
    })
  ],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.join(__dirname, './src/')
      }
    ]
    // 以下配置，在 window 电脑跑不起来
    // alias: {
    //   '@/': path.join(__dirname, './src/')
    // }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // antd 定制主题样式
        modifyVars: {
          '@fill-body': '#fff'
        }
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: true,
    polyfillDynamicImport: true,
    rollupOptions: {
      plugins: []
    }
  }
}

export default ({ command, mode }: ConfigEnv) => {
  // 官方策略顺序
  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`
  ]
  const { plugins = [], build = {} } = config
  const { rollupOptions = {} } = build

  for (const file of envFiles) {
    try {
      fs.accessSync(file, fs.constants.F_OK)
      const envConfig = dotenv.parse(fs.readFileSync(file))
      for (const k in envConfig) {
        if (Object.prototype.hasOwnProperty.call(envConfig, k)) {
          process.env[k] = envConfig[k]
        }
      }
    } catch (error) {
      console.log('配置文件不存在，忽略')
    }
  }

  const isBuild = command === 'build'
  // const base = isBuild ? process.env.VITE_STATIC_CDN : '//localhost:3000/'

  config.base = process.env.VITE_STATIC_CDN

  if (isBuild) {
    // 压缩 Html 插件
    config.plugins = [...plugins, minifyHtml()]
    config.define = {
      'process.env.NODE_ENV': '"production"'
    }
  }

  if (process.env.VISUALIZER) {
    const { plugins = [] } = rollupOptions
    rollupOptions.plugins = [
      ...plugins,
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ]
  }

  // 在这里无法使用 import.meta.env 变量
  if (command === 'serve') {
    config.server = {
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
  return config
}

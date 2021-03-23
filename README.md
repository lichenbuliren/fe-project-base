# 使用 Vite + React + Typescript 打造一个前端单页应用模板

> 最近前端大火的 Vite 2.0 版本终于出来了，在这里分享一下如何使用 vite 构建一个前端单页应用

**该文章主要面向对 Vite 感兴趣，或者做前端项目架构的同学**

源码地址：[fe-project-base](https://github.com/lichenbuliren/fe-project-base)

通过这篇文章，你能了解到以下几点：
- vscode 编辑器配置
- ESLint + Pritter 配置
- git pre-commit 如何配置
- 标准前端单页应用目录规划
- 从 0 到 1 学习 vite 构建优化
- Typescript d.ts 声明文件如何编写
- mobx + react + Typescript 最佳实践

## 初始化项目
这里我们项目名是 [fe-project-base](https://github.com/lichenbuliren/fe-project-base)
这里我们采用的 [vite 2.0](https://vitejs.dev/guide/#overview) 来初始化我们的项目

``` bash
npm init @vitejs/app fe-project-base --template react-ts
```

这个时候，会出现命令行提示，咱们按照自己想要的模板，选择对应初始化类型就 OK 了

## 安装项目依赖
首先，我们需要安装依赖，要打造一个基本的前端单页应用模板，咱们需要安装以下依赖：
1. `react` & `react-dom`：基础核心
2. `react-router`：路由配置
3. `@loadable/component`：动态路由加载
4. `classnames`：更好的 className 写法
5. `react-router-config`：更好的 react-router 路由配置包
6. `mobx-react` & `mobx-persist`：mobx 状态管理
7. `eslint` & `lint-staged` & `husky` & `prettier`：代码校验配置
8. `eslint-config-alloy`：ESLint 配置插件

dependencies:

``` bash
npm install --save react react-dom react-router @loadable/component classnames react-router-config mobx-react mobx-persist
```

devDependencies：

``` bash
npm install --save-dev eslint lint-staged husky@4.3.8 prettier
```

通过 `cat .git/hooks/pre-commit` 来判断 husky 是否正常安装，如果不存在该文件，则说明安装失败，需要重新安装试试

<span style="color:red;font-weight:bold;">
这里的 husky 使用 4.x 版本，5.x 版本已经不是免费协议了<br/>测试发现 node/14.15.1 版本会导致 husky 自动创建 .git/hooks/pre-commit 配置失败，升级 node/14.16.0 修复该问题
</span>


在完成了以上安装配置之后，我们还需要对 `package.json` 添加相关配置

``` json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --cache --fix",
      "git add"
    ],
    "src/**/*.{js,jsx}": [
      "eslint --cache --fix",
      "git add"
    ]
  },
}
```

到这里，我们的整个项目就具备了针对提交的文件做 ESLint 校验并修复格式化的能力了

## 编辑器配置

工欲善其事必先利其器，我们首要解决的是在团队内部编辑器协作问题，这个时候，就需要开发者的编辑器统一安装 [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 插件（这里以 vscode 插件为例）

首先，我们在项目根目录新建一个配置文件：`.editorconfig`

参考配置：

``` ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

**配置自动格式化与代码校验**

在 vscode 编辑器中，Mac 快捷键 `command + ,` 来快速打开配置项，切换到 `workspace` 模块，并点击右上角的 `open settings json` 按钮，配置如下信息：

``` json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.tslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

这个时候，咱们的编辑器已经具备了保存并自动格式化的功能了

**更进一步：格式化自定义配置**

- `.eslintignore`：配置 ESLint 忽略文件

- `.eslintrc`：ESLint 编码规则配置，这里推荐使用业界统一标准，这里我推荐 AlloyTeam 的 [eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy)，按照文档安装对应的 ESLint 配置：

  ``` bash
  npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-config-alloy
  ```

- `.prettierignore`：配置 Prettier 忽略文件

- `.prettierrc`：格式化自定义配置
  ``` json
  {
    "singleQuote": true,
    "tabWidth": 2,
    "bracketSpacing": true,
    "trailingComma": "none",
    "printWidth": 100,
    "semi": false,
    "overrides": [
      {
        "files": ".prettierrc",
        "options": { "parser": "typescript" }
      }
    ]
  }
  ```

  选择 `eslint-config-alloy` 的几大理由如下：
  - 更清晰的 ESLint 提示：比如特殊字符需要转义的提示等等
    ``` bash
    error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities
    ```
  - 更加严格的 ESLint 配置提示：比如会提示 ESLint 没有配置指明 React 的 version 就会告警
    ``` bash
    Warning: React version not specified in eslint-plugin-react settings. See https://github.com/yannickcr/eslint-plugin-react#configuration .
    ```

    ``` json
    // .eslintrc
    {
      "settings": {
        "react": {
          "version": "detect"
        }
      }
    }
    ```

## 目录规划

一个基本的前端单页应用，需要的大致的目录架构如下：

这里以 `src` 下面的目录划分为例

``` bash
.
├── app.tsx
├── assets // 静态资源，会被打包优化
│   ├── favicon.svg
│   └── logo.svg
├── common // 公共配置，比如统一请求封装，session 封装
│   ├── http-client
│   └── session
├── components // 全局组件，分业务组件或 UI 组件
│   ├── Toast
├── config // 配置文件目录
│   ├── index.ts
├── hooks // 自定义 hook
│   └── index.ts
├── layouts // 模板，不同的路由，可以配置不同的模板
│   └── index.tsx
├── lib // 通常这里防止第三方库，比如 jweixin.js、jsBridge.js
│   ├── README.md
│   ├── jsBridge.js
│   └── jweixin.js
├── pages // 页面存放位置
│   ├── components // 就近原则页面级别的组件
│   ├── home
├── routes // 路由配置
│   └── index.ts
├── store // 全局状态管理
│   ├── common.ts
│   ├── index.ts
│   └── session.ts
├── styles // 全局样式
│   ├── global.less
│   └── reset.less
└── utils // 工具方法
  └── index.ts
```

OK，到这里，我们规划好了一个大致的前端项目目录结构，接下来我们要配置一下别名，来优化代码中的，比如： `import xxx from '@/utils'` 路径体验

*通常这里还会有一个 public 目录与 src 目录同级，该目录下的文件会直接拷贝到构建目录*

### 别名配置

别名的配置，我们需要关注的是两个地方：`vite.config.ts` & `tsconfig.json`

其中 `vite.config.ts` 用来编译识别用的；`tsconfig.json` 是用来给 Typescript 识别用的；

这里建议采用的是 `@/` 开头，为什么不用 `@` 开头，这是为了避免跟业界某些 npm 包名冲突（例如 @vitejs）

- `vite.config.ts`

``` js
// vite.config.ts
{
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
}
```

- `tsconfig.json`

``` json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/config/*": ["./src/config/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/common/*": ["./src/common/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/routes/*": ["./src/routes/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/store/*": ["./src/store/*"]
    },
    "typeRoots": ["./typings/"]
  },
  "include": ["./src", "./typings", "./vite.config.ts"],
  "exclude": ["node_modules"]
}
```

## 从 0 到 1 vite 构建配置

### 路由规划

首先，一个项目最重要的部分，就是路由配置；那么很明显我们需要一个配置文件作为入口来配置所有的页面路由：

1. 路由配置文件配置：`src/routes/index.ts`，这里我们引入的了 `@loadable/component` 库来做路由动态加载，[vite 默认支持动态加载特性](https://vitejs.dev/guide/features.html#dynamic-import-polyfill)，以此提高程序打包效率

   ``` typescript
   import loadable from '@loadable/component'
   import Layout, { H5Layout } from '@/layouts'
   import { RouteConfig } from 'react-router-config'
   import Home from '@/pages/home'

   const routesConfig: RouteConfig[] = [
     {
       path: '/',
       exact: true,
       component: Home
     },
     // hybird 路由
     {
       path: '/hybird',
       exact: true,
       component: Layout,
       routes: [
         {
           path: '/',
           exact: false,
           component: loadable(() => import('@/pages/hybird'))
         }
       ]
     },
     // H5 相关路由
     {
       path: '/h5',
       exact: false,
       component: H5Layout,
       routes: [
         {
           path: '/',
           exact: false,
           component: loadable(() => import('@/pages/h5'))
         }
       ]
     }
   ]

   export default routesConfig
   ```

2. 入口 `main.tsx` 文件配置路由路口

   ``` tsx
   import React from 'react'
   import ReactDOM from 'react-dom'
   import { BrowserRouter } from 'react-router-dom'
   import '@/styles/global.less'
   import { renderRoutes } from 'react-router-config'
   import routes from './routes'

   ReactDOM.render(
     <React.StrictMode>
       <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
     </React.StrictMode>,
     document.getElementById('root')
   )
   ```

   这里的面的 `renderRoutes` 其实就是咱们 `react-router` 的配置写法，通过查看 [源码 ](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config/modules/renderRoutes.js)如下：

   ```
   import React from "react";
   import { Switch, Route } from "react-router";

   function renderRoutes(routes, extraProps = {}, switchProps = {}) {
     return routes ? (
       <Switch {...switchProps}>
         {routes.map((route, i) => (
           <Route
             key={route.key || i}
             path={route.path}
             exact={route.exact}
             strict={route.strict}
             render={props =>
               route.render ? (
                 route.render({ ...props, ...extraProps, route: route })
               ) : (
                 <route.component {...props} {...extraProps} route={route} />
               )
             }
           />
         ))}
       </Switch>
     ) : null;
   }

   export default renderRoutes;
   ```

通过以上两个配置，咱们就基本能把项目跑起来了，同时也具备了路由的懒加载能力；

细心的同学可能会发现，上面咱们的路由配置里面，特意拆分了两个 `Layout` & `H5Layout`，这里这么做的目的是为了区分在微信 h5 与 hybird 之间的差异化而设置的模板入口，大家可以根据自己的业务来决定是否需要 `Layout` 层

### 样式处理

说到样式处理，这里咱们的示例采用的是 `.less` 文件，所以在项目里面需要安装对应的解析库

``` bash
npm install --save-dev less postcss
```



### 编译构建




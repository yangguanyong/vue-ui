### 开发
```
npm run dev
```

### 在本地项目跑
1. 在当前项目执行 yarn（第一次时才需要执行）
1. 在当前项目执行 npm run build（第一次才需要执行）
1. 在当前项目执行 yarn link（第一次才需要执行）
1. 在当前项目执行 npm run dev
1. 在目标项目内安装 yarn add talebase-ui
1. 在目标项目内执行 yarn link talebase-ui
1. 重启目标项目服务

### 项目说明
1. 组件js和scss分开，不要写内联样式
2. 样式文件前缀用 't-'， 如按钮组件：'t-btn'
3. 组件需要声明 name 属性，在 vue.component 里注册用
4. 每个组件需声明 install 方法，用于 vue.use
5. 组件在项目入口处注册，实现单个导出 export ，批量引用 install
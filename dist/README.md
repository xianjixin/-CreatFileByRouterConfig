#根据vue的路由配置的路径自动生成vue模板文件

##安装

> npm install -D auto-creat-file-by-path


##用法

 vue-cli 3.0的生成vue项目的使用方法


    const { CreateFileByRouterConfig } = require("auto-creat-file-by-path")
    module.exports = {
        configureWebpack: {
            plugins: [
                new CreateFileByRouterConfig({ routePath: "@/router.js", vueSrcSign: "@", jsTypeAboutVue: "ts", cssType: "less" })
            ]
        }
    }

 webpack4.0的vue项目的使用方法

    const { CreateFileByRouterConfig } = require("auto-creat-file-by-path")
    module.exports = {
        ...
        plugins: [
            new CreateFileByRouterConfig({ routePath: "@/router.js", vueSrcSign: "@", jsTypeAboutVue: "ts", cssType: "less" })
        ],
        //需要有配置@的别名路径
        resolve: {
          alias: {
            ...,
            '@': path.resolve(__dirname, './src')
          }
        ...
    }

插件CreateFileByRouterConfig 参数讲解

      // vue的路由在项目中的全路径,要加上文件名
      private routePath: string;
      // 配置的vue的关于src配置的别名符号 非必填
      private vueSrcSign: string ;
      //vue的script需要支持的js类型 是js还是ts   
      private jsTypeAboutVue: JSTypeAboutVue;
      // vue的style需要支持的css类型,支持css,sass,scss,less
      private cssType: CSSType;

routePath传参 "@/router.js"的代码介绍

    import Vue from 'vue'
    import Router from 'vue-router'
    import Home from '@/views/Home.vue'
    import Home1 from '@/views/Home1.vue'
    import Home2 from '@/aaa/Home1.vue'
    Vue.use(Router)
    export default new Router({
      mode: 'history',
      base: process.env.BASE_URL,
      routes: [
        {
          path: '/',
          name: 'home',
          component: Home
        }
      ]
    })


本插件作用就是当我们在配置了router.js里面写入了 导入其他vue组件的代码并且保存了以后,会去检测该文件是否有生成,如果没有生成的话,则会去自动创建该文件.
上面例子里,则会自动在views文件夹里面创建home1.vue,和自动创建aaa文件夹和home1.vue

###注意: 
1. 现阶段导入的组件必须带上.vue后缀. 
2. 现阶段只支持在配置的route.js里面新增了不存在的路径才可以自动创建vue文件. 相对路径和变量赋值的这2种将在后续更新中补上.
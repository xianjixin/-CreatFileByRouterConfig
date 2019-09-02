import { Compiler, Resolve } from "webpack";
import { Utils } from "./Utils";
import * as fs from 'fs';
import { CSSType, JSTypeAboutVue } from "./interface/interface";

// import * as t from "babel-traverse";

const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const parser = require("@babel/parser");

export class CreateFileByRouterConfig {
  /**
   * vue的路由在项目中的全路径,要加上文件名
   */
  private routePath: string = "";
  /**
   * 别名数组
   */
  private alias?: { [key: string]: string };
  /**
   * 配置的vue的关于src配置的别名符号
   */
  private vueSrcSign: string = "@";
  /**
   * 绝对路径
   */
  private absolutePath: string;
  /**
   * vue的script需要支持的js类型 是js还是ts
   */
  private jsTypeAboutVue: JSTypeAboutVue;
  /**
   * vue的style需要支持的css类型,支持css,sass,scss,less
   */
  private cssType: CSSType;
  /**
   * @desc 创建对象
   * @params routePath vue的路由在项目中的全路径,要加上文件名
   * @param routePath vue的路由在项目中的全路径,要加上文件名
   */
  constructor({ routePath, vueSrcSign, jsTypeAboutVue, cssType }: { routePath: string, vueSrcSign: string, jsTypeAboutVue: string, cssType: string }) {
    this.routePath = routePath;
    this.vueSrcSign = vueSrcSign || "@";
    this.jsTypeAboutVue = jsTypeAboutVue === JSTypeAboutVue.JS ? JSTypeAboutVue.JS : JSTypeAboutVue.TS;
    switch (cssType) {
      case CSSType.SCSS:
        this.cssType = CSSType.SCSS;
        break;
      case CSSType.SASS:
        this.cssType = CSSType.SASS;
        break;
      case CSSType.CSS:
        this.cssType = CSSType.CSS;
        break;
      case CSSType.LESS:
        this.cssType = CSSType.LESS;
        break;
      default:
        this.cssType = CSSType.SCSS;
        break;
    }
    console.log('constructor', this.jsTypeAboutVue, this.cssType);
  }
  apply(compiler: Compiler) {
    compiler.hooks.watchRun.tapAsync("CreateFileByRouterConfig", (watching: Compiler, callback: Function) => {

      let resolve: Resolve | any;
      resolve = watching.options.resolve;
      this.alias = resolve.alias;
      if (!this.alias) {
        //说明用户没有配置vue的@
      } else {
        this.createFileByAtSign(watching, callback);
      }
      callback();
    })
  }
  /**
   * 通过ast来解析源码
   * @param source 源码
   */
  parseSourceToChangeAst(source: string, callback: Function) {
    let ast = parser.parse(source, {
      sourceType: "module",
      plugins: ["dynamicImport"]
    });
    traverse(ast, {
      ImportDeclaration: node => {
        let dom = node.node;
        //获取到导入的value值
        let pathValue = dom.source.value;
        let replacePath = Utils.replaceAt(pathValue, this.vueSrcSign, this.absolutePath);
        if (!replacePath) return;
        let fullPath = Utils.unifiedPath(replacePath);
        let exits = fs.existsSync(fullPath);
        if (exits) return;
        Utils.createFile(fullPath, this.jsTypeAboutVue, this.cssType);
        callback();
      }
    })
  }
  /**
   * 根据'@'符号的配置路径来创建文件
   * 用户在webpack的resolve里面配置的别名alias
   * @param alias 
   */
  createFileByAtSign(watching: Compiler, callback: Function) {
    //先获取用户设置的别名配置
    this.absolutePath = this.alias[this.vueSrcSign];
    let fullUnifiedPath: string = '';
    /**
     * 如果用户传入了配置了别名的路径,需要去解析
     */
    if (this.routePath.indexOf(this.vueSrcSign) > -1) {
      let routeUrl = this.routePath.replace(this.vueSrcSign, this.absolutePath);
      fullUnifiedPath = Utils.unifiedPath(routeUrl);
    } else {
      /**
       * TODO
       * 用户传入了没有配置别名的路径,需要先去判断是不是绝对路径,如果不是绝对路径,还需要
       * 转换成绝对路径,才能找到配置的路由入口文件
       */
    }
    /**
     * 查找到是否有路由文件有变动,如果路由文件有变动,需要去解析源码,查看引入的组件哪些是新写入的,而且此组件并没有被创建,
     * 如果有这种未创建组件的时候,则需要我们来创建
     */
    // @ts-ignore
    let mtimes: { [path: string]: number; } = watching.watchFileSystem.watcher.mtimes;
    if (!mtimes) {
      callback();
      return;
    } else {
      let result = mtimes[fullUnifiedPath];
      if (result) {
        /**
         * 发现了被我们加入观察的route的文件有变化, 使用ast 找到导入的组件
         */
        let source = fs.readFileSync(fullUnifiedPath, { encoding: "utf8" });
        try {
          this.parseSourceToChangeAst(source, callback);
        } catch (error) {
          console.log('error', error);
          callback();
        }
      }
    }

  }

}
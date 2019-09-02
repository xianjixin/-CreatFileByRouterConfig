"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
var fs = __importStar(require("fs"));
var interface_1 = require("./interface/interface");
// import * as t from "babel-traverse";
var traverse = require("@babel/traverse").default;
var types = require("@babel/types");
var parser = require("@babel/parser");
var CreateFileByRouterConfig = /** @class */ (function () {
    /**
     * @desc 创建对象
     * @params routePath vue的路由在项目中的全路径,要加上文件名
     * @param routePath vue的路由在项目中的全路径,要加上文件名
     */
    function CreateFileByRouterConfig(_a) {
        var routePath = _a.routePath, vueSrcSign = _a.vueSrcSign, jsTypeAboutVue = _a.jsTypeAboutVue, cssType = _a.cssType;
        /**
         * vue的路由在项目中的全路径,要加上文件名
         */
        this.routePath = "";
        /**
         * 配置的vue的关于src配置的别名符号
         */
        this.vueSrcSign = "@";
        this.routePath = routePath;
        this.vueSrcSign = vueSrcSign || "@";
        this.jsTypeAboutVue = jsTypeAboutVue === interface_1.JSTypeAboutVue.JS ? interface_1.JSTypeAboutVue.JS : interface_1.JSTypeAboutVue.TS;
        switch (cssType) {
            case interface_1.CSSType.SCSS:
                this.cssType = interface_1.CSSType.SCSS;
                break;
            case interface_1.CSSType.SASS:
                this.cssType = interface_1.CSSType.SASS;
                break;
            case interface_1.CSSType.CSS:
                this.cssType = interface_1.CSSType.CSS;
                break;
            case interface_1.CSSType.LESS:
                this.cssType = interface_1.CSSType.LESS;
                break;
            default:
                this.cssType = interface_1.CSSType.SCSS;
                break;
        }
        console.log('constructor', this.jsTypeAboutVue, this.cssType);
    }
    CreateFileByRouterConfig.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.watchRun.tapAsync("CreateFileByRouterConfig", function (watching, callback) {
            var resolve;
            resolve = watching.options.resolve;
            _this.alias = resolve.alias;
            if (!_this.alias) {
                //说明用户没有配置vue的@
            }
            else {
                _this.createFileByAtSign(watching, callback);
            }
            callback();
        });
    };
    /**
     * 通过ast来解析源码
     * @param source 源码
     */
    CreateFileByRouterConfig.prototype.parseSourceToChangeAst = function (source, callback) {
        var _this = this;
        var ast = parser.parse(source, {
            sourceType: "module",
            plugins: ["dynamicImport"]
        });
        traverse(ast, {
            ImportDeclaration: function (node) {
                var dom = node.node;
                //获取到导入的value值
                var pathValue = dom.source.value;
                var replacePath = Utils_1.Utils.replaceAt(pathValue, _this.vueSrcSign, _this.absolutePath);
                if (!replacePath)
                    return;
                var fullPath = Utils_1.Utils.unifiedPath(replacePath);
                var exits = fs.existsSync(fullPath);
                if (exits)
                    return;
                Utils_1.Utils.createFile(fullPath, _this.jsTypeAboutVue, _this.cssType);
                callback();
            }
        });
    };
    /**
     * 根据'@'符号的配置路径来创建文件
     * 用户在webpack的resolve里面配置的别名alias
     * @param alias
     */
    CreateFileByRouterConfig.prototype.createFileByAtSign = function (watching, callback) {
        //先获取用户设置的别名配置
        this.absolutePath = this.alias[this.vueSrcSign];
        var fullUnifiedPath = '';
        /**
         * 如果用户传入了配置了别名的路径,需要去解析
         */
        if (this.routePath.indexOf(this.vueSrcSign) > -1) {
            var routeUrl = this.routePath.replace(this.vueSrcSign, this.absolutePath);
            fullUnifiedPath = Utils_1.Utils.unifiedPath(routeUrl);
        }
        else {
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
        var mtimes = watching.watchFileSystem.watcher.mtimes;
        if (!mtimes) {
            callback();
            return;
        }
        else {
            var result = mtimes[fullUnifiedPath];
            if (result) {
                /**
                 * 发现了被我们加入观察的route的文件有变化, 使用ast 找到导入的组件
                 */
                var source = fs.readFileSync(fullUnifiedPath, { encoding: "utf8" });
                try {
                    this.parseSourceToChangeAst(source, callback);
                }
                catch (error) {
                    console.log('error', error);
                    callback();
                }
            }
        }
    };
    return CreateFileByRouterConfig;
}());
exports.CreateFileByRouterConfig = CreateFileByRouterConfig;

import { Compiler } from "webpack";
export declare class CreateFileByRouterConfig {
    /**
     * vue的路由在项目中的全路径,要加上文件名
     */
    private routePath;
    /**
     * 别名数组
     */
    private alias?;
    /**
     * 配置的vue的关于src配置的别名符号
     */
    private vueSrcSign;
    /**
     * 绝对路径
     */
    private absolutePath;
    /**
     * vue的script需要支持的js类型 是js还是ts
     */
    private jsTypeAboutVue;
    /**
     * vue的style需要支持的css类型,支持css,sass,scss,less
     */
    private cssType;
    /**
     * @desc 创建对象
     * @params routePath vue的路由在项目中的全路径,要加上文件名
     * @param routePath vue的路由在项目中的全路径,要加上文件名
     */
    constructor({ routePath, vueSrcSign, jsTypeAboutVue, cssType }: {
        routePath: string;
        vueSrcSign: string;
        jsTypeAboutVue: string;
        cssType: string;
    });
    apply(compiler: Compiler): void;
    /**
     * 通过ast来解析源码
     * @param source 源码
     */
    parseSourceToChangeAst(source: string, callback: Function): void;
    /**
     * 根据'@'符号的配置路径来创建文件
     * 用户在webpack的resolve里面配置的别名alias
     * @param alias
     */
    createFileByAtSign(watching: Compiler, callback: Function): void;
}

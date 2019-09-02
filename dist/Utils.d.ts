import { JSTypeAboutVue, CSSType } from './interface/interface';
export declare class Utils {
    static createFile(routePath: string, jsTypeAboutVue: JSTypeAboutVue, cssType: CSSType): void;
    static replaceAt(filePath: string, vueSrcSign: string, absolutePath: string): string;
    static unifiedPath(pathStr: string): string;
    private static reolveFile;
    static createFileByFileType(file: string, jsTypeAboutVue: JSTypeAboutVue, cssType: CSSType): void;
}

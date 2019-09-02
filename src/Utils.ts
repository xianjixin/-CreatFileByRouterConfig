import * as path from 'path';
import * as fs from "fs";
import { TemplateType, JSTypeAboutVue, CSSType } from './interface/interface';
import { TemplateFactory } from "./template/FileTemplate";
export class Utils {
  static createFile(routePath: string, jsTypeAboutVue: JSTypeAboutVue, cssType: CSSType) {
    console.log("utils", jsTypeAboutVue, cssType);
    let files = routePath.split(path.sep);
    let dirArr = files.splice(0, 2);
    let file = dirArr.join(path.sep);
    for (const item of files) {
      if (!fs.existsSync(file)) {
        if (this.reolveFile(file, jsTypeAboutVue, cssType)) return;
      }
      file = path.resolve(file, item);
    }
    this.reolveFile(file, jsTypeAboutVue, cssType);
  }
  static replaceAt(filePath: string, vueSrcSign: string, absolutePath: string): string {
    if (filePath.indexOf(vueSrcSign) > -1) {
      let routePath = filePath.replace(vueSrcSign, absolutePath);
      return routePath;
    }
    return;
  }
  public static unifiedPath(pathStr: string): string {
    let p1 = pathStr.replace(/\\/g, '/');
    return p1.split("/").join(path.sep);
  }
  private static reolveFile(item: string, jsTypeAboutVue: JSTypeAboutVue, cssType: CSSType) {
    if (path.extname(item)) {
      this.createFileByFileType(item, jsTypeAboutVue, cssType);
      return true;
    } else {
      fs.mkdirSync(item);
    }
    return false;
  }
  static createFileByFileType(file: string, jsTypeAboutVue: JSTypeAboutVue, cssType: CSSType) {
    let extname = path.extname(file) || TemplateType.JS;
    let fileTemplateCreate = new TemplateFactory(<TemplateType>extname);
    let template = fileTemplateCreate.createTemplate(jsTypeAboutVue, cssType)
    fs.writeFileSync(file, template);
    fs.writeFileSync
  }
}
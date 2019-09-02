"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var interface_1 = require("./interface/interface");
var FileTemplate_1 = require("./template/FileTemplate");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.createFile = function (routePath, jsTypeAboutVue, cssType) {
        console.log("utils", jsTypeAboutVue, cssType);
        var files = routePath.split(path.sep);
        var dirArr = files.splice(0, 2);
        var file = dirArr.join(path.sep);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var item = files_1[_i];
            if (!fs.existsSync(file)) {
                if (this.reolveFile(file, jsTypeAboutVue, cssType))
                    return;
            }
            file = path.resolve(file, item);
        }
        this.reolveFile(file, jsTypeAboutVue, cssType);
    };
    Utils.replaceAt = function (filePath, vueSrcSign, absolutePath) {
        if (filePath.indexOf(vueSrcSign) > -1) {
            var routePath = filePath.replace(vueSrcSign, absolutePath);
            return routePath;
        }
        return;
    };
    Utils.unifiedPath = function (pathStr) {
        var p1 = pathStr.replace(/\\/g, '/');
        return p1.split("/").join(path.sep);
    };
    Utils.reolveFile = function (item, jsTypeAboutVue, cssType) {
        if (path.extname(item)) {
            this.createFileByFileType(item, jsTypeAboutVue, cssType);
            return true;
        }
        else {
            fs.mkdirSync(item);
        }
        return false;
    };
    Utils.createFileByFileType = function (file, jsTypeAboutVue, cssType) {
        var extname = path.extname(file) || interface_1.TemplateType.JS;
        var fileTemplateCreate = new FileTemplate_1.TemplateFactory(extname);
        var template = fileTemplateCreate.createTemplate(jsTypeAboutVue, cssType);
        fs.writeFileSync(file, template);
        fs.writeFileSync;
    };
    return Utils;
}());
exports.Utils = Utils;

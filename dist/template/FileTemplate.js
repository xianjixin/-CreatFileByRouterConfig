"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("../interface/interface");
var vueTemplateByJS = "\n<template>\n  <div class=\"\">\n  </div>  \n</template>\n<script>\nexport default {\n  name: \"\",\n}\n</script>\n";
var vueTemplateByTS = "\n<template>\n  <div class=\"\">\n\n  </div>\n</template>\n<script lang=\"ts\">\nimport Vue from 'vue'\nexport default Vue.extend({\n  \n})\n</script>\n";
var TemplateFactory = /** @class */ (function () {
    function TemplateFactory(templateType) {
        if (templateType === void 0) { templateType = interface_1.TemplateType.VUE; }
        this.templateType = templateType;
        console.log('this.templateType', templateType);
    }
    TemplateFactory.prototype.createTemplate = function (jsType, cssType) {
        if (cssType === void 0) { cssType = interface_1.CSSType.SASS; }
        switch (this.templateType) {
            case interface_1.TemplateType.VUE:
                return this.createVueTemplate(jsType, cssType);
            default:
                break;
        }
    };
    /**
     * 创建的vue模板
     * @param jsType
     */
    TemplateFactory.prototype.createVueTemplate = function (jsType, cssType) {
        var template = '';
        console.log('createVue', jsType);
        switch (jsType) {
            case interface_1.JSTypeAboutVue.TS:
                template = vueTemplateByTS;
                break;
            case interface_1.JSTypeAboutVue.JS:
                template = vueTemplateByJS;
                break;
            default:
                break;
        }
        var cssTemplate = this.createCssTemplate(cssType);
        return template + "\n" + cssTemplate + "\n            ";
    };
    TemplateFactory.prototype.createCssTemplate = function (cssType) {
        return "<style lang=\"" + cssType + "\"></style>\n    ";
    };
    return TemplateFactory;
}());
exports.TemplateFactory = TemplateFactory;

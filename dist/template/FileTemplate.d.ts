import { TemplateType, JSTypeAboutVue, CSSType } from "../interface/interface";
export declare class TemplateFactory {
    private templateType?;
    constructor(templateType?: TemplateType);
    createTemplate(jsType: JSTypeAboutVue, cssType?: CSSType): string;
    /**
     * 创建的vue模板
     * @param jsType
     */
    private createVueTemplate;
    private createCssTemplate;
}

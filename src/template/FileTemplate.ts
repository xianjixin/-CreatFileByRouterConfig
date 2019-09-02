import { TemplateType, JSTypeAboutVue, CSSType } from "../interface/interface";

let vueTemplateByJS: string = `
<template>
  <div class="">
  </div>  
</template>
<script>
export default {
  name: "",
}
</script>
`
let vueTemplateByTS: string = `
<template>
  <div class="">

  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  
})
</script>
`

export class TemplateFactory {
  private templateType?: TemplateType;
  constructor(templateType: TemplateType = TemplateType.VUE) {
    this.templateType = templateType
    console.log('this.templateType', templateType);
  }
  createTemplate(jsType: JSTypeAboutVue, cssType: CSSType = CSSType.SASS) {
    switch (this.templateType) {
      case TemplateType.VUE:
        return this.createVueTemplate(jsType, cssType);

      default:
        break;
    }
  }
  /**
   * 创建的vue模板
   * @param jsType 
   */
  private createVueTemplate(jsType: JSTypeAboutVue, cssType: CSSType): string {
    let template = '';
    console.log('createVue', jsType);
    switch (jsType) {
      case JSTypeAboutVue.TS:
        template = vueTemplateByTS;
        break;
      case JSTypeAboutVue.JS:
        template = vueTemplateByJS;
        break;
      default:
        break;
    }
    let cssTemplate = this.createCssTemplate(cssType)
    return `${template}
${cssTemplate}
            `
  }
  private createCssTemplate(cssType: CSSType): string {
    return `<style lang="${cssType}"></style>
    `
  }
}
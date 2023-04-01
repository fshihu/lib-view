

// @ts-ignore
import {importManualAll} from "./import-manual-all";

const modules = importManualAll();
// import './filter/xb-filter-form.vue'
export default {
    install: function (Vue
    ) {


        for(let key in modules){
                // @ts-ignore
            let module = modules[key];
            const componentName = Object.keys(module)[0];
            // @ts-ignore
            Vue.component(componentName,module[componentName])
        }
        // requireComponent.keys().forEach(fileName => {
        //     const componentConfig = requireComponent(fileName)
        //     // 获取组件的 PascalCase 命名
        //     const componentName = fileName
        //         .split('/')
        //         .pop()
        //         .replace(/\.\w+$/, '')
        //     // 全局注册组件
        //     let compent = componentConfig.default || componentConfig;
        //
        //     Vue.component(
        //         componentName,
        //         compent
        //     )
        // });
    }
};
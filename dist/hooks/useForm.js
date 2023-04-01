import {reactive} from "@vue/composition-api";

export function useForm({title,form_data = {},rules = {}},props = {}){
    let form = reactive({
        title:title,
        form_data:form_data,
        form_rules:rules,
    });
    return {
        form
    }
}
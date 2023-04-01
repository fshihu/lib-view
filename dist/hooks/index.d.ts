interface form{
    title:string,
    form_data?:object,
    form_rules?:[],
}



export function useForm(form:form): { form:form };


interface apiResult{
    list:[],
    page:{
        total:number,
    }
}
interface listResult{
    /**
     * v-bind 绑定到list
     */
    tableProps:{
        refreshing:boolean,
        list:[]
    },
    tableOp:{
        search:(form_data:object)=>void,
        export:()=>void,
        reset:()=>void,
        searchDefaultParams:()=>void,
        reload:()=>void,
        setDefaultParams:(form_data:object)=>void,
    },
    /**
     * v-on 绑定到list
     */
    tableHandlers:{

    }
}

export function useAntdTable(api:(pagination:object,formData:object)=>Promise<apiResult>,options?:{init_request: boolean}):listResult;

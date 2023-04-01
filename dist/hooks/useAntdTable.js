import {ref,reactive} from "@vue/composition-api";


export function useAntdTable(api,options={init_request:true,pagination: {}}) {

    options = {...{init_request:true,pagination:{}},...options};
    let show_more = false;
    let tableProps = reactive({
        dataSource:[],
        rowKey:'id',
        loading:false,
        pagination:{
            pageSize:10,
            total:0,
            current:1,
            showTotal:total => `共 ${ show_more?(total-2):total} 条`,
            ...options.pagination,
        }
    });
    let formData = {},default_params = {},cur_sorter = {};

    function request(params={}){
        if(!params.isExport){
            tableProps.loading = true;
        }
        return new Promise(resolve => {
            api(tableProps.pagination,{...formData,...params,...default_params,__sorter:Object.keys(cur_sorter).length?cur_sorter:null} ).then(res =>{
                if(params.isExport){
                    resolve(res);
                    return;
                }
                tableProps.loading = false;
                res.list.forEach((item,index) =>{
                    item._serial_num = (tableProps.pagination.current-1) * tableProps.pagination.pageSize+index+1;
                })
                tableProps.dataSource = res.list;
                if(res.list.length == 0){
                    show_more = true;
                    res.page.total += 2;
                }else{
                    show_more = false;
                }
                tableProps.pagination.total = res.page.total;
                resolve(res);
            })
        })
    }
    if(options.init_request){
        request({});
    }
    return {
        tableProps: tableProps,
        tableHandlers:{
            change(pagination,filters,sorter ){
                tableProps.pagination = pagination
                cur_sorter = sorter;
                request({});
            }
        },
        tableOp:{
            search(v){
                tableProps.pagination.current = 1;
                formData = v;
                return request({});
            },
            searchDefaultParams(){
                tableProps.pagination.current = 1;
                return request({});
            },
            export(){
                return request({isExport:true})
            },
            reset(){
                formData = {};
                tableProps.pagination.current = 1;
                return request({});
            },
            reload(){
                return request({});
            },
            setDefaultParams(params){
                default_params = params;
            }
        }
    }
}
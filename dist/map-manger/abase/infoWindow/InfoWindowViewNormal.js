export class InfoWindowViewNormal {
    // data = {
    //     lng : '',
    //     lat:'',
    // }

    constructor(data) {
        this.data = data;
        this.map = null;
        this.close_fn = null;
    }
    getMapObj(){
        return this.map;
    }
    setCloseFn(close_fn){
        this.close_fn = close_fn;
    }
    setMapObj(map){
        this.map = map;
    }


    getFinalRenderOptions({el,data}){

        let defaultOption = {
            is_modal:false,//模态窗口
            modal_z_index:123,
            modal_class_name:'',
            is_vue:false,//是否是vue组件
            autoMove:true,//自动移动
            content:'<div class=""></div>',//html或vue组件
            pos_bottom:200,        //自动居中，距离底部
            props:{},//vue 组件时的prop
        }

        return {
            ...defaultOption,
            ...this.getRenderOptions({el,data}),
        };
    }
    /**
     *
     * @returns {{}}
     */
    getRenderOptions({el,data}){
        console.warn(this.constructor.name+'需要实现render')
        return {
            is_modal:false,//模态窗口
            modal_z_index:123,
            modal_class_name:'',
            is_vue:false,//是否是vue组件
            autoMove:true,//自动移动
            content:'<div class=""></div>',//html或vue组件
            pos_bottom:200,        //自动居中，距离底部
            props:{},//vue 组件时的prop
        };
    }
    close(){
        if(this.close_fn){
            this.close_fn();
        }
    }
}
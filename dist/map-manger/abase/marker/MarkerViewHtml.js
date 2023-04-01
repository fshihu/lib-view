export class MarkerViewHtml {
    // data = {
    //     lng : '',
    //     lat:'',
    // }

    constructor(data) {
        this.data = data;
        this.map = null;
    }
    getMapObj(){
        return this.map;
    }
    setMapObj(map){
        this.map = map;
    }


    getFinalRenderOptions({el,data}){
        let defaultOption = {
            is_vue:false, //是否是vue组件渲染
            size: [64, 30], // 大小
            offset: [32, 30], //偏移，相对左上角
            content:'<div class=""></div>',//html或vue组件
            props:{},//vue 组件时的prop
        }
        return {
            ...defaultOption,...this.getRenderOptions({el,data}),
        }
    }
    /**
     *
     * @returns {{}}
     */
    getRenderOptions({el,data}){
        console.warn(this.constructor.name+'需要实现render')
        return {
            is_vue:false, //是否是vue组件渲染
            size: [64, 30], // 大小
            offset: [32, 30], //偏移，相对左上角
            content:'<div class=""></div>',//html或vue组件
            props:{},//vue 组件时的prop
        };
    }

    /**
     *
     * @param e 事件
     * @param el dom元素，html渲染才有
     * @return InfoWindowViewNormal|undefined
     */
    onClick({e,el,data}){

    }

    /**
     *
     * @param e
     * @param el
     * @return MarkerViewHtml|undefined
     */
    onMouseover({e,el,data}){

    }
    onMouseout({e,el,data}){

    }

}
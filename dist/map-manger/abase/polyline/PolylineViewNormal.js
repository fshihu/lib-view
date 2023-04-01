export class PolylineViewNormal {
    // data = {
    //     path : [],
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
    getFinalRenderOptions({data}){
        let defaultOption = {
            borderWeight : 2,
            fillOpacity: 0.5,
            strokeColor: '#2b8cbe',
            strokeOpacity:1,
            strokeWeight : 4,
            strokeStyle:'solid', //dashed
            lineJoin:'round',
            lineCap:'round',
            strokeDasharray:[10,10],
            showDir:false,
            default_marker:null,
            // strokeStyle: 'dashed',
            // strokeDasharray: [5, 5],
        }
        return {
            ...defaultOption,
            ...this.getRenderOptions({data}),
        }
    }
    /**
     *
     * @returns {{}}
     */
    getRenderOptions({data}){
        console.warn(this.constructor.name+'需要实现render')
        return {
            fillColor: '#2990FF',
            strokeOpacity: 1,
            fillOpacity: 0.3,
            strokeColor: '#2990FF',
            strokeWeight: 1,
            default_marker:null,//默认marker
            // strokeStyle: 'dashed',
            // strokeDasharray: [5, 5],
        };
    }

    /**
     *
     * @param e 事件
     * @param el dom元素，html渲染才有
     * @return InfoWindowViewNormal|undefined
     */
    onClick({e,data}){

    }

    /**
     *
     * @param e
     * @param data
     * @return {{hover_marker: MarkerViewHtml|undefined, hover_options: {}}}
     */
    onMouseover({e,data}){
        return  {
            hover_marker:undefined,
            remove_default_marker:false,//是否移除默认marker
            hover_options:{}
        }
    }
    onMouseout({e,data}){

    }
}
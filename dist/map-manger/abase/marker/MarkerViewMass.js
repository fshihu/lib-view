export class MarkerViewMass {


    getFinalStyleConf(){
        let defaultOption = {
            minZoom: 2,
            maxZoom: 14,
            url:'',// require('./img/aaa.png'),
            size: [20, 20], // 大小
            offset: [10, 10], //偏移，相对左上角
            scale:0.001,
        }
        return  this.getStyleConf().map(item =>{
            return {
                ...defaultOption,
                ...item,
            }
        });
    }
    //样式key，自定义枚举，用于mass渲染
    getStyleConf(){
        console.warn(this.constructor.name+'需要实现getStyleKey')
        return  [
                {
                    minZoom: 2,
                    maxZoom: 14,
                    url:'',// require('./img/aaa.png'),
                    size: [20, 20], // 大小
                    offset: [10, 10], //偏移，相对左上角
                }
            ];

    }


    /**
     *
     * @param data
     * @return InfoWindowViewNormal|undefined
     */
    onClick({data}){

    }

    /**
     *
     * @param e
     * @param el
     * @return MarkerViewHtml|undefined
     */
    onMouseover({data}){

    }
    onMouseout({data}){

    }
}
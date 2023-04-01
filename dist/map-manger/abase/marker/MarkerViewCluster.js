export class MarkerViewCluster {
    getClusterOptions(){
        return {
            cluster_type:'grid',//key  可以按key聚合或网格
            gridSize :80,
            clusterIndexSet:{//按key聚合时，需要传data数据的key，例如网格id，按zoom 设置
                city: {
                    minZoom: 2,
                    maxZoom: 10,
                },
                district: {
                    minZoom: 10,
                    maxZoom: 12,
                },
                area: {
                    minZoom: 12,
                    maxZoom: 15,
                },
                community: {
                    minZoom: 15,
                    maxZoom: 22,
                },
            },
        }
    }

    getMapObj(){
        return this.map;
    }
    setMapObj(map){
        this.map = map;
    }


    /**
     * 目前只支持html、vue渲染
     * @returns {{}}
     */
    getRenderOptions({el,clusterData=[],count=0,indexKey=''}){
        console.warn(this.constructor.name+'需要实现render')
        return {
            is_vue:false,
            size: [64, 30], // 大小
            offset: [32, 30], //偏移，相对左上角
            content:'<div class=""></div>',//html或vue组件
        };
    }

    /**
     *
     * @param clusterData
     * @param count
     * @param lnglat
     * @param indexKey
     * @return InfoWindowViewNormal|undefined
     */
    onClick({el,clusterData=[],count=0,lnglat={},indexKey=''}){

    }

    /**
     *
     * @param clusterData
     * @param count
     * @param lnglat
     * @param lng
     * @param lat
     * @param indexKey
     * @return MarkerViewHtml|undefined
     */
    onMouseover({el,clusterData=[],count=0,lnglat,lng,lat,indexKey=''}){

    }
    onMouseout({el,clusterData=[],count=0,lnglat,lng,lat,indexKey=''}){

    }

}
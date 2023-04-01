import {MarkerViewCluster} from "./MarkerViewCluster";
import {MapManager} from "../MapManager";

export class MarkerLayerRenderCluster {
    constructor(map, mapManager, markerViewCluster) {
        this.map = map;
        this.mapManager = mapManager;
        this.components = [];
        this.clusterIndexSet = {};
        if (markerViewCluster instanceof MarkerViewCluster) {
            let clusterOptions = markerViewCluster.getClusterOptions();
            // clusterOptions.cluster_type == '';

            this.clusterIndexSet = clusterOptions.clusterIndexSet;
            markerViewCluster.setMapObj(this.map);

            const renderMarker = (context) => {
                let el = document.createElement('div');
                let options = markerViewCluster.getRenderOptions({
                    el,
                    clusterData: context.clusterData,
                    count: context.count,
                    indexKey: context.index?context.index.mainKey:undefined,
                });
                let is_vue = options.is_vue;
                if (this.mapManager instanceof MapManager) {
                    const component = this.mapManager.getRenderHtml(el, options, is_vue);

                    if (component) {
                        this.components.push(component);
                    }

                    let event_data = {
                        el,
                        clusterData: context.clusterData,
                        count: context.count,
                        lnglat: context.marker.getPosition(),
                        lng: context.marker.getPosition().lng,
                        lat: context.marker.getPosition().lat,
                    };
                    context.marker.on('mouseover', (e) => {
                        let hover_marker = markerViewCluster.onMouseover(event_data);
                        if (this.mapManager instanceof MapManager) {
                            this.mapManager.mouseover(hover_marker);
                        }
                    });
                    context.marker.setExtData({el});
                    context.marker.on('mouseout', (e) => {
                        markerViewCluster.onMouseout(event_data);
                        if (this.mapManager instanceof MapManager) {
                            this.mapManager.mouseout();
                        }
                    })

                    context.marker.setContent(el);
                    context.marker.setOffset(new AMap.Pixel(-options.offset[0], -options.offset[1]));
                }

            }

            if (clusterOptions.cluster_type == 'key') {
                this.markerClusterObj = new AMap.IndexCluster(this.map, [], {
                    rendermarkerViewCluster: (context) => {
                        renderMarker(context);
                    }, // 自定义聚合点样式
                    ...clusterOptions,
                });

            } else {
                this.markerClusterObj = new AMap.MarkerCluster(this.map, [], {
                    renderClusterMarker: (context) => {
                        let clusterData = [];
                        if(context.clusterData){
                            context.clusterData.forEach(item => {
                                clusterData = [...clusterData, ...item._amapMarker.originData[0]];
                            })
                        }

                        renderMarker({
                            clusterData,
                            count: context.count,
                            marker: context.marker,
                        });
                    }, // 自定义聚合点样式
                    renderMarker: (context) => {
                        context.clusterData = context.data;
                        renderMarker(context);
                    }, // 自定义非聚合点样式
                    ...clusterOptions,
                });

            }
            this.markerClusterObj.on('click', (e) => {
                let {el} = e.marker.getExtData();
                let infoWindow = markerViewCluster.onClick({
                    el,
                    clusterData: e.clusterData,
                    count: e.clusterData.length,
                    lnglat: e.marker.getPosition(),
                });
                if (this.mapManager instanceof MapManager) {
                    this.mapManager.click(infoWindow);
                }
            })
        }

    }

    remove() {
        this.markerClusterObj.setMap(null);
        this.components.forEach(component => {
            component.$destroy();
        });
        this.components = [];
        this.markerClusterObj.setData([]);
    }

    render(data_objs) {
        data_objs.forEach(item => {
            item.lnglat = [item.data.lng, item.data.lat];
            for (let key in this.clusterIndexSet) {
                item[key] = item.data[key];
            }
        });
        this.markerClusterObj.setData(data_objs);
    }
}
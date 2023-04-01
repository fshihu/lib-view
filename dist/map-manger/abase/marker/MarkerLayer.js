import {MarkerViewHtml} from "./MarkerViewHtml";
import {MarkerLayerRenderHtml} from "./MarkerLayerRenderHtml";
import {MarkerLayerRenderCluster} from "./MarkerLayerRenderCluster";
import {MarkerViewCluster} from "./MarkerViewCluster";
import {MarkerLayerRenderMass} from "./MarkerLayerRenderMass";
import {MarkerData} from "./MarkerData";
import {MapManager} from "../MapManager";
import {debounce} from "../utils/debounce";

/***
 * marker管理类
 */
export class MarkerLayer {
    constructor(map, mapManager) {
        this.map = map;
        this.map_html_data_objs = {};
        this.map_cluster_map_datas = {};
        this.map_mass_data_objs = {};

        this.mapMarkerViewCluster = {};

        this.marker_options = {};

        this.mapManager = mapManager;
        this.markerLayerRenderHtml = new MarkerLayerRenderHtml(map, mapManager);
        this.markerLayerRenderMass = new MarkerLayerRenderMass(map,mapManager);
        this.mapMarkerLayerRenderClusters = {};
        const render = debounce(() => {
            this.render(true);
        },500);
        this.map.on('zoomend',()=>{
            render();
        });
        this.map.on('moveend',()=>{
            render();
        });
    }

    /**
     *
     * @param mapMarkerViewCluster
     */
    setMapMarkerViewCluster(mapMarkerViewCluster){
        this.mapMarkerViewCluster = mapMarkerViewCluster;
    }
    setMapMarkerViewMass(mapMarkerViewMass){
        this.markerLayerRenderMass.setMapMarkerViewMass(mapMarkerViewMass);
    }
    setMarkerOptions(data_type,options = {max:0,maxZoom:17}){
        let defaultOptions = {max:0,maxZoom:17};
        this.marker_options[data_type] = {...defaultOptions,...options};
    }

    _addMarker(data_type,data){
        if(!this.map_html_data_objs[data_type]){
            this.map_html_data_objs[data_type] = [];
        }
        if(!this.map_cluster_map_datas[data_type]){
            this.map_cluster_map_datas[data_type] = [];
        }
        if(!this.map_mass_data_objs[data_type]){
            this.map_mass_data_objs[data_type] = [];
        }

        if(data instanceof MarkerData){
            let renderType = data.getRenderType();
            if(renderType == MarkerData.render_html){
                this.map_html_data_objs[data_type].push(data);
            }
            if(renderType == MarkerData.render_cluster ){
                let clusterGroup = data.getClusterViewGroup();
                if(!this.map_cluster_map_datas[data_type][clusterGroup]){
                    this.map_cluster_map_datas[data_type][clusterGroup] = [];
                }
                this.map_cluster_map_datas[data_type][clusterGroup].push(data);
            }
            if(renderType == MarkerData.render_mass){
                this.map_mass_data_objs[data_type].push(data);
            }
        }


    }
    addMarkers(data_type,list){
        list.forEach(item =>{
            this._addMarker(data_type,item);
        })
    }
    setMarkers(data_type,list){
        this.map_html_data_objs[data_type] = [];
        this.map_cluster_map_datas[data_type] = [];
        this.map_mass_data_objs[data_type] = [];

        list.forEach(item =>{
            this._addMarker(data_type,item);
        })
    }

    /**
     * 触发事件
     * @param key， marker的字段需要有所有marker唯一的key
     * @param type click，mouseover,mouseout
     * @return boolean 是否查找到
     */
    triggerMarker(key,type='click',trigger_options = {is_near:false}){
        let ok = false;
        if(!ok){
            ok = this.markerLayerRenderHtml.triggerMarker(key,type,trigger_options);
        }
        if(!ok){
            ok = this.markerLayerRenderMass.triggerMarker(key,type,trigger_options);
        }
        return ok;
    }

    /**
     * 触发事件，使用data_index
     * @param data_index
     * @param type
     * @param options
     * @return {boolean}
     */
    triggerMarkerDataIndex(data_index,type='click',trigger_options = {is_near:false}){
        let ok = false;
        if(!ok){
            ok = this.markerLayerRenderHtml.triggerMarkerDataIndex(data_index,type,trigger_options);
        }
        if(!ok){
            ok = this.markerLayerRenderMass.triggerMarkerDataIndex(data_index,type,trigger_options);
        }
        return ok;
    }
    render(is_zoom_end){

        if(this.mapManager instanceof MapManager){
            this.mapManager.removeHover();
        }
        let html_data_objs = [];
        Object.keys(this.map_html_data_objs).forEach(key =>{
            html_data_objs = [...html_data_objs,...this.map_html_data_objs[key]];
        });
        this.markerLayerRenderHtml.render(html_data_objs);


        if(!is_zoom_end){
            let cluster_map_datas = {};
            Object.keys(this.map_cluster_map_datas).forEach(key =>{
                for(let key1 in this.map_cluster_map_datas[key]) {
                    if(!cluster_map_datas[key1]){
                        cluster_map_datas[key1] = [];
                    }
                    cluster_map_datas[key1] = [...cluster_map_datas[key1], ...this.map_cluster_map_datas[key][key1]];
                }
            });

            for(let key in cluster_map_datas){
                if(!this.mapMarkerViewCluster[key]){
                    console.warn('key "'+key+'"分组为设置渲染对象，调用setClusterMarker设置')
                }

                let mapMarkerLayerRenderCluster = this.mapMarkerLayerRenderClusters[key];
                if(!mapMarkerLayerRenderCluster){
                    mapMarkerLayerRenderCluster = new MarkerLayerRenderCluster(this.map,this.mapManager,this.mapMarkerViewCluster[key]);
                    this.mapMarkerLayerRenderClusters[key] = mapMarkerLayerRenderCluster;
                }
                mapMarkerLayerRenderCluster.render(cluster_map_datas[key]);
            }
        }

        let mass_data_objs = [];
        let bounds = null;
        if(!this.mapManager.is_three_3d){
            bounds = this.map.getBounds();
        }

        Object.keys(this.map_mass_data_objs).forEach(key =>{

            let dataObjs = this.map_mass_data_objs[key];
            if(this.marker_options[key]){
                let options = this.marker_options[key];
                if(options.max > 0  && options.max < dataObjs.length  && this.map.getZoom() <= options.maxZoom){
                    let reDataObjs = [];
                    let ratio = options.max/dataObjs.length;
                    for(let i=0;i<dataObjs.length;i++){
                        if(Math.random() < ratio){
                            reDataObjs.push(dataObjs[i]);
                        }
                    }
                    dataObjs = reDataObjs;
                }else if(bounds){
                    let reDataObjs = [];
                    for(let i=0;i<dataObjs.length;i++){
                        if(bounds.contains(new AMap.LngLat(dataObjs[i].data.lng,dataObjs[i].data.lat))){
                            reDataObjs.push(dataObjs[i]);
                        }
                    }
                    dataObjs = reDataObjs;
                }
            }
            mass_data_objs = [...mass_data_objs,...dataObjs];
        });
        this.markerLayerRenderMass.render(mass_data_objs);


    }

    /**
     * 返回数组，多了_data_index和_data_type字段
     *
     * @return {[{_data_index:'',_data_type:'',}]}
     */
    getAllData(){
        let all_data = [];
        const mergeData = (data_type,data_arr) => {

            data_arr = data_arr.map(item =>{
                return {
                    ...item.data,
                    _data_type:data_type,
                    _data_index:item.data_index
                }
            })
            all_data= [...all_data,...data_arr];

        }
        for(let data_type in this.map_html_data_objs){
            let data_arr = this.map_html_data_objs[data_type];
            mergeData(data_type,data_arr);
        }
        for(let data_type in this.map_cluster_map_datas){
            let data_arr = this.map_cluster_map_datas[data_type];
            mergeData(data_type,data_arr);

        }
        for(let data_type in this.map_mass_data_objs){
            let data_arr = this.map_mass_data_objs[data_type];
            mergeData(data_type,data_arr);
        }
        return all_data
    }



}
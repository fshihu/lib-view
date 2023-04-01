import {MarkerViewHtml} from "./MarkerViewHtml";

let data_index = 1;
export class MarkerData {

    // data = {
    //     key :'',
    //     lng : '',
    //     lat:'',
    // }




    constructor(data) {
        this.data = data;
        this.render_type = '';
        this.cluster_view_group = '';
        this.mass_view_group = '';
        this.data_index = 'marker_'+data_index++;
        data._data_index = this.data_index;
        this.markerViewHtml = null;
    }



    //html,cluster,mass
    getRenderType(){
        return this.render_type;
    }
    getClusterViewGroup(){
        return this.cluster_view_group;
    }
    getMassViewGroup(){
        return this.mass_view_group;
    }


}
MarkerData.render_html = 'html';//html自定义，需要实现render方法
MarkerData.render_cluster = 'cluster';//聚合点方式，需要实现render方法
MarkerData.render_mass = 'mass';//麻点方式


/**
 *
 * @param list
 * @param markerViewHtmlClassDefine MarkerViewHtml类
 */
MarkerData.listToHtmlMarker = function (list,markerViewHtmlClassDefine) {
    if(!markerViewHtmlClassDefine instanceof MarkerViewHtml){
        console.error('listToHtmlMarker markerViewHtmlClassDefine需要继承MarkerViewHtml')
    }
    return MarkerData.listToMarker(list,{
        render_type:MarkerData.render_html,
        markerViewHtmlClassDefine,
    })
}
MarkerData.listToClusterMarker = function(list, cluster_view_group){
    return MarkerData.listToMarker(list,{
        render_type:MarkerData.render_cluster,
        cluster_view_group: cluster_view_group,
    })
}
MarkerData.listToMassMarker = function(list, mass_view_group){
    return MarkerData.listToMarker(list,{
        render_type:MarkerData.render_mass,
        mass_view_group: mass_view_group
    })
}
MarkerData.listToMarker = function(list,{render_type,markerViewHtmlClassDefine,cluster_view_group,mass_view_group}){
    let s = [];
    list.forEach(item =>{

        let markerViewHtml = null;
        if(markerViewHtmlClassDefine){
            markerViewHtml = new markerViewHtmlClassDefine(item);
        }
        let itemData = this.createMarker(item,{
            render_type,markerViewHtml,cluster_view_group,mass_view_group
        })
        s.push(itemData);
    });
    return s;
}
MarkerData.createMarker = function (data,{render_type,markerViewHtml,cluster_view_group,mass_view_group}){
    let itemData = new this(data);
    itemData.render_type = render_type;
    itemData.cluster_view_group = cluster_view_group;
    itemData.mass_view_group = mass_view_group;
    itemData.markerViewHtml = markerViewHtml;
    return itemData;
}
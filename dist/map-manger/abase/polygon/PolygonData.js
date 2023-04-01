import {PolygonViewNormal} from "./PolygonViewNormal";
let data_index = 1;
export class PolygonData {
    // data = {
    //     path:[],
    // }

    constructor(data) {
        this.polygonViewNormal = null;
        this.data = data;
        this.data_index = 'polygon_'+data_index++;
        data._data_index = this.data_index;
    }

    getRenderType(){
        return PolygonData.render_normal;
    }

}
PolygonData.render_normal = 'normal';

PolygonData.listToPolygonNormal= function(list,polygonViewNormalClassDefine){
    if(!polygonViewNormalClassDefine instanceof PolygonViewNormal){
        console.error('listToHtmlMarker markerViewHtmlClassDefine需要继承MarkerViewHtml')
    }
    let s = [];
    list.forEach(item =>{
        let itemData = new this(item);
        itemData.polygonViewNormal = new polygonViewNormalClassDefine(item);
        s.push(itemData);
    });
    return s;
}
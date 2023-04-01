import {PolylineViewNormal} from "./PolylineViewNormal";
let data_index = 1;
export class PolylineData {
    // data = {
    //     path:[],
    // }

    constructor(data) {
        this.polylineViewNormal = null;
        this.data = data;
        this.data_index = 'polyline_'+data_index++;
        data._data_index = this.data_index;
    }

    getRenderType(){
        return PolylineData.render_normal;
    }

}
PolylineData.render_normal = 'normal';

PolylineData.listToPolylineNormal= function(list,polylineViewNormalClassDefine){
    if(!polylineViewNormalClassDefine instanceof PolylineViewNormal){
        console.error('listToHtmlMarker markerViewHtmlClassDefine需要继承MarkerViewHtml')
    }
    let s = [];
    list.forEach(item =>{
        let itemData = new this(item);
        itemData.polylineViewNormal = new polylineViewNormalClassDefine(item);
        s.push(itemData);
    });
    return s;
}
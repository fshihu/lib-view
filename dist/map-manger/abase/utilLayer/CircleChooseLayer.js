import circleChoose from './circleChoose/index';
import turf from "turf";
import geoTransUtil1 from "../utils/geoTransUtil";

export class CircleChooseLayer {
    constructor(map,mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.marker = null;
        this.component = null;
    }


    changeDis(dis){
       if(this.component){
           this.component.$children[0].changeDis(dis);
       }
    }

    /**
     *
     * @param center []
     * @param radius number 米
     * @param to [] 判断点
     */
    inCircle(center,radius,to){
        let _from = turf.point(center);
        let _to = turf.point(to);
        let options = "kilometers";
        let _distance = turf.distance(_from, _to, options)*1000;
        return _distance <= radius;
    }

    /**
     *
     * @param lng
     * @param lat
     * @param options {dis:500,minDis:100,onEnd:(dis)=>{}}
     */
    renderCircle([lng,lat],options = {}){
        this.clear();
        let defaultOptions = {
            dis:500,
            minDis:100,
            theme:'blue',
            onEnd:(dis)=>{
                console.log(dis);
            }
        };
        options = {...defaultOptions,...options}
        let el = document.createElement('div');
        const component = this.mapManager.getRenderHtml(el, {
            content:circleChoose,
            props:{
                mapObj:this.map,
                center:[lng,lat],
                disDefault:options.dis,
                onEnd:options.onEnd,
                minDis:options.minDis,
                theme:options.theme,
            }
        }, true);

        el.className = 'circle_choose_marker_warp';
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        let marker = null,marker_el = null;

        if(this.mapManager.is_three_3d){
            marker = new this.mapManager.Xb3DMap.Marker({
                position: geoTransUtil1.gcj02towgs84(lng, lat),
                // offset: new AMap.Pixel(-options.offset[0], -options.offset[1]),
                content: el,
               // ...marker_options,
            });
            marker.setMap(this.map);
            marker_el = el;
            marker_el.on = el.addEventListener;
        }else{
            marker = new AMap.Marker({
                position: this.mapManager.lngLatToMap([lng, lat]),
              //  offset: new AMap.Pixel(-options.offset[0], -options.offset[1]),
                content: el,
                size:[1,1],
                offset:[0,0],
               // ...marker_options,
            });
            marker.setMap(this.map);
            marker_el = marker;
        }

        this.component = component;
        this.marker = marker;

    }
    clear(){
        if(this.component){
            this.component.$destroy();
            this.component = null;
        }
        if(this.marker){
            this.marker.setMap(null);
            this.marker = null;
        }
    }
}
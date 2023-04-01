import {throttled1} from "../utils/throttled1";
import geoTransUtil1 from "../utils/geoTransUtil";

export class RegionChooseLayer {
    constructor(map,mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.is_start = false;

        this.is_down = false;

        this.polygon = null;

        this.start_pos = [];
        this.end_pos = [];
        this.options  = null;
        const onMousedown = (e) => {
            if(!this.is_start){
                return;
            }
            let originEvent = e.originEvent || window.event;
            if(originEvent.button == 2){
                this.is_down = true;
                this.start_pos = [e.lnglat.lng,e.lnglat.lat];
            }
        }
        const onMousemove = throttled1((e) => {
            if(this.is_down){
                let box = this.map.getContainer().getBoundingClientRect();
                let lngLat = this.map.containerToLngLat([e.pageX-box.x, e.pageY - box.y]);
                this.end_pos = [lngLat.lng,lngLat.lat];
                this.renderPolygon();
            }
        },50)
        const onMouseup = (e) => {
            if(this.is_down){
                e.preventDefault();
                if(this.options && this.options.onEnd){
                    let startPos = this.start_pos;
                    let endPos = this.end_pos;
                    if(this.mapManager.is_three_3d){
                        startPos = geoTransUtil1.wgs84togcj02(startPos[0],startPos[1]);
                        endPos = geoTransUtil1.wgs84togcj02(endPos[0],endPos[1]);
                    }else{
                        startPos = this.mapManager.lngLatToGaoDe(startPos);
                        endPos = this.mapManager.lngLatToGaoDe(endPos);
                    }

                    this.options.onEnd(startPos,endPos);
                }
            }
            this.is_down = false;
        }


        this.map.on('mousedown',onMousedown);
        document.addEventListener('mousemove',onMousemove);
        document.addEventListener('mouseup',onMouseup);
    }

    /**
     * 判断点是否在选区
     * @param startPos []
     * @param endPos []
     * @param point []
     */
    inRegion(startPos,endPos,point){
        if(point[0] > startPos[0] && point[0] < endPos[0]){
            if(point[1] < startPos[1] && point[1] > endPos[1]){
                return true;
            }
        }
        return false;
    }

    /**
     * 开始框选
     * @param options
     */
    startRegion(options={
        renderOption:{
            fillColor: '#41b039',
            strokeOpacity: 1,
            fillOpacity: 0.3,
            strokeColor: '#41b039',
            strokeWeight: 1,
        },
        onEnd(startPos,endPos){
            console.log(startPos,endPos);
        }
    }){
        this.options = options;
        this.map.setStatus({
            rotateEnable: false,
            pitchEnable: false,
        });
        this.map.setPitch(0, false, 50);
        this.map.setRotation(0, false, 50);
        this.is_start = true;
    }
    clear(){
        if(this.polygon){
            this.polygon.setMap(null);
            this.polygon = null;
        }
    }
    stopRegion(){
        this.clear();
        this.is_start = false;
        this.is_down = false;
    }
    renderPolygon(){
        let path = [this.start_pos,[this.start_pos[0],this.end_pos[1]],this.end_pos,[this.end_pos[0],this.start_pos[1]]];
        if(this.polygon){
            this.polygon.setPath(path);
            return;
        }
        let defaultOption = {
            fillColor: '#41b039',
            strokeOpacity: 1,
            fillOpacity: 0.3,
            strokeColor: '#41b039',
            strokeWeight: 1,
            // strokeStyle: 'dashed',
            // strokeDasharray: [5, 5],
        }
        let options = defaultOption;
        if(this.mapManager.is_three_3d){
            let polygon = new this.mapManager.Xb3DMap.Polygon({
                path: path,
                ...{...defaultOption,...this.options.renderOption},
            });
            polygon.setMap(this.map);
            this.polygon = polygon;
        }else{
            let polygon = new AMap.Polygon({
                path: path,
                ...{...defaultOption,...this.options.renderOption},
            });
            polygon.setMap(this.map);
            this.polygon = polygon;
        }
    }

}
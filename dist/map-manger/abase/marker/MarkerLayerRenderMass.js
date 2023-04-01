import {MarkerViewMass} from "./MarkerViewMass";
import {MarkerData} from "./MarkerData";
import {MapManager} from "../MapManager";
import {throttled1} from "../utils/throttled1";
import geoTransUtil1 from "../utils/geoTransUtil";



export class MarkerLayerRenderMass{
    constructor(map,mapManager) {
        this.map = map;
        this.mapManager = mapManager;

        this.mapMarkerViewMass = {

        };

        let massMarksClass = this.mapManager.getCustomRenderMassMarks();
        if(this.mapManager.is_three_3d || massMarksClass){
            this.initMass3d(massMarksClass);
        }else{
            this.labelsLayer = new AMap.LabelsLayer({
                zooms: [3, 25],
                collision: false,
                // 设置 allowCollision：true，可以让标注避让用户的标注
                allowCollision:false,
            });
            this.map.add(this.labelsLayer);
        }

        this.data_objs_map = {};
        this.data_index_map = {};


        this.event_trigger_data = {
            is_mouse_enter:false,
            mouse_enter_marker_data:null,
            click_marker_data:null,
            cur_click_data_time:0,
            cur_click_data_index:-1,
        }
        /*this.massMarksObj = new AMap.MassMarks({
            zIndex: 5, 	// 海量点图层叠加的顺序
            zooms: [3, 19],	 // 在指定地图缩放级别范围内展示海量点图层
            opacity:1,
            alwaysRender:false,
            style: [

            ], 	//多种样式对象的数组
        });

        const getStyleObj = (e) => {
            let data = e.data;
            if(data instanceof MarkerData){
                let styleObj = this.mapMarkerViewMass[data.getMassViewGroup()];
                if(styleObj instanceof MarkerViewMass){
                    return [styleObj,data];
                }
            }
            return [null,null];
        }
        this.massMarksObj.on('click',()=>{

        })
        this.massMarksObj.on('mouseover',(e)=>{

            const [styleObj,data] = getStyleObj(e);
            if(styleObj instanceof MarkerViewMass && data instanceof MarkerData){
                let hover_marker = styleObj.onMouseover({data:data.data});
                this.mouseover(hover_marker);
            }

        })
        this.massMarksObj.on('mouseout',(e)=>{
            const [styleObj,data]  = getStyleObj(e);
            if(styleObj instanceof MarkerViewMass && data instanceof MarkerData){
                this.mouseout();
                styleObj.onMouseout({data:data.data});

            }
        })*/
    }
    initMass3d(massMarksClass){
        if(massMarksClass){
            this.mass3d = new massMarksClass(this.map);
        }else{
            this.mass3d = new this.mapManager.Xb3DMap.MassMarks([], {
                style:[],
            })
        }

        const onClick = throttled1((curData)=>{
            if(curData instanceof MarkerData){
                if(this.event_trigger_data.click_marker_data &&
                    this.event_trigger_data.click_marker_data.data_index === this.event_trigger_data.cur_click_data_index){
                    if(new Date().getTime() - 500 < this.event_trigger_data.cur_click_data_time){
                        return;
                    }
                }
                this.mapManager.markerHoverLayer.remove();

                this.event_trigger_data.cur_click_data_time = new Date().getTime();
                this.event_trigger_data.cur_click_data_index = curData.data_index;

                this.event_trigger_data.click_marker_data = curData;
                const {styles,style_map_index,markerViewMassIndex} = this.getStyleMapIndex();
                let markerViewMass = markerViewMassIndex[curData.getMassViewGroup()];
                if(markerViewMass instanceof MarkerViewMass) {
                    let style = this.getMarkerViewMassStyle(markerViewMass);
                    this.triggerItem(markerViewMass,{markerData:curData},'click',style);
                }
            }
        },300);

        this.mass3d.on('click',(curData)=>{
            onClick(curData);
        });
        const onMousemove = throttled1((e) => {
            this.map.getContainer().style.cursor = 'pointer';
            console.log('mouseenter markder 3d');
            this.event_trigger_data.is_mouse_enter = true;
            let curData = e.data;
            this.event_trigger_data.mouse_enter_marker_data = curData;
            if(curData instanceof MarkerData){
                const {styles,style_map_index,markerViewMassIndex} = this.getStyleMapIndex();
                let markerViewMass = markerViewMassIndex[curData.getMassViewGroup()];
                if(markerViewMass instanceof MarkerViewMass) {
                    let style = this.getMarkerViewMassStyle(markerViewMass);
                    this.triggerItem(markerViewMass,{markerData:curData},'mouseover',style)
                }
            }

        },100);
        this.mass3d.on('mousemove',(e)=>{
            onMousemove(e);
        });
        const onMouseout = throttled1((e) => {
            if(this.event_trigger_data.is_mouse_enter){
                this.map.getContainer().style.cursor = 'auto';
                console.log('mouseout markder 3d');
                //out
                let curData = this.event_trigger_data.mouse_enter_marker_data;
                if(curData instanceof MarkerData){
                    const {styles,style_map_index,markerViewMassIndex} = this.getStyleMapIndex();
                    let markerViewMass = markerViewMassIndex[curData.getMassViewGroup()];
                    if(markerViewMass instanceof MarkerViewMass) {
                        let style = this.getMarkerViewMassStyle(markerViewMass);
                        this.triggerItem(markerViewMass,{markerData:curData},'mouseout',style);
                    }
                }

                this.event_trigger_data.is_mouse_enter = false;
                this.event_trigger_data.mouse_enter_marker_data = null;
            }
        },100);
        document.addEventListener('mousemove',(e)=>{
            onMouseout(e);
        })
    }
    setMapMarkerViewMass(mapMarkerViewMass){
        this.mapMarkerViewMass = {...this.mapMarkerViewMass,...mapMarkerViewMass};

    }

    remove(){
/*        this.massMarksObj.setMap(null);
        this.massMarksObj.setData([]);*/

        this.event_trigger_data.is_mouse_enter = false;
        this.event_trigger_data.mouse_enter_marker_data = null;
        this.data_objs_map = {};
        this.data_index_map = {};
        if(this.mass3d){
            this.mass3d.clear();
        }
        if(this.labelsLayer){
            this.labelsLayer.clear();
        }
    }
    triggerMarker(key,type='click',trigger_options){
        let ok = false;
        for(let data_key in this.data_objs_map){
            let item = this.data_objs_map[data_key];
            if(item.data.lng <= 0 || item.data.lat  <= 0 ){
                continue ;
            }
            if(key == item.data.key){
                ok  = true;
                ok = this.triggerMarkerItem(type,item,trigger_options)
            }

        }
        return ok;
    }

    triggerMarkerDataIndex(data_index,type='click',trigger_options){
        let ok = false;
        for(let key in this.data_index_map){
            let item = this.data_index_map[key];
            if(item.data.lng <= 0 || item.data.lat  <= 0 ){
                continue ;
            }
            if(data_index == item.data_index){
                ok  = true;
                this.triggerMarkerItem(type,item,trigger_options)
            }
        }
        return ok;
    }
    triggerMarkerItem(type,item,trigger_options){

        if (item instanceof MarkerData) {
            let markerViewMass = this.mapMarkerViewMass[item.getMassViewGroup()];
            let style = this.getMarkerViewMassStyle(markerViewMass);
            this.triggerItem(markerViewMass, {markerData: item}, type, style,trigger_options);

        }
    }
    triggerItem(markerViewMass,{markerData},type,originalMarkerOption,trigger_options = null){
        if(markerViewMass instanceof MarkerViewMass){
            if(type == 'click'){
                if((!trigger_options || !trigger_options.is_near) && this.mapManager.nearMarkerLayer.countNearMarker(markerData.data)){
                    return;
                }
                this.mapManager.nearMarkerLayer.clear();
                let infoWindow = markerViewMass.onClick({data:markerData.data});
                if(this.mapManager instanceof MapManager) {
                    this.mapManager.click(infoWindow);
                }
            }
            if(type == 'mouseout'){
                if (this.mapManager instanceof MapManager) {
                    this.mapManager.mouseout(markerData);
                }

                markerViewMass.onMouseout({ data:markerData.data});

            }
            if(type == 'mouseover'){
                let hover_marker = markerViewMass.onMouseover({data:markerData.data});
                if (this.mapManager instanceof MapManager) {
                    this.mapManager.mouseover(hover_marker,markerData.data_index,originalMarkerOption);
                }
            }
        }

    }
    getMarkerViewMassStyle(markerViewMass){
        let cur_style = {};
        let zoom = this.map.getZoom();
        if(markerViewMass instanceof MarkerViewMass){
            markerViewMass.getFinalStyleConf().forEach(style =>{
                if(style.minZoom <= zoom && zoom < style.maxZoom) {
                    cur_style = style;
                }
            })
        }
        return cur_style;
    }
    render(data_objs){
        this.remove();


        let massMarksClass = this.mapManager.getCustomRenderMassMarks();

        if(this.mapManager.is_three_3d || massMarksClass) {
            this.renderMass3d(data_objs);
            return;
        }

        let markers = [];
        for (let i = 0; i < data_objs.length; i++) {
            let curData = data_objs[i];
            if(curData instanceof MarkerData){
                this.data_objs_map[curData.data.key] = curData;
                this.data_index_map[curData.data_index] = curData;
                if(curData.data.lng <= 0 || curData.data.lat  <= 0 ){
                    continue;
                }
                let markerViewMass = this.mapMarkerViewMass[curData.getMassViewGroup()];

                if(markerViewMass instanceof MarkerViewMass){
                    let style = this.getMarkerViewMassStyle(markerViewMass);
                    let icon = {
                        // 图标类型，现阶段只支持 image 类型
                        type: 'image',
                        // 图片 url
                        image: style.url,
                        // 图片尺寸
                        size: style.size,
                        // 图片相对 position 的锚点，默认为 bottom-center
                        anchor: style.offset,
                    };
                    let labelMarker = new AMap.LabelMarker({
                        position: this.mapManager.lngLatToMap([curData.data.lng, curData.data.lat]),
                        zooms: [style.minZoom,style.maxZoom],
                        opacity: 1,
                        zIndex: 4,
                        icon,
                    });
                    labelMarker.on('mouseover',()=>{
                        this.triggerItem(markerViewMass,{markerData: curData},'mouseover',style);

                    });
                    labelMarker.on('mouseout',()=>{
                        this.triggerItem(markerViewMass,{markerData: curData},'mouseout',style);
                    });
                    labelMarker.on('click',()=>{
                        this.triggerItem(markerViewMass,{markerData: curData},'click',style);
                    });
                    markers.push(labelMarker);
                }


            }

        }
        this.labelsLayer.add(markers)

/*      mass版本
        let key_index = 0;
        let styles = [];
        let style_map_index = {};
        for(let key in this.mapMarkerViewMass){
            let markerViewMass = this.mapMarkerViewMass[key];
            if(markerViewMass instanceof MarkerViewMass){
                markerViewMass.getStyleConf().forEach(style =>{
                    if(style.minZoom <= zoom && zoom < style.maxZoom){
                        style.size = new AMap.Size(style.size[0],style.size[1]),
                        style.anchor = new AMap.Pixel(style.offset[0],style.offset[1]),
                        styles[key_index] = style;
                        style_map_index[key] = key_index;
                    }
                });
            }
            key_index++;
        }
        data_objs.forEach(item =>{
            if(item instanceof MarkerData){
                item.lnglat = [item.data.lng,item.data.lat];
                item.style = style_map_index[item.getMassViewGroup()];
            }
        });

        this.massMarksObj.setStyle(styles);
        this.massMarksObj.setData(data_objs);
        this.massMarksObj.setMap(this.map);*/
    }
    getStyleMapIndex(){
        let key_index = 0;
        let styles = [];
        let style_map_index = {};
        let markerViewMassIndex = {};
        for(let key in this.mapMarkerViewMass){
            let markerViewMass = this.mapMarkerViewMass[key];
            if(markerViewMass instanceof MarkerViewMass){
                styles[key_index] = this.getMarkerViewMassStyle(markerViewMass);
                style_map_index[key] = key_index;
                markerViewMassIndex[key] = markerViewMass;

            }
            key_index++;
        }
        return {
            styles,
            style_map_index,
            markerViewMassIndex
        }
    }
    renderMass3d(data_objs){
        const {styles,style_map_index} = this.getStyleMapIndex();
        data_objs.forEach(item =>{
            if(item instanceof MarkerData){
                this.data_objs_map[item.data.key] = item;
                this.data_index_map[item.data_index] = item;
                item.lnglat = geoTransUtil1.gcj02towgs84(item.data.lng,item.data.lat);
                item.style = style_map_index[item.getMassViewGroup()];
            }
        });
        let styles_new = styles.map(item =>{
            return {
                ...item,
                offset:[item.size[0]/2 - item.offset[0],-item.size[1] + item.offset[1]],
            //    offset:[item.size[0]/2-item.offset[0],item.size[1]/2-item.offset[1]]
            }
        })
        console.log('renderMass3d',data_objs,styles_new);
        this.mass3d.setStyle(styles_new);
        this.mass3d.setData(data_objs);
     //  this.mass3d.setMap(this.map);
    }

}
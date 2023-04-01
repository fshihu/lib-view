<template>
  <div class="map-con" ref="map">

  </div>
</template>

<script>


import {MapManager} from "./abase/MapManager";
import {LayerServer} from "../utils";
import geoTransUtil1 from "./abase/utils/geoTransUtil";



export default {
  name: "cmd-map",
  props: {

    /**
     * 返回 promise => {
     *     mapOptions: Object,
     *     center: [],
     *     layerServer:{
     *       urls:[],
     *       type:1,//
     *     },
     *     zoom: 11,
     *
     * }
     */
    initBefore:Function,
  },

  data(){
    return {
      map_is_ok:false,
      view_mode:'2d',
    }
  },
  async mounted () {
    let map = null;
    let init_options = {
      zoom:12,
      layerServer:{
        urls:[],
        type:LayerServer.type_gaode
      }
    }
    if(this.initBefore){
      let initOptions = await this.initBefore();
      init_options = {...init_options,...initOptions};
    }
    let layerServer = new LayerServer(init_options.layerServer.urls,init_options.layerServer.type);

    let center = undefined;
    if(init_options.center && init_options.center[0]){
      center = layerServer.toMapLayer(init_options.center[0],init_options.center[1])
    }
    map = new AMap.Map(this.$refs.map, {
      zoom: init_options.zoom,//级别
      center: center,//中心点坐标
      viewMode: '3D', // 地图模式
      doubleClickZoom: false,
      rotateEnable: false,
      pitchEnable: false,
      zooms: [2, 21],
      ...init_options.mapOptions,
    });



    layerServer.addLayer(map);

    const mapOk = ()=>{
      const mapManager = new MapManager(map,{});
      mapManager.layerServer = layerServer;
      this.mapManager = mapManager;
      this.map_is_ok = true;
      this.$emit('mapOk', mapManager);
    }
    if(AMap.v && AMap.v.indexOf('1.') >= 0){
      console.log('amap 1.x 依赖 AMap.MassMarks AMap.Geocoder');
      map.on('complete',()=>{
        mapOk();
      })
    }else{
      map.plugin(["AMap.MarkerCluster", "AMap.MarkerCluster", 'AMap.MassMarks', 'AMap.Geocoder', 'AMap.IndexCluster'], () => {
        mapOk();
      });
    }

    const setCenter = map.setCenter;
    map.setCenter = ([lng,lat])=>{
      center = layerServer.toMapLayer(lng,lat);
      setCenter.call(map,center);
    }

    map.on('click', (e) => {
      console.log('zoom', map.getZoom());
      console.log(e);
    });
    /**
     *      {
     *              center: [100.74790698736541, 26.687964987784724],
     *              zoom: 15.297986626793138,
     *              pitch: 27,
     *              rotation: 1.4736842105263232,
     *      }
     * @param options
     */
    map.flyTo = (options)=>{
      if(options){
        if(options.center){
          map.setCenter(options.center);
        }
        if(options.zoom){
          map.setZoom(options.zoom);
        }
        if(options.pitch){
          map.setPitch(options.pitch);
        }
        if(options.rotation){
          map.setRotation(options.rotation);
        }
      }
    }
    this.map = map;
    this.view_mode = '2d';
    this.defaultCenter = init_options.center;
    this.defaultZoom = init_options.zoom;
    this.map_layer_satellite = new AMap.TileLayer.Satellite();
    // 路网
    this.map_layer_road = new AMap.TileLayer.RoadNet();
  },
  beforeDestroy() {
    if(this.map){
      this.map.destroy();
    }
  },
  methods: {
    changeMode({type, value}) {
      if (type == 'view') {
        if (this.view_mode == value) {
          return;
        }
        if (value == '2d') {
          this.map.setPitch(0, false, 200);
          this.map.setRotation(0, false, 200);
          this.map.setStatus({
            rotateEnable: false,
            pitchEnable: false,
          });

          this.map.removeLayer(this.map_layer_satellite)
          this.map.removeLayer(this.map_layer_road);
          this.view_mode = value;
        }
        if (value == '3d') {
          this.map.setPitch(45, false, 200);
          this.map.setStatus({
            rotateEnable: true,
            pitchEnable: true,
          });
          this.map.removeLayer(this.map_layer_satellite)
          this.map.removeLayer(this.map_layer_road);
          this.view_mode = value;
        }

        if (value == 'satellite') {

          this.map.addLayer(this.map_layer_satellite)
          this.map.addLayer(this.map_layer_road);
          this.view_mode = value;
        }
      }
      if (type == 'zoom' && value == 'in') {
        this.map.zoomIn();
      }
      if (type == 'zoom' && value == 'out') {
        this.map.zoomOut();
      }

      if (type == 'reset') {
        this.map.setCenter(this.defaultCenter);
        this.map.setZoom(this.defaultZoom);
      }
      if (type == 'refresh') {
        //
      }
    }
  }
}
</script>

<style scoped lang="less">
.map-con {
  background: #070c22;
  width: 100%;
  height: 100%;
  overflow: hidden;

}

</style>
<style lang="less">
.base_info_window_warp_modal{
  position: absolute;
  left: 0;
  top:0;
  width: 100%;
  height: 100%;
  z-index: 123;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.41);
  transition: all .3s;
  &>*{
    transform: scale(.2);
    opacity: 0;
  }
  &>.in{
    transform: scale(1);
    opacity: 1;
  }
}
.amap-logo, .amap-copyright {
  display: none !important;
}


.amap-marker.point-none {
  pointer-events: none !important;
}
</style>
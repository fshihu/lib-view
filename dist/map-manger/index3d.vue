<template>
  <div class="map-con" ref="map">
    <canvas ref="canvas" class="canvas" />
    <div class="progress" :class="{max:progress_max}">
      <div class="mini">{{progress_val.cur}}/{{progress_val.total}}</div>
      <div class="max">
        <div class="info">
          <div class="label">模型总数：</div>
          <div class="txt">
            {{progress_val.total}}
          </div>
        </div>
        <div class="info">
          <div class="label">已加载总数：</div>
          <div class="txt">
            {{progress_val.cur}}
          </div>
        </div>
      </div>
    </div>
    <div class="map-loading" v-if="show_loading">
      <div class="loading">
        <div class="val">{{progress_val.process}} <span class="bai">%</span></div>
        <div class="tip">加载中....</div>
        </div>
      <img :src="loading_img" class="img" v-if="loading_img" />
      <video muted autoplay="autoplay" loop="loop" :src="loading_mp4" class="video" v-if="loading_mp4" />
    </div>
  </div>
</template>

<script>


import {MapManager} from "./abase/MapManager";
import Xb3DMap from 'three-access';
import geoTransUtil1 from "./abase/utils/geoTransUtil";



export default {
  name: "cmd-map",
  props: {

    /**
     * 返回 promise => {
     *     mapOptions: Object,
     *     center: Array,
     *     loading_img:'',
     *     zoom: {
     *       type: [Number, String],
     *       default: 11
     *     },
     *
     * }
     */
    initBefore:Function,
  },

  data(){
    return {
      map_is_ok:false,
      view_mode:'3d',
      loading_img:'',
      loading_mp4:'',
      show_loading:false,
      progress_max:false,
      progress_val:{
        cur:0,
        total:0,
        process:0,
      },
    }
  },
  async mounted() {
    this.show_loading = true;
    let map = null;
    let init_options = {
      zoom:12,
      mapOptions:{},
      loading_img:'',
    }
    if(this.initBefore){
      let initOptions = await this.initBefore();
      init_options = {...init_options,...initOptions};
    }
    let mapOptions = init_options.mapOptions||{};
    let fullConf = mapOptions.fullConf||{};
    let center = init_options.center;
    if(init_options.loading_img && init_options.loading_img.indexOf('.mp4') >=0){
      this.loading_mp4 = init_options.loading_img;
    }else{
      this.loading_img = init_options.loading_img;
    }
    if(center){
      center = geoTransUtil1.gcj02towgs84(center[0],center[1]);
    }
    map = new Xb3DMap(this.$refs.canvas, {
      workerPath: './worker/worker.bundle.js',
      ...mapOptions,
     ...fullConf,
    });
    if(mapOptions.hasOwnProperty('pitch')){
      map.setPitch(mapOptions.pitch);
    }
    map.getContainer = ()=>{
      return this.$refs.map;
    }

    const mapOk = () => {
      setTimeout(()=>{
        this.show_loading = false;
      },init_options.loading_delay||2000);
      const mapManager = new MapManager(map,{Xb3DMap,is_three_3d:true});
      this.mapManager = mapManager;
      this.map_is_ok = true;
      console.log('map_is_ok');
      this.$emit('mapOk', mapManager);
    }
    map.on('progress', ({total, cur}) => {
      console.log('progress', {total,cur});
      this.progress_val.total = total || 0;
      this.progress_val.cur = cur || 0;
      if(total > 0){
        this.progress_val.process = Math.min(Math.floor(cur / total * 100),100);
      }
      if(total > 0 ){
        if(total == cur){
         mapOk();
        }
      }else{
       mapOk();
      }
    })
    map.on('complete', () => {
      if(!init_options.mapOptions.fullConf){
       mapOk();
      }

    })
    window.mapObj = map;

    const getCenter = map.getCenter;
    const setCenter = map.setCenter;
    const flyTo = map.flyTo;
    map.getCenter = ()=>{
      let center = getCenter();
      center = geoTransUtil1.wgs84togcj02(center.lng,center.lat);
      return {lng:center[0],lat:center[1]};
    }
    map.setCenter = (center)=>{
      center = geoTransUtil1.gcj02towgs84(center[0],center[1]);
      setCenter(center);
    }
    /**
     *   {
     *              center: [100.74790698736541, 26.687964987784724],
     *              zoom: 15.297986626793138,
     *              pitch: 27,
     *              rotation: 1.4736842105263232,
     *      }
     */
    map.flyTo =(options)=>{
        if(options.hasOwnProperty('center')){
          options.center = geoTransUtil1.gcj02towgs84(options.center[0],options.center[1]);
        }else{
          options.center = getCenter();
        }
        flyTo(options);
    }

    const click5 = ((callback) => {
      let num = 0;
      let last_time = 0;
      let interval_time = 300;

      return ()=>{
        let cur_time = new Date().getTime();
        if(cur_time - last_time > interval_time){
          num = 1;
        }else{
          num++;
        }
        if(num == 5){
          callback();
          num = 1;
        }
        last_time = cur_time;
      }
    });
    const click5_trigger = click5(()=>{
      console.log('trigger 5');
    })

    map.on('click', (e) => {
      console.log('zoom', map.getZoom());
      console.log(e);
      click5_trigger();
    });
    this.map = map;
    this.view_mode = '2d';
    this.defaultCenter = center;
    this.defaultZoom = init_options.zoom;
  },
  beforeDestroy() {
    if(this.map){
      // this.map.destroy();
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
  position: relative;
  .map-loading{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top:0;
    .img{
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%,-50%);
    }
    .video{
      position: absolute;
      width: 100%;
      height: 100%;
      left:0;
      top:0;
      object-fit: cover;
    }
    .loading{
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,0);
      color: #fff;
      z-index: 1;
      text-shadow: 0 0 3px #000;
      .val{
        font-size: 34px;
        font-weight: bold;
        text-shadow:3px 3px  #00aaff, 0 0 13px #00aaff;
      }
      .tip{
        font-size: 16px;
        font-weight: bold;
        text-shadow: 0 0 13px #00aaff;
      }
    }
  }
  .canvas{
    width: 100%;
    height: 100%;
  }
}
.progress{
  display: none;
  position: absolute;
  right: 5px;
  bottom: 0;
  user-select: none;
  color: rgba(255, 255, 255, 0.73);
  text-shadow: 0 0 3px #464646;
  .max{
    display: none;
  }
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
  &>*{
    transition: all .3s;
    transform: scale(.2);
    opacity: 0;
  }
  &.in>*{
    transform: scale(1);
    opacity: 1;
  }
}
#css-2d-renderer{
  z-index: 0;
  .base_el_marker_warp{
    z-index: 1 !important;
  }
}
.amap-logo, .amap-copyright {
  display: none !important;
}


.amap-marker.point-none {
  pointer-events: none !important;
}
</style>
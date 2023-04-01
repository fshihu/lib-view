<template>
  <div class="map-normal"  style="height: 100%;min-height: 200px;">
    <div class="input-item xb-map-select-show-val" style="" v-if="address">
      {{address}}
    </div>
    <div class="search_list xb-map-select-search-list">

        <a-input-search v-if="!is_read" placeholder="搜索地点" v-model="search_val" style="width: 200px" @change="searchPosition" />

      <div class="list">
        <div class="item" @click="changeSelect(item)" v-for="item in search_list">
          {{item.name}}
        </div>
      </div>

    </div>
    <div
        ref="container"
        :style="{
              height: '100%',
              minHeight: '400px'
            }"
    ></div>

  </div>


</template>

<script>

import {getLayerServer} from "../../../utils/LayerServer";

let AMap, AMapUI;

export default {
  name: "MapSelect",
  components: {},
  props: {
    lng: { type: [String, Number], default: "" }, //应该根据自动识别地图默认中心
    lat: { type: [String, Number], default: "" },
    addressString: { type: String, default: "" },

    is_read:{
      type:Boolean,
      default:false,
    },
    simple_address:{
      type:Boolean,
      default:false,
    },
    addressShow: { type: String, default: "" },
    mapStyle:String,


  },
  watch: {
    lat: {
      immediate: true,
      handler(val) {
        this.latitude = this.ProcessLatLng(val);
      }
    },
    lng: {
      immediate: true,
      handler(val) {
        this.longitude = this.ProcessLatLng(val);
      }
    },
    addressString: {
      immediate: true,
      handler(val) {
        this.address = val;
      }
    },

  },
  data() {
    return {
      loadingMap: false,
      address: this.addressString,
      latitude: null,
      longitude: null,
      marker: null,
      geocoder: null,
      placeSearch: null,
      search_list:[],
      search_val:'',

    };
  },
  beforeDestroy() {
    this.map && this.map.destroy();
  },
  created() {
    this.latitude = this.ProcessLatLng(this.lat);
    this.longitude = this.ProcessLatLng(this.lng);
  },
  mounted() {
    this.init();
  },
  methods: {
    ProcessLatLng(data) {
      return data && data != 0 ? parseFloat(data) : "";
    },
    async init() {
      this.loadingMap = true;
      await this.initMap();
      this.loadingMap = false;
    },
    locationCheck() {
      this.$emit("choose", {
        address: this.address || "",
        lng: this.longitude || "",
        lat: this.latitude || ""
      });
    },

    async loadMapComp(conf) {
      await asyncLoadScript({
        id: "map-script",
        src:conf&&conf.amap_url
      });
// await Promise.all([mapPromise, autoSearchPromise, mapUiPromise]);
    },
    async initMap() {
      let {conf,layerServer} = await getLayerServer();
      this.layerServer = layerServer;
      if(!window.AMap){
        await this.loadMapComp(conf);
      }


      AMap = AMap || window.AMap;
      AMapUI = AMapUI || window.AMapUI;
      if (this.longitude && this.latitude) {
        this.map = new AMap.Map(this.$refs.container, {
          zoom: 11,
          center: this.getMapLngLat([this.longitude, this.latitude]),
        });
      } else {
        this.map = new AMap.Map(this.$refs.container, {
          center:conf.center?conf.center:undefined,
          zoom: 11
        });

      }
      if(this.mapStyle){
        this.map.setMapStyle(this.mapStyle);
      }
      if(this.layerServer){
        this.layerServer.addLayer(this.map);
      }
      this.bindMapEvents();
    },
    getMapLngLat(lnglat){
      if(this.layerServer){
        return this.layerServer.toMapLayer(lnglat[0],lnglat[1]);
      }
      return lnglat;
    },
    getGaodeLngLat(lnglat){
      if(this.layerServer){
        return this.layerServer.toGaode(lnglat[0],lnglat[1]);
      }
      return lnglat;
    },
    bindMapEvents() {
      this.map.on("complete", async () => {

        await this._initGeocoder();
        this.setMarker();

        this.map.on("click", e => {
          if(this.is_read){
            return;
          }
          let lng = e.lnglat.getLng();
          let lat = e.lnglat.getLat();
          [lng,lat] = this.getGaodeLngLat([lng,lat]);
          this.decodeGeoAddress(lng, lat);
        });
      });
    },
    decodeGeoAddress(lng, lat,) {
      let vm = this,
        lnglat = new AMap.LngLat(lng, lat),
        address = "";
      this.longitude = lng;
      this.latitude = lat;
      this.address = address;
      this.locationCheck();
      this.setMarker();
      this.geocoder.getAddress(lnglat, (status, result) => {
        if (status === "complete" && result.regeocode) {
          address = result.regeocode.formattedAddress;
          if (this.simple_address) {
            address = address.replace(result.regeocode.addressComponent.province + result.regeocode.addressComponent.city, '');
          }
          this.address = address;
          this.locationCheck();
        }
      });
    },


    setMarker(map) {
      if (!(this.longitude && this.latitude)) return;
      if(this.marker){
        this.marker.setMap(null);
      }
      this.marker = new AMap.Marker({
        position: this.getMapLngLat([this.longitude, this.latitude]),
        icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAhCAYAAAA74pBqAAACmElEQVR42qWUXUiTcRTG35Kiy+imCJISp+9mLmcrTae1/Nz0Iug2qCgMKyRik4r8zpzfm5predFlXdZNEfkJIVRQkkQRTfuSlLXMOTc1t9N5IAY25/a+Xfz4c855nh8MtglEFIaxxbuTMTPDzBSz9PcdwR73tXqrBkOzZxPTwPiMtiUqsQeo1EFU2sfwixl73JFDfk1ZsWVuKzNgsPqp5A6RsS8yuCPH+UFm2ypZUdNsHNNfbPOTEaIYQZ57o8zmkKyw0V1b1L5ABgdJBj30CbKCG67tjK/QvkKFjqBk0EMfHiGvfsaU3zZPBbeDskGfPWbhaN33wbwuP+XZA7JBHx5BX/NtRt+zTPreFdmgz55p4XDVl8CR3t/0v8Aj5F6fnM/tWaLcW8uyQZ89HiHnmvO1rtNLOl7IBX32jAnZVz/Ysi0uOtS9KBv02dMtZFW+z8yqmqSMLr9s0IdHwDc30/x2OLNxmg7afJJBD/3QzynDNJ7MLGo7PKS1LsQM8uihH5KBA5fH6rQ1nyjd6o0Z5NEL+wvSXnq1hZnQ3JyhfZ3zUUEOefTCZCC94uUxzZV3lNrhiQpyyEf8pwWai8/71bWfKaV9LiK4c24A+XVlaRdG1UxA1faLIoE7clFlQF3+7F5KlZPE1tkwsMcduZhkqedGVExQ0fqT/gV73GOWgb1lQw+SqycoscUdAjP2uEuSqc4O5IsVLyih2R0CM/aSZcozTzcwzoSGKdpj+UF4MWMvWQbE00+qE01vKN7iIrw812AvS5Z86rGoKBuiXU0uwotZtgwknXz0Mb7+K+HFLFmWIsRtZHYwYtLxu/d3m8cJL2bscZciQ2k/EHXmcsWJh14xp/I8ZoC7FJkSpXVQyvqYTBoEeKN9zD/ozGaYK5XXKgAAAABJRU5ErkJggg==',
        title: this.address,
        map:this.map,
      });
      this.map.setCenter(this.getMapLngLat([this.longitude,this.latitude]))
      this.map.setZoom(17)

    },
    _initGeocoder() {
      return new Promise(resolve => {
        AMap.plugin("AMap.Geocoder", () => {
          this.geocoder = new AMap.Geocoder();
          resolve();
        });
      });
    },
    searchPosition(){
      console.log('xxxxxxxx');
      AMap.plugin('AMap.PlaceSearch',  () =>{
        var placeSearch = new AMap.PlaceSearch()

        console.log(this.search_val);
        placeSearch.search(this.search_val,  (status, result) => {
          if(result.info == 'OK'){
            this.search_list = result.poiList?.pois || result.pois || [];
          }
        })
      })
    },

    changeSelect(item){
      this.address = item.name;
      this.longitude = item.location.lng;
      this.latitude = item.location.lat;
      this.setMarker();
      this.locationCheck();
    }
  },

};

function asyncLoadScript({ id, src, type = "async" }) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) return resolve();
    let script = document.createElement("script");
    if (["async", "defer"].indexOf(type) !== -1) script[type] = type;
    script.id = id;
    script.src = src;
    script.onload = () => setTimeout(() => resolve({ ok: true }), 50);
    script.onerror = () => reject({ ok: false });
    document.getElementsByTagName("head")[0].appendChild(script);
  }).catch(err => {
    console.error(err);
  });
}
</script>

<style scoped lang="less">
.map-normal {
  position: relative;
}

.input-item {
  margin: auto;
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 10px;
  width: 400px;
  right: 10px;
  text-align: center;
  background: #fff;
  box-shadow: 0 0 5px #bbb;
  border-radius: 5px;
  padding: 5px;
  max-width: 80%;
}
.search_list{
  position: absolute;
  left:10px;
  top:10px;
  z-index: 1;
  .list{
    background: #fff;
    .item{
      border-bottom: 1px solid #f1f1f1;
      line-height: 30px;
      padding: 0 10px;
      cursor: pointer;
      &:hover{
        background: #f6f6f6;
      }
    }
  }
}

</style>
<style>
.amap-logo,.amap-copyright{
  display: none !important;
}
</style>

<template>
  <div
    class="case-circle-marker"
    :class="[theme]"
    @click="showTooltip"
  >
    <div
      class="case-circle-bottom"
      :style="{
        transform: 'rotateX(' + pitch + 'deg)',
        display: gripperEventMoveX < 100 ? 'none' : 'block'
      }"
    >
      <div class="case-circle-bottom-2"></div>
    </div>
    <div
      class="case-circle-max"
      :style="circleStyle"
      style=""
      draggable="false"
      style="-webkit-user-select:none"
    >
      <div class="case-circle-max-scale anima-scale-1s">
        <div class="case-circle-max-bd anima-rotate-5s"></div>
        <div class="case-circle-max-bg"></div>
        <div class="case-circle-max-num">
          <span class="case-circle-max-num-bd"></span>
          <span class="case-circle-max-num-txt"
            >半径:{{ dis.toFixed(0) }}米</span
          >
          <span class="case-circle-max-num-bd"></span>
        </div>
        <div class="case-circle-max-ring animate-scaleHide-1s"></div>
        <div
          class="case-circle-max-gripper"
          @mousedown.stop="showGripper($event)"
        ></div>
      </div>
    </div>
    <div class="case-circle" :class="translate">
      <div class="case-circle-icon"></div>
    </div>

  </div>
</template>

<script>
import turf from 'turf'
export default {
  name: "circleChoose",
  props: {
    center:null,
    mapObj:null,
    disDefault: {
      default:300,
    },
    minDis: {
      default:150,
    },
    theme:{//blue
      type:String,
      default:'',
    },
    onEnd:Function,
  },
  data: function() {
    return {
      dis:this.disDefault*1,
      lineList: [],
      disTemp: 600,
      startX: 0,
      endX: 0,
      gripper: false,
      px:0,
      pitch:0,
    };
  },
  watch: {
    gripperEventMoveX(newval, oldval) {
      if (newval != null && this.gripper) {
        // move this
        let _distance = this.pxToDistance(this.gripperEventMoveX);
        let dis = this.disTemp + _distance;
        this.dis = dis < this.minDis ? this.minDis : dis;
        // console.log('move this')
        // this.$emit("getDis", this.dis);
      } else if (newval == null && this.gripper) {
        // move end
        this.gripper = false;
        this.disTemp = this.dis;
      }
    }
  },
  computed: {
    circleStyle() {
      return {
        transform: "rotateX(" + this.pitch + "deg)",
        width: this.radius * 2 + "px",
        height: this.radius * 2 + "px",
        left: (1 - this.radius * 2) / 2 + "px",
        bottom: (1 - this.radius * 2) / 2  + "px",
        display: this.adjacenLoading ? "none" : "block"
      };
    },
    translate() {
      return this.adjacenLoading ? "animate-translate-1s" : "";
    },
    adjacenLoading() {
      return false;
    },
    gripperEventMoveX(event) {
      return this.endX - this.startX;
    },
    room: function() {
      return this.mapObj.getZoom();
    },
    radius() {
      return this.dis / this.px;
    }
  },
  mounted() {
    this.getPx();
    if(this.onEnd){
      this.onEnd(this.dis.toFixed(0));
    }
    this.mapObj.on('zoomchange',()=>{
      this.getPx()
    });
    this.mapObj.on('zoom',()=>{
      this.getPx()
    });
    this.mapObj.on('pitch',()=>{
      this.pitch = this.mapObj.getPitch();
    });
    this.mapObj.on('pitchchange',()=>{
      this.pitch = this.mapObj.getPitch();
    });
    this.mousemoveFuncBind = this.mousemoveFunc.bind(this);
    this.mouseupFuncBind = this.mouseupFunc.bind(this);

  },
  beforeDestroy() {
    this.mouseupFunc();
  },
  methods: {
    documentEvent() {


      document.addEventListener("mousemove", this.mousemoveFuncBind);
      document.addEventListener("mouseup", this.mouseupFuncBind);
      document.addEventListener("mouseleave", this.mouseupFuncBind);
    },
    mousemoveFunc(e) {

      this.endX = e.pageX;
    },
    mouseupFunc() {
      this.disTemp = this.dis;
      this.gripper = false;
      document.removeEventListener("mousemove", this.mousemoveFuncBind);
      document.removeEventListener("mouseup", this.mouseupFuncBind);
      if(this.onEnd){
        this.onEnd(this.dis.toFixed(0));
      }
    },
    changeDis(dis){
      this.dis = dis;
      this.disTemp = dis;
    },
    pxToDistance(px) {
      return this.getPx() * px;
    },
    // 每像素对应多少米
    getPx() {
      let width = this.mapObj.getContainer().clientWidth;
      let height = this.mapObj.getContainer().clientHeight;

      let _from_lnglat, _to_lnglat;
      _from_lnglat = this.mapObj.containerToLngLat([0, height/2]);
      _to_lnglat = this.mapObj.containerToLngLat([width, height/2]);

      let _from = turf.point([_from_lnglat.lng, _from_lnglat.lat]);
      let _to = turf.point([_to_lnglat.lng, _to_lnglat.lat]);
      let options = "kilometers";
      let _distance = turf.distance(_from, _to, options);
      let px = (_distance * 1000) / width;
      this.px = px;
      return this.px;
    },
    showGripper(event) {
      this.gripper = true;
      this.startX = event.pageX;
      this.endX = event.pageX;
      this.documentEvent();
    },
    showTooltip() {},

  }
};
</script>

<style scoped lang="less">
.case-circle-marker {

}
.case-circle-marker.blue{
  .case-circle-icon{
    background-image: url("./assets/blue/icon_create_task.png");
  }
  .case-circle-bottom-2{
    background-image: url("./assets/blue/icon_task_focus.png");
  }
  .case-circle-max-bd{
    background-image: url("./assets/blue/selected_area_outline.png");
  }
  .case-circle-max-bg{
    background-image: url("./assets/blue/selected_area_fill.png");
  }
  .case-circle-max-gripper{
    background-image: url("./assets/blue/icon_drag.png");
  }
}
.case-circle {
  position: relative;
  width:0px;
  z-index: 2;
  height: 0px;
}
.case-circle-icon{
  position: absolute;left: -36px;top: -68px;
  width: 73px;
  height: 79px;
  background: url("./assets/icon_create_task.png") ;
}
.case-circle-bottom {
  width: 86px;
  height: 86px;
  position: absolute;
  border: 1px dotted rgba(255, 168, 0, 1);
  border-radius: 50%;
  left: -44px;
  bottom: -38px;
}
.case-circle-bottom-2 {
  width: 70px;
  height: 70px;
  position: absolute;
  left: 8px;
  top: 8px;
  background: url("./assets/icon_task_focus.png") no-repeat center center /
    cover;
}
.case-circle-max {
  position: absolute;
  width: 200px;
  height: 200px;
  left: -63px;
  bottom: -84px;
  pointer-events: none;
}
.case-circle-max-scale {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.case-circle-max-bd {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  background: url("./assets/selected_area_outline.png") no-repeat center center /
    cover;
  pointer-events: none;
}
.case-circle-max-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  background: url("./assets/selected_area_fill.png") no-repeat center center /
    cover;
  pointer-events: none;
}
.case-circle-max-num {
  width: 46%;
  left: 50%;
  top: 50%;
  position: absolute;
  text-align: center;
  margin-top: -14px;
  display: flex;
  font-size: 16px;
}
.case-circle-max-num-bd {
  width: calc((100% - 100px) / 2);
  position: relative;
}
.case-circle-max-num-bd:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 50%;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
  left: 0;
  top: 0;
}
.case-circle-max-num-txt {
  background: rgba(0, 0, 0, 0.35);
  padding: 4px 6px;
  min-width: 100px;
  color: #fff;
  word-break: keep-all;
}
.case-circle-max-ring {
  position: absolute;
  width: 96%;
  height: 96%;
  left: 2%;
  top: 2%;
  border: 20px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
}
.case-circle-max-gripper {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 97.5%;
  height: 52px;
  width: 52px;
  margin-top: -26px;
  margin-left: -26px;
  z-index: 99;
  pointer-events: auto;
  cursor: ew-resize;
  background: url("./assets/icon_drag.png") no-repeat;
}

.anima-rotate-5s {
  animation: rotate 10s linear 0s infinite;
}
.anima-scale-1s {
  animation: scale 1s linear 0s 1;
}
.animate-translate-1s {
  animation: translate 1s linear 0s infinite;
}
.animate-scaleHide-1s {
  animation: scaleHide 10s linear 0s infinite;
}

@keyframes scaleHide {
  0% {
    transform: scale(0);
    opacity: 0.4;
  }
  8% {
    transform: scale(0.8);
    opacity: 1;
  }
  10% {
    transform: scale(1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
@keyframes translate {
  0% {
    transform: translateY(0px) scale(1);
  }
  40% {
    transform: translateY(-20px) scale(1.1);
  }
  60% {
    transform: translateY(5px) scale(0.9);
  }
  80% {
    transform: translateY(-10px) scale(1);
  }
  95% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes scale {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

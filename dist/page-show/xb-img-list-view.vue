<template>

  <span ref="img_list">
    <span   class="img_w" :style="{width:width,height:height}" v-for="(item,index) in list">
       <div class="op">
        <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;">
          <a-icon type="eye" @click="view(index)" style="margin-right: 10px;" />
          <a-icon type="delete" @click="del(index)" />
        </div>
      </div>
       <img :src="item.url" ref="img" :data-group="group" class="xb-img-view" />
    </span>
  </span>


</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
let num = 0;
export default {
  name: "xb-img-list-view",
  props:{
    list:{
      type:Array,
      default(){
        return [];
      }
    },
    width:{
      type:String,
      default:'100px',
    },
    height:{
      type:String,
      default:'100px',
    },
    delParams:null,
  },
  data(){
      return {
        group:'img-view-'+num++,
      }
  },
  watch:{
    list:{
      handler(){
        if(this.viewer){
          this.$nextTick(()=>{
            this.viewer.update();
          })
        }
      }
    }
  },
  mounted(){
    if(this.group){
      console.log(this.group);
      console.log(this.$refs.img_list);
      const viewer = new Viewer(this.$refs.img_list, {


      });
      this.viewer = viewer

    }else{
      const viewer = new Viewer(this.$refs.img, {

      });
      this.viewer = viewer

    }
  },
  beforeDestroy() {
    this.viewer.destroy();
  },
  methods:{
    view(index){
      console.log(index);
      this.viewer.view(index);
    },
    del(index){
      this.$emit('del',index,this.delParams);
    }
  }
}
</script>

<style scoped>
img{cursor: pointer;}
.img_w{
  width: 104px;height: 104px;display: inline-flex;margin-right: 12px; vertical-align: middle;background: #FAFAFA;
  position: relative;
  margin-bottom: 12px;
  justify-content: center;
  align-items: center;
}
.img_w .op{
  position: absolute;
  color: #fff;
  left: 0;
  top:0;
  width: 100%;
  height: 100%;
  line-height: 1;
  background: rgba(31, 31, 31, 0.42);
  z-index: 1;
  display: none;
}
.img_w:hover .op{
  display: block;
}
.img_w img{
  max-width: 100%;
  max-height: 100%;
}
</style>
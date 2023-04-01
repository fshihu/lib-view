<template>
  <img :src="src" ref="img" :data-group="group" class="xb-img-view" />

</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

export default {
  name: "xb-img-view",
  props:{
    src:'',

      group:'',
  },
  mounted(){

    if(this.group){
      const viewer = new Viewer(document.body, {
        filter:(image)=> {
          if(image.classList && image.classList.contains('xb-img-view')){
            if(image.getAttribute('data-group') == this.group){
              return true;
            }
          }
          return false;
        }

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
      this.viewer.view(index);
    }
  }
}
</script>

<style scoped>
img{cursor: pointer;}
</style>
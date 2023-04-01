<template>

  <xb-simple-modal ref="modal" title="查看位置" :noBtn="true" :bodyStyle="{padding:0}" width="1052px">
      <div style="height: calc(100vh - 400px);">
        <map-select
            :address-string="choose_data.address"
            :lng="choose_data.lng"
            :is_read="true"
            :lat="choose_data.lat"
        />
      </div>
  </xb-simple-modal>

</template>

<script>
import MapSelect from "./mapSelect/MapSelect";
export default {
  name: "xb-input-map-pop",
  components:{ MapSelect },
  props:{
    /**
     * 对象 {
     *           address:"",
     *         lng:"",
     *         lat:""
     * }
     */
    value:null,

  },
  data() {
    return {
      val: {},
      choose_data: {
        address:"",
        lng:"",
        lat:""
      },

    };
  },
  watch:{
    value:{
      handler(){
        if(this.value){
          this.choose_data = this.value;
        }
      },
      immediate:true,
    }
  },
  methods:{
    /**
     * 打开弹窗
     * @public
     */
    open(){

      this.$refs.modal.open(({ok})=>{
        ok();
      });
    },

  }
}
</script>

<style scoped>
.layout-form-simple-input{
  padding: 0;
}
.layout-form-simple-input:after{
  border: none;
}
.right-icon{
  display: block;
  width: 20px;
}
</style>
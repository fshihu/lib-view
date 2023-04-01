<template>
  <div>

      <div @click.stop="showAddress">
        <a-input v-model="choose_data.address" @change="changeIpt" placeholder="请选择" :read-only="!canEdit">
          <a-icon @click="show" type="environment" slot="addonAfter" style="cursor: pointer;" />
        </a-input>
      </div>

    <xb-simple-modal ref="modal" title="选择位置" :bodyStyle="{padding:0}" width="1052px">
      <div style="height: calc(100vh - 400px);">
      <map-select @choose="choose"
                    :address-string="choose_data.address"
                    :lng="choose_data.lng"
                    :lat="choose_data.lat"
                  :mapStyle="mapStyle"
                    :show_search="true" :simple_address="simple_address"/>
      </div>
    </xb-simple-modal>
  </div>

</template>

<script>
import MapSelect from "./mapSelect/MapSelect";
export default {
  name: "xb-input-map-select",
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
    canEdit:Boolean,
    simple_address:{
      type:Boolean,
      default:true
    },
    mapStyle:String,
  },
  data() {
    return {
      val: {},
      choose_data: {
        address:"",
        lng:"",
        lat:""
      },
      choose_data_temp: {  //暂存地址，如果取消，choose_data需要还原
        address:"",
        lng:"",
        lat:""
      },
      addressShow: false,
    };
  },
  watch:{
    value:{
      handler(){
        if(this.value){
          this.choose_data = this.value;
          this.choose_data_temp = this.value;
        }
      },
      immediate:true,
    }
  },
  methods:{
    showAddress(){
      if(!this.choose_data || !this.choose_data.lng){
        this.show();
        return;
      }
      if(!this.canEdit){
        this.show();
      }
    },
    show(){

      this.$refs.modal.open(({ok})=>{
        this.choose_data = this.choose_data_temp
        ok();
        this.$emit('input',this.choose_data);
        this.$emit('change', this.choose_data);
      });
    },
    cancelChoose(){
    },
    changeIpt(v){
      this.choose_data.address = v.target.value;
      this.$emit('input',this.choose_data);
      this.$emit('change', this.choose_data);
    },
    choose(data){
      this.choose_data_temp = data;
    }
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
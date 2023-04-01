<template>
  <a-drawer
      class="xb-right-modal"
      :title="title"
      placement="right"
      :visible="visible"
      :maskClosable="false" :destroyOnClose="true"
      :bodyStyle="{padding:0}"
      v-bind="$attrs"
      @close="close"

  >
    <div class="content_w">

      <div class="content" >
        <slot v-if="withoutForm"/>
        <a-form-model v-else  ref="form"  :model="form_data" :rules="form_rules" style="height: 100%;">
          <slot v-bind:form_data='form_data' />
        </a-form-model>

      </div>


      <div v-if="!noBtn" style="padding: 16px;text-align: right; height: 56px;background: #FFFFFF;box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09);">
        <a-button @click="close"  style="margin-right: 10px;">
          取消
        </a-button>
        <a-button type="primary" @click="handleSubmit" :loading="btn_loading">
          {{confirmButtonText}}
        </a-button>
      </div>
    </div>
  </a-drawer>

</template>

<script>
export default {
  name: "xb-right-modal",
  props:{
    form_data:{
      type:Object,
      default(){
        return {};
      }
    },
    layout:'',
    form_rules:{
      type:Object,
      default(){
        return {};
      }
    },
    withoutForm:false,//不需要form
    title:{
      type:String,
      default:''
    },
    confirmButtonText:{
      type:String,
      default:'确定',
    },
    noBtn:{
      type:Boolean,
      default:false
    },
    show_btn_loading:false,
    value:false,
  },
  watch:{
    value:{
      immediate:true,
      handler(v){
        this.visible = v
      },
    },
    visible:{
      immediate:true,
      handler(v){
        this.$emit("input",v)
      },
    }
  },
  data(){
    return {
      visible:false,
      btn_loading:false,



    }
  },
  methods:{
    close(){
      this.visible = false;
      this.$emit('close');
    },
    open(resolve){
      this.resolve = resolve;
      this.visible = true;
    },
    clearValidate(){
      this.$refs.form.clearValidate();
    },
    handleSubmit(){
      if(this.resolve){
        if(this.$refs.form){
          this.$refs.form.validate(valid => {
            if (valid) {
              if(this.show_btn_loading){
                this.btn_loading = true;
              }
              this.resolve({
                form_data:this.form_data,
                ok:()=>{
                  this.btn_loading = false;
                  this.visible = false;
                },
                btn_loading_end:()=>{
                  this.btn_loading = false;
                }
              });
            } else {
              return false;
            }
          });
        }else{
          this.resolve({
            form_data:this.form_data,
            ok:()=>{ this.visible = false;  }
          });
        }

      }
    }
  }
}
</script>

<style scoped lang="less">
.content{
  flex: 1;
  overflow: auto;
  padding: 16px  ;
}
.xb-right-modal::v-deep{
  >.ant-drawer-content-wrapper{
    >.ant-drawer-content{
      >.ant-drawer-wrapper-body{
        display: flex;
        flex-direction: column;
        >.ant-drawer-body{
          flex: 1;
          min-height: 1px;
          .content_w{
            height: 100%;
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
}
</style>
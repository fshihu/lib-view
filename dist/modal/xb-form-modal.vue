<template>
  <div>
    <a-modal v-if="!is_right"  v-bind="$attrs" :destroyOnClose="true" :bodyStyle="{padding:0}"
             class="xb-form-modal"
             :visible="showModal" :maskClosable="false" @ok="handleSubmit" @cancel="cancel">
      <template slot="title">
        <span style="font-size: 16px;">{{title}}</span>
      </template>
      <div  v-if="withoutForm" class="form_w" :style="contentBoxStyle">
        <slot />
      </div>
      <a-form-model v-else  class="form_w" :style="contentBoxStyle" ref="form" :model="form_data"  v-bind="formItemLayout" :rules="form_rules"  @submit.native.prevent>
        <slot v-bind:form_data='form_data'></slot>
      </a-form-model>

      <template #footer>
        <div v-if="!noBtn" style="display: flex;justify-content: space-between;align-items: center;"  >
          <div>
            <slot name="leftFooter"/>
          </div>
          <div style="display: flex;">
            <a-button key="back" @click="cancel"  >
              取消
            </a-button>
            <div v-if="$slots.submitButton" style="margin-left: 8px;">
              <slot name="submitButton"  />
            </div>
            <a-button v-else key="submit" type="primary" :loading="btn_loading"   @click="handleSubmit">
              {{$attrs.button_name||confirmButtonText}}
            </a-button>
          </div>
        </div>


      </template>

    </a-modal>
    <a-drawer
        v-else
        class="xb-right-modal"
        :title="title"
        placement="right"
        :visible="showModal"
        :width="$attrs.width||'600px'"
        :maskClosable="false" :destroyOnClose="true"
        :bodyStyle="{padding:0}"
        v-bind="$attrs"
        @close="close"

    >
      <div class="content_w">

        <div class="content" :style="contentBoxStyle">
          <slot v-if="withoutForm"/>
          <a-form-model v-else  ref="form"  :model="form_data" :rules="form_rules" style="height: 100%;">
            <slot v-bind:form_data='form_data' />
          </a-form-model>

        </div>


        <div v-if="!noBtn" style="padding: 16px;display: flex;justify-content: space-between; height: 56px;background: #FFFFFF;box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09);">
          <div>
            <slot name="leftFooter"/>
          </div>
          <div style="display: flex;align-items: center;">
            <a-button @click="close"  style="margin-right: 10px;">
              取消
            </a-button>
            <a-button type="primary" @click="handleSubmit" :loading="btn_loading">
              {{confirmButtonText}}
            </a-button>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>


</template>

<script>

/**
 * 表单弹窗
 */
export default {
  name: "xb-form-modal",
  props:{
    form_data:{
      type:Object,
      default(){
        return {};
      }
    },
    /**
     * @values horizontal
     */
    layout:'',
    form_rules:{
      type:Object,
      default(){
        return {};
      }
    },
    /**
     * 是不是右边弹窗
     */
    is_right:{
      type:Boolean,
      default:false,
    },
    title:'',
    confirmButtonText:{
      type:String,
      default:'确定',
    },
    /**
     * 不需要form标签
     */
    withoutForm: {
      type:Boolean,
      default:false,
    },
    noBtn:{
      type:Boolean,
      default:false
    },
    /**
     * 点击确定是否显示loading，需要在resolve里面调用btn\_loading\_end关闭
     */
    show_btn_loading: {
      type:Boolean,
      default:false,
    },
    /**
     * 内容包裹原始样式
     */
    contentBoxStyle:{
      type:Object,
      default(){
        return {}
      }
    },
    /**
     * 是否全屏弹窗,没有作用，只是提示手机端
     */
    is_full:{
      type:Boolean,
      default:false,
    },
    /**
     * 关闭确认，返回promise
     */
    closeConfirm:Function,
    /**
     * 是否是白色背景,没有作用，只是提示手机端
     */
    isWhite:{
      type:Boolean,
      default:false,
    },
  },
  computed: {
    formItemLayout() {
      const layout= this.layout;
      return layout === 'horizontal'
          ? {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          }
          : {};
    },
  },
  data(){
      return {
        showModal:false,
        btn_loading:false,
      }
  },
  methods:{
    async cancel(){
      if(this.closeConfirm){
        await this.closeConfirm();
      }

      this.showModal = false;
      this.btn_loading = false;

      this.$emit('close');
    },
    close(){
      this.cancel();
    },
    /**
     *

     * <pre>
     *  open(({ok,form\_data,btn\_loading\_end})=>{
     *    form_data//表单数据
     *    btn\_loading\_end();//关闭按钮loading弹窗
     *    ok();//关闭弹窗
     *  })
     *</pre>
     * @param {({ok:Function,form_data:Object,btn_loading_end:Function})=>void} resolve
     * @public
     */
    open(resolve){
      this.showModal = true;
      this.resolve = resolve;

    },
    clearValidate(){
        this.$refs.form.clearValidate();
    },
    handleSubmit(){
      let resolve = this.resolve;
      if(!resolve){
        resolve = ({ok})=>{ ok();};
      }
      if(this.$refs.form){
        this.$refs.form.validate(valid => {
          console.log(valid);
          if (valid) {
            if(this.show_btn_loading){
              this.btn_loading = true;
              setTimeout(()=>{
                this.btn_loading = false;
              },1000);
            }
            resolve({
              form_data:this.form_data,
              ok:()=>{
                this.btn_loading = false;
                this.showModal = false;
              },
              btn_loading_end:()=>{
                this.btn_loading = false;
              }
            });
          } else {
            this.$message.error('请正确填写信息');
            return false;
          }
        });
      }else{
        if(this.show_btn_loading){
          this.btn_loading = true;
          setTimeout(()=>{
            this.btn_loading = false;
          },1000);
        }
        resolve({
          ok:()=>{
            this.btn_loading = false;
            this.showModal = false;
          },
          btn_loading_end:()=>{
            this.btn_loading = false;
          }
        });

      }
    }
  }
}
</script>

<style scoped lang="less">
.form_w{
  max-height: calc(100vh - 350px);padding: 24px; overflow: auto;
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
          >.content_w{
            height: 100%;
            display: flex;
            flex-direction: column;
            >.content{
              flex: 1;
              overflow: auto;
              padding: 16px  ;
            }
          }
        }
      }
    }
  }
}

</style>
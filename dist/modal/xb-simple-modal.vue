<template>
<a-modal :class="['simple-modal',{'no-btn':noBtn}]" v-model="visible" @cancel="close"   @ok="handleOk" :destroyOnClose="true" :maskClosable="false"   v-bind="$attrs">

  <div v-if="!autoHeight" :style="{margin:'-20px',padding: '20px', maxHeight: 'calc(100vh - 350px)', overflow: 'auto',...slotStyle}">
    <slot/>
  </div>
  <slot v-else />

  <template slot="title" v-if="title || $slots.title">
    <div v-if="$slots.title">
      <slot   name="title"/>
    </div>
    <span v-else style="font-size: 16px;color: #262626;">{{title}}</span>
  </template>
  <template slot="footer">
    <template v-if="$slots.footer">
      <slot name="footer"/>
    </template>
    <template v-else>
      <div v-if="noBtn"></div>
      <div style="display: flex;justify-content: space-between;align-items: center;" v-else>
        <div>
          <slot name="leftFooter"/>
        </div>
        <div style="display: flex;">
          <a-button key="back" @click="close"  >
            取消
          </a-button>
          <div v-if="$slots.submitButton" style="margin-left: 8px;">
            <slot name="submitButton"  />
          </div>
          <a-button v-else key="submit" type="primary"   @click="handleOk">
            {{confirmButtonText}}

          </a-button>
        </div>
      </div>

    </template>


  </template>

</a-modal>
</template>

<script>
export default {
  name: "xb-simple-modal",
  props:{
    value:{
      type:Array,
      default(){
        return [];
      }
    },
    title:'',
    confirmButtonText:{
      type:String,
      default:'确定',
    },
    autoHeight:false,
    noBtn:false,
    slotStyle:{
      type:Object,
      default(){
        return {};
      }
    },
    onModalClose:Function,
  },
  data(){
    return {
        visible:false,
    }
  },
  methods:{
    open(resolve){
      this.visible = true;
      this.resolve = resolve;
    },
    close(){
      this.visible = false;
      this.$emit('close');
      if(this.onModalClose){
        this.onModalClose();
      }
    },
    handleOk(){
      if(this.resolve) {
        this.resolve({
          ok:()=>{
            this.visible = false;
          }
        });
      }
    }
  }
}
</script>

<style scoped>
.simple-modal.no-btn::v-deep .ant-modal-footer{
  display: none;
}
</style>
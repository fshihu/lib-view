<template>
  <div :class="['xb-breadcrumb-tabs',{use_value:use_value}]" style="height: 100%;display: flex;flex-direction: column;">
    <a-tabs v-model="cur_val"   @change="changeValue" v-if="($slots.default && !use_value) || list.length">
      <slot/>
      <a-tab-pane :key="tab.id" :tab="tab.name" v-for="tab in list"></a-tab-pane>
    </a-tabs>
    <div class="xb-breadcrumb-tabs-content" style="flex: 1;height: 1px;">
      <slot name="content"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "xb-breadcrumb-tabs",
  props:{
    /**用于上层绑定v-model*/
    value:{
      type:[Number,String],
      default:()=>"1"
    },
    use_value:{//使用value切换， 而不是tab切换，需要传 content slot
      type:Boolean,
      default:false,
    },
    /**
     * 标签列表，[{id:'1',name:'页面1'}]
     */
    list:{
      type:Array,
      default(){
        return [];
      }
    }
  },
  watch:{
    value:{
      immediate:true,
      handler(){
        this.cur_val = this.value;
      },
    }
  },
  data(){
      return {
        cur_val:'',
      }
  },
  methods:{
    changeValue(e){
      this.$emit('input',e)
      this.$emit('change',e)
    },
  }
}
</script>

<style scoped>
::v-deep.xb-breadcrumb-tabs>.ant-tabs{
  height: 100%;
  background: #fff;
}
::v-deep.xb-breadcrumb-tabs.use_value>.ant-tabs{
  height: auto;
  background: #fff;
}
::v-deep.xb-breadcrumb-tabs.use_value>.ant-tabs .ant-tabs-content{
  display: none;
}

::v-deep.xb-breadcrumb-tabs>.ant-tabs .ant-tabs-nav-wrap{
  margin-left: 16px;
}
::v-deep.xb-breadcrumb-tabs>.ant-tabs .ant-tabs-nav .ant-tabs-tab{
  padding: 12px 0;
}
::v-deep.xb-breadcrumb-tabs>.ant-tabs .ant-tabs-bar{
  margin-bottom: 0;
}
::v-deep.xb-breadcrumb-tabs>.ant-tabs .ant-tabs-content{
  height: calc(100% - 44px);
}
::v-deep.xb-breadcrumb-tabs>.ant-tabs .ant-tabs-tabpane-active{
  height: 100%;
}
</style>
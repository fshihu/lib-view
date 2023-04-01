<template>
  <div class="xb-tabs">
    <a-tabs v-if="is_ant_tab" :activeKey="active_key" @change="changeVal">
      <a-tab-pane :key="tab.id" :tab="tab.name" v-for="tab in list"></a-tab-pane>
    </a-tabs>
    <div class="tabs" v-else>
      <div :class="{'tab':true,active:tab.id==cur_active_tab}" @click="changeTab(tab)" v-for="(tab,index) in list">
        {{tab.name}}
      </div>

    </div>

  </div>


</template>

<script>

/**
 * 标签页
 */
export default {
  name: "xb-tabs",
  props:{

    is_ant_tab:{
      type:Boolean,
      default:false
    },
    list:{
      type:Array,
      default(){
        return [];
      }
    },
    active_tab:{
      type:Number,
      default:1,
    }

  },
  watch:{
    active_tab:{
      immediate:true,
      handler(){
        this.cur_active_tab = this.active_tab;
        this.active_key = this.active_tab;
      }
    },
    active_key:{
      handler() {

        this.list.forEach(item =>{
          if(item.id == this.active_key){
            this.$emit('change',item);
          }
        })
      }
    }
  },
  data(){
      return {
        active_key:'',
        cur_active_tab:this.active_tab,
      }
  },
  methods:{
    changeTab(tab){
      this.cur_active_tab = tab.id;
      this.$emit('change',tab);
    },
    changeVal(v){
      this.active_key = v;
    }
  }
}
</script>

<style scoped>
.tabs{
  display: flex;
  margin-bottom: 16px;
}
.tabs .tab{
  color: #262626;
  font-size: 16px;
  margin-right: 32px;
  padding: 0 0 10px 0;
  cursor: pointer;
}
.tabs .tab.active{
  color: #096DD9;
  border-bottom: 2px solid #096DD9;
}
::v-deep.xb-tabs>.ant-tabs{
  height: 100%;
}
::v-deep.xb-tabs.use_value>.ant-tabs{
  height: auto;
}
::v-deep.xb-tabs.use_value>.ant-tabs .ant-tabs-content{
  display: none;
}

::v-deep.xb-tabs>.ant-tabs .ant-tabs-nav-wrap{
  margin-left: 16px;
}
::v-deep.xb-tabs>.ant-tabs .ant-tabs-nav .ant-tabs-tab{
  padding: 12px 0;
}
::v-deep.xb-tabs>.ant-tabs .ant-tabs-bar{
  margin-bottom: 0;
}

</style>
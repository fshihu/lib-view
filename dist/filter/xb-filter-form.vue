<template>
  <div ref="form_w" class="xb-filter-form">
    <a-form-model layout="inline" ref="filterFromData" :model="filterFromData" style="display: flex;justify-content: space-between">
      <div class="xb-filter-form-input-w" style="flex: 1; max-height: 200px; overflow: auto; ">
        <template  v-for="(groupFilterInput,index) in groupFilterInputs">
          <a-input-group class="xb-filter-form-input-group" :size="size" style="display: flex;align-items: center;min-height: 40px;" v-show="index==0||expand">
            <component
                ref="filter_input"
                class="xb-filter-form-input"
                :style="{width:input.width+'px'}"
                :is="'filter-'+input.type"
                :form_data="filterFromData"
                :apiRequest="apiRequestLoc"
                v-bind="input.props"
                :key="input.props.name+index"
                @change="change"
                v-for="(input,index) in groupFilterInput.children"
            ></component>
          </a-input-group>


        </template>

      </div>
      <div class="xb-filter-form-btn-w" style="flex-shrink: 0;">

        <div ref="button_w" style="display: flex;align-items: center;">

        <a-button @click="openMore" v-if="showOpenMore"  style="margin-right: 10px">
          <a-icon :class="[expand?'open':'down']" type="down" />
        </a-button>
        <div style="margin-right: 10px;display:inline-block;">
          <slot name="button" />
        </div>
        <a-button key="reset" style="margin-right: 10px" @click="resetForm">
          重置
        </a-button>
        <a-button type="primary" @click="submitForm">
          搜索
        </a-button>
        </div>

      </div>
    </a-form-model>
  </div>
</template>
<script>

import FilterInput from "./filter-input/filter-input";
import FilterTree from "./filter-input/filter-tree";
import FilterSelect from "./filter-input/filter-select";
import FilterTimeRange from "./filter-input/filter-time-range";
import FilterNumber from './filter-input/filter-number'
export default {
  name: "xb-filter-form",
  components: {FilterTimeRange, FilterSelect, FilterTree, FilterInput,FilterNumber},
  props:{
    /**
     [
      {type:input,props:{}}
     ]
     */
    filterInputs:{
      type:Array,
      default(){
        return []
      },
    },
    /**
     * export const apiRequest = (url,params,{filterFromData,name}) =>
     *     axios.post(url, params);
     */
    apiRequest:Function,
    size:{
      type:String,
      default:'default',
    },
    //是否显示全部
    showAll:Boolean,
  },
  data() {
    return {
      lineNum:5,
      expand:false,
      filterFromData: {
      },
      groupFilterInputs:[],
      showOpenMore:false,
      btn_width:0
    };
  },
  watch:{
    filterInputs:{
      handler(){
        this.setGroupFilterInputs();
      },
      immediate:true
    }
  },
  computed:{
    apiRequestLoc(){
      return this.apiRequest||(this.$api?this.$api.apiRequest:undefined);
    }
  },
  created(){
    (function() {
      var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
          if (running) { return; }
          running = true;
          requestAnimationFrame(function() {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        };
        obj.addEventListener(type, func);
      };

      /* init - you can init any event */
      throttle("resize", "optimizedResize");
    })();

    window.addEventListener('optimizedResize',()=>{
      this.setGroupFilterInputs();
    })
  },
  mounted() {
    setTimeout(()=>{
      this.setGroupFilterInputs();
    },20)
    this.btn_width = this.$refs.button_w.clientWidth;
  },
  methods: {
    clearData(){
      this.filterFromData = {

      }
    },
    setGroupFilterInputs(){
      if(!this.$refs.form_w) {
        return;
      }
      let total_width = this.$refs.form_w.clientWidth - ( this.btn_width + 50);
      let cur_width = 0;
      this.groupFilterInputs = [];
      let children = [];
      let width_types = {
        'input':200,
        'select':302,
        'tree':302,
        'time-range':342,
      }
      this.filterInputs.forEach((input,index) =>{
        let cur_type_width = width_types[input.type];
        if(input.width){
          cur_type_width = input.width;
        }else{
          input.width = cur_type_width;
        }
        if(cur_width + cur_type_width > total_width && !this.showAll){
          this.groupFilterInputs.push({
            children
          });
          cur_width = 0;
          children = [];
        }
        children.push(input);
        cur_width += cur_type_width;
        if(index == this.filterInputs.length-1) {
          this.groupFilterInputs.push({
            children
          })
        }
      });
      if(this.groupFilterInputs.length>1){
        this.showOpenMore = true;
      }else{
        this.showOpenMore = false;
      }
    },
    openMore(){
      this.expand = !this.expand;
    },
    submitForm() {
      this.$refs.filterFromData.validate(valid => {
        if (valid) {
          this.$emit('search',{_is_search:true,...this.filterFromData})
        } else {
          return false;
        }
      });
    },
    /**
     * 重置表单
     * @public
     */
    resetForm() {
      this.filterFromData = {

      }
      this.$refs.filter_input.forEach((input)=>{
        if(input.reset){
          input.reset();
        }

      })
      this.filterInputs.forEach(filterInput =>{
        if(filterInput.props?.default_value && !filterInput.props?.reset_clear_default_value){
          this.$set(this.filterFromData,filterInput.props.name,filterInput.props.default_value);
        }
      });
      this.$emit('search',{_is_reset:true,...this.filterFromData});
      this.$emit('reset');
    },
    change(name){
      this.filterInputs.forEach(filterInput =>{
        let props = filterInput.props || {};
        let depend_names = props.depend_names || [];
        if(depend_names.indexOf(name) >= 0){
          this.$set(this.filterFromData,props.name,undefined);
          this.$set(props,'is_reload', {load:true});
        }
      })
      /**
       * 选项变了
       * @property {object} filterFromData
       * @property {string} name
       */
      this.$emit('change',this.filterFromData,name);
    }
  },
};
</script>
<style scoped>
  .down{
    transition: all 0.3s;
  }
  .open{
    transform:rotate(180deg);
    transition: all 0.3s;
  }

</style>
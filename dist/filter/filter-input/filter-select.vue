<template>
  <a-form-model-item>
    <div class="ant-input" @click="clickItem">
      <span class="label" :title="label">{{label}}：</span>
      <xb-input-select
          v-if="isSingleSelect"
          @change="change"
          :list="loc_list"
          ipt_type="select"
          class="input_val"
          style="flex:1; "
          v-model="form_data[name]"
            v-bind="$attrs"  :placeholder="$attrs.placeholder||'请选择'"
      />
      <xb-input-multi-select
          v-else
          @changeValue="changeMulti"
          :list="loc_list"
          ipt_type="select"
          class="input_val"
          :maxTagCount="2"
          style="flex:1; "
          :allowClear="true"
          :value="sel_val"
            v-bind="$attrs"  :placeholder="$attrs.placeholder||'请选择'"
      >
        <div slot="maxTagPlaceholder" >
          <a-popover  >
            <template slot="content">
              {{sel_label.join(',')}}
            </template>
            <a-icon type="more" />
          </a-popover>
        </div>

      </xb-input-multi-select>
    </div>

  </a-form-model-item>


</template>

<script>
import XbInputSelect from "../../input/xb-input-select";
export default {
  name: "filter-select",
  components: {XbInputSelect},
  props:{
    form_data:null,
    size:null,
    name:'',
    label:'',
    show_all:{
      type:Boolean,
      default:true,
    },
    /**
     * 依赖项，依赖修改了当前字段会置空，[name1,name2]
     */
    depend_names:Array,
    default_value:null,
    url:null, // string , /basic/user/index
    apiRequest:Function,
    params:null,//{}, url 对应的参数
    api:null, //function
    /**
     * 异步数据不缓存
     */
    no_cache:false,
    /**
     * 是否重新加载,异步数据 {load:true}
     */
    is_reload:Object,
    /***
     *是否单选
     */
    isSingleSelect:{
      type:Boolean,
      default:true,
    },
    list:{
      type:Array,
      default(){
        return [];
      }
    },
  },

  data(){

    return {
      isLoading:false,
      loc_list:[
          ...this.getAllItem(),...(this.list||[])
      ],
      sel_val:[]
    }
  },
  watch:{
    list:{
      handler(){

        this.loc_list = [
            ...this.getAllItem(),...(this.list||[])
        ];
      }
    },
    is_reload:{
      handler(){
        this.isLoading = false;
        if(this.is_reload){
          this.loc_list = []
        }
      }
    },
    default_value:{
      immediate:true,
      handler(){
        this.setDefaultVal();
      }
    }
  },
  computed:{
    sel_label(){
      return this.loc_list.filter(item => this.sel_val.includes(item.id)).map(item => item.name);
    },
  },
  methods:{

    getAllItem(){
      let all = [];
      if(this.show_all && this.isSingleSelect){
        all = [{id:'',name:'全部'}];
      }
      return all;
    },
    change(){
      this.$emit('change',this.name);
    },
    changeMulti(v){
      this.$set(this.form_data,this.name,v.join(','));
      this.sel_val = v;
      this.$emit('change',this.name);
    },
    setDefaultVal(){
      if(!this.isSingleSelect){
        let default_val = [];
        if(Array.isArray(this.default_value)){
          default_val = this.default_value;
        }else if(this.default_value !== null && this.default_value !== undefined&& this.default_value !== ''){
          default_val = [this.default_value];
        }
        this.sel_val = default_val;
        this.$set(this.form_data,this.name,default_val.join(','));
      }else{
        this.$set(this.form_data,this.name,this.default_value);
      }
    },
    reset(){
      this.setDefaultVal();
    },
    clickItem(){
      if(this.api && (!this.isLoading || this.no_cache)){
        this.api().then(res =>{
          if(res.ok){
            this.isLoading = true;
            this.loc_list = [...this.getAllItem(),...res.list];
          }
        });
      }
      if(this.url && (!this.isLoading || this.no_cache)){
        this.apiRequest(this.url,this.params||{},{filterFromData:this.form_data,name:this.name}).then(res =>{
          if(res.ok){
            this.isLoading = true;
            this.loc_list = [...this.getAllItem(),...res.list];
          }
        })
      }
    }
  }

}
</script>

<style scoped lang="less">
.ant-input{
  display: flex;align-items: center;
  width: 300px;
  line-height: 40px;
  .label{
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
  }
}
::v-deep .ant-select-selection{
  border: none;
  background: none;
  box-shadow: none;
}
::v-deep .ant-select-selection__rendered{
  display: flex;
  width: 100%;
  ul{
    display: flex;
    width: 100%;
  }
}
::v-deep .ant-form-item-control-wrapper{
  width: 100%;
  .input_val{
    flex:1;
    overflow: hidden;
    display: flex;
  }
}
::v-deep .ant-select-selection__choice__content{
  min-width: 10px;
}
</style>
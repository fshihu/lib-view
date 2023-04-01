<template>
    <a-form-model-item>
      <div class="ant-input" @click="clickItem">
        <span class="label" :title="label">{{label}}：</span>
        <a-tree-select
            v-bind="$attrs"  :placeholder="$attrs.placeholder||'请选择'"
            style="flex:1;overflow:hidden;"
            v-model="sel_val"
            :key="tree_key"
            :showSearch="true"
            treeNodeFilterProp="title"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :maxTagCount="2"
            :load-data="loadData?onLoadData:undefined"
            @change="change"
            allowClear
            :multiple="multiple"
        >
          <div slot="maxTagPlaceholder" >
            <a-popover  >
              <template slot="content">
                {{sel_label.join(',')}}
              </template>
              ...
            </a-popover>
          </div>

        </a-tree-select>
      </div>

    </a-form-model-item>


</template>

<script>

export default {
  name: "filter-tree",
  props:{
    form_data:null,
    size:null,
    name:'',
    label:'',
    url:null, // string , /basic/user/index
    apiRequest:Function,
    params:null,//{}, url 对应的参数
    api:null, //function
    /**
     * 异步加载 (item)=> resolve([{},{}])
     */
    loadData:Function,
    list:{
      type:Array,
      default(){
        return [];
      }
    },
    no_cache:false,
    multiple:{
      type:Boolean,
      default:()=>true
    },
  },
  data(){
    return {
      isLoading:false,
      treeData:[],
      sel_label:[],
      sel_val:[],
      isLoadData:false,
      tree_key:1,
    }
  },
  watch:{
    list:{
      handler(){
        if(this.list && this.list.length){
          this.treeData = this.list;
        }
      },
      immediate:true
    }
  },

  methods:{
    change(value,label){
      this.sel_label = label;
      this.$set(this.form_data,this.name,Array.isArray(value)?value.join(','):value);
      this.$emit('change',this.name);
    },
    reset(){
      this.sel_val = [];
      this.isLoadData = false;
      this.tree_key++;
    },
    onLoadData(treeNode){
      const item = treeNode.dataRef;
      return new Promise(resolve => {
        this.loadData(item).then(list =>{
          this.isLoadData = true;
          list.forEach(child =>{
            if(!child.hasOwnProperty('value')){
              child.value = child.key;
            }
          })
          if(item){
            this.$set(item,'children',list);
          }else{
            this.treeData = list;
          }
          resolve();
        });

      })
    },
    clickItem(){
      if(this.loadData){ //结束了，组件内部会取
        if(!this.isLoadData){
          this.onLoadData({dataRef:null})
        }
        return
      }
      if(this.api && (!this.isLoading || this.no_cache)){
        let params = {}
        if(this.$attrs.apiStaticParams){
          params = this.$attrs.apiStaticParams
        }
        this.api(params).then(res =>{
          if(res.ok){
            this.isLoading = true;
            this.treeData = res.list;
          }
        });
      }
      if(this.url && (!this.isLoading || this.no_cache)){
        this.apiRequest(this.url,this.params||{},{filterFromData:this.form_data,name:this.name}).then(res =>{
          if(res.ok){
            this.isLoading = true;
            this.treeData = res.list;
          }
        })
      }

    }
  }
}
</script>

<style scoped>
.ant-input{display: flex;align-items: center;
  width: 300px;
  line-height: 40px;}
.ant-input >.label{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
  flex-shrink: 0;
}
::v-deep .ant-select-selection{
  border: none;
  background: none;
  box-shadow: none;
}
::v-deep .ant-select-selection__rendered{
  display: flex;
}
::v-deep .ant-select-selection__choice__content{
  min-width: 10px;
}
</style>
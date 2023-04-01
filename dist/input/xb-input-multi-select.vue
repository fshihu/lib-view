<template>
<div>
  <a-checkbox-group :value="cur_value" v-bind="$attrs"   v-if="ipt_type=='checkbox'||ipt_type=='checkbox_block'">
    <a-checkbox :disabled="item.selectable===false" :value="item[id_field]" v-for="item in list" :style="radioStyle" @change="changeCheckbox"  >
      {{item[name_field]}}
    </a-checkbox>
  </a-checkbox-group>

  <a-select  v-model="cur_value" style="width: 100%;" :mode="mode_type" v-bind="$attrs" v-on="$listeners" @select="changeSelect"
             @deselect="changeDeSelect"
             @change="changeMulti"
             :filter-option="filterOption"
             :placeholder="placeholder"
             v-if="ipt_type=='select'" >
    <template #maxTagPlaceholder v-if="$slots.maxTagPlaceholder">
      <slot name="maxTagPlaceholder" />
    </template>
    <a-select-option :disabled="item.selectable === false" :value="item[id_field]" v-for="item in list"  >
      <span v-if="item.selectable === false" style="color: #969696;">{{item[name_field]}}</span>
      <template v-else>
        {{item[name_field]}}
      </template>
    </a-select-option>
  </a-select>
</div>


</template>

<script>
export default {
  name: "xb-input-multi-select",
  props:{
    value:null,
    /**
     * [{id:'',name:'',selectable:true,}
     */
    list:{
      type:Array,
      default(){
        return [];
      },
    },
    ipt_type:{
      type:String,
      default:'checkbox', // checkbox,checkbox_block,select
    },
    id_field:{
      type:String,
      default:'id',
    },
    name_field:{
      type:String,
      default:'name',
    },
    mode_type:{
      type:String,
      default:'multiple'
    },
    placeholder:{
      type:String,
      default:'请选择'
    }
  },
  data(){
    return {
      cur_value: (this.value)||[],
    }
  },
  watch:{
    value:{
      handler(){
        this.cur_value =  (this.value) || [];
      },
      immediate:true
    }
  },
  computed:{
    radioStyle(){
      if(this.ipt_type == 'checkbox_block'){
        return  {
          display:'block',
          lineHeight:'30px',
          marginLeft:'0px',
        }
      }
      return  {};
    },
  },
  methods:{
    changeCheckbox(e){
      if(e.target.checked){
        this.cur_value.push(e.target.value);
      }else{
        this.cur_value.forEach((v,index)=>{
          if(v == e.target.value){
            this.cur_value.splice(index,1);
          }
        })
      }
       this.change_id = e.target.value;
       this.change(e.target.value);
    },
    changeSelect(value,option){
      this.change_id = option.componentOptions.propsData.value;
    },
    changeDeSelect(value,option){
      this.change_id = option.componentOptions.propsData.value;
    },
    changeMulti(value){
      setTimeout(()=>{
        this.change();
      },0);
    },
    change(){
      let cur_item_list = [];
      let name = [];
      this.list.forEach(item =>{
        if(this.cur_value.includes(item[this.id_field])){
          cur_item_list.push(item);
          name.push(item[this.name_field]);
        }
      });
      this.$emit('input',this.cur_value);
      this.$emit("change")
      /**
       * <strong>推荐使用这个事件，属性统一</strong>
       * 选中的id、item
       * @property {array} cur_value
       * @property {array[item]} cur_item_list
       */
      this.$emit('changeValue',this.cur_value,cur_item_list);

      /**
       * 选择时的事件，这里一般是需要自己处理选择数据，所以不会用v-model
       * @property {array} cur_value
       * @property {array[item]} cur_item_list
       * @property {number} cur_id
       */
      this.$emit('changeSelect',this.cur_value,cur_item_list,this.change_id);
      this.change_id = '';
    },
    filterOption(input,option){
      if(!option.componentOptions.children[0].text){
        return false;
      }
      return  option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ;
    }
  }
}
</script>

<style scoped>

</style>
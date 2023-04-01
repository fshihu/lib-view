<template>
<div>
  <a-radio-group :value="cur_value"   style="width: 100%;" v-bind="$attrs" v-on="$listeners" v-if="ipt_type=='radio'||ipt_type=='radio_block'">
    <a-radio  :disabled="item.selectable === false"
              @click="changeRadio(item)"
              :value="item[id_field]" v-for="item in list" :style="radioStyle" >
      {{item[name_field]}}
    </a-radio>
  </a-radio-group>

  <a-select v-model="cur_value" @change="change"
            showSearch
            :filter-option="filterOption"
            style="width: 100%;" v-bind="$attrs" v-on="$listeners" v-if="ipt_type=='select'" :placeholder="placeholder" >
    <a-select-option  :disabled="item.selectable === false" :value="item[id_field]" :title="item[name_field]" v-for="item in list" >
      {{item[name_field]}}
    </a-select-option>

  </a-select>
</div>


</template>

<script>
export default {
  name: "xb-input-select",
  props:{
    /**
     * value
     * @model
     */
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
    /**
     * array ，单选时，也可以返回数组
     * @values '' array
     */
    out_type:'',
    /***
     *
     * @values  radio,radio_block,select
     */
    ipt_type:{
      type:String,
      default:'radio',
    },
    id_field:{
      type:String,
      default:'id',
    },
    /**
     * 允许取消
     */
    allow_cancel:Boolean,
    /**
     * 不在列表，显示
     */
    not_int_list_label:String,
    name_field:{
      type:String,
      default:'name',
    },
    placeholder:{
      type:String,
      default:'请选择'
    }

  },
  data(){
    return {
      cur_value: '',
    }
  },
  watch:{
    value:{
      handler(){
        this.getSelVal();
      },
      immediate:true,
    },
    list:{
      handler(){
        this.getSelVal();
      },
    }
  },
  computed:{
    radioStyle(){
      if(this.ipt_type == 'radio_block'){
        return  {
          display:'block',
          lineHeight:'30px',
        }
      }
      return  {};
    },
  },
  methods:{
    getSelVal(){
      this.cur_value = Array.isArray(this.value)?(this.value[0]??''): (this.value);
      let find = false;
      this.list.forEach(item =>{
        if(item[this.id_field] == this.cur_value){
          find = true;
        }
      });
      if(!find){
        this.cur_value = this.not_int_list_label;
      }
    },
    changeRadio(item){
      if(this.allow_cancel){
        if(this.cur_value == item[this.id_field]){
          this.cur_value = '';
        }else{
          this.cur_value = item[this.id_field];
        }
      }else{
        this.cur_value = item[this.id_field];
      }
      this.change();
    },
    change(){
      let cur_item = null;
      this.list.forEach(item =>{
        if(item[this.id_field] === this.cur_value){
          cur_item = item;
        }
      });
      if(this.out_type == 'array'){
        /**
         * 选中的id
         * @property {array||number||string} cur_value
         */
        this.$emit('input',[this.cur_value]);
        /**
         * <strong>推荐使用这个事件，属性统一</strong>
         * 选中的id、item
         * @property {array||number||string} cur_value
         * @property {object} cur_item
         */
        this.$emit('changeValue',[this.cur_value],[cur_item]);
      }else{
        this.$emit('input',this.cur_value);;

        this.$emit('changeValue',this.cur_value,cur_item);
      }
    },
    filterOption(input,option){
      return    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ;
    }
  }
}
</script>

<style scoped>

</style>
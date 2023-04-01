<template>
  <a-date-picker
      :format="format"
      :show-time="showTime"
      :valueFormat="valueFormat"
      v-model="value_loc"
      :disabled-date="disabledDate"
      @change="change"
      v-bind="$attrs"
  />
</template>

<script>
import moment from "moment";

export default {
  name: "xb-input-date-time-picker",
  props:{
    /**
     * 显示格式化
     */
    format:{
      type:String,
      default:'YYYY-MM-DD'
    },
    /**
     *  {format:'HH:mm:ss'} ，根据格式化值，显示时间框
     */
    showTime:{
      type:Object,
    },
    /**
     * 默认返回 moment  对象，格式化
     */
    valueFormat:{
      type:String,
    },
    /**
     * value
     * @model
     */
    value:'',
    minDate:Date,
    maxDate:Date,
  },
  watch:{
    value:{
      immediate:true,
      handler(){
        if(this.valueFormat == 'X' && this.value){
          this.value_loc = this.value+'';
        }else{
          this.value_loc = this.value;
        }
      }
    }
  },
  data(){
    return {
      value_loc:''
    }
  },
  methods:{
    change(v){
     this.$emit('input',v);
     this.$emit('change',v);
    },
    disabledDate(current){
      if(this.minDate){
        if(current < moment(this.minDate)){
          return true;
        }
      }
      if(this.maxDate){
        if(current > moment(this.maxDate)){
          return true;
        }
      }
      return false;
    }
  }
}
</script>

<style scoped>

</style>
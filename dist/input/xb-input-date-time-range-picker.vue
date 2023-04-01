<template>
  <a-range-picker
      :format="format"
      :show-time="showTime"
      :valueFormat="valueFormat"
      v-model="value_loc"
      @change="change"
      v-bind="$attrs"
  />
</template>

<script>
import moment from "moment";

export default {
  name: "xb-input-date-time-range-picker",
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
    /**
     * value {start:'',end:''}
     * @model
     */
    value:Object,

    /**
     * 替换，开始、结束字段
     */
    replaceFields:{
      type:Object,
      default:()=>{
        return {start:'start', end:'end',  }
      }
    },
    minDate:Date,
    maxDate:Date,
  },
  watch:{
    value:{
      immediate:true,
      handler(){
        if(this.value){
          if(this.valueFormat == 'X' && this.value[this.replaceFields.start]){
            this.value_loc = [this.value[this.replaceFields.start]+'',this.value[this.replaceFields.end]+''];
          }else{
            this.value_loc = [this.value[this.replaceFields.start],this.value[this.replaceFields.end]];
          }
        }
      }
    }
  },
  data(){
    return {
      value_loc:null
    }
  },
  methods:{
    change(v,v2){
      let new_val = {[this.replaceFields.start]:v[0],[this.replaceFields.end]:v[1]};
      console.log(new_val);
      this.$emit('input',new_val);
      this.$emit('change',new_val);
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
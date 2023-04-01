<template>
  <a-form-model-item>
    <div class="ant-input filter-time-range"  >
      <span class="label" :title="label">{{label}}：</span>
      <a-range-picker
          style="width: 240px"
          :ranges="ranges"
          format="YYYY-MM-DD"
          valueFormat="X"
          v-bind="$attrs"
          @change="change"
          v-model="sel_val"

      />
    </div>

  </a-form-model-item>


</template>

<script>
import XbInputSelect from "../../input/xb-input-select";
import moment from "moment";

export default {
  name: "filter-time-range",
  components: {XbInputSelect},
  props:{
    form_data:null,
    size:null,
    name:'',
    label:'',
    /**
     * {"start","end"} ,时间戳
     */
    default_value:{
      type:Object,
    },
    /**
     *  默认 返回2个字段， object， {"start","end"}
     * @values '' object
     */
    return_type:'',
  },
  data(){
    return {
      sel_val:[],
      ranges:{
        '今天': [moment().startOf('day'), moment().endOf('day')],
        '昨天': [moment().subtract(1,'days'),moment().subtract(1,'days')],
        '本周': [moment().day("Monday"),moment()],
        '本月': [moment().startOf('month'), moment()]
      }
    }
  },
  watch:{
    default_value:{
      immediate:true,
      handler(){
        if(this.default_value){
          this.sel_val = [this.default_value.start+'',this.default_value.end+''];
          this.setValue(this.sel_val);
        }
      }
    }
  },
  methods:{
    reset(){
      if(this.default_value){
        this.sel_val = [this.default_value.start+'',this.default_value.end+''];
        this.setValue(this.sel_val);
      }else{
        this.sel_val = [];
      }
    },
    setValue(date){
      let start = '';
      let end =  '';
      if(date && date[0]){
        start = moment(date[0]*1000).startOf('day').format('X')*1
      }
      if(date && date[1]){
        end = moment(date[1]*1000).endOf('day').format('X')*1;
      }
      if(start && end){
        if(this.return_type == 'object'){
          this.$set(this.form_data,this.name,  {start,end});
        }else{
          this.$set(this.form_data,this.name+'Start',  start);
          this.$set(this.form_data,this.name+'End', end);
        }
      }else{
        if(this.return_type == 'object'){
          delete this.form_data[this.name]
        }else{
          this.$set(this.form_data,this.name+'Start',  start);
          this.$set(this.form_data,this.name+'End', end);
        }
      }

    },
    change(date, dateString){
      this.setValue(date);
      this.$emit('change',this.name);
    }
  }
}
</script>

<style scoped>
.ant-input{display: flex;align-items: center;
  width: 340px;
  line-height: 40px;}
.ant-input >.label{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
}
::v-deep .filter-time-range .ant-calendar-picker .ant-calendar-picker-input{
  border: none;
  background: none;
  box-shadow: none;
}

</style>
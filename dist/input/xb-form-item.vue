<template>
  <a-row class="xb_form_item" :class="{item_flex}">
    <a-col class="label" :style="{'--item_label_width':item_label_width}" v-if="label"  v-bind="labelCol">
      <span v-if="has_required&&!requiredRight" class="required">*</span>
      <span class="txt">
        <span class="txt_label">
          {{label}}
        </span>
        <span v-if="has_required&&requiredRight" class="required">*</span>
        <span class="colon" v-if="colon">：</span>
      </span>

      <slot  name="labelRight"/>
    </a-col>
    <a-col class="cont" v-bind="wrapperCol">
      <a-form-model-item-fix :prop="name||prop"  :rules="rules_loc" v-bind="{...$attrs,...item_attr}">
        <slot />
      </a-form-model-item-fix>
    </a-col>
  </a-row>


</template>

<script>
import {FormModel} from 'ant-design-vue';

function getPropByPath(obj, path, strict) {
  var tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  var keyArr = path.split('.');
  var i = 0;
  for (var len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    var key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
}

FormModel.Item.props.value = {
  type:[String,Number,Boolean,Array,Object,Date,Function,Symbol]
};
FormModel.Item.props.use_value_verification = {
  type:Boolean,
  default:false,
};
FormModel.Item.computed.fieldValue =  function  fieldValue () {
  var model = this.FormContext.model;
  if (!model || !this.prop) {
    return;
  }
  if(this.use_value_verification){
    return  this.value;
  }
  var path = this.prop;
  if (path.indexOf(':') !== -1) {
    path = path.replace(/:/g, '.');
  }
  return getPropByPath(model, path, true).v;
};
FormModel.Item.methods.onFieldBlur =function () {
  setTimeout(()=>{
    this.validate('blur');
  },1)
}
FormModel.Item.methods.onFieldChange = function () {
  if (this.validateDisabled) {
    this.validateDisabled = false;
    return;
  }
  setTimeout(()=>{
    this.validate('change');
  },1);
}

let FormModelItemOptions = {};
for(let key in FormModel.Item){
  if(key == '_Ctor'){
    continue;
  }
  FormModelItemOptions[key] = FormModel.Item[key];
}
FormModelItemOptions.name = 'AFormModelItemFix';


export default {
  name: "xb-form-item",
  components:{
    'a-form-model-item-fix':FormModelItemOptions,
  },
  props:{
    name:"",
    prop:"",
    label:'',
    value:'',
    /**
     * 使用value验证值
     */
    use_value_verification: {
      type:Boolean,
      default:false
    },
    required: {
      type:Boolean,
      default:false
    },
    requiredRight:Boolean,
    /**
     * item使用 flex 水平布局
     */
    item_flex:Boolean,
    /**
     * item使用 flex 水平布局时，label的宽度
     * */
    item_label_width:'',
    colon:{
      type:Boolean,
      default:true
    },
    labelCol:{
      type:Object,
      default(){
        return {}
      }
    },
    wrapperCol:{
      type:Object,
      default(){
        return {}
      }
    },
    rules:Array,
  },
  computed:{
    has_required(){
      let rs = false;
      this.rules_loc ? this.rules_loc.forEach(item => {
        if(!rs){
          rs = item.required;
        }
      }) : undefined
      return rs;
    },
    rules_loc(){
      if(!this.required && !this.rules){
        return undefined;
      }
      let rules = this.rules || [];
      return [
        {required:this.required,message:this.label+'不能为空'},...rules
      ];
    },

  },
  watch:{
    value:{
      deep:true,
      handler(){
        console.log('2222222222');
        this.item_attr.value = this.value;
      }
    }
  },
  data(){
    return {
      item_attr:{
          use_value_verification:this.use_value_verification,
          value:this.value,
      }
    }
  }
}
</script>

<style scoped lang="less">
.xb_form_item {
  margin-bottom: 24px;
  >.label{
    line-height: 40px;
    color: rgba(0,0,0,.85);
    .required{
      font-family: SimSun,sans-serif;
      color: #f5222d;
    }
  }
  >.cont>.ant-form-item{
    margin-bottom: 0;
  }
}
.xb_form_item.item_flex{
  display: flex;
  >.label{
    width: var(--item_label_width);
  }
  >.cont{
    flex: 1;
  }
}
</style>
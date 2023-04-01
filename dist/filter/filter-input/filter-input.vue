<template>
  <a-form-model-item>
      <a-input @change="change" v-bind="$attrs" v-model="form_data[name]" :placeholder="$attrs.placeholder||'请输入'" >
        <a-icon slot="prefix" type="search" />
      </a-input>
  </a-form-model-item>

</template>

<script>
export default {
  name: "filter-input",
  props:{
    form_data:null,
    size:null,
    name:'',
    default_value:null,
    /**
     * 重置按钮，是否清空默认值
     */
    reset_clear_default_value:Boolean,
  },
  watch:{
    default_value:{
      immediate:true,
      handler(){
        this.$set(this.form_data,this.name,this.default_value);
      }
    }
  },
  methods:{
    change(){
      this.$emit('change',this.name);
    }
  }
}
</script>

<style scoped>

</style>
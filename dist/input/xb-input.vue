<template>
  <a-input class="xb_input" v-model="cur_val" @change="change" v-bind="$attrs"  :placeholder="placeholder"  />
</template>

<script>
export default {
  name: "xb-input",
  props:{
    value: [String, Number],
    placeholder:{
      type:String,
      default:'请输入'
    },
  },
  data(){
    return {
      cur_val:''
    }
  },
  watch:{
    value:{
      immediate:true,
      handler(){
        this.cur_val = this.value;
      }
    }
  },
  methods:{
    change(e){
      this.$emit('input',this.cur_val);
      this.$emit('change',e);
    }
  }
}
</script>

<style scoped lang="less">

</style>
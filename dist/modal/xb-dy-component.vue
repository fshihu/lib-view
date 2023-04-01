<template>
  <component :is="component" v-bind="$attrs" v-on="$listeners" v-if="visible" :key="dy_key" :onModalClose="onModalClose" ref="component"></component>
</template>

<script>
let dy_key = 0;
export default {
  name: "xb-dy-component",
  props:{
    /**
     * 组件 string | ComponentDefinition | ComponentConstructor
     */
    component:null,
  },
  data(){
    return {
      visible:false,
      dy_key:0,
    }
  },
  methods:{
    onModalClose(){
      this.visible = false;
    },
    /**
     * 打开组件，会调用子组件的open方法
     * @public
     */
    open(){
      this.visible = true;
      this.dy_key++;
      this.$nextTick(()=>{
        this.$refs.component.open.apply(null,arguments);
      })
    }
  }
}
</script>

<style scoped>

</style>
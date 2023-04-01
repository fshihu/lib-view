<template>
<a-spin :spinning="spinning">
  <slot/>
</a-spin>
</template>

<script>
export default {
  name: "xb-loading-spin",
  data(){
    return {
      spinning:false
    }
  },
  methods:{
    loading(spinning){
      this.spinning = spinning;
    }
  }
}
</script>

<style scoped>

</style>
<template>
<div>
  <a-popover v-if="text.length > maxLength">
    <template #content>
      {{text}}
    </template>
    {{text.substring(0,maxLength)+'...'}}
  </a-popover>
  <template v-else>
    {{text}}
  </template>
</div>
</template>

<script>
export default {
  name: "xb-ell-pop",
  props:{
    text:String,
    maxLength:{
      default:10,
      type:[String,Number],
    }
  }
}
</script>

<style scoped>

</style>
<template>
<div class="xb-button-group">
  <slot />
</div>
</template>

<script>
export default {
  name: "xb-button-group"
}
</script>

<style scoped lang="less">

.xb-button-group {
  padding: 8px;
  border-top: 1px solid #eeeded;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  > * {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
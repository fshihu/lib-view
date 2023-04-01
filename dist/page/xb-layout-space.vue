<template>
<div :class="['xb-layout-space',{transparent:transparent}]"  >
  <div class="count" v-if="$slots.count">
    <slot name="count"/>
  </div>
  <div class="filter" v-if="$slots.filter">
    <slot name="filter"/>
  </div>
  <div class="button" v-if="$slots.button">
    <slot name="button"/>
  </div>
  <div class="table" v-if="$slots.table">
    <slot name="table"/>
  </div>

  <slot/>
</div>
</template>

<script>
export default {
  name: "xb-layout-space",
  props:{
    transparent:{ //透明背景，底色是灰色的
      type:Boolean,
      default:false,
    }
  }
}
</script>

<style scoped>
.xb-layout-space{
  height: 100%;background:#E5E5E5;padding: 16px; display: flex;flex-direction: column;
}
.xb-layout-space>.count{
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
}
.xb-layout-space>.filter{
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
}
.xb-layout-space>.button{
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
  background: #fff;

}

.xb-layout-space.transparent>.button{
  background: none;
  border-bottom: none;
  padding-left: 0;
}
.xb-layout-space.transparent>.table{
  background: none;
  padding: 0;
}

.xb-layout-space>.table{
  flex: 1;
  padding: 16px;
  background: #fff;
  height: 1px;
  overflow: auto;
}

</style>
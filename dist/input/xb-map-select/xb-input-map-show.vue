<template>
<map-select
    :address-string="value.address"
    :lng="value.lng"
    :is_read="true"
    :lat="value.lat"/>
</template>

<script>
import MapSelect from "./mapSelect/MapSelect";
export default {
  name: "xb-input-map-show",
  components: {MapSelect},
  props:{
    /**
     * {lng:'',lat:'',address:''}
     */
    value:{
      type:Object,
      default:()=>{},
    },
  }
}
</script>

<style scoped>

</style>
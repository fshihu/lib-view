<template>
  <div style="flex: 1;min-width: 1px;display: flex;align-items: center;"
   >
    <div @mouseover="mouseover" ref="ell" :style="elli">
      <slot />
    </div>
    <div style="flex-shrink:0;">
      <slot name="other"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "xb-ell",
    props:{
        row:{
          type:[String,Number],
            default:()=>1
      }
    },
    computed:{
        elli(){
            return {
                display:' -webkit-box',                                           
                boxOrient: 'vertical',
                lineClamp: Number(this.row)?this.row:1,
                overflow: 'hidden'
            }
        },
    },
  methods:{
    mouseover(){
      this.$refs.ell.setAttribute('title',this.$refs.ell.innerText);
    }
  }
}
</script>

<style scoped>

</style>
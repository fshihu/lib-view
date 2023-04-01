
<script>
export default {
  name: "xb-tree-simple-select",
  props:{
    value:null
  },
  watch:{
    value:{
      immediate:true,
      handler(){
        this.value_loc = this.value;
      }
    }
  },
  data(){
    return {
      value_loc:null
    }
  },
  methods:{
    change(){
      console.log('this',this)
      this.$emit('input',this.value_loc);
    }
  },
  render(createElement, context) {
    return createElement('a-tree-select',{
      props:{
        value:this.value_loc,
        ...this.$attrs,
      },
      scopedSlots:this.$scopedSlots,
      on:{
        ...this.$listeners,
        input:(...arg)=>{
          this.$emit('input',...arg);
          this.$emit('change',...arg);
        },
        change:(...arg)=>{
          this.$emit('input',...arg);
          this.$emit('change',...arg);
        },
      },
    })
  }
}
</script>

<style scoped>

</style>
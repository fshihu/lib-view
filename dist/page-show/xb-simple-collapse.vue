<template>
<div class="xb_collapse_w">
  <div class="xb_collapse">
    <div class="xb_collapse_t" >
      <div class="tit"  @click="change" :style="collapse_t_style">
        <span :class="['xb_collapse_icon',{'xb_collapse_open':open}]">
          <a-icon type="caret-right" style="font-size: 14px;" v-if="icon=='caret'"/>
          <a-icon type="right" style="font-size: 12px;"  v-else/>
        </span>
        <span class="xb_collapse_txt" v-if="!$slots.title" :style="xb_collapse_txt_style">{{ title }}</span>
        <slot name="title" v-else/>
      </div>
      <div>
        <slot name="rightTitle"/>
      </div>


    </div>
    <div ref="cont" class="transition" :style="cont_style" :class="['xb_collapse_c'] " >
      <slot></slot>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "xb-simple-collapse",
  props:{
    title:'',
    icon:{
      type:String,
      default:'caret',//arrows
    },
    collapse_t_style:{},
    xb_collapse_txt_style:{},
    default_open:{
      type:Boolean,
      default: ()=>false
    },
    //为满足搜索时展开的定制功能{{open:true,docList:[]},{open:false,docList:[]}}
    group:{
      type:Object,
      default:()=>({})
    }
  },
  data(){
      return {
        open:this.default_open,
      };
  },
  watch:{
    group:{
      immediate:true,
      deep:true,
      handler(v) {
        if(Object.keys(v).length>0){
          this.open = v.open;
        }
      }
    }
  },
  computed:{
    cont_style(){
      if(this.open){
        return {
          height:'auto',
          opacity:1
        }
      }else{
        return {
          height:0,
          opacity:0
        }
      }

    },
  },
  mounted(){

  },
  methods:{
    change(){
      this.open =!this.open;
      this.$emit('change',this.open)
    },
  }
}
</script>

<style scoped>
  .transition{
    transition: all 0.15s linear;
    overflow:hidden
  }
.xb_collapse_t{
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  align-items: center;
  padding-bottom: 4px;}
.xb_collapse_t .tit{
  cursor: pointer;
  display: flex;
  align-items: center;
}
.xb_collapse_t .icon{font-size: 12px;}
.xb_collapse_t .txt{font-size: 14px;color: rgba(0, 0, 0, 0.65);}
.xb_collapse_c{
  transition: all 0.3s;
}
.xb_collapse_icon{
  transition: all 0.3s;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
.xb_collapse_txt{
  display: inline-block;
  vertical-align: middle;
}
.xb_collapse_icon.xb_collapse_open{
  transform: rotate(90deg);
}
.xb_collapse_c.xb_collapse_hide{
  display: none;
}

.xb_collapse_txt{
  margin-left: 12px;}
</style>
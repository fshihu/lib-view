<template>
  <div class="xb-simple-slide" :style="{height:height+'px'}">
    <div class="item_w" ref="item_w" :style="{'--item-width':'calc('+(100/show_num)+'% - 8px)'}">
      <slot />
    </div>
    <div class="prev" @click="prev" v-if="show_prev">
      <slot name="prev">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="black" fill-opacity="0.6"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.4163 13.6551L9.40403 13.6674L8.27266 12.536L12.8087 8L13.94 9.13137L10.5477 12.5238L14 15.9761L12.8686 17.1075L9.4163 13.6551Z" fill="white"/>
        </svg>

      </slot>
    </div>
    <div class="next" @click="next" v-if="show_next">
      <slot name="next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle r="12" transform="matrix(-1 0 0 1 12 12)" fill="black" fill-opacity="0.6"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5837 13.6551L14.596 13.6674L15.7273 12.536L11.1913 8L10.06 9.13137L13.4523 12.5238L10 15.9761L11.1314 17.1075L14.5837 13.6551Z" fill="white"/>
        </svg>
      </slot>
    </div>
    <div class="pots" v-if="show_pots">
      <div class="pot" :class="{active:i == move_num+1}" v-for="i in children_len">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "xb-simple-slide",
  props:{
    show_num: {
      type:Number,
      default:4,
    },
    height:{
      type:[Number,String],
      default:'60'
    },
    show_pots:Boolean,
  },
  data(){
    return {
      move_num:0,
      show_prev:false,
      show_next:false,
      children_len:0,
    }
  },
  mounted() {
    setTimeout(()=>{
      this.children_len = this.$refs.item_w.children.length;
      if(this.children_len > this.show_num){
        this.show_next = true;
      }
    },500);
  },
  methods:{
    prev(){
      this.move_num--;
      this.setStyle();
      this.$emit('change',this.move_num)
    },
    next(){
      this.move_num++;
      this.setStyle();
      this.$emit('change',this.move_num)
    },
    setStyle(){
      if(this.move_num == 0){
        this.show_prev = false;
      }else{
        this.show_prev = true;
      }
      if(this.move_num+this.show_num == this.children_len){
        this.show_next = false;
      }else{
        this.show_next = true;
      }
      let left = (this.$refs.item_w.children[0].clientWidth+8) *this.move_num;
      this.$refs.item_w.style.left =  -left+'px';
    }
  }
}
</script>

<style scoped lang="less">
.xb-simple-slide{
  width: 100%;
  overflow: hidden;
  position: relative;
}
.item_w{
  display: flex;
  height: 100%;
  margin: 0 -4px;
  transition: all .2s;
  position: relative;
  left:0;
  >*{
    width: var(--item-width);
    height: 100%; flex-shrink: 0;margin-right: 4px;margin-bottom: 8px;
    margin-left: 4px;
  }
}
.next{
  position: absolute;
  right: 0;
  top:50%;
  cursor: pointer;
  transform: translate(0,-50%);
}
.prev{
  position: absolute;
  left: 0;
  top:50%;
  cursor: pointer;
  transform: translate(0,-50%);
}
.pots{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  .pot{
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: #ccc;
    margin-left: 5px;
    &.active{
      background: #679dff;
    }
  }
}
</style>
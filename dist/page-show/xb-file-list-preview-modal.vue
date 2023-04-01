<template>
  <transition name="item-edit">
    <div class="item-edit" v-if="is_visible" ref="item_edit">
      <div class="item-edit-bg" @click="close"></div>
      <div class="close" @click="close">
        ×
      </div>
      <xb-file-list-preview v-model="attachment_cur_index" :toMp3Url="toMp3Url" ref="preview_files" :list="list" @clickGray="close"/>

    </div>

<!--  <xb-simple-modal :autoHeight="true" :noBtn="true" :bodyStyle="{padding:0}" ref="preview_modal" width="640px"-->
<!--                   :title="'预览文件'+'('+attachment_cur_index+'/'+list.length+')'">-->

  </transition>


</template>

<script>

export default {
  name: "xb-file-list-preview-modal",
  props:{
    list:{
      type:Array, // {name:'',url:''},
      default(){
        return [];
      }
    },
    /**
     * 如果有音频文件，需要传这个 <br>
     *
     * process.env.VUE_APP_ApiUrl = http://new.szcgtest.xbcx.com.cn/szcg/admin <br />
     * `${process.env.VUE_APP_ApiUrl}/upfile_server/core/upfile/mp3?ses_token=${LoginUtil.getToken()}`
     */
    toMp3Url:{
      type:String,
      default:'',
    }
  },
  components: {},
  data(){
    return {
      attachment_cur_index:1,
      is_visible:false,
    }
  },
  mounted() {
    document.body.append(this.$el);
    console.log(this.$refs.item_edit);

  },
  methods:{
    open(index){
      this.is_visible = true;
      this.$nextTick(()=>{
        this.$refs.item_edit.addEventListener('click',(e)=>{
          console.log(e);
        })
        this.$refs.preview_files.show(index);
      })
    },
    close(){
      this.is_visible = false;
    }

  }
}
</script>

<style scoped lang="less">
.item-edit{
  position: fixed;
  left: 0;top:0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .item-edit-bg{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(58, 58, 58, 0.56);
  }
  .close{
    position: absolute;
    right: 10px;
    top:10px;
    background: #5a5a5a;
    font-size: 50px;
    width: 40px;
    color: #fff;
    height: 40px;
    line-height: .6;
    text-align: center;
    cursor: pointer;
    z-index: 1;
    border-radius: 20px;
  }
}

.item-edit-enter-active, .item-edit-leave-active {
  transition: all .3s;
  transform: scale(1);
  opacity: 1;
}
.item-edit-enter, .item-edit-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: scale(0);
  opacity: 0;
}
</style>
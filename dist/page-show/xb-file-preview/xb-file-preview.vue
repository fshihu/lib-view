<template>
  <div class="xb-file-preview">
    <div class="preview_box img" v-if="img_type==AttachmentExt.image">
      <img class="img" :src="url_loc" alt="">
    </div>
    <div class="preview_box video" v-if="img_type==AttachmentExt.video">
      <img class="img" :src="url_loc" v-if="url_loc" alt="">
      <img v-else src="./imgs/dd.png" style="width: 100%;height: 100%;" />
      <svg class="icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="white" fill-opacity="0.5"/>
        <path d="M24.5 17.134C25.1667 17.5189 25.1667 18.4811 24.5 18.866L15.5 24.0622C14.8333 24.4471 14 23.966 14 23.1962L14 12.8038C14 12.034 14.8333 11.5529 15.5 11.9378L24.5 17.134Z" fill="white" fill-opacity="0.8"/>
      </svg>

    </div>
    <div class="preview_box audio" v-if="img_type==AttachmentExt.audio">
      <img class="img" :src="url_loc" v-if="url_loc" alt="">
      <img v-else src="./imgs/dd.png" style="width: 100%;height: 100%;" />

      <svg class="icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="white" fill-opacity="0.5"/>
        <path d="M18 11C18.1632 11 18.3197 11.0642 18.4351 11.1785C18.5506 11.2928 18.6154 11.4479 18.6154 11.6095V25.019C18.6154 25.1807 18.5506 25.3357 18.4351 25.45C18.3197 25.5644 18.1632 25.6286 18 25.6286C17.8368 25.6286 17.6803 25.5644 17.5649 25.45C17.4495 25.3357 17.3846 25.1807 17.3846 25.019V11.6095C17.3846 11.4479 17.4495 11.2928 17.5649 11.1785C17.6803 11.0642 17.8368 11 18 11ZM14.3077 13.4381C14.4709 13.4381 14.6274 13.5023 14.7428 13.6166C14.8582 13.7309 14.9231 13.886 14.9231 14.0476V22.581C14.9231 22.7426 14.8582 22.8976 14.7428 23.012C14.6274 23.1263 14.4709 23.1905 14.3077 23.1905C14.1445 23.1905 13.988 23.1263 13.8726 23.012C13.7571 22.8976 13.6923 22.7426 13.6923 22.581V14.0476C13.6923 13.886 13.7571 13.7309 13.8726 13.6166C13.988 13.5023 14.1445 13.4381 14.3077 13.4381ZM21.6923 13.4381C21.8555 13.4381 22.012 13.5023 22.1275 13.6166C22.2429 13.7309 22.3077 13.886 22.3077 14.0476V22.581C22.3077 22.7426 22.2429 22.8976 22.1275 23.012C22.012 23.1263 21.8555 23.1905 21.6923 23.1905C21.5291 23.1905 21.3726 23.1263 21.2572 23.012C21.1418 22.8976 21.0769 22.7426 21.0769 22.581V14.0476C21.0769 13.886 21.1418 13.7309 21.2572 13.6166C21.3726 13.5023 21.5291 13.4381 21.6923 13.4381ZM25.3846 15.8762C25.5478 15.8762 25.7044 15.9404 25.8198 16.0547C25.9352 16.169 26 16.3241 26 16.4857V20.1429C26 20.3045 25.9352 20.4595 25.8198 20.5739C25.7044 20.6882 25.5478 20.7524 25.3846 20.7524C25.2214 20.7524 25.0649 20.6882 24.9495 20.5739C24.8341 20.4595 24.7692 20.3045 24.7692 20.1429V16.4857C24.7692 16.3241 24.8341 16.169 24.9495 16.0547C25.0649 15.9404 25.2214 15.8762 25.3846 15.8762ZM10.6154 15.8762C10.7786 15.8762 10.9351 15.9404 11.0505 16.0547C11.1659 16.169 11.2308 16.3241 11.2308 16.4857V20.1429C11.2308 20.3045 11.1659 20.4595 11.0505 20.5739C10.9351 20.6882 10.7786 20.7524 10.6154 20.7524C10.4522 20.7524 10.2956 20.6882 10.1802 20.5739C10.0648 20.4595 10 20.3045 10 20.1429V16.4857C10 16.3241 10.0648 16.169 10.1802 16.0547C10.2956 15.9404 10.4522 15.8762 10.6154 15.8762Z" fill="white" fill-opacity="0.8"/>
      </svg>

    </div>
    <div class="preview_box file" v-if="img_type == AttachmentExt.file">
      <div v-html="file_icon">

      </div>
    </div>
  </div>
</template>

<script>
import {AttachmentExt} from "../../utils/AttachmentExt";
import {AttachmentIconEnum} from "../../utils/AttachmentIconEnum";

export default {
  name: "xb-file-preview",
  props:{
    /***
     * 原始文件地址，用这个判断文件格式
     */
    url:{
      type:String,
      default:'',
    },
    /***
     * 缩略图地址
     */
    thumbUrl:{
      type:String,
      default:'',
    },
  },
  data(){
    return {
      AttachmentExt,
    }
  },
  computed:{
    img_type(){
      return AttachmentExt.getType(this.url);
    },
    url_loc(){
      if(this.thumbUrl){
        return this.thumbUrl;
      }
      if(this.img_type == AttachmentExt.image){
        return  this.url;
      }
      return  '';
    },
    file_icon(){
      return AttachmentIconEnum.getIcon(this.url);
    }
  },
  methods:{

  }
}
</script>

<style scoped lang="less">
.xb-file-preview{
  width: 100%;
  height: 100%;
  border-radius: 4px;

  .preview_box{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5F5F5;
    position: relative;
    .img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    .icon{
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%,-50%);
    }
  }
  .img{


  }
}
</style>
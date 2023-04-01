<template>
  <div style="width: 100%;height: 100%;  display: flex;position:relative;
flex-direction: column;
">
    <div style="flex: 1;  display: flex; justify-content: center;
  align-items: center;min-height: 1px;padding: 0 110px;" @click="clickGray">
      <div v-if="isImg()"   style="width: 100%;height: 100%;position:relative;" @click.stop="clickImg">
        <div ref="attachment_pre" >
          <img :src="cur_item.url" width="0" />
        </div>
      </div>
      <div v-else-if="cur_item.ext == 'mp4'" style="height: 100%;width: 100%; display: flex;flex-direction: column;" @click.stop>
        <div style="flex: 1;min-height: 1px; width:100%;background: #000;" >
          <video controls :src="cur_item.url" style="width: 100%;height: 100%;object-fit: contain;" />
        </div>
      </div>
      <div v-else-if="cur_item.ext == 'mp3'||cur_item.ext == 'amr'" @click.stop >
        <div :style="{color:text_color}" class="txt">{{cur_item.name}}</div>
        <audio controls :src="getMp3Url()" ></audio>
      </div>
      <div v-else style="text-align: center; " @click.stop>
        <div style="margin-bottom: 8px;" v-html="file_icon" class="file_icon">

        </div>
        <div :style="{color:text_color}" class="txt">{{cur_item.filename}}</div>
        <a :href="cur_item.url" target="_blank" download>
          <a-button style="margin-top: 1em" type="primary" icon="download" :size="'large'">点击下载
          </a-button>
        </a>
      </div>
    </div>

    <div class="swiper-button-w">
      <div class="swiper-button-prev arrow" v-if="show_prev" @click="prev()">
        <svg style="transform: rotate(180deg)" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_b_101_26502)">
            <mask id="path-1-inside-1_101_26502" fill="white">
              <path d="M1.39876e-06 16C2.17128e-06 7.16344 7.16345 -2.17128e-06 16 -1.39876e-06C24.8366 -6.26248e-07 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 6.26248e-07 24.8366 1.39876e-06 16Z"/>
            </mask>
            <path d="M1.39876e-06 16C2.17128e-06 7.16344 7.16345 -2.17128e-06 16 -1.39876e-06C24.8366 -6.26248e-07 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 6.26248e-07 24.8366 1.39876e-06 16Z" fill="black" fill-opacity="0.4"/>
            <path d="M2 16C2 8.26801 8.26802 2 16 2L16 -2C6.05888 -2 -2 6.05887 -2 16L2 16ZM16 2C23.732 2 30 8.26801 30 16L34 16C34 6.05887 25.9411 -2 16 -2L16 2ZM30 16C30 23.732 23.732 30 16 30L16 34C25.9411 34 34 25.9411 34 16L30 16ZM16 30C8.26801 30 2 23.732 2 16L-2 16C-2 25.9411 6.05887 34 16 34L16 30Z" fill="white" fill-opacity="0.4" mask="url(#path-1-inside-1_101_26502)"/>
          </g>
          <mask id="path-3-inside-2_101_26502" fill="white">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.153 15.9435L13.2338 11.0243L14.6512 9.60693L21 15.9557L19.5826 17.3731L19.5704 17.3608L14.5985 22.3328L13.1811 20.9154L18.153 15.9435Z"/>
          </mask>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.153 15.9435L13.2338 11.0243L14.6512 9.60693L21 15.9557L19.5826 17.3731L19.5704 17.3608L14.5985 22.3328L13.1811 20.9154L18.153 15.9435Z" fill="white"/>
          <path d="M18.153 15.9435L19.5672 17.3577L20.9814 15.9435L19.5672 14.5293L18.153 15.9435ZM13.2338 11.0243L11.8196 9.61008L10.4054 11.0243L11.8196 12.4385L13.2338 11.0243ZM14.6512 9.60693L16.0654 8.19272L14.6512 6.77851L13.237 8.19272L14.6512 9.60693ZM21 15.9557L22.4142 17.3699L23.8284 15.9557L22.4142 14.5415L21 15.9557ZM19.5826 17.3731L18.1684 18.7873L19.5826 20.2015L20.9969 18.7873L19.5826 17.3731ZM19.5704 17.3608L20.9846 15.9466L19.5704 14.5324L18.1562 15.9466L19.5704 17.3608ZM14.5985 22.3328L13.1842 23.747L14.5985 25.1612L16.0127 23.747L14.5985 22.3328ZM13.1811 20.9154L11.7669 19.5012L10.3527 20.9154L11.7669 22.3296L13.1811 20.9154ZM19.5672 14.5293L14.6481 9.61008L11.8196 12.4385L16.7388 17.3577L19.5672 14.5293ZM14.6481 12.4385L16.0654 11.0211L13.237 8.19272L11.8196 9.61008L14.6481 12.4385ZM13.237 11.0211L19.5858 17.3699L22.4142 14.5415L16.0654 8.19272L13.237 11.0211ZM19.5858 14.5415L18.1684 15.9589L20.9969 18.7873L22.4142 17.3699L19.5858 14.5415ZM20.9969 15.9589L20.9846 15.9466L18.1562 18.775L18.1684 18.7873L20.9969 15.9589ZM18.1562 15.9466L13.1842 20.9185L16.0127 23.747L20.9846 18.775L18.1562 15.9466ZM16.0127 20.9185L14.5953 19.5012L11.7669 22.3296L13.1842 23.747L16.0127 20.9185ZM14.5953 22.3296L19.5672 17.3577L16.7388 14.5293L11.7669 19.5012L14.5953 22.3296Z" fill="white" fill-opacity="0.4" mask="url(#path-3-inside-2_101_26502)"/>
          <defs>
            <filter id="filter0_b_101_26502" x="-3" y="-3" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feGaussianBlur in="BackgroundImage" stdDeviation="1.5"/>
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_101_26502"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_101_26502" result="shape"/>
            </filter>
          </defs>
        </svg>

      </div>

      <div class="swiper-button-next arrow" v-if="show_next"  @click="next()">

        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_b_101_26502)">
            <mask id="path-1-inside-1_101_26502" fill="white">
              <path d="M1.39876e-06 16C2.17128e-06 7.16344 7.16345 -2.17128e-06 16 -1.39876e-06C24.8366 -6.26248e-07 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 6.26248e-07 24.8366 1.39876e-06 16Z"/>
            </mask>
            <path d="M1.39876e-06 16C2.17128e-06 7.16344 7.16345 -2.17128e-06 16 -1.39876e-06C24.8366 -6.26248e-07 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 6.26248e-07 24.8366 1.39876e-06 16Z" fill="black" fill-opacity="0.4"/>
            <path d="M2 16C2 8.26801 8.26802 2 16 2L16 -2C6.05888 -2 -2 6.05887 -2 16L2 16ZM16 2C23.732 2 30 8.26801 30 16L34 16C34 6.05887 25.9411 -2 16 -2L16 2ZM30 16C30 23.732 23.732 30 16 30L16 34C25.9411 34 34 25.9411 34 16L30 16ZM16 30C8.26801 30 2 23.732 2 16L-2 16C-2 25.9411 6.05887 34 16 34L16 30Z" fill="white" fill-opacity="0.4" mask="url(#path-1-inside-1_101_26502)"/>
          </g>
          <mask id="path-3-inside-2_101_26502" fill="white">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.153 15.9435L13.2338 11.0243L14.6512 9.60693L21 15.9557L19.5826 17.3731L19.5704 17.3608L14.5985 22.3328L13.1811 20.9154L18.153 15.9435Z"/>
          </mask>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.153 15.9435L13.2338 11.0243L14.6512 9.60693L21 15.9557L19.5826 17.3731L19.5704 17.3608L14.5985 22.3328L13.1811 20.9154L18.153 15.9435Z" fill="white"/>
          <path d="M18.153 15.9435L19.5672 17.3577L20.9814 15.9435L19.5672 14.5293L18.153 15.9435ZM13.2338 11.0243L11.8196 9.61008L10.4054 11.0243L11.8196 12.4385L13.2338 11.0243ZM14.6512 9.60693L16.0654 8.19272L14.6512 6.77851L13.237 8.19272L14.6512 9.60693ZM21 15.9557L22.4142 17.3699L23.8284 15.9557L22.4142 14.5415L21 15.9557ZM19.5826 17.3731L18.1684 18.7873L19.5826 20.2015L20.9969 18.7873L19.5826 17.3731ZM19.5704 17.3608L20.9846 15.9466L19.5704 14.5324L18.1562 15.9466L19.5704 17.3608ZM14.5985 22.3328L13.1842 23.747L14.5985 25.1612L16.0127 23.747L14.5985 22.3328ZM13.1811 20.9154L11.7669 19.5012L10.3527 20.9154L11.7669 22.3296L13.1811 20.9154ZM19.5672 14.5293L14.6481 9.61008L11.8196 12.4385L16.7388 17.3577L19.5672 14.5293ZM14.6481 12.4385L16.0654 11.0211L13.237 8.19272L11.8196 9.61008L14.6481 12.4385ZM13.237 11.0211L19.5858 17.3699L22.4142 14.5415L16.0654 8.19272L13.237 11.0211ZM19.5858 14.5415L18.1684 15.9589L20.9969 18.7873L22.4142 17.3699L19.5858 14.5415ZM20.9969 15.9589L20.9846 15.9466L18.1562 18.775L18.1684 18.7873L20.9969 15.9589ZM18.1562 15.9466L13.1842 20.9185L16.0127 23.747L20.9846 18.775L18.1562 15.9466ZM16.0127 20.9185L14.5953 19.5012L11.7669 22.3296L13.1842 23.747L16.0127 20.9185ZM14.5953 22.3296L19.5672 17.3577L16.7388 14.5293L11.7669 19.5012L14.5953 22.3296Z" fill="white" fill-opacity="0.4" mask="url(#path-3-inside-2_101_26502)"/>
          <defs>
            <filter id="filter0_b_101_26502" x="-3" y="-3" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feGaussianBlur in="BackgroundImage" stdDeviation="1.5"/>
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_101_26502"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_101_26502" result="shape"/>
            </filter>
          </defs>
        </svg>

      </div>
    </div>

  </div>
</template>

<script>

import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import {AttachmentExt} from "../../utils/AttachmentExt";
import {AttachmentIconEnum} from "../../utils/AttachmentIconEnum";

export default {
  name: "xb-file-list-preview",
  props:{
    /**
     *
     * {filename:'',url:''},
     */
    list:{
      type:Array, //
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
    },
    value:0,
    text_color:{
      type:String,
      default:'white',
    }, //white
  },
  watch:{
    list:{
      handler(){
        if(this.list){
          this.cur_index = 0;
          this.checkButton();
        }
      },
      immediate:true
    }
  },
  computed:{
    file_icon(){
      return AttachmentIconEnum.getIcon(this.cur_item.url,200);
    }
  },
  data(){
    return {
      cur_item:{},
      cur_index:0,
      show_prev:false,
      show_next:false,
      viewer:null
    }
  },
  beforeDestroy() {
    if(this.viewer){
      this.viewer.destroy();
    }
  },
  methods:{
    prev(){
      this.cur_index--;
      this.checkButton();
    },
    next(){
      this.cur_index++;
      this.checkButton();
    },
    getMp3Url(){
      if(this.cur_item.ext == 'mp3'){
        return this.cur_item.url;
      }
      return this.toMp3Url+'&url='+this.cur_item.url;
    },
    checkButton(){
      if(this.list[this.cur_index] == this.cur_item){
        return;
      }
      this.$emit('input',this.cur_index+1);
      if(this.viewer){
        this.viewer.hide();
        this.viewer.destroy();

      }
      this.cur_item = this.list[this.cur_index] || {};

      this.cur_item.ext = AttachmentExt.getExt(this.cur_item.url);

      this.$nextTick(()=>{
        if(this.isImg()){
          if(this.viewer){
            this.viewer.hide();
            this.viewer.destroy();

          }
          this.viewer = new Viewer(this.$refs.attachment_pre, {
            inline: true,
            navbar:false,
            fullscreen:false,
            backdrop:false,
            button:false,
            toolbar:{
              zoomIn: 1,
              zoomOut: 1,
              oneToOne: 1,
              reset: 1,
              prev: 0,
              play: 0,
              next: 0,
              rotateLeft: 1,
              rotateRight: 1,

            },
            viewed() {
            },
          });

        }

      })

      if(this.cur_index == 0){
        this.show_prev = false;
      }else{
        this.show_prev = true;
      }
      console.log(this.list.length);
      if(this.list.length > 1 && this.cur_index < this.list.length - 1){
        this.show_next = true;
      }else{
        this.show_next = false;
      }
    },
    show(index){
      this.cur_index = index;
      this.checkButton();
    },
    isImg(){
      let {cur_item} = this;
      return cur_item.ext == 'png' || cur_item.ext == 'jpg' ||cur_item.ext == 'bmp'||cur_item.ext == 'gif'||cur_item.ext == 'jpeg'
    },
    clickGray(){
      this.$emit('clickGray');
    },
    clickImg(e){
      if(e.composedPath()[0].className == 'viewer-canvas'){
        this.clickGray();
      }
      console.log(e,this.$refs.attachment_pre);
    }
  }
}
</script>

<style scoped lang="less">
.txt{
  padding-bottom: 10px;text-align: center;
}
.swiper-button-w{
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-button-w .txt{
  padding: 0 10px;
}
.swiper-button-prev{
  position: absolute;
  left: 16px;
  top:  calc( 50% - 20px);
  width: 50px;
  height: 50px;
  z-index: 9;
  border-radius: 0 5px 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg{
    width: 50px;
    height: 50px;
  }
}
.swiper-button-prev img{
  transform: rotate(-180deg);
}
.swiper-button-next{
  position: absolute;
  right: 16px;
  top: calc( 50% - 20px);
  width: 50px;
  height: 50px;
  z-index: 9;
  cursor: pointer;
  border-radius: 5px 0 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg{
    width: 50px;
    height: 50px;
  }
}
.file_icon svg{
  width: 200px;
  height: 200px;
}

</style>
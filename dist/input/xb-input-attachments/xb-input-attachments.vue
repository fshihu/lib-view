<template>
  <div class="xb-input-attachments" style="display: flex;">
    <div class="up_list">
      <a-upload
          class="up_btn"
          name="file"
          list-type="picture-card"
          :customRequest="upfile"
          :show-upload-list="false"
          :beforeUpload="beforeUpload"
          :accept="accept_loc"
          v-show="fileList.length < max && !disabled"
          multiple
          @change="handleUploadChange"
      >


        <div   class="btn" >
          <a-icon type="plus" style="font-size: 32px;color: #8C8C8C;" />
          <!--<div style="line-height: 1;">-->
          <!--上传文件-->
          <!--</div>-->
        </div>


      </a-upload>

      <div class="file_item" v-for="(file,index) in fileList">
        <div class="uploading" v-if="file.status == 'uploading'">
          <a-icon type="loading" style="font-size: 32px;" />
          <div class="name">{{file.filename}}</div>
          <a-icon class="del" @click="del(index)" type="delete"/>
        </div>
        <div class="error" v-if="file.status == 'error'" @click="retry(file)">
          <div>上传失败</div>
          <div>点击重试</div>
          <a-icon class="del" @click="del(index)" type="delete"/>
        </div>
        <div class="done" v-if="file.status == 'done'">
          <xb-file-preview :url="file.url" :thumb-url="file.thumburl"/>
          <div class="bg"></div>
          <div class="op">
            <a-icon class="del" @click="del(index)" type="delete"/>
            <a-icon class="eye" @click="eye(index)" type="eye"/>
          </div>
        </div>
      </div>
    </div>
    <slot name="tips"/>

    <xb-file-list-preview-modal :list="fileList" ref="modal" :to-mp3-url="toMp3Url"/>
  </div>
</template>

<script>
import {AttachmentExt} from "../../utils/AttachmentExt";
export default {
  name: "xb-input-attachments",
  components: {},
  props:{
    show_tip:{
      type:[Boolean],
      default:()=>true,
    },
    value:{
      type:Array,
      default:()=>[],
    },
    biz_type:'',
    is_store:{
      type:[Number,String],
      default:()=>1,
    },
    max:{
      type:[Number,String],
      default:()=>30,
    },
    disabled:{
      type:[Boolean],
      default:()=>false,
    },
    /**
     * (file) =>  Promise
     *
     * 上传前的处理 resolve(file)时 使用新文件， resolve() 继续上传， resolve(false) 停止上传
     *
     */
    onBeforeUpload:Function,
    /**
     * 上传类型， image，video,image_video，file
     */
    up_type:{
      type:String,
      default:'file',
    },
    /**
     * 自定义accept，有特殊需求可以传这个
     */
    accept:{
      type:String,
      default:'',
    },
    /**
     * export const upfileApi = params =>
     *   axios.post("/upfile_server/core/upfile/index", params);
     */
    upfileApi:Function,
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


  },
  watch:{
    value:{
      immediate:true,
      deep:true,
      handler(v,o){
        if(v){
          v = v || [];
          v.forEach(item =>{
            if(!item.status){
              item.status = 'done';
              item.uid = '';
            }
          })
          this.fileList = v;
        }
      }
    }
  },
  computed:{
    accept_loc(){
      if(this.accept){
        return this.accept;
      }


      return [this.getLimitType()].join(',');
    }
  },
  data(){
    return {
      /**
       {status:'uploading',filename:'测试文件测试文件.jpg'},{status:'error'},{
        status:'done',
        url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/case/2022/05/27/6290a08392c745bfc9f4c.png',
      },{
        status: 'done',
        url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/case/2022/05/27/6290a4f7a1b2d3c704647.mp4',
      },{
        status: 'done',
        url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/case/2022/05/27/6290a4f7a1b2d3c704647.mp3',
      },{
        status: 'done',
        url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/case/2022/05/27/6290a4f7a1b2d3c704647.pdf',
      }
       */
      fileList:[],
    }
  },

  methods:{
    getLimitType(){
      let type_str = '*/*';
      if(this.up_type == 'image'){
        type_str ='.jpg,.png,.jpeg';
      }
      if(this.up_type == 'video'){
        type_str ='.mp4';

      }
      if(this.up_type == 'image_video'){
        type_str ='.jpg,.png,.jpeg,.mp4';
      }
      return type_str;
    },
    checkType(file){
      let ok = false;
      let limitType = this.getLimitType();
      if(limitType == '*/*'){
        return true;
      }
      limitType.split(',').forEach(type =>{
        if(!ok){
          ok = file.name.toLowerCase().endsWith(type);
        }
      });
      if(!ok){
        this.$message.error('不允许该类型')
      }
      return ok;
    },
    beforeUpload(file){

      return new Promise((resolve,reject) => {
        if( this.onBeforeUpload){
          this.onBeforeUpload(file).then(res =>{
            if(res === false){
              reject();
            }else{
              if(this.checkType(file)){
                resolve(res);
              }else{
                reject();
              }
            }
          })

        }else{
          if(this.checkType(file)){
            resolve(file);
          }else{
            reject();
          }
        }
      });
    },
    upfile({file,onSuccess,onError,onProgress,is_retry}){
      console.log('xxxx');
      if(!is_retry){
        if(this.fileList.length >= this.max){
           onError({});
          return;
        }
        this.fileList.push(this.getFileInfo(file));
      }
      let formdata = new FormData();
      return new Promise(resolve => {
        formdata.append('file',file,file.name);
        formdata.append('biz_type',this.biz_type);
        formdata.append('is_store',this.is_store);
        let ext = AttachmentExt.getExt(file.name);
        if(ext == 'mp4' || ext == 'mov' || ext == '3gp'){
          formdata.append('makevideothumb',1);
        }
        this.upfileApi(formdata).then(res =>{
          if(res.ok){
            onSuccess(res);
          }else{
            onError(res);
          }
        }).catch(()=>{
          onError({'error':'网络错误'});
        })
      })

    },
    handleUploadChange({file}){
      let info = {
        'status':file.status,
      };
      if(file.status == 'done' && file.response && file.response.ok){
        info.url = file.response.url;
        info.thumburl = file.response.thumburl || file.response.video_thumburl;
        if(file.response.video_duration){
          info.video_duration = file.response.video_duration;
        }
      }
      this.changeFileInfo(file,info)


    },
    changeFileInfo(file,info){
      this.fileList.forEach(item =>{
        if(item.uid == file.uid){
          for(let key in info){
            this.$set(item,key,info[key]);
          }
        }
      });
      this.$emit('input',this.fileList);
      this.$emit('change',this.fileList);
    },
    changeVal(){
      // let list = this.fileList.filter(item => item.)
    },
    getFileInfo(file){
      return {
        filename:file.name,
        uid:file.uid,
        status:'uploading',//uploading done error removed
      }
    },
    retry(file){
      file.status = 'uploading';
      this.upfile({
        file,
        is_retry:true,
        onSuccess:()=>{
          file.status = 'done';
          this.handleUploadChange(file)
        },
        onError:()=>{
          file.status = 'error';
          this.handleUploadChange(file)
        },
        onProgress:()=>{

        },
      })
    },
    del(index){
      this.fileList.splice(index,1);
      this.$emit('input',this.fileList);
      this.$emit('change',this.fileList);
    },
    eye(index){
      this.$refs.modal.open(index);
    }

  }
}
</script>

<style scoped lang="less">
.img_w{
  margin-right: 10px; display: inline-flex;vertical-align: middle;background: #FAFAFA;
  position: relative;
  justify-content: center;
  align-items: center;
}
.img_w .del{
  position: absolute;
  color: red;
  right: 0;
  top:0;
  line-height: 1;
  cursor: pointer;
}
.btn{
  width: 86px;
  height: 86px;
  display:inline-flex;flex-wrap: wrap;flex-direction: column;align-items: center;justify-content: center;
  /*background: #F5F5F5;*/
  /*border-radius: 2px;*/
  /*border: 1px dashed #D9D9D9;*/
  text-align: center;color: #595959;

  cursor: pointer;
}
.up_list{
  display: flex;
  flex-wrap: wrap;
  .up_btn{
    width: 102px;
    height: 102px;

    margin-right: 8px;
  }

  .file_item{
      width: 102px;
      height: 102px;
      border-radius: 4px;
      margin-right: 8px;
      margin-bottom: 8px;
      .uploading{
        border-radius: 4px;
        background: rgba(31, 31, 31, 0.65);
        width: 100%;
        height: 100%;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .name{
          width: 100%;
          padding: 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.4;
          text-align: center;
        }
        position: relative;
        .del{
          position: absolute;
          right: 2px;
          top:2px;
        }
      }
      .error{
        border-radius: 4px;
        background: rgba(31, 31, 31, 0.65);
        width: 100%;
        height: 100%;
        color: #1890ff;
        display: flex;
        line-height: 1.2;
        cursor: pointer;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        .del{
          position: absolute;
          right: 2px;
          top:2px;
        }

      }
      .done{
        position: relative;
        width: 100%;
        height: 100%;
        img{
          width: 100%;
          height: 100%;
        }
        .bg{
          display: none;
          border-radius: 4px;
          position: absolute;
          left: 0;
          top:0;
          width: 100%;
          height: 100%;
          background: rgba(31, 31, 31, 0.65);
        }
        .op{
          position: absolute;
          left: 50%;
          top:50%;
          transform: translate(-50%,-50%);
          display: none;
          color: #fff;
          font-size: 20px;
          .del{
            cursor: pointer;
            margin-right: 5px;
          }
          .eye{
            cursor: pointer;
          }
        }

        &:hover{
          .bg{
            display: block;
          }
          .op{

            display: block;
          }
        }
      }
  }

}

</style>
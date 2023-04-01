<template>
  <div>
    <a-upload
        list-type="picture-card"
        name="file"
        :customRequest="upfile"
        accept=".jpg, .png, .jpeg "
        :file-list="fileList"
        multiple
        @change="handleUploadChange"
    >


      <div   class="btn" v-if="fileList.length < max || disabled">
        <a-icon type="plus" style="font-size: 32px;color: #8C8C8C;" />
        <!--<div style="line-height: 1;">-->
        <!--上传文件-->
        <!--</div>-->
      </div>


    </a-upload>
    <div style="margin:10px;" v-if="show_tip">
      格式支持：jpg、jpeg、png格式
    </div>
  </div>
</template>

<script>
export default {
  name: "xb-input-img-multiple",
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
    upfileApi:Function,

  },
  watch:{
    value:{
      immediate:true,
      deep:true,
      handler(v,o){
        if(v){
          this.changeListWithNewValule(v)
        }
      }
    }
  },
  data(){
    return {
      fileList:[],
    }
  },

  methods:{
    upfile({file,onSuccess}){
      let formdata = new FormData();
      return new Promise(resolve => {
        formdata.append('file',file,file.filename);
        formdata.append('biz_type',this.biz_type);
        formdata.append('is_store',this.is_store);
        this.upfileApi(formdata).then(res =>{
          onSuccess(res);
        })
      })

    },
    changeListWithNewValule(value){
      //只管新增不管删除，删除有其他管的
      let arr = value
      //查找在fileList中有没有
      arr.map(item=>{
        let findUrl = this.fileList.find(file=>{
          return item.url == file.url
        })
        if(!findUrl){
          this.fileList.push({
            uid:new Date().getTime() + Math.floor(Math.random()*1000000),  //必须给一个随机uid
            type:"image/png",
            status:"done",
            percent:100,
            url:item.url
          })
        }
      })
    },
    handleUploadChange(info){
      console.log(info);
      let fileList = [...info.fileList];
      if(fileList.length>this.max){
        fileList.pop()
      }else{
        fileList = fileList.map(file => {
          console.log(file.response);
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.fileList = fileList;
        if(info.file&&(info.file.status == 'done' || info.file.status == 'removed')){
          let urls = info.fileList.filter(item=>item.url).map(item=>{
            console.log(item.url);
            return {
              url:item.url
            }
          })
          this.$emit('input',urls);
          this.$emit('change',urls);
        }
      }

    },
    getParams() {
      let formData = {
        is_store: 1,
        biz_type: this.biz_type,
        ses_token: this.getCookie("_ses_token"),
      };
      return formData;
    },
    getCookie(c_name) {
      let c_start,c_end
      if (document.cookie.length>0)
      {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
          c_start=c_start + c_name.length+1
          c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length
          return unescape(document.cookie.substring(c_start,c_end))
        }
      }
      return ""
    }
  }
}
</script>

<style scoped>
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
</style>
<template>
<div style="display: flex;">
  <div   class="img_w" v-if="cur_value">
    <span class="del" @click="delVal">×</span>
    <xb-img-view :src="cur_value" style=" max-width: 100%;max-height: 100%;" />
  </div>
  <a-upload
      v-if="!cur_value"
      name="file"
      :action="upfile"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      accept=".jpg, .png, .jpeg "
  >


    <div   class="btn" >
      <a-icon type="plus" style="font-size: 24px;margin-top: 26px;" />
      <div style="line-height: 1;">
        上传文件
      </div>
    </div>

  </a-upload>
  <div style="margin:10px;">
    格式支持：jpg、jpeg、png格式
    <br>
    不超过10M
  </div>
</div>
</template>

<script>
export default {
  name: "xb-input-img-single",
  props:{
    value:{
      type:String,
      default:'',
    },
    biz_type:'',
    is_store:{
      type:[Number,String],
      default:1,
    },
    upfileApi:Function,
  },
  watch:{
    value:{
      handler(){
        this.cur_value =  (this.value);
      },
      immediate:true
    }
  },
  computed:{
    cur_value_preview(){
      if(this.cur_value.indexOf('/') === 0){
        return process.env.VUE_APP_HOST+this.cur_value;
      }
      return this.cur_value;
    }
  },
  data(){
      return {
        cur_value:'',
      }
  },
  methods:{
    beforeUpload(file){
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
        this.$message.error('请上传 jpg、jpeg、png 格式的图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error('请限制文件大小在10M以内!');
      }
      return isJpgOrPng && isLt2M;
    },
    upfile(file){
      let formdata = new FormData();
      return new Promise(resolve => {
        formdata.append('file',file,file.filename);
        formdata.append('biz_type',this.biz_type);
        formdata.append('is_store',this.is_store);
        this.upfileApi(formdata).then(res =>{
          if(res.ok){
            this.cur_value = res.url;
            this.$emit('input',res.url);
          }
        })
      })

    },
    delVal(){
      this.cur_value = '';
      this.$emit('input','');
    }
  }
}
</script>

<style scoped>
.img_w{
  width: 104px;height: 104px;display: inline-flex;margin-right: 10px; vertical-align: middle;background: #FAFAFA;
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
  background: #F5F5F5;width: 104px; height: 104px;display:inline-block;vertical-align: middle;border-radius: 2px;text-align: center;color: #595959;border: 1px dashed #D9D9D9;cursor: pointer;
}
</style>
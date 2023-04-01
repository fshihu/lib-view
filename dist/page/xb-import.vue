<template>
    <xb-simple-modal :title="title" ref="modal">
        <a-card title="模板下载" v-if="tempUrl">
            <p>
                请按照数据模板的格式准备导入数据，模板中的表头不可作任何修改，否则将会无法正常导入
            </p>
            <div style="cursor: pointer" @click="discretionTemplate">
                <a-icon type="file-excel" />
                <span style="color: rgb(55,101,205)">点击下载模板文件</span>
            </div>
        </a-card>
        <a-card title="选择需要导入的Excel文件">
            <a-upload
                    name="file"
                    accept=".xlsx, .xls, .csv ,.pdf "
                    :multiple="false"
                    :file-list="fileList"
                    :remove="handleRemove"
                    :before-upload="beforeUpload"
            >
                <a-button> <a-icon type="upload" /> 文件导入 </a-button>
            </a-upload>
        </a-card>
    </xb-simple-modal>
</template>

<script>


    export default {
        name: "xb-import",
        props:{
            title:{
                type:String,
                default:"导入模板"
            },
          /**
           * @var
           *  完整的路径，包括ses_token, //https://test.zf.xbcx.com.cn:20443/wq/admin/case_server/litigant/template?ses_token=xxxx 或 /wq/admin/case_server/litigant/template?ses_token=xxxx
           */
          tempUrl:{
                type:String,
                default:""
            },
            submitApi:{
                type:Function,
                default:()=>{
                    return ()=>{}
                }
            },
        },
        data(){
            return{
                 fileList:[]
            }
        },
        methods:{
            open(resolve){
                this.fileList=[] //重置上传列表
                this.$refs.modal.open(({ok})=>{
                    this.handleUpload(resolve,ok)
                });
            },
            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList;
            },
            beforeUpload(file) {
                this.fileList = [file];
                return false;
            },
            handleUpload(resolve,ok) {
                const { fileList } = this;
                const formData = new FormData();
                formData.append('file',fileList[0],fileList[0].filename);
                this.submitApi(formData).then(res=>{
                  if(resolve){
                      //ok(); //先直接关了弹窗都
                        resolve({res,ok});
                        return;
                  }
                    if(res.ok){
                      ok();
                      this.$message.success(res.data);
                    }else {
                        this.$message.error(res.error);
                    }
                })
            },
            discretionTemplate(){
                window.open( this.tempUrl,"_blank")
            },
        }
    }
</script>

<style scoped>
    /deep/ .ant-upload-list-item-info .anticon-loading,/deep/ .ant-upload-list-item-info .anticon-paper-clip{
        top: 5px;
    }
    /deep/ .ant-upload-list-item-name{
        padding-left: 22px;
    }
</style>
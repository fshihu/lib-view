<template>
<div style="height: 100%;display: flex; flex-direction: column; " class="xb-breadcrumb">
  <div style="background:#fff; height:44px;display: flex; align-items: center;">
    <span v-if="back" @click="backClick" style="cursor: pointer; color: #096DD9;width: 44px;height:44px;line-height:44px; text-align: center;display: inline-block;border-right: 1px solid #F0F0F0;">
      <a-icon type="arrow-left" />
    </span>
    <a-breadcrumb style="margin-left: 20px;">
      <a-breadcrumb-item v-for="item in items_loc">{{item.name}}</a-breadcrumb-item>
      <a-breadcrumb-item v-for="item in items">{{item.name}}</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
  <div style="flex: 1;height: 1px; padding: 16px;background: rgb(242,242,242);">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "xb-breadcrumb",
  props:{
    back:{
      type:Boolean,
      default:false,
    },
    go:{
      type:[Number,String],
      default:-1,
    },
    backConfirm:false,
    items:{
      type:Array,
      default(){
        return [{
          'name':'home'
        }];
      }
    }
  },
  data(){
    return {
      items_loc:[]
    }
  },
  watch:{
    $route(){
      setTimeout(()=>{
        this.changeItems();
      },200);

    },

  },
  created() {
    setTimeout(()=>{
      this.changeItems();
    },200);
  },
  methods:{
    changeItems(){
      let left_nav_name_path = new URLSearchParams(location.hash.substr(1)).get('left_nav_name_path') || '';
      console.log(this.$route.query);
      let path_arr = left_nav_name_path.split(',');

      this.items_loc = [];
      path_arr.forEach(path =>{
        if(path){
          this.items_loc.push({
            name:path,
          })
        }
      });
    },
    backClick(){
      if(this.backConfirm){
        this.$confirm({
          title: '确认返回？',
          content: h => <div ><span style="color:red;">返回后当前页面数据不保存</span>，你还要继续吗？</div>,
          okText: '继续',
          cancelText: '取消',
          onOk:() =>{
            this.$router.go(this.go);
          },

        });
      }else{
        this.$router.go(this.go);
      }
    }
  }
}
</script>

<style scoped>

</style>
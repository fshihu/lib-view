<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

import XbInputDateTimePicker from "../dist/input/xb-input-date-time-picker";
import {useAntdTable} from "../dist/hooks";
import XbInputAttachments from "../dist/input/xb-input-attachments/xb-input-attachments";
import {Enum} from "../dist/utils";

export class DispatchTypeEnum extends Enum {
  static ENUM_NAME = Symbol("DispatchTypeEnum");
  static TO_PRO = 2;
  static TO_LOOP_SYS = 6;
  static TO_INSPECTIONS = 7;

  static TO_COMMAND_CENTER = 10;
  static TO_CHILD_DEPARTMENT = 11;
  constructor() {
    super();
  }
  initAddDatas() {
    this.add(DispatchTypeEnum.TO_COMMAND_CENTER, "监督指挥中心");
    this.add(DispatchTypeEnum.TO_CHILD_DEPARTMENT, "下级部门");

    this.add(DispatchTypeEnum.TO_PRO, "专业部门");
    // this.add(DispatchTypeEnum.TO_INSPECTIONS, "监督巡查");
    this.add(DispatchTypeEnum.TO_LOOP_SYS, "行业单位");


    // this.add(DispatchTypeEnum.TO_INSPECTIONS, "监督巡查");
    // this.add(DispatchTypeEnum.TO_LOOP_SYS, "行业单位");
  }
}
console.log(DispatchTypeEnum.getValues());

export default {
  name: 'App',
  components: {
    XbInputAttachments,
    XbInputDateTimePicker

  },
  setup() {
    let has_err = false;
    const api = ({current, pageSize}, formData) => {
      return new Promise((resolve, reject) => {
        console.log(current);
        if (current == 3 && !has_err) {
          has_err = true;
          reject();
          return;
        }
        if(formData.isExport){
          resolve({
            ok:true
          });
          return;
        }
        setTimeout(() => {
          resolve({
            list: [{name: 'xxx'}, {name: 'bbb'}],
            page: {
              total: 10,
            }
          })
        }, 1000);
      });
    }
    let {tableProps, tableHandlers, tableOp} = useAntdTable(api,{init_request: false});
    return {
      tableProps,
      tableHandlers,
      tableOp,
    }
  },
  data(){
    return {
      postponeTime:'',
      form_data_1:{

      },
      form_data:{
        test6:[2],
        test8:[
          {
            status:'done',
            url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/case/2022/05/27/6290a08392c745bfc9f4c.png',
          },{
            status: 'done',
            url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/case/2022/05/27/6290a4f7a1b2d3c704647.mp4',
          },{
            status: 'done',
            url:'http://weixin.zftest.xbcx.com.cn/files/2022/07/26/32e345f95870a6dd8dc4c07760677ea9.mp3',
          },{
            status: 'done',
            url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/case/2022/05/27/6290a4f7a1b2d3c704647.pdf',
          },{
            status: 'done',
            url:'/upfile_server/download/http://10.81.83.29:8011/upfile_server/files/szcg_test/2/undefined/2022/06/08/62a079d1f090e725b3531.mp4',
          }
        ]
      },
      treeData:[
        {'key':1,value:1,title:'未关联',selectable:false,
          children:[{key:'11',value:'11',title:'下级1',
            children:[{key:'12',value:'12',title:'下级',isLeaf:true}],
          }]},
        {'key':2,value:2,title:'节点关联',
          children:[{key:'22',value:'22',title:'下级',isLeaf:true}]
        },{'key':3,value:3,title:'APP关联'},{'key':4,value:4,title:'标记关联'},],
      filterInputs:[
        {type:'select',props:{name:'withholdStatus',label:'状态111',show_all:false,placeholder:'搜索', default_value:1, list:[{id:1,name:'选项1'},{id:2,name:'选项2'}]}},
        {type:'select',props:{name:'withholdStatus1',label:'状态url',show_all:false, url:'/uss/bbb',}},
        {type:'select',props:{name:'withholdStatus2',label:'状态api',show_all:false, api:this.getList}},
        {type:'tree',props:{name:'uids',label:'登记人登记人登记人',list:[
            {'key':1,value:1,title:'未关联',selectable:false,
              children:[{key:'11',value:'11',title:'下级1',
                children:[{key:'12',value:'12',title:'下级',isLeaf:true}],
              }]},
              {'key':2,value:2,title:'节点关联',
                children:[{key:'22',value:'22',title:'下级',isLeaf:true}]
              },{'key':3,value:3,title:'APP关联'},{'key':4,value:4,title:'标记关联'},]}},
        {type:'time-range',props:{name:'createTime',label:'登记时间'}},
        {type:'input',props:{name:'withholdCode',label:'物品编号',default_value: 'bbb',reset_clear_default_value:true}},
        {type:'input',props:{name:'withholdName',label:'物品名称'}},
        {type:'select',props:{name:'withholdStatus1',label:'状态',list:[{id:1,name:'选项1'},{id:2,name:'选项2'}]}},
        {type:'time-range',props:{name:'createTime',label:'登记时间'}},
      ],
      tag_list:[],

      columns:[
        {
          dataIndex: 'name',
          key: 'name',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'name' },
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          scopedSlots: { customRender: 'tags' },
        },
        {
          title: 'Action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      upfileApi:(formdata)=>{//直接使用公共上传服务api即可
        formdata.append('ses_token','7BV1pQg1kTCL88L1r3sQuQ%2Bxkk5FODzXBADIuT6sCRp7jnS1mFMFEWNSBfLKv%2BhBmF7hCYMUFUuCYBUx%2BqhLqX6bTsANRrkICQBJjHV4i5jdQBhTNxZPuXU1%2FDUPGHPR');

        return new Promise(resolve => {
          fetch('/admin/upfile_server/core/upfile/index', {
            method: 'POST',
            body: formdata,
            // headers: {
            //   'Content-Type': 'multipart/form-data'
            // }
          }).then(res => {
            if(res.ok) {
              return res.json();
            } else {
              console.log('网络错误')
            }
          }).then(res => {
            resolve(res)
          })

        })


      },
      toMapUrl:'http://new.szcgtest.xbcx.com.cn/szcg/admin/upfile_server/core/upfile/mp3?ses_token=7BV1pQg1kTCL88L1r3sQuQ%2Bxkk5FODzXBADIuT6sCRp7jnS1mFMFEWNSBfLKv%2BhBmF7hCYMUFUuCYBUx%2BqhLqX6bTsANRrkICQBJjHV4i5jdQBhTNxZPuXU1%2FDUPGHPR'

    }
  },

  methods:{
    addTag(){
      this.tag_list.push('bb');
    },
    remove(index){
      this.tag_list.splice(index);
    },
    changeValue(v,item,cur_id){
      console.log(v,item,cur_id);
     // this.$set(this.form_data,'test3',[1]);
      console.log(this.form_data.test3);
    },
    openModal(){
      this.$refs.model.open(({ok,form_data})=>{

        console.log(form_data)
        ok();
      })
    },
    apiRequest(url,params){
      return vuecc.http.post('/baseurl'+url);
    },
    changeTree(){
      console.log('changeTree');
    },
    submit(){
      this.$refs.form.validate()
    }
  }
}
</script>

<style>
#app {

}
</style>

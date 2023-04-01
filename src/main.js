import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
import Antdv from "ant-design-vue";
import 'ant-design-vue/dist/antd.min.css';
Vue.config.productionTip = false
Vue.use(VueCompositionAPI);
import xb_lib from '../dist/index';
Vue.use(VueRouter)

Vue.use(Antdv);
Vue.use(xb_lib);

window.globalGetLayerServerConfig = () => {
  return new Promise(resolve => {
    /**
     static type_4326 = 1;
     static type_3857 = 2;
     static type_gaode = 3;
     */
    resolve({
      center:[113,23],
      urls: [
       
      ],
      type: 3,//
    })
  })

}
window.vuecc = {
  http:{
    post(){
      return new Promise(resolve => {
        resolve({ok:true,list:[{id:1,name:'bb'}]})
      })
    }
  }
}
const router = new VueRouter({
  mode: 'hash',
  routes:[
    {path:'/',component:()=> import('./list')},
    {path:'/test',component:()=> import('./test')},
    {path:'/map',component:()=> import('./map')},
  ]
});
function asyncLoadScript({ id, src, type = "async" }) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) return resolve();
    let script = document.createElement("script");
    if (["async", "defer"].indexOf(type) !== -1) script[type] = type;
    script.id = id;
    script.src = src;
    script.onload = () => setTimeout(() => resolve({ ok: true }), 50);
    script.onerror = () => reject({ ok: false });
    document.getElementsByTagName("head")[0].appendChild(script);
  }).catch(err => {
    console.error(err);
  });
}


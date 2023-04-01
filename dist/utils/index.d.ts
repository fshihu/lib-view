import type {App} from "vue";

/**
 * api请求缓存api
 */
export function fetchCache<T>(fetchFn:()=>Promise<T>,params?:object):Promise<T>;

/**
 * 处理返回按钮到app
 * @param router
 */
interface options  {
  appBackToReferer?:boolean,
  appBackToLast?:boolean,
  app:App,
}
export function routeGuardBack(router,options:options):void;

/**
 * 检查是否要回到app
 */
export function checkBackToApp():boolean;
/**
 * 设置返回回调
 */
export function setBackCallback(fn):void;

export class AttachmentExt{
  static image:string;
  static video:string;
  static audio:string;
  static file:string;
  /**
   * 获取扩展名，name可以是完整的url路径
   */
  static getType:(name:string)=>string;
  static isImage:(name:string)=>boolean;
  static isVideo:(name:string)=>boolean;
  static isAudio:(name:string)=>boolean;
}
export class LoginUtil{
  static getToken():string;
  static setToken(ses_token:string):void;
  static setTokenFromUrl():void;
  static setTokenKey(key:string):void;
  static clearToken():void;
}

export class Password{
  static encode(pwd:string):string;
  static simpleAes(str:string):string;
}
export class Enum{
  /**
   * 根据key获取值
   */
  static getValueByIndex:(key:string|number)=>string;
  static getValues:()=>[];
  abstract initAddDatas():void;
  add:(id:string|number, val:string) => void;
}
export class AttachmentIconEnum{
  /**
   * 获取图标，name可以是完整的url路径
   */
  static getIcon:(name:string)=>string;
}
export class LayerServer{
  toMapLayer(lng:string,lat:string):[string,string];
  addLayer(map,zIndex,AMap):void;
  toGaode(lng:string,lat:string):[string,string];
}
export function getLayerServer():Promise<{conf:{},layerServer:LayerServer}>;
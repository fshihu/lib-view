;(function() {
  //定义一些常量
  var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lon
   * @param bd_lat
   * @returns {*[]}
   */
  function bd09togcj02(bd_lon, bd_lat) {
    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
  }

  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function gcj02tobd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
  }

  /**
   * WGS84转GCj02
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function wgs84togcj02(lng, lat) {
    lng = lng *1;
    lat = lat * 1;

    if (out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat];
    }
  }

  /**
   * GCJ02 转换为 WGS84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function gcj02towgs84(lng, lat) {
    lng = lng *1;
    lat = lat * 1;

    if (out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat];
    }
  }

  function transformlat(lng, lat) {
    var ret =
      -100.0 +
      2.0 * lng +
      3.0 * lat +
      0.2 * lat * lat +
      0.1 * lng * lat +
      0.2 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((lat / 12.0) * PI) +
        320 * Math.sin((lat * PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  }

  function transformlng(lng, lat) {
    var ret =
      300.0 +
      lng +
      2.0 * lat +
      0.1 * lng * lng +
      0.1 * lng * lat +
      0.1 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((lng / 12.0) * PI) +
        300.0 * Math.sin((lng / 30.0) * PI)) *
        2.0) /
      3.0;
    return ret;
  }

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  function out_of_china(lng, lat) {
    return (
      lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
    );
  }
  window.geoTransUtil = {
    gcj02towgs84: gcj02towgs84,
    wgs84togcj02: wgs84togcj02,
    gcj02tobd09: gcj02tobd09
  };

  function _Math_sinh(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  }

  class TransformClassNormal {
    constructor(levelRange_max, LevelRange_min) {
      this.levelMax = levelRange_max;
      this.levelMin = LevelRange_min;
    }

    /*
     * 某一瓦片等级下瓦片地图X轴(Y轴)上的瓦片数目
     */
    _getMapSize(level) {
      return Math.pow(2, level);
    }

    /*
     * 分辨率，表示水平方向上一个像素点代表的真实距离(m)
     */
    getResolution(latitude, level) {
      let resolution =
        (6378137.0 * 2 * Math.PI * Math.cos(latitude)) /
        256 /
        this._getMapSize(level);
      return resolution;
    }

    _lngToTileX(longitude, level) {
      let x = (longitude + 180) / 360;
      let tileX = Math.floor(x * this._getMapSize(level));

      /**
       * 限定边界值, 解决 longitude=180 时边界值错误
       * latitude 应该没问题, 因为 latitude 不会取到 90/-90
       */
      tileX = Math.min(tileX, Math.pow(2, level) - 1);

      return tileX;
    }

    _latToTileY(latitude, level) {
      let lat_rad = (latitude * Math.PI) / 180;
      let y =
        (1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2;
      let tileY = Math.floor(y * this._getMapSize(level));

      // 代替性算法,使用了一些三角变化，其实完全等价
      //let sinLatitude = Math.sin(latitude * Math.PI / 180);
      //let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
      //let tileY = Math.floor(y * this._getMapSize(level));

      return tileY;
    }

    /*
     * 从经纬度获取某一级别瓦片坐标编号
     */
    lnglatToTile(longitude, latitude, level) {
      let tileX = this._lngToTileX(longitude, level);
      let tileY = this._latToTileY(latitude, level);

      return {
        tileX,
        tileY
      };
    }

    _lngToPixelX(longitude, level) {
      let x = (longitude + 180) / 360;
      let pixelX = x * this._getMapSize(level) * 256;

      return pixelX;
    }

    _latToPixelY(latitude, level) {
      let sinLatitude = Math.sin((latitude * Math.PI) / 180);
      let y =
        0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
      let pixelY = y * this._getMapSize(level) * 256;

      return pixelY;
    }

    /*
     * 从经纬度获取点在某一级别瓦片中的像素坐标
     */
    lnglatToPixel(longitude, latitude, level) {
      let pixelX = this._lngToPixelX(longitude, level);
      let pixelY = this._latToPixelY(latitude, level);

      return {
        pixelX,
        pixelY
      };
    }

    _pixelXTolng(pixelX, tileX, level) {
      let pixelXToTileAddition = pixelX / 256.0;
      let lngitude =
        ((tileX + pixelXToTileAddition) / this._getMapSize(level)) * 360 - 180;

      return lngitude;
    }

    _pixelYToLat(pixelY, tileY, level) {
      let pixelYToTileAddition = pixelY / 256.0;
      let latitude =
        (Math.atan(
          _Math_sinh(
            Math.PI *
              (1 -
                (2 * (tileY + pixelYToTileAddition)) / this._getMapSize(level))
          )
        ) *
          180.0) /
        Math.PI;

      return latitude;
    }

    /*
     * 从某一瓦片的某一像素点到经纬度
     */
    pixelToLnglat(pixelX, pixelY, level) {
      let tileX = parseInt(pixelX / 256, 10);
      let tileY = parseInt(pixelY / 256, 10);
      pixelX = pixelX % 256;
      pixelY = pixelY % 256;
      let lng = this._pixelXTolng(pixelX, tileX, level);
      let lat = this._pixelYToLat(pixelY, tileY, level);

      return {
        lng,
        lat
      };
    }
  }

  class TransformClassTianditu4326 {
    lnglatToPixel(lng, lat, zoom) {
      let bili1 = -(-180 - lng) / 360;
      let bili2 = (90 - lat) / 180;
      let pixY1 = Math.pow(2, zoom) * 256 * bili1;
      let pixY2 = Math.pow(2, zoom - 1) * 256 * bili2;
      return [pixY1, pixY2];
    }
    pixelToLnglat(pixelX, pixelY, zoom) {
      let bili1 = pixelX / (Math.pow(2, zoom) * 256);
      let m = bili1 * 360;
      let lng = -180 + m;

      let bili2 = pixelY / (Math.pow(2, zoom - 1) * 256);
      let m2 = bili2 * 180;
      let lat = 90 - m2;
      return [lng, lat];
    }
  }

  class LayerServer {
    constructor(urls, type) {
      this.urls = urls;
      this.type = type;
      this.layers = [];
    }
    addLayer(map, zIndex, AMap) {
      if (this.type == LayerServer.type_gaode) {
        return;
      }
      map.setFeatures([]);
      zIndex = zIndex || 100;
      AMap = AMap || window.AMap;
      this.urls.forEach(url => {
        const xyzTiandituTileLayer = new AMap.TileLayer({
          // 图块取图地址
          getTileUrl: (x, y, z) => {
            y = this._getY(x, y, z);
            if (this.type == LayerServer.type_4326_down_1) {
              z = z - 1;
            }
            let urlm = url.replace("{x}", x);
            urlm = urlm.replace("{y}", y);
            urlm = urlm.replace("{z}", z);
            return urlm;
          },
          zIndex: zIndex++
        });
        map.add(xyzTiandituTileLayer);
        this.layers.push(xyzTiandituTileLayer);
      });
      this.removeLogoAndCopyRight();
    }
    removeLayer(map) {
      this.layers.forEach(layer => {
        map.remove(layer);
      });
    }
    removeLogoAndCopyRight() {
      let logo = document.querySelector(".amap-logo");
      if (logo) {
        logo.parentNode.removeChild(logo);
      }
      let copyRight = document.querySelector(".amap-copyright");
      if (copyRight) {
        copyRight.parentNode.removeChild(copyRight);
      }
    }
    _getY(x, y, z) {
      if (this.type == LayerServer.type_4326 || this.type == LayerServer.type_4326_down_1) {
        y = y - Math.pow(2, z) / 4;
      }
      return y;
    }

    toMapLayer(lng, lat) {
      lng = lng*1;
      lat = lat*1;
      if (this.type == LayerServer.type_gaode) {
        return [lng, lat];
      }
      let z = 18;
      let s0 = geoTransUtil.gcj02towgs84(lng, lat);

      if (this.type == LayerServer.type_3857) {
        return s0;
      }
      let ts4326 = new TransformClassTianditu4326();
      var px = ts4326.lnglatToPixel(s0[0], s0[1], z);

      px[1] += (Math.pow(2, z) / 4) * 256;

      let ts = new TransformClassNormal(18, 3);
      let lnglat = ts.pixelToLnglat(px[0], px[1], z);

      if(this.type == LayerServer.type_4326_down_1){
        lnglat.lng = lnglat.lng -0.000435103;
        lnglat.lat = lnglat.lat -0.000301103;
      }
      return [lnglat.lng, lnglat.lat];
    }
    toGaode(lng, lat) {
      lng = parseFloat(lng);
      lat = parseFloat(lat);
      if (this.type == LayerServer.type_gaode) {
        return [lng, lat];
      }

      let z = 18;
      let s0 = geoTransUtil.wgs84togcj02(lng, lat);
      // pix = (90-s0[1])/45*256;
      if (this.type == LayerServer.type_3857) {
        return s0;
      }

      let ts = new TransformClassNormal(18, 3);
      var px = ts.lnglatToPixel(lng, lat, z);

      px.pixelY -= (Math.pow(2, z) / 4) * 256;

      let ts4326 = new TransformClassTianditu4326();
      let s1 = ts4326.pixelToLnglat(px.pixelX, px.pixelY, z);
      return geoTransUtil.wgs84togcj02(s1[0], s1[1]);
    }
  }
  LayerServer.type_4326 = 1;
  LayerServer.type_3857 = 2;
  LayerServer.type_gaode = 3;
  LayerServer.type_4326_down_1 = 4;//
  window.LayerServer = LayerServer;
})();

export const LayerServer = window.LayerServer;

export const getLayerServer = async () => {
  return new Promise(resolve => {
    if(window.globalGetLayerServerConfig){
      window.globalGetLayerServerConfig().then(conf =>{
        let layerServer = new LayerServer( [], LayerServer.type_gaode );
        if(conf.type && conf.urls){
          layerServer = new LayerServer(conf.urls,conf.type);
        }
        resolve({conf,layerServer});
      })
    }else{
      resolve({conf:{},layerServer:new LayerServer( [], LayerServer.type_gaode )});
    }
  })
};
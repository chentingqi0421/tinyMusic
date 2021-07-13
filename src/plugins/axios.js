"use strict";

import Vue from 'vue';
import axios from "axios";

let config = {
  // 请求地址
  baseURL:"http://www.linkk.asia:13000"
  // baseURL:'http://music.kele8.cn'
};

const _axios = axios.create(config);

// axios ajax请求的前置配置（请求之前）
_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // config.headers.biaoji = "hello add token";
    // url请求后面添加参数
    // config.url += "?token=88888";
    return config;
  },
  function(error) {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// Add a response interceptor
// axios ajax响应的前置配置（响应之前）
_axios.interceptors.response.use(
  function(response) {
    //响应成功
    return response;
  },
  function(error) {
    //响应错误
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  // 给VUE.原型添加属性方法
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
    $http:{
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin)

export default Plugin;

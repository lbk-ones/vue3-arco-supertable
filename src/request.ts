import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { Message } from "@arco-design/web-vue";

// Extend AxiosRequestConfig to support custom properties like skipLoading
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipLoading?: boolean;
  loadingText?: string;
}

interface RequestConfig extends AxiosRequestConfig {
  skipLoading?: boolean;
  loadingText?: string;
}

/**
 * 全部以 application/x-www-form-urlencoded 传参
 * @type {axios.AxiosInstance}
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  // headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  // },
});

// 请求计数器：处理并发请求，避免重复显示/提前隐藏 Loading
let requestCount = 0;

// 显示 Loading（封装，方便扩展）
const showLoading = (config: CustomAxiosRequestConfig | RequestConfig) => {
  // 若配置 skipLoading: true，则跳过显示
  if (config?.skipLoading) return;
  // 只有第一个请求时才显示 Loading
  if (requestCount === 0) {
    window.$loading.show(config.loadingText || "加载中...");
  }
  requestCount++;
};

// 隐藏 Loading（封装）
const hideLoading = (config: CustomAxiosRequestConfig | RequestConfig | undefined) => {
  if (config?.skipLoading) return;
  requestCount--;
  // 所有请求完成后才隐藏 Loading
  if (requestCount <= 0) {
    requestCount = 0; // 重置，避免负数
    window.$loading.hide();
  }
};

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    showLoading(config as CustomAxiosRequestConfig);
    return config;
  },
  function (error) {
    // Do something with request error
    hideLoading(error.config);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // data 为后端返回的数据
    const { config, data } = response;
    // 隐藏 Loading
    hideLoading(config as CustomAxiosRequestConfig);
    if (data.code !== "0") {
      const newVar = data?.Message || "请求失败";
      Message.error(newVar);
      console.error(newVar); // 示例：结合 Element Plus 提示
      return Promise.reject(newVar);
    }
    return data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { response } = error;
    hideLoading(error.config);
    let errMsg = "请求失败";

    // 1. 有响应（服务器返回了 status）
    if (response) {
      const { status, statusText, data } = response;
      // 优先使用接口返回的错误信息，无则用 statusText
      errMsg = data?.msg || statusText || errMsg;

      // 按 status 分类处理
      switch (status) {
        case 401:
          // Token 过期/未登录：清空 token + 跳转登录页
          errMsg = "未登录";
          break;
        case 403:
          errMsg = "无操作权限，请联系管理员";
          break;
        case 404:
          errMsg = "请求的资源不存在";
          break;
        case 429:
          errMsg = "操作过于频繁，请稍后再试";
          break;
        case 500:
        case 502:
        case 503:
          errMsg = "服务器异常，请稍后重试";
          // 可选：记录错误日志（如上报到监控平台）
          console.error("服务器错误：", error);
          break;
        default:
          // 400/405 等其他客户端错误
          errMsg = `请求错误(${status})：${errMsg}`;
      }
    } else {
      // 2. 无响应（网络错误/超时/取消请求）
      if (error.message && error.message.includes("timeout")) {
        errMsg = "请求超时，请检查网络";
      } else if (axios.isCancel(error)) {
        errMsg = "请求已取消";
        console.log(errMsg, error.message);
        return Promise.reject(error); // 取消请求不提示
      } else {
        errMsg = "网络异常，请检查网络连接";
      }
    }

    // 统一错误提示（排除取消请求）
    if (!axios.isCancel(error)) {
      Message.error(errMsg);
    }
    return Promise.reject(error);
  }
);

export function post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, config)
      .then((res) => {
        resolve(res as unknown as T);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    instance
      .put(url, data, config)
      .then((res) => {
        resolve(res as unknown as T);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function get<T = any>(url: string, params: any = null, config: RequestConfig = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        ...config,
        params: params,
      })
      .then((res) => {
        resolve(res as unknown as T);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function del<T = any>(url: string, params: any = null, config: RequestConfig = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        ...config,
        params: params,
      })
      .then((res) => {
        resolve(res as unknown as T);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

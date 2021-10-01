import axios from 'axios'
import { Toast } from 'vant'

// 当前loading的显示状态
let loading = false
// 当前正在内的请求数量
let requestCount = 0

const service = axios.create({
  // baseURL: '',
  // 统一超时时间，如有某个接口需要设置不同超时时间，可在调用接口是传入超时时间来覆盖这个超时时间
  timeout: 30 * 1000,
  // 请求是否携带cookie
  withCredentials: true
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token（接口未实现token，暂时不添加）
    // get请求添加时间戳
    if (config.method.toLowerCase === 'get') {
      config.params._t = new Date().getTime()
    }

    // 显示loading
    showLoading()

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 关闭loading
    closeLoading()

    // 200状态码
    if (response.status === 200) {
      return response.data
    }
  },
  err => {
    // 超时提示
    if (err.message.includes('timeout')) {
      Toast.fail('request timeout')
    }

    // 处理500等错误
    if (err.response.status === 500) {
      Toast.fail('server error')
    }

    return Promise.reject(err)
  }
)

/**
 * 显示loading
 */
function showLoading() {
  // 当前正在请求中的数量加一
  requestCount++

  // loading状态为隐藏，并且是第一个请求
  if (!loading && requestCount === 1) {
    Toast.loading('加载中...')
    loading = true
  }
}

/**
 * 关闭loading
 */
function closeLoading() {
  // 当前正在请求中的数量减一
  requestCount--

  // loading状态为展示，并且是最后一个请求
  if (loading && requestCount === 0) {
    Toast.clear()
    loading = false
  }
}

export default service
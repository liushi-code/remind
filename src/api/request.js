import axios from 'axios'
import message from 'ant-design-vue/es/message'

const axiosInstance = axios.create({
  baseURL: 'http://9.134.117.7:7001/api',
  timeout: 5000
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 404) {
      message.error(`404，访问的资源不存在${data.Message}`)
    } else if (error.response.status === 403) {
      message.error(`403，无权限访问 ${data.Message}`)
    } else if (error.response.status === 401) {
      message.error(`401，未认证 ${data.Message}`)
    } else if (error.response.status === 500) {
      message.error(`500 Error，message: ${data.Message}`)
    } else {
      message.error(`未知错误，status:${error.response.status} message: ${data.Message}`)
    }
  } else {
    message.error(`请求错误，错误信息：${error}`)
  }
  return Promise.reject(error)
}
axiosInstance.interceptors.request.use(config => {
  // const { method, data } = config
  // if (method.toUpperCase() === "POST" && data instanceof Object) {
  //   // 将对象转为url参数格式
  //   config.data = qs.stringify(data)
  // }
  return config
}, err)

axiosInstance.interceptors.response.use(response => {
  return response.data
}, err)

export default axiosInstance
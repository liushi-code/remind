import axios from './request'
// 查询定时任务
export function queryTask (parameter) {
  return axios({
    url: '/task/query',
    method: 'post',
    data: parameter
  })
}
// 新增定时任务
export function addTask (parameter) {
  return axios({
    url: '/task/add',
    method: 'post',
    data: parameter
  })
}
// 编辑定时任务
export function editTask (parameter) {
  return axios({
    url: '/task/modify',
    method: 'post',
    data: parameter
  })
}
// 删除定时任务
export function deleteTask (parameter) {
  return axios({
    url: '/task/delete',
    method: 'post',
    data: parameter
  })
}
// 暂停定时任务
export function pauseTask (parameter) {
  return axios({
    url: '/task/update',
    method: 'post',
    data: parameter
  })
}
import { post } from '@/utils/request'

export default {
  getUserList: data => post('/user/list', data),
  getVerifyList: data => post('/user/verify-step-list', data),
  addUser: data => post('/user/add', data),
  modifyUser: data => post('/user/modify', data),
  deleteUser: data => post('/user/delete', data)
}

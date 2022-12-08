import { post } from '@/utils/request'

export default {
  getUserList: data => post('/user/list', data),
  addUser: data => post('/user/add-modify', data),
  deleteUser: data => post('/user/delete', data)
}

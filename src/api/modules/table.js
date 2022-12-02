import { post } from '@/utils/request'

export default {
  getList: data => post('/vue-admin-template/table/list', data)
}

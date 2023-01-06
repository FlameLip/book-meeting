import { post } from '@/utils/request'

export default {
  getCallList: data => post('/meeting/history-list', data),
  getCallDetail: data => post('/meeting/history-detail', data)
}

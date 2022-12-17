import { post } from '@/utils/request'

export default {
  getHistoryList: data => post(' /meeting/history-list', data)
}

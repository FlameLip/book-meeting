import { post } from '@/utils/request'

export default {
  getPhoneCodeWhiteList: data => post('/system/phone-code-white-list', data),
  modifyPhoneCodeWhite: data => post('/system/phone-code-white-modify', data)
}

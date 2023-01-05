import { post } from '@/utils/request'

export default {
  getPhoneCodeWhiteList: data => post('/system/phone-code-white-list', data),
  addPhoneCodeWhite: data => post('/system/phone-code-white-add', data),
  modifyPhoneCodeWhite: data => post('/system/phone-code-white-modify', data),
  deletePhoneCodeWhite: data => post('/system/phone-code-white-delete', data),
  getRelationList: data => post('/family/relation-list', data)
}

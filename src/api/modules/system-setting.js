import { post } from '@/utils/request'

export default {
  getPrisonId: data => post('/system/prison-id-finder', data),
  addPrison: data => post('/system/prison-add', data),
  getAreaList: data => post('/system/area-list', data),
  setAreaList: data => post('/system/area-config', data)
}

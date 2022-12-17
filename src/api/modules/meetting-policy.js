import { post } from '@/utils/request'

export default {
  getMeetingRule: data => post('/system/meeting-rule-detail', data),
  addMeetingRule: data => post('/system/meeting-rule-modify', data),
  getMeetingTime: data => post('/system/meeting-time-range-list', data),
  addMeetingTime: data => post('/system/meeting-time-range-config', data),
  unusualConfig: data => post('/system/unusual-config', data),
  unusualList: data => post('/system/unusual-list', data),
  deleteUnusual: data => post('/system/unusual-delete', data)
}

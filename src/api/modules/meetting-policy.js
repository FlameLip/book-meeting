import { post } from '@/utils/request'

export default {
  getMeetingRule: data => post('/system/meeting-rule-detail', data),
  addMeetingRule: data => post('/system/meeting-rule-modify', data),
  getMeetingTime: data => post('/system/meeting-time-range-list', data),
  getMeetingTime: data => post('/system/meeting-time-range-list', data),
  unusualConfig: data => post('/system/unusual-config', data)
}

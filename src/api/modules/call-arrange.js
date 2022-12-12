import { post } from '@/utils/request'

export default {
  getWeekdayAreaInfo: data => post('/system/meeting-weekday-time-info', data),
  setWeekdayAreaInfo: data => post('/system/meeting-weekday-time-config', data),
  getHolidayConfig: data => post('/system/meeting-holiday-config-list', data),
  setHolidayConfig: data =>
    post('/system/meeting-holiday-config-add-modify', data),
  deleteHolidayConfig: data =>
    post('/system/meeting-holiday-config-delete', data)
}

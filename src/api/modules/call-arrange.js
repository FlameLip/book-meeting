import { post } from '@/utils/request'

export default {
  getWeekdayAreaInfo: data => post('/system/weekday-area-info', data),
  setWeekdayAreaInfo: data => post('/system/weekday-area-config', data),
  getHolidayConfig: data => post('/system/holiday-config-list', data),
  setHolidayConfig: data => post('/system/holiday-config-add-modify', data),
  deleteHolidayConfig: data => post('/system/holiday-config-delete', data)
}

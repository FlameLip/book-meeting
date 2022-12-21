import { post } from '@/utils/request'

export default {
  getMettingArrangeList: data => post('/meeting/apply-list-2', data),
  getMettingUsableList: data => post('/meeting/usable-time-list-2', data),
  mettingRoomArrange: data => post('/meeting/apply-room-arrangement', data)
}

import { post } from '@/utils/request'

export default {
  getApplyList: data => post('/meeting/apply-list', data),
  getUsableTimeList: data => post('/meeting/usable-time-list', data),
  getApplyDeteil: data => post('/meeting/apply-detail', data),
  applyrAccept: data => post('/meeting/apply-accept', data),
  applyrReject: data => post('/meeting/apply-reject', data),
  getApplyrRejectList: data => post('/meeting/apply-reject-reason-list', data)
}

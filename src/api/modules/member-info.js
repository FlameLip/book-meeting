import { post } from '@/utils/request'

export default {
  getMemberList: data => post('/family/member-list', data),
  getMemberDetail: data => post('/family/member-detail', data),
  memberAccept: data => post('/family/member-accept', data),
  memberReject: data => post('/family/member-reject', data)
}

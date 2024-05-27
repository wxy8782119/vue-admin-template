import mockRequest from '@/utils/mockRequest'

export function getList(params) {
  return mockRequest({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

import { defAxios as request } from '@/utils/http'

export function getUsers(params = {}) {
  console.log('getUsers')
  return request({
    url: '/users',
    method: 'get',
    params,
  })
}

export function getUser(id) {
  console.log('getUser')
  if (id) {
    return request({
      url: `/user/${id}`,
      method: 'get',
    })
  }
  return request({
    url: '/user',
    method: 'get',
  })
}

export function saveUser(data = {}, id) {
  if (id) {
    return request({
      url: '/user',
      method: 'put',
      data,
    })
  }

  return request({
    url: `/user/${id}`,
    method: 'put',
    data,
  })
}

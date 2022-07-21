import { defAxios as request } from '@/utils/http'

export const login = (data) => {
  console.log('在login')
  console.log(data)
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export const refreshToken = () => {
  return request({
    url: '/auth/refreshToken',
    method: 'post',
  })
}

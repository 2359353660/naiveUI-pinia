import { defineStore } from 'pinia'
import { getUser } from '@/api/user'
import { removeToken } from '@/utils/token'
import { toLogin } from '@/utils/auth'
import { login } from '@/api/auth/index'
import { setToken } from '@/utils/token'
import { lStorage } from '@/utils/cache'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: lStorage.get('userInfo') || {},
    }
  },
  getters: {
    userId() {
      return this.userInfo?.id
    },
    username() {
      return this.userInfo?.username
    },
    avatar() {
      return this.userInfo?.avatar
    },
    role() {
      return this.userInfo?.role || []
    },
  },
  actions: {
    login(username, password) {
        return new Promise((resolve, reject) => {
          login({ username, password})
              .then(res => {
                  const { code, data, message = ''} = res;
                  if(1001 == code) {
                    const token = data.token;
                    setToken(token);
                    console.log(`Get token=${token}, ready get res...`)
                    console.log(`Get res=${JSON.stringify(res)}, ready get userInfo...`)
                    console.log(this)
                    return this.getUserInfo()
                  } else {
                    $message.warning("登陆失败")
                    reject(message)
                  }
              })
              .then(userInfo => {
                  console.log(`Get userInfo = ${JSON.stringify(userInfo)}`);
                  lStorage.set('userInfo', userInfo, 3600 * 6);
                  console.log('Set userInfo to storage');
                  resolve(userInfo);
              })
              .catch(err => reject(err))
        })
    },
    async getUserInfo() {
      console.log('store userjs getUserInfo')
      try {
        const res = await getUser()
        console.log(res)
        if (res.code === 1001) {
          const { id, username, avatar, role } = res.data
          this.userInfo = { id, username, avatar, role }
          return Promise.resolve(res.data)
        } else {
          return Promise.reject(res)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      removeToken()
      this.userInfo = {}
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})

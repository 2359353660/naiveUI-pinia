import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { NOT_FOUND_ROUTE } from '@/router/routes'
import { getToken, refreshAccessToken, removeToken } from '@/utils/token'
import { toLogin } from '@/utils/auth'

const WHITE_LIST = ['/login', '/redirect']
export function createPermissionGuard(router) {
  console.log('createPermissionGuard')
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  router.beforeEach(async (to, from, next) => {
    const token = getToken()
    console.log("beforeEach "+token)
    if (token) {
      console.log("to.path "+to.path)
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        console.log("userStore.userId "+ userStore.userId)
        console.log(Boolean(userStore.userId))
        if (userStore.userId) {
          // 已经拿到用户信息
          console.log('获取用户信息成功')
          refreshAccessToken()
          next()
        } else {
          await userStore.getUserInfo().catch((error) => {
            removeToken()
            toLogin()
            debugger
            console.log('获取用户信息失败')
            $message.error(error.message || '获取用户信息失败！')
            return
          })
          const accessRoutes = permissionStore.generateRoutes(userStore.role)
          accessRoutes.forEach((route) => {
            !router.hasRoute(route.name) && router.addRoute(route)
          })
          router.addRoute(NOT_FOUND_ROUTE)
          next({ ...to, replace: true })
        }
      }
    } else {
      if (WHITE_LIST.includes(to.path)) {
        next()
      } else {
        next({ path: '/login', query: { ...to.query, redirect: to.path } })
      }
    }
  })
}

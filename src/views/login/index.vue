<template>
  <div class="login-bg" f-c-c h-full>
    <div class="login-wrapper" flex w-full max-w-1020>
      <div p-40 border-r border-gray-200>
        <img src="@/assets/images/login_banner.png" height="380" alt="login_banner" />
      </div>

      <div w-full f-c-c flex-col>
        <h5 f-c-c w-full p-15 text-24 font-normal color="#6a6a6a">
          <icon-custom-logo mr30 text-50 />
          {{ title }}
        </h5>
        <div mt-30 w-full max-w-360>
          <n-input
            v-model:value="loginInfo.username"
            autofocus
            class="text-16 items-center h-50 pl-10"
            placeholder="账号"
            :maxlength="20">
          </n-input>
        </div>
        <div mt-30 w-full max-w-360>
          <n-input
            v-model:value="loginInfo.password"
            class="text-16 items-center h-50 pl-10"
            type="password"
            show-password-on="mousedown"
            placeholder="密码"
            :maxlength="20"
            @keydown.enter="handleLogin" />
        </div>

        <div mt-20 w-full max-w-360>
          <n-checkbox :checked="isRemember" label="记住我" :on-update:checked="(val) => (isRemember = val)" />
        </div>

        <div mt-20 w-full max-w-360>
          <n-button w-full h-50 rounded-5 text-16 type="primary" @click="handleLogin">登录</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { lStorage } from '@/utils/cache'
import { useStorage } from '@vueuse/core'
import { useUserStore } from '@/store/modules/user';

const title = import.meta.env.VITE_APP_TITLE

const router = useRouter()
const query = unref(router.currentRoute).query

const useStore = useUserStore()

const loginInfo = ref({
  username: '',
  password: '',
})

initLoginInfo()

function initLoginInfo() {
  const localLoginInfo = lStorage.get('loginInfo')
  if (localLoginInfo) {
    loginInfo.value.username = localLoginInfo.username || ''
    loginInfo.value.password = localLoginInfo.password || ''
  }
}

let isRemember = useStorage('isRemember', false)
async function handleLogin() {
  const { username, password } = loginInfo.value
  if (!username || !password) {
    $message.warning('请输入用户名和密码')
    return
  }
  $message.loading('正在验证...')
  useStore.login(username, password).then(userInfo => {
    console.log('Login successfully', JSON.stringify(userInfo));
    $message.success('登录成功')
    if (isRemember.value) {
      lStorage.set('loginInfo', { username, password })
    } else {
      lStorage.remove('loginInfo')
    }
    if (query.redirect) {
      const path = query.redirect
      console.log(path)
      Reflect.deleteProperty(query, 'redirect')
      router.push({ path, query })
    } else {
      console.log('目前走的path是‘/’')
      router.push('/')
    }
  }).catch(err => console.log(err))
  /*
  try {
    const res = await login({ username, password: password.toString() })
    console.log(res)
    if (res.code === 1001) {
      console.log("code == 1001")
      // useStore.setUserInfo({
      //   // id : 1,
      //   // username : 'abc',
      //   avatar : 'http://www.baidu.com/1.gif'
      // });
      $message.success('登录成功')
      // setToken(res.data.token)
      console.log(res.data.token)
      if (isRemember.value) {
        lStorage.set('loginInfo', { username, password })
      } else {
        lStorage.remove('loginInfo')
      }
      if (query.redirect) {
        const path = query.redirect
        console.log(path)
        Reflect.deleteProperty(query, 'redirect')
        router.push({ path, query })
      } else {
        console.log('目前走的path是‘/’')
        router.push('/')
      }
    } else {
      $message.warning(res.message)
    }
  } catch (error) {
    $message.error(error.message)
  }*/
}
</script>

<style lang="scss" scoped>
.login-bg {
  background-size: cover;
}

.login-bg {
  background-image: url(src/assets/images/login_bg.jpg);
}

.login-wrapper {
  box-shadow: 1.5px 3.99px 27px 0px rgb(0 0 0 / 10%);
  background-color: rgba(255, 255, 255, 0.6);
}
</style>

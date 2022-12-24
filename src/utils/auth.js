/*
 * @Descripttion:
 * @Version: 1.0
 * @Author: FlameLip 18070568168@163.com
 * @Date: 2022-12-01 16:00:19
 */
// import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

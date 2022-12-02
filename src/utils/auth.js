/*
 * @Descripttion:
 * @Version: 1.0
 * @Author: jianlvqi jianlvqi@jxcc.com
 * @Date: 2022-12-01 16:00:19
 */
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

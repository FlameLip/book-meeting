/*
 * @Descripttion:
 * @Version: 1.0
 * @Author: FlameLip 18070568168@163.com
 * @Date: 2022-12-01 16:00:19
 */
import defaultSettings from '@/settings'

const title = defaultSettings.title

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

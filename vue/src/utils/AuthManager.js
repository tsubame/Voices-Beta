import { CONSTANTS } from "../consts/ConstantVals.js"


//======================================================
//
// 1-1. ログイン中かを返す
//
//======================================================

/**
 * ログイン中かを返す
 */
export function checkIsLogin() {  
  // IDをCookieからセット
  let id = this.getCookie(CONSTANTS.COOKIE_KEY_TWITTER_ID)
  console.log("Cookie内のTwitterID:" + id)

  // 空ならリダイレクト
  if (id == null) {
    console.log("id未セットのためリダイレクト対象")

    return false
  }     

  return true
}
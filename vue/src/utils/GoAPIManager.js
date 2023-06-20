//======================================================
//
// Go API関連のマネージャ
//
// [索引]
//  □ 1-1. 部屋一覧をGoのAPIからセット
//  □ 1-2. 対象の部屋のデータをGoのAPIからセット
//  □ 
//
//======================================================

import { CONSTANTS } from "../consts/ConstantVals.js"
import axios from 'axios'
import https from 'https-browserify' // 追加

// APIキーデータ
let _apiKeyData = {
  apiKey:    "",
  apiSecret: "",
}

// URLのプレフィックス
//let _apiUrlPrefix = ""; //window.location.protocol + '//' + window.location.hostname + CONSTANTS.API_URL_GO_PORT + "/"

//======================================================
//
// 1-1. 部屋一覧をGoのAPIからセット
//
//======================================================

/**
 * 部屋一覧をGoのAPIからセット
 */
export async function getAllRoomDatas() {

  // API URLをセット  
  let apiURL = getAPIURLPrefix() + CONSTANTS.API_URL_GO_ROOM_READ_ALL;
  console.log("[API接続]" + apiURL)

  // 変数初期化
  let rooms = []

  /*
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  axios.defaults.httpsAgent = agent;
  */
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  await axios
    // axiosで通信
    .get(
      apiURL,
      { httpsAgent })
    .then(response => {
      rooms = response.data;
      console.log(rooms)
    })
    .catch(error => {
      console.log(error);
    })

  return rooms
}

//======================================================
// API URLのプレフィックスをセット
//======================================================

/**
 * API URLのプレフィックスをセット
 */
function getAPIURLPrefix() {
  let apiUrlPrefix;

  try {
    apiUrlPrefix = window.location.protocol + '//' + window.location.hostname;
    
    // 本番環境なら
    if (window.location.hostname.indexOf(CONSTANTS.DEV_SERVER_HOSTNAME_KEYWORD) === -1) {
      console.log("[本番環境]")
      apiUrlPrefix += CONSTANTS.API_URL_GO_PORT_PRODUCT + "/"
    // 開発環境ならポート番号を付与
    } else {
      console.log("[開発環境]")
      apiUrlPrefix += CONSTANTS.API_URL_GO_PORT_DEV + "/"
    }
  } catch (error) {
    console.error(error)
  }

  return apiUrlPrefix
}


//======================================================
//
// 1-2. アクティブな部屋一覧をGoのAPIからセット
//
//======================================================

/**
 * 部屋一覧をGoのAPIからセット
 */
export async function getActiveRoomDatas() {

  // API URLをセット  
  let apiURL = getAPIURLPrefix() + CONSTANTS.API_URL_GO_ROOM_READ_ACTIVE;
  console.log("[API接続]" + apiURL)
  // 変数初期化
  let rooms = []

  /*
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  axios.defaults.httpsAgent = agent;  
  */
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  await axios
    // axiosで通信
    .get(
      apiURL,
      { httpsAgent })
    .then(response => {
      rooms = response.data;
      console.log(rooms)
    })
    .catch(error => {
      console.log(error);
    })

  return rooms
}

//======================================================
//
// 1-3. 対象の部屋のデータをGoのAPIからセット
//
//======================================================

/**
 * 対象の部屋のデータをGoのAPIからセット
 */
export async function getTargetIdRoomData(roomId) {
  // 変数初期化
  let tRoom = {}

  try {      
    // API URLをセット  
    // API URLをセット  
    let apiURL = getAPIURLPrefix() + CONSTANTS.API_URL_GO_ROOM_READ_TARGET_ID + roomId;
    console.log("[API接続]" + apiURL)

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    await axios
      // axiosで通信
      .get(
        apiURL,
        { httpsAgent })
      .then(response => {
        tRoom = response.data;
        console.log(tRoom)
      })
      .catch(error => {
        console.log(error);
      })
  } catch (error) {        
    console.error(error);      
  }

  return tRoom
}

//======================================================
//
// 2-1. SkywayのAPIキー、APIシークレットを返す
//
//======================================================

/**
 * SkywayのAPIキー、APIシークレットを返す
 */
export async function getAPIKeys() {
  try {      
    // API URLをセット  
    let apiURL = getAPIURLPrefix() + CONSTANTS.API_URL_GO_SKYWAY_KEYS

    /*
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    axios.defaults.httpsAgent = agent;
    */

    await axios
      // axiosで通信
      .get(apiURL)
      .then(response => {
        _apiKeyData = response.data;
        //console.log(_apiKeyData)
      })
      .catch(error => {
        console.log(error);
      })    
  } catch (error) {        
    console.error(error);      
  }

  return _apiKeyData;  
}

//======================================================
//
// 3-1. roomsへデータ登録用のURLを返す
//
//======================================================

/**
 * roomsへデータ登録用のURLを返す
 */
export function getRoomCreateURL() {
  // 変数初期化
  let apiURL = ""

  try {      
    // API URLをセット  
    apiURL = getAPIURLPrefix() + CONSTANTS.API_URL_GO_ROOM_CREATE;
    console.log("[API接続]" + apiURL)
  } catch (error) {        
    console.error(error);      
  }

  return apiURL
}
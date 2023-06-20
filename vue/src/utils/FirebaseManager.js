//======================================================
//
// FirabaseManager.js FireBase関連の処理管理用
//
// [索引]
//  □ 1-1. 匿名認証実行
//  □ 1-2. google認証実行
//  □ 1-3. Twitter認証実行
//
//  □ 2-1. FireBaseDBの特定キーにデータを追加
//  □ 2-2. FireBaseDBの特定のキーを更新
//  □ 2-3. FireBaseDBの特定のキーを削除
//  □ 2-4. FireBaseDBの特定のキーを監視
//
//  □ 3-1. チャットデータを追加
//  □ 3-2. 対象の部屋のChatsデータを監視
//  □ 3-3. 対象の部屋のListnerデータを監視
//  □ 3-4. 対象の部屋のListnerデータを削除
//
//======================================================

// FireBase
import { getDatabase, ref, set, get, push, onValue, remove } from "firebase/database";
// FireBase認証
import {  getAuth, signInAnonymously, onAuthStateChanged, signInWithRedirect, 
          GoogleAuthProvider, getRedirectResult, TwitterAuthProvider,
          setPersistence, browserLocalPersistence
       } from "firebase/auth";

// 定数
import { CONSTANTS } from "../consts/ConstantVals"

// ユーザ情報
let authedUser;

// ログイン済か
let hasLoginned;

//======================================================
//
// 1-1. 匿名認証実行
//
//======================================================

/**
 * 匿名認証実行
 */
export async function initAuthAnonymous() {
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      console.log("[google匿名認証実行]")
    })
    .catch((error) => {
      console.log(error.message);
    });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //console.log(user.uid)
    }
  });    
}

//======================================================
//
// 1-2. google認証実行
//
//======================================================

/**
 * google認証実行
 */
export async function initAuthByGoogle() {
  const auth = getAuth();
  // ユーザー情報を取得
  await getRedirectResult(auth).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const authedUser = result.user;

    console.log(`ログイン情報：${authedUser} ${token}`);
    console.log(authedUser);
    console.log(authedUser.displayName);
    hasLoginned = true;

    return
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const credential = GoogleAuthProvider.credentialFromError(error);

    console.log(`Error!! ${errorCode}${errorMessage}${credential}`)
  });

  console.log(`ログイン済：${hasLoginned}`)

  if (hasLoginned) {
    return;
  }

  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    authedUser = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    console.log(`sined in by google ${authedUser} ${token}`)
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...

    console.log(`Error!! ${errorCode}${errorMessage}${email}${credential}`)
  });
}

//======================================================
//
// 1-3. Twitter認証実行
//
//======================================================

/**
 * Twitter認証実行
 */
export async function initAuthByTwitter() {
  const auth = getAuth();  
  const provider = new TwitterAuthProvider();

  console.log(`ログイン情報：${authedUser}`)
  console.log(`ログイン済：${hasLoginned}`)

  if (hasLoginned) {
    return;
  }

  setPersistence(auth,browserLocalPersistence).then(() => {
    signInWithRedirect(auth, provider).then(() => {
      getRedirectResult(auth)
        .then((result) => {
          authedUser = result.user;

          console.log(authedUser);
          console.log(authedUser.displayName);          
        });
    });
  })
}

//======================================================
//
// 2-1. FireBaseDBの特定キーにデータを追加
//
//======================================================

/**
 * FireBaseDBの特定キーにデータを追加
 * 
 * @param {*} key 
 * @param {*} val 
 */
export async function pushDataToDB(key, val) {
  try {      
    // データを追加
    const newRef = await push(ref(getDatabase(), key), val);
    //console.log(newRef);   

    return newRef.key;
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 2-2. FireBaseDBの特定のキーを更新
//
//======================================================

/**
 * FireBaseDBの特定のキーを更新
 * 
 * @param string key 
 * @param callback 
 */
export async function updateTargetKey(key, val) {
  try {      
    const db = getDatabase();
    await set(ref(db, key), val);
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 2-3. FireBaseDBの特定のキーを削除
//
//======================================================

/**
 * FireBaseDBの特定のキーを削除
 * 
 * @param string key 
 */
export async function deleteTargetKey(keyToDelete) {
  try {      
    await remove(ref(getDatabase(), keyToDelete))
      .then(() => {
        console.log("[削除が完了しました]" + keyToDelete);
      })
      .catch((error) => {
        console.error("削除中にエラーが発生しました", error);
      });
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 2-4. FireBaseの特定のキーのデータを取得（※未作成）
//
//======================================================

/**
 * FireBaseDBの特定のキーを監視
 * 
 * @param string key 
 * @param callback 
 */
export async function getTargetKeyVal(key) {
  let vals = [];

  try {      
    const db = await getDatabase();
    // 取得するキーを指定して、get()関数を呼び出す
    await get(ref(db, key))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            vals.push(childData);
          });        
        } else {
          console.log("データが存在しません " + key);
        }
      })
      .catch((error) => {
        console.error("データの取得中にエラーが発生しました", error);
      });
  } catch (error) {        
    console.error(error);      
  }

  return vals;
}

//======================================================
//
// 2-5. FireBaseDBの特定のキーを監視
//
//======================================================

/**
 * FireBaseDBの特定のキーを監視
 * 
 * @param string key 
 * @param callback 
 */
export async function watchTargetKey(key, callback) {
  try {      
    const dbRef = await ref(getDatabase(), key);
    onValue(dbRef, callback)
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 3-1. FireBaseDBにチャットデータを追加
//
//======================================================

/**
 * FireBaseDBにチャットデータを追加
 * 
 * @param {*} roomID    部屋ID
 * @param {*} chatData  チャットデータ
 */
export function addChatDataToDB(roomID, chatData) {
  try {      
    // キーをセット
    const dbKey = `${CONSTANTS.FB_TABLE_ROOM_CHATS}/${roomID}`
    // データを追加
    pushDataToDB(dbKey, chatData)
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 3-2. 対象の部屋のChatsデータを監視
//
//======================================================

/**
 * 対象の部屋のChatsデータを監視
 *  ・データは逆順に取得する
 * 
 * @param {*} roomId 
 * @param {*} chats 
 */
export function watchTargetRoomChats(roomId, callback) {
  try {      
    // キーをセット
    const dbKey = `${CONSTANTS.FB_TABLE_ROOM_CHATS}/${roomId}`
    console.log("[FirebaseDB Chatsキー]" + dbKey)

    // chatsテーブルの変更を監視
    watchTargetKey(dbKey, (snapshot) => {
      var dataArray = [];
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        dataArray.push(childData);
      });

      // 配列を逆順にする
      dataArray.reverse();
      console.log('[chatsデータ監視]')

      // データをセット
      //chats = dataArray;
      callback(dataArray)
    })
  } catch (error) {        
    console.error(error);      
  }  
}

//======================================================
//
// 4-1. 対象の部屋のListnerデータを監視
//
//======================================================

/**
 * 対象の部屋のListnerデータを監視
 * 
 * @param {*} roomId 
 * @param {*} chats 
 */
export async function watchTargetRoomListnerDatas(roomId, callback) {
  try {      
    // キーをセット
    const dbKey = `${CONSTANTS.FB_TABLE_ROOM_LISTNERS}/${roomId}`
    console.log("[FirebaseDB Listnersキー]" + dbKey)

    // chatsテーブルの変更を監視
    await watchTargetKey(dbKey, (snapshot) => {
      var dataArray = [];
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        dataArray.push(childData);
      });

      console.log('[listnersデータ監視]')

      // データをセット      
      callback(dataArray)
    })
  } catch (error) {        
    console.error(error);      
  }  
}

//======================================================
//
// 4-2. 対象の部屋のListnerデータを取得
//
//======================================================

/**
 * 対象の部屋のListnerデータを取得
 * 
 * @param {*} roomId 
 * @param {*} chats 
 */
export async function getTargetRoomListnerDatas(roomId) {
  let vals = [];

  try {      
    // キーをセット
    const dbKey = `${CONSTANTS.FB_TABLE_ROOM_LISTNERS}/${roomId}`
    console.log("[FirebaseDB Listnersキー]" + dbKey)

    // chatsテーブルの変更を監視
    vals = await getTargetKeyVal(dbKey)
    //console.log("[FireBaseListnerデータ取得]")
    //console.log(vals)
  } catch (error) {        
    console.error(error);      
  }  

  return vals;
}

//======================================================
//
// 4-3. FireBaseDBにListnerデータを追加
//
//======================================================

/**
 * FireBaseDBにListnerデータを追加
 * 
 * @param {*} roomID       部屋ID
 * @param {*} listnerData  listnerデータ
 */
export async function addListnerDataToDB(roomId, listnerData) {
  try {      
    // キーをセット
    const dbKey = `${CONSTANTS.FB_TABLE_ROOM_LISTNERS}/${roomId}`
    // 入室済みならスキップ
    const res = await checkTargetUserAlreadyJoinedToTargetRoom(roomId, listnerData.userId)
    if (res) {
      console.log("[入室済みなのでListnerデータ登録スキップ]")

      return
    }

    // データ追加
    const insertedKey = await pushDataToDB(dbKey, listnerData)
    console.log(insertedKey);   
    
    return insertedKey
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 4-4. FireBaseDBから対象Listnerデータを削除
//
//======================================================

/**
 * FireBaseDBから対象Listnerデータを削除
 * 
 * @param {*} roomId       部屋ID
 * @param {*} key  listnerデータ
 */
export async function removeTargetListnerDataFromDB(roomId, key) {
  try {      
    // キーをセット
    const dbKey = `${CONSTANTS.FB_TABLE_ROOM_LISTNERS}/${roomId}/${key}`
    console.log(`[Lisnerデータをfirebaseから削除] ${dbKey}`)

    await deleteTargetKey(dbKey);
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 4-5. 対象のroom_lisntersに該当ユーザIDのListnerが存在するかを返す
//
//======================================================

/**
 * 対象のroom_lisntersに該当ユーザIDのListnerが存在するかを返す
 * 
 * @param {*} roomId 
 * @param {*} tUserId 
 */
export async function checkTargetUserAlreadyJoinedToTargetRoom(roomId, tUserId) {
  let res = false

  try {      
    //console.log("入室済か判定")
    const vals = await getTargetRoomListnerDatas(roomId)
    vals.forEach(function(v) {
      if (v.userId === tUserId) {
        console.log("[入室済]" + tUserId)

        res = true;
      }
    });
  } catch (error) {        
    console.error(error);      
  }

  return res
}
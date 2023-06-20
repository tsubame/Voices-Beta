//======================================================
//
// Skyway関連の処理管理用
//
// [索引]
//  □ 0.   トークン生成
//  □ 1.   音声通話に参加（Publish、Subscribe）
//  □ 1.   音声通話から退出（unPublish）
//  □ 2.   対象の部屋の音声を聴取（Subscribe）
//  □ 3-1. ミュート処理
//  □ 3-2. ミュート解除
//
//======================================================

// SkywaySDK
//import { nowInSec, SkyWayAuthToken, SkyWayContext, SkyWayRoom, SkyWayStreamFactory, uuidV4 } from '@skyway-sdk/room';
import * as SkywayModule from '@skyway-sdk/room'
// 定数
import { CONSTANTS } from '@/consts/ConstantVals';
// GoAPI
import { getAPIKeys } from '@/utils/GoAPIManager';

// プレイヤーを表示
const SHOW_PLAYER = false;

// トークン
let _token = {}
// コンテキスト
let _context;
// 自セッション
let _mySession;
// 自音声のpublish
let _myPublication;
// 部屋
let _room;
// 部屋名
let _roomName;
// 接続方法
let _cWay;
// ユーザID
let _userId;
// オーディオ要素
let _audio;

//======================================================
//
// 0. 入室時初期処理
//
//======================================================

/**
 * 入室時初期処理
 *  ・トークン生成
 *  ・対象IDの部屋に入る
 */
export async function joinToRoom(roomId, userId) {
  try {     
    _userId = userId    
    // トークン生成
    await createToken()
    // 部屋名をセット
    _roomName = "room" + roomId
    // 接続方法にSFUをセット
    _cWay = CONSTANTS.SKYWAY_CONNECT_WAY_SFU
    if (!CONSTANTS.SKYWAY_USE_SFU) {
      _cWay = CONSTANTS.SKYWAY_CONNECT_WAY_P2P
    }
  
    // 音声ストリーム生成
    _audio = await SkywayModule.SkyWayStreamFactory.createMicrophoneAudioStream();
    // 部屋に入る
    await createContextAndJoinRoom()

    // エラー時
    _context.onFatalError.add(async () => {
      _context.dispose();

      // context再生成、再接続
      await createContextAndJoinRoom();
      console.log("[エラーによるSkyway Room再入室] ")    
    });    
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
// トークン生成
//======================================================

/**
 * トークン生成
 */
async function createToken() {
  try {      
    // APIキーをセット
    const apiKeyData = await getAPIKeys()

    // 生成
    _token = new SkywayModule.SkyWayAuthToken({
      //jti: uuidV4(),
      jti: SkywayModule.uuidV4(),      
      //iat: nowInSec(),
      iat: SkywayModule.nowInSec(),

      // 有効期間
      //exp: nowInSec() + 60 * 60 * 1,
      exp: SkywayModule.nowInSec() + 60 * 60 * 1,
      // スコープ
      scope: {
        app: {
          // アプリケーションID
          id: apiKeyData.apiKey,
          turn: true,
          actions: ['read'],
          channels: CONSTANTS.SKYWAY_CHANNEL_PARAMS,
        },
      },
    // シークレット
    }).encode(apiKeyData.apiSecret);

    console.log("[トークン生成]")
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
// contextを生成し、部屋に入る
//======================================================

/**
 * contextを生成し、部屋に入る
 */
async function createContextAndJoinRoom() {
  try {
    // Context生成
    _context = await SkywayModule.SkyWayContext.Create(_token);
    // 部屋作成 or 検索
    _room = await SkywayModule.SkyWayRoom.FindOrCreate(_context, {
      type: _cWay,
      name: _roomName,
    });

    console.log("[Skyway Room入室開始] " + _roomName + " - " + _cWay)
    // 入室
    _mySession = await _room.join({ name: _userId.toString() })     
    
    console.log("[Skyway Room入室] " + _roomName + " - " + _cWay)
    console.log(_mySession)
  } catch (error) {
    console.error(error)
  }
}

//======================================================
//
// 1-1. 自音声をPublish（音声通話に参加）
//
//======================================================

/**
 * 自音声をPublish（音声通話に参加）
 *
 * @param liveId 
 * @param dom 
 */
export async function publishMyAudio(dom) {
  try {        
    // 自音声をPublish
    await createMySessionAndPublish()

    // 部屋に存在するPublishを走査
    const subscribeAndAttach = async(publication) => {
      // 対象者の音声をSubscribe
      await subscribeTargetMemberAudio(publication, dom)
    }      

    // publicationsを走査  
    _room.publications.forEach(subscribeAndAttach);
    _room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));    
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
// 自音声をPublish（音声配信開始）
//======================================================

/**
 * 自音声をPublish（音声配信開始）
 * 
 * @param liveId
 */
async function createMySessionAndPublish() {
  try {      
    // Publish
    _myPublication = await _mySession.publish(_audio);  

    // エラー時は再度Publish
    _myPublication.onFatalError.add(async () => {
      await _mySession.publish(_audio);
    });

    console.log(`自音声publish: ${_mySession.id}`); 
  } catch (error) {        
    console.error(error);      
  } 
}

//======================================================
// 対象者の音声をSubscribe
//======================================================

/**
 * 対象者の音声をSubscribe
 * 
 * @param publication
 * @param dom
 */
async function subscribeTargetMemberAudio(publication, dom) {
  try {      
    // 自分のPublishはスキップ
    if (publication.publisher.id === _mySession.id) { 
      console.log("[自分の音声はsubscribeスキップ]")

      return;
    }

    // 他の人の音声をsubscribe
    const { stream } = await _mySession.subscribe(publication.id);

    let newMedia;
    // ストリームが音声なら
    switch (stream.track.kind) {
      case 'audio':
        newMedia = document.createElement('audio');
        newMedia.autoplay = true;
        newMedia.controls = SHOW_PLAYER;

        console.log("[対象者の音声をsubscribe]")
        console.log(stream)

        break;
      default:
        return;
    }

    stream.attach(newMedia);
    dom.appendChild(newMedia);     
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 1-2. 自音声のPublishを停止（音声通話から退出）
//
//======================================================

/**
 * 自音声をPublish（音声通話に参加）
 *
 * @param liveId 
 * @param dom 
 */
export async function unpublishMyAudio() {
  try {        
    await _mySession.unpublish(_myPublication.id);

    console.log("[自音声publish停止]")
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 2. 部屋の音声を聴取（Subscribe）
//
//======================================================

/**
 * 音声通話に参加（Publish、Subscribe）
 *
 * @param roomId 
 * @param dom 
 */
export async function subscribeRoomAudio(dom) {
  try {            
    console.log("[subscribe開始]")

    // 部屋に存在するPublishを走査
    const subscribeAndAttach = async(publication) => {
      // 対象の音声をSubscribe
      await subscribeTargetMemberAudio(publication, dom)
    }      

    // publicationsを走査。ストリームに追加
    _room.publications.forEach(subscribeAndAttach);
    _room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));    
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 3-1. ミュート実行
//
//======================================================

/**
* ミュート実行
*
*/
export async function mute() {
  try {
    //var audioTrack = _myPublication.stream.getAudioTracks()[0];
    //audioTrack.enabled = false;
    var audioTrack = _myPublication.stream._track;
    audioTrack.enabled = false;

    console.log(_myPublication.stream)

    //await _myPublication.disable()    

    console.log("[ミュート実施]")
  } catch (error) {        
    console.error(error);      
  } 
}

//======================================================
//
// 3-2. ミュート解除
//
//======================================================

/**
* ミュート解除
*
*/
export async function unmute() {
  try {
    var audioTrack = _myPublication.stream._track;
    audioTrack.enabled = true;

    //await _myPublication.enable();    

    console.log("[ミュート解除]")    
  } catch (error) {
    console.error(error);   
  }
}

//======================================================
//
// 4. 退室処理
//
//======================================================

/**
 * 退室処理
 */
export async function leaveFromRoom(roomId) {
  try {     
    // 部屋名をセット
    let roomName = "room" + roomId
    // 接続方法にSFUをセット
    let cWay = CONSTANTS.SKYWAY_CONNECT_WAY_SFU
    if (!CONSTANTS.SKYWAY_USE_SFU) {
      cWay = CONSTANTS.SKYWAY_CONNECT_WAY_P2P
    }

    console.log(roomName)
    // 部屋を取得
    //_room = await SkyWayRoom.Find(_context, { name: roomName }, cWay);
    _room = await SkywayModule.SkyWayRoom.Find(_context, { name: roomName }, cWay);
    // 部屋から出る
    await _room.leave(_mySession);      
    console.log("[Skyway Room退室] " + roomName + " - " + cWay)
    console.log(_mySession)
  } catch (error) {        
    console.error(error);      
  }
}


/*
const token = new SkyWayAuthToken({
  jti: uuidV4(),
  iat: nowInSec(),
  // 有効期間
  exp: nowInSec() + 60 * CONSTANTS.ROOM_VALID_PERIOD_MIN * 1,
  // スコープ
  scope: {
    app: {
      // アプリケーションID
      id: SKYWAY_APP_ID,
      turn: true,
      actions: ['read'],
      channels: [
        {
          id: '*',
          name: '*',
          actions: ['write'],
          members: [
            {
              id: '*',
              name: '*',
              actions: ['write'],
              publication: {
                actions: ['write'],
              },
              subscription: {
                actions: ['write'],
              },
            },
          ],
          sfuBots: [
            {
              actions: ['write'],
              forwardings: [
                {
                  actions: ['write'],
                },
              ],
            },
          ],
        },
      ],
    },
  },
// シークレットキー
}).encode(SKYWAY_SC_KEY);
*/
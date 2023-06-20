//======================================================
//
// Agora関連の処理管理用
//
// [索引]
//  □ 0.   トークン生成
//
//
//======================================================

// AgoraSDK
import AgoraRTC from "agora-rtc-sdk-ng"
// 定数
import { CONSTANTS } from '@/consts/ConstantVals';

// role ホスト
const ROLE_HOST = "host"
// role audience
const ROLE_AUDIENCE = "audience"


// オプション設定
let _options = {
};

// パラメータ
let _channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold the remote user id.
  remoteUid: null,
};

// agoraEngine
let _agoraEngine;

// 通話中か
let _isPublishing = false;


//======================================================
//
// 1-1. 自音声をPublish（音声通話に参加）
//
//======================================================

/**
 * 自音声をPublish（音声通話に参加）
 */
export async function publishMyAudioByAgora()
{
  try {    
    // roleをhostに
    _options.role = ROLE_HOST;    
    await _agoraEngine.setClientRole(_options.role);

    // Create a local audio track from the microphone audio.
    _channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio track in the channel.
    await _agoraEngine.publish(_channelParameters.localAudioTrack);
    console.log("Publish success!");  
    
    _isPublishing = true;
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 1-2. 自音声をUnPublish（音声通話から退出）
//
//======================================================

/**
 * 自音声をUnPublish（音声通話から退出）
 */
export async function unpublishMyAudioByAgora()
{
  try {    

    // Create a local audio track from the microphone audio.
    _channelParameters.localAudioTrack.close()    
    console.log("UnPublish success!");    

    _isPublishing = false;    
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 2. subscribe
//
//======================================================

/**
 * subscribe
 * 
 * @param dom
 * @param roomId
 * @param userId
 */
export async function subscribeRoomAudioByAgora(dom, roomId, userId)
{
  try {
    // optionsをセット
    setOptions(roomId, userId, ROLE_AUDIENCE) 
    // 初期設定
    initAgoraToken(dom)
    // ロールをセット
    await _agoraEngine.setClientRole(_options.role);       
    // Join a channel.
    await _agoraEngine.join(_options.appId, _options.channel, _options.token, _options.uid);
    console.log("Joined channel: " + _options.channel);
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
// optionをセット
//======================================================

/**
 * optionsをセット
 * 
 * @param {*} roomId 
 * @param {*} userId
 * @param {*} myRole
 */
function setOptions(roomId, userId, myRole) {
  try {
    _options = {
      // Pass your App ID here.
      appId: CONSTANTS.AGORA_APP_ID,
      // Set the channel name.
      channel: "room" + roomId,
      // Pass your temp token here.
      token: null,
      // role
      role: myRole,
      // Set the user ID.
      uid: userId,//Math.floor(Math.random() * 1000000),
    };
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
// agora初期化
//======================================================

/**
 * agora初期化
 */
async function initAgoraToken(dom) {
  try {
    // Create an instance of the Agora Engine
    _agoraEngine = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    // Listen for the "user-unpublished" event.
    _agoraEngine.on("user-unpublished", user => {
      console.log(user.uid + "has left the channel");
      console.log("Remote user has left the channel");
    });    

    // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
    _agoraEngine.on("user-published", async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event.
      await _agoraEngine.subscribe(user, mediaType);      
      console.log("subscribe success");

      // Subscribe and play the remote audio track.
      if (mediaType == "audio") {
        if (user.uid !== _options.uid) {
          _channelParameters.remoteUid=user.uid;
          _channelParameters.remoteAudioTrack = user.audioTrack;   
          _channelParameters.remoteAudioTrack.play();
          console.log("Remote user connected: " + user.uid);    

          /*
          let newMedia;
          let stream = user.audioTrack.getMediaStreamTrack.stream;
          newMedia = await document.createElement('audio');
          newMedia.autoplay = true;
          newMedia.src = stream;
          //stream.attach(newMedia);
          //dom.appendChild(_channelParameters.remoteAudioTrack);      
          dom.appendChild(newMedia); 
          */
          console.log(dom)
        }
      }
    });
  } catch (error) {
    console.error(error);    
  }
}

//======================================================
//
// 3-1. Mute
//
//======================================================

/**
 * Mute
 */
export async function muteByAgora() {
  try {     
    await _channelParameters.localAudioTrack.setMuted(true); 
  } catch (error) {        
    console.error(error);      
  }
}

//======================================================
//
// 3-2. UnMute
//
//======================================================

/**
 * Mute
 */
export async function unmuteByAgora() {
  try {     
    await _channelParameters.localAudioTrack.setMuted(false);
    //await localTracks.audioTrack.setMuted(true);
    //localTrackState.audioTrackMuted = true;    
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
export async function leaveFromRoomByAgora() {
  try {     
    // Destroy the local audio track.
    if (_isPublishing) {
      _channelParameters.localAudioTrack.close();
      _isPublishing = false;
    }

    // Leave the channel
    await _agoraEngine.leave();

    console.log("[Agora Room退室] ")
  } catch (error) {        
    console.error(error);      
  }
}
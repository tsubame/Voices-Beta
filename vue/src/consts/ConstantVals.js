
export const CONSTANTS = {

  //======================================================
  // 認証関連
  //======================================================

  // Google認証を使用
  USE_GOOGLE_AUTH: false,
  // Twitter認証を使用
  USE_TWITTER_AUTH: false,
  // FiraBase DBテーブル room_listners
  FB_TABLE_ROOM_LISTNERS: "room_listners",
  // FiraBase DBテーブル room_multi_cast_users
  FB_TABLE_ROOM_MULTI_CAST_USERS: "room_multi_cast_users",  
  // FiraBase DBテーブル chats
  FB_TABLE_ROOM_CHATS: "chats",
  
  //======================================================
  // API（バックエンド）
  //======================================================

  // Go API プレフィックス(本番環境)
  API_URL_GO_PORT_PRODUCT: "", 
  // Go API プレフィックス(開発環境)
  API_URL_GO_PORT_DEV: ":3000", 
  // APIエンドポイント 部屋作成
  API_URL_GO_ROOM_CREATE: "api/rooms/create",
  // APIエンドポイント 部屋一覧
  API_URL_GO_ROOM_READ_ALL: "api/rooms/",
  // APIエンドポイント アクティブな部屋一覧
  API_URL_GO_ROOM_READ_ACTIVE: "api/rooms/active",  
  // APIエンドポイント 対象の部屋
  API_URL_GO_ROOM_READ_TARGET_ID: "api/rooms/read/",
  // APIエンドポイント ユーザ作成
  API_URL_GO_USER_CREATE: "api/users/create",
  // APIエンドポイント 部屋一覧
  API_URL_GO_USER_READ_ALL: "api/users/",
  // APIエンドポイント Skyway シークレットキー
  API_URL_GO_SKYWAY_KEYS: "api/skyway/",
  // APIエンドポイント Twitter認証 Go バックエンド 現在のURLを末尾に付与する
  API_URL_GO_TWITTER_AUTH: "api/twitter/auth?front_callback_url=",
  // APIエンドポイント Twitter自分のユーザ情報のセット
  API_URL_GO_TWITTER_GET_MY_USER: "api/twitter/getMyUserInfo",

  // 開発環境のホスト名のキーワード
  DEV_SERVER_HOSTNAME_KEYWORD: "localhost",

  //======================================================
  // リンク
  //======================================================

  // グローバルメニュー
  LINK_VALS: [
    //['mdi-home', 'ホーム'],
    ['mdi-clock-outline', '配信一覧', "/rooms"],
    ['mdi-book-open-blank-variant', '台本一覧', '/scripts'],
    ['mdi-account', 'マイページ', '/users'],
  ],

  //======================================================
  // 配信部屋
  //======================================================

  // 部屋カテゴリ
  ROOM_CATEGORY_VALS: [
    "声劇",
    "雑談",    
  ],

  // 通信サービス
  ROOM_SERVICES_VALS: [
    "agora",
    "skyway",    
  ],  

  // 通信サービス AGORA
  WEB_RTC_SERVICE_AGORA: "agora",

  // 通信サービス Skyway
  WEB_RTC_SERVICE_SKYWAY: "skyway",

  // 部屋内のフッターメニューのアイテム
  ROOM_FOOTER_MENU_ITEM_NAMES: [
    /*
    {
      title: "マルチキャスト申請",
      icon: "mdi-phone"
    },*/
    {
      title: "BGM再生",
      icon: "mdi-music"
    },
    {
      title: "BGM停止",
      icon: "mdi-music-off"
    },    
  ],

  // 部屋内のフッターメニューのアイテム
  ROOM_FOOTER_MENU_ITEM_NAMES_BGM_PLAY: 
    {
      title: "BGM再生",
      icon: "mdi-music"
    },

  // 部屋内のフッターメニューのアイテム
  ROOM_FOOTER_MENU_ITEM_NAMES_BGM_STOP: 
    {
      title: "BGM停止",
      icon: "mdi-music-off"
    },    

  // 配信の時間制限（60）
  ROOM_VALID_PERIOD_MIN: 60,

  //======================================================
  // Agora.io
  //======================================================

  // AppID
  AGORA_APP_ID: "",

  // テンポラリトークン（有効期限1日）
  AGORA_TEMP_TOKEN: "",

  // Appテスト用CH
  AGORA_TEST_CH: "test",

  //======================================================
  // Skyway
  //======================================================

  // SFUを使用する
  SKYWAY_USE_SFU: true,
  // SFU
  SKYWAY_CONNECT_WAY_SFU: 'sfu',   
  // P2P
  SKYWAY_CONNECT_WAY_P2P: 'p2p',   
  // トークン有効期間（分）
  SKYWAY_TOKEN_EXPIRE_MIN: 10,
  // Skyway channels用のパラメータ
  SKYWAY_CHANNEL_PARAMS: [
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

  //======================================================
  // 画像
  //======================================================

  // ゲストユーザ用のアイコン ※storeに定義中のため不要
  GUEST_USER_ICON_FILES: [
    'user_icon_0.png',      
    'user_icon_1.png',      
    'user_icon_2.png',              
    'user_icon_3.png',      
    'user_icon_4.png',      
    'user_icon_5.png',  
    'user_icon_6.png',      
  ],
  
  //======================================================
  // BGM
  //======================================================

  // BGの拡張子
  BGM_EXTENSION: ".mp3",

  // requireする際の音楽ファイルのフォルダパス
  BGM_REQUIRE_DIR_PATH: '@/assets/music/',

  // BGM再生時のデフォルトのボリューム
  BGM_DEFAULT_VOLUME: 0.1,

  //======================================================
  // Cookie
  //======================================================

  // Cookie Key ユーザID（数値）
  COOKIE_KEY_USER_ID: "user_id",
  // Cookie Key ユーザID（文字列）
  COOKIE_KEY_USER_ID_STR: "user_id_str",
  // Cookie Key ユーザ名
  COOKIE_KEY_USER_NAME: "user_name",
  // Cookie Key ランダムユーザID
  COOKIE_KEY_PROFILE_IMAGE_URL: "profile_image_url",

  // Cookie Key ランダムユーザID
  COOKIE_KEY_RANDOM_USER_ID: "random_user_id",
  // Cookie Key TwitterID
  COOKIE_KEY_TWITTER_ID: "twitter_id",
  // Cookie Key TwitterName
  COOKIE_KEY_TWITTER_NAME: "name",
  // Cookie Key TwitterScreenName
  COOKIE_KEY_TWITTER_SCREEN_NAME: "screen_name",
  // Cookie Key ProfileImageUrl
  COOKIE_KEY_TWITTER_PROFILE_IMAGE_URL: "profile_image_url",      
}

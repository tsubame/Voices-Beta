package controller

//======================================================
//
// コントローラパッケージ
// API Twitter認証関連
//
// [索引]
//	□ 1. Twitter認証実施
//  □ 2. Twitter認証（Twitter認証ページからのCallback）
//	□ 3. Twitterユーザ情報をJSON形式で返す
//
//======================================================

import (
	"encoding/json"
	"strconv"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/dghubble/oauth1"
	"github.com/dghubble/oauth1/twitter"
	gTwitter "github.com/dghubble/go-twitter/twitter"	
)

// 定数定義
const (
	// TwitterAPIキー
	CONSUMER_KEY    = "HXOxEG7NYNWVfUhF3RbXskNqy"
	CONSUMER_SECRET = "WpfcdndimeNknDiYM46b50hvDYiA94nyfw4Yuix7tvZjxQA19M"
	// セッション キー名
	SESSION_KEY_REQUEST_TOKEN = "request_token"
	SESSION_KEY_REQUEST_SECRET = "request_secret"
	SESSION_KEY_ACCESS_TOKEN = "access_token"
	SESSION_KEY_ACCESS_SECRET = "access_secret"
	SESSION_KEY_USER_ID = "id"
	SESSION_KEY_SCREEN_NAME = "screen_name"	
	SESSION_KEY_NAME = "name"		
	SESSION_KEY_PROFILE_IMAGE_URL = "profile_image_url"
	// クエリキー名
	QUERY_KEY_FRONT_CALLBACK_URL = "front_callback_url"
	// Go言語APIでのTwitterコールバックURL
	API_URL_GO_TWITTER_AUTH_CALLBACK = "http://localhost:3000/api/twitter/callback"
)

// 構造体 ユーザー情報
//
type User struct {
	ID string `json: "id"`
	Name string `json: "name"`
	ScreenName string `json: "screen_name"` //json:"screen_name"
	ProfileImageUrl string `json: "profile_image_url"`
}


//======================================================
//
// 1. Twitter認証実施
//
//======================================================
 
// Twitter認証
//
func AuthByTwitter(c *gin.Context) {	
	// セッション生成
	session := sessions.Default(c)	
	// クエリパラメータからフロントエンドのリダイレクト先を取得
	callbackFrontEndURL := c.Query(QUERY_KEY_FRONT_CALLBACK_URL)
	// セッションにリダイレクト先を記憶
	if callbackFrontEndURL != "" {
		session.Set(QUERY_KEY_FRONT_CALLBACK_URL, callbackFrontEndURL)
	}

	// ログイン済の場合はフロントエンドにリダイレクト
	redirectToFrontEndCallBackURLIfLoginned(c, callbackFrontEndURL)

	// config生成
	config := getOAuthConfig()
	// Twitterの認証ページにリダイレクトする	
	requestToken, requestSecret, err := config.RequestToken()
	if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"request token error": err.Error()})
			return
	}

	// 認証用URLをセット
	authorizationURL, err := config.AuthorizationURL(requestToken)
	if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
	}

	// 認証後に受け取るトークンのリクエストトークンとリクエストシークレットをセッションに保存する
	session.Set(SESSION_KEY_REQUEST_TOKEN, requestToken)
	session.Set(SESSION_KEY_REQUEST_SECRET, requestSecret)
	session.Save()	

	// Twitter認証用ページにリダイレクト
	c.Redirect(http.StatusFound, authorizationURL.String())
}

//======================================================
// ログイン済の場合、フロントエンドのコールバックURLにリダイレクト
//======================================================

// ログイン済の場合、フロントエンドのコールバックURLにリダイレクト
//
func redirectToFrontEndCallBackURLIfLoginned(c *gin.Context, callbackFrontEndURL string) {
	// 未ログインなら終了
	if !hasAuthed(c) {
		return
	}

	println("redirect from" + callbackFrontEndURL)

	// フロントエンドにリダイレクト
	if callbackFrontEndURL != "" {
		//c.Redirect(http.StatusFound, callbackFrontEndURL)

		return
	}
}

// ログイン済かを返す
//
func hasAuthed(c *gin.Context) bool {
	session := sessions.Default(c)
	sKey, _ := session.Get(SESSION_KEY_ACCESS_TOKEN).(string)
	println("AccessToken: " + sKey)

	uid, _ := session.Get(SESSION_KEY_USER_ID).(string)
	println("UserID: " + uid)

	if sKey != "" && uid != "" {
		println("already logined. UID:", uid)

		return true
	}

	return false
}

//======================================================
// OAUTH Config作成
//======================================================

// OAUTH Config作成
//
func getOAuthConfig() oauth1.Config {
	// config生成
	config := oauth1.Config{
		ConsumerKey:    CONSUMER_KEY,
		ConsumerSecret: CONSUMER_SECRET,
		CallbackURL:    API_URL_GO_TWITTER_AUTH_CALLBACK,
		Endpoint:       twitter.AuthorizeEndpoint,
	}

	return config
}

//======================================================
//
// 2. Twitter認証（Twitter認証ページからのCallback）
//
//======================================================
 
// Twitter認証（Twitter認証ページからのCallback）
//
func AuthByTwitterCallBack(c *gin.Context) {	
	// クエリパラメータからoauth_verifierを取得する
	verifier := c.Query("oauth_verifier")

	// セッションからリクエストトークンとリクエストシークレットを取得する
	session := sessions.Default(c)
	savedRequestToken, _ := session.Get(SESSION_KEY_REQUEST_TOKEN).(string)
	savedRequestSecret, _ := session.Get(SESSION_KEY_REQUEST_SECRET).(string)

	// config生成
	config := getOAuthConfig()	
	// アクセストークンを取得する
	accessToken, accessSecret, err := config.AccessToken(savedRequestToken, savedRequestSecret, verifier)
	if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"access token error": err.Error()})
			return
	}

	// アクセストークンとアクセスシークレットをセッションに保存する
	session.Set(SESSION_KEY_ACCESS_TOKEN, accessToken)
	session.Set(SESSION_KEY_ACCESS_SECRET, accessSecret)
	session.Save()

	// リクエストトークンとリクエストシークレットをOAuth1.0aのトークンに変換する
	token := oauth1.NewToken(accessToken, accessSecret)
	httpClient := config.Client(oauth1.NoContext, token)

	// Twitterクライアントを作成する
	client := gTwitter.NewClient(httpClient)
	// 認証したTwitterユーザ情報を取得する
	twUser, _, err := client.Accounts.VerifyCredentials(&gTwitter.AccountVerifyParams{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"use get error": err.Error()})
		return
	}

	// ユーザー情報をセッションに保存する
	session.Set(SESSION_KEY_USER_ID, strconv.FormatInt(twUser.ID, 10))
	session.Set(SESSION_KEY_SCREEN_NAME, twUser.ScreenName)
	session.Set(SESSION_KEY_PROFILE_IMAGE_URL, twUser.ProfileImageURL)
	session.Set(SESSION_KEY_NAME, twUser.Name)
	session.Save()

	fmt.Println("user_id: ", twUser.ID)
	println("screen_name:" + twUser.ScreenName)
	println("画像URL:" + twUser.ProfileImageURL)
	println("name:" + twUser.Name)
	println("verifier:" + verifier)

	// 認証完了後のページにリダイレクトする
	callbackFrontEndURL, _ := session.Get(QUERY_KEY_FRONT_CALLBACK_URL).(string)
	println("Redirect To Target URL", callbackFrontEndURL)
	// パラメータを付与
	callbackFrontEndURL += "?" + SESSION_KEY_USER_ID + "=" + strconv.FormatInt(twUser.ID, 10)
	callbackFrontEndURL += "&" + SESSION_KEY_NAME + "=" + twUser.Name
	callbackFrontEndURL += "&" + SESSION_KEY_SCREEN_NAME + "=" + twUser.ScreenName
	callbackFrontEndURL += "&" + SESSION_KEY_PROFILE_IMAGE_URL + "=" + twUser.ProfileImageURL

	println("Redirect To Target URL with Params", callbackFrontEndURL)
	
	// リダイレクト
	c.Redirect(http.StatusFound, callbackFrontEndURL)
}

// パラメータをフロントエンドのURLに付与
//
func addParamsToCallBackFrontEndURL(twUser, callbackFrontEndURL string) string {


	return callbackFrontEndURL
}

//======================================================
//
// 3. Twitterユーザ情報をJSON形式で返す
//
//======================================================

// Twitterユーザ情報をJSON形式で返す
//
func GetMyTwitterUserInfo(c *gin.Context) {
	//session := sessions.Default(c)
	println("Access to GetMyTwitterInfo...")

	// 未ログインならリダイレクト
	if !hasAuthed(c) {
		println("GetMyTwitterInfo... but not logined")
		// セッションにリダイレクト先を記憶
		cUrl := c.Request.URL.String()
		println("current URL:", cUrl)

		session := sessions.Default(c)		
		session.Set(QUERY_KEY_FRONT_CALLBACK_URL, cUrl)

		//AuthByTwitter(c)
	} 

	session := sessions.Default(c)	

	// セッションの値をユーザ構造体にマッピング
	var user User
	user.ID = getSessionKeyVal(session, SESSION_KEY_USER_ID)
	println("TwitterID:", user.ID)
	user.Name = getSessionKeyVal(session, SESSION_KEY_NAME)
	println("TwitterName: ", user.Name)
	user.ScreenName = getSessionKeyVal(session, SESSION_KEY_SCREEN_NAME) 
	println("TwitterScrrenName: ", user.ScreenName)
	user.ProfileImageUrl = getSessionKeyVal(session, SESSION_KEY_PROFILE_IMAGE_URL) 
	println("TwitterImageURL: ", user.ProfileImageUrl)
	
	// JSONに変換
	jsonBytes, err := json.Marshal(user)
	if err != nil {
			panic(err)
	}

	jsonString := string(jsonBytes)
	c.Header("Content-Type", "text/plain; charset=utf-8")	
	//c.JSON(http.StatusOK, gin.H{"id": user.ID, SESSION_KEY_SCREEN_NAME: user.ScreenName, SESSION_KEY_NAME: user.Name,SESSION_KEY_PROFILE_IMAGE_URL: user.ProfileImageUrl})		
	c.String(http.StatusOK, jsonString)
}

//======================================================
// セッションキーを返す
//======================================================

// 対象セッションキーの値を返す 
//
func getSessionKeyVal(session sessions.Session, key string) string {
	v, _ := session.Get(key).(string)
	if v == "" {
		println("session key not found.", key)
	}
	
	return v
}

/*
// ユーザー情報を取得する関数
//
func getUser(httpClient *http.Client) (*User, error) {

	const API_URL = "https://api.twitter.com/1.1/account/verify_credentials.json"

	resp, err := httpClient.Get(API_URL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var user User

	// レスポンスのボディを出力する
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		// エラー処理
		panic(err)
	}
	fmt.Println(string(body))

	return &user, nil
}*/
	
//======================================================
//
// コントローラパッケージ - ルーティングコントローラ
// 
// [索引]
//	□ 1. ルーティング設定を返す
//
//======================================================

package controller

import (
	"github.com/gin-contrib/cors"	
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"	
)

//======================================================
//
// 1. ルーティング設定を返す
//
//======================================================

/**
 * ルーティング設定を返す
 */
 func GetRouter() *gin.Engine {
	r := gin.Default()
	
	// CORS設定
	config := getRouterConfig()
	r.Use(cors.New(config))

	// セッションでCookieを使用
	store := cookie.NewStore([]byte("secret"))
	// 1年間有効に
	store.Options(sessions.Options{MaxAge:   60 * 60 * 24 * 365}) 	
	r.Use(sessions.Sessions("mysession", store))	

	// APIルーティングを定義
	gr := r.Group("api")
	sample := gr.Group("/sample")
	sample.GET("/", SampleAPI)

	// 部屋関連
	rm := gr.Group("/rooms")
	rm.GET("/", GetAllRoomsByJson)
	rm.GET("/active", GetActiveRoomsByJson)	
	rm.GET("/read/:id", GetTargetIDRoomByJson)	
	rm.POST("/create", InsertRoomData)

	// skyway関連
	sk := gr.Group("/skyway")
	sk.GET("/", GetSkywayAPIKey)

	pr := gr.Group("/programs")
	pr.GET("/", GetAllProgramsByJson)
	pr.POST("create/", InsertProgramData)

	// Twitter認証
	at := gr.Group("/twitter")
	at.GET("auth", AuthByTwitter)
	at.GET("callback", AuthByTwitterCallBack)
	at.GET("getMyUserInfo", GetMyTwitterUserInfo)
	
	r.POST("/", func(c *gin.Context) {
	  c.String(200, "index")
	})

	return r
}

/**
 * 	CORS設定を返す
 */
func getRouterConfig() cors.Config {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{
		"POST",
		"GET",
		"OPTIONS",
		"PUT",
		"DELETE",
	}
	config.AllowHeaders = []string{
		"Access-Control-Allow-Credentials",
		"Access-Control-Allow-Headers",
		"Content-Type",
		"Content-Length",
		"Accept-Encoding",
		"Authorization",
	}

	return config
}
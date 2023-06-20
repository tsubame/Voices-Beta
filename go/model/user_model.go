package model

//======================================================
//
// ユーザモデル定義用モジュール
//
//======================================================

import (
	//"github.com/jinzhu/gorm"
	"gorm.io/gorm"
	//"time"
)

/**
 * ユーザデータ
 */
type User struct {
	gorm.Model
	// ユーザID
	UserID							int		 `json: "user_id"`
	// 名前
	Name 								string `json: "name"`
	// 性別
	Sex									string `gorm:"default:''" json:"sex"`
	// TwitterID
	TwitterIDStr 				string `gorm:"default:''" json: "twitter_id_str"`
	// Twitterの@ユーザ名
	TwitterScreenName 	string `gorm:"default:''" json: "twitter_screen_name"`
	// プロフィール画像
	ProfileImageUrl			string `gorm:"default:''" json: "profile_image_url"`
	// 説明
	Description string `gorm:"default:''" json: "description"`
	// パスワード
	Password 		string `gorm:"default:''" json: "password"`
}

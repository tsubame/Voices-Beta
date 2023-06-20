//======================================================
//
// 	モデル定義用パッケージ - 配信部屋管理用モデル
//
// 	[索引]
//		□ 1. 部屋データを全件返す（RåEAD）
//
//======================================================

package model

import (
	"github.com/jinzhu/gorm"
	"time"
)

// 部屋データ
//
type Room struct {
	gorm.Model
	// ID
  ID            uint				`gorm:"primaryKey" json:"id"`
	// タイトル
	Title 				string 			`json:"title"`			
	// 配信者ユーザID
	OwnerUserId		int    			`gorm:"column:owner_user_id" json:"ownerUserId"`
	// 配信者ユーザ名
	OwnerUserName string    	`gorm:"column:owner_user_name" json:"ownerUserName"`
	// サムネイル画像
	ThumImageUrl 	string 			`gorm:"default:''" json:"thumImageUrl"`
	// 背景画像
	BgImageUrl 		string 			`gorm:"default:''" json:"bgImageUrl"`
	// BGM
	BgmUrl				string			`gorm:"default:''" json:"bgmUrl"`
	// カテゴリ
	Category 			string 			`gorm:"default:''" json:"category"`
	// 説明
	Description 	string 			`gorm:"default:''" json:"description"`
	// Agora.ioを使用するか
	WebRtcService	string			`gorm:"default:skyway" json:"webRtcService"`
	// マルチキャストを受け付けるか
	AllowMulticast bool		  	`gorm:"default:true" json:"allowMulticast"`
	// 配信中か
	IsActive 			bool 				`gorm:"default:true" json:"isActive"`
	// 開始日時
	StartedAt 		*time.Time 	`json:"startedAt"`
	// 終了日時
	EndedAt 			*time.Time 	`json:"endedAt"`		
}

//======================================================
//
// 1-1. 部屋データを全件返す（READ）
//
//======================================================

// 部屋データを全件返す（READ）
//	・60分前までのデータはIsActiveをTrueに
//
func GetAllRooms() (datas []Room) {
	// DBからデータ取得
	res := dbCon.Find(&datas)
	if res.Error != nil {
		panic(res.Error)
	}

	// 60分前をセット
	currentTime := time.Now()
	limitTime := currentTime.Add(-60 * time.Minute)	

	for i := range datas {
		if datas[i].CreatedAt.After(limitTime) {
			datas[i].IsActive = true
		} else {
			datas[i].IsActive = false
		}
	}

	return
}

//======================================================
//
// 1-2. activeな部屋データを全件返す（READ）
//
//======================================================

// activeな部屋データを全件返す（READ）
//	・60分前までのデータを取得
//
func GetActiveRooms() (datas []Room) {
	// DBからデータ取得
	limitTime := time.Now().Add(-60 * time.Minute)
	if err := dbCon.Where("created_at >= ?", limitTime).Find(&datas).Error; err != nil {
		panic(err)
	}

	return
}


//======================================================
// 
// 1-3. 対象IDの部屋データを返す（READ）
//
//======================================================

// 対象IDの部屋データを返す
//
func GetTargetIDRoom(id int) Room {
	var room Room
	res := dbCon.First(&room, id) // ここでIDを指定する
	/*
	if err.Is(res.Error, gorm.ErrRecordNotFound) {
		// 指定されたIDのレコードが見つからなかった場合の処理
		return
	}*/

	if res.Error != nil {
			// エラーが発生した場合の処理
			panic(res.Error)
	}

	return room
}

//======================================================
//
// 2. 部屋データを登録（CREATE）
//
//======================================================

// 部屋データを登録（CREATE）
//	・登録したIDを返す
//
func (b *Room) Create() (uint, error) {
	result := dbCon.Create(b)
	if result.Error != nil {
		panic(result.Error)
	}

	return b.ID, nil	
}


//======================================================
//
// 	モデル定義用パッケージ - 配信番組管理用モデル
//
// 	[索引]
//		□ 1. 番組データを全件返す（READ）
//
//======================================================
package model

import (
	"github.com/jinzhu/gorm"
	"time"
	//"strconv"
	//"net/http"	
)

// 配信番組データ
//
type Program struct {
	gorm.Model
	Title 			string 			`json: "title"`
	UserId			int    			`json: "user_id"`
	Category 		string 			`json: "category"`
	Description string 			`json: "description"`
	IsEnded 		bool 				`json: "is_ended"`
	StartedAt 	*time.Time 	`json: "started_at"`
	EndedAt 		*time.Time 	`json: "ended_at"`		
}

//======================================================
//
// 1. 番組データを全件返す（READ）
//
//======================================================

// 1. 番組データを全件返す（READ）
//
func GetAllPrograms() (datas []Program) {
	// DBからデータ取得
	res := dbCon.Find(&datas)
	if res.Error != nil {
		panic(res.Error)
	}

	return
}

//======================================================
//
// 2. 番組データを登録（CREATE）
//
//======================================================

// 番組データを登録（CREATE）
//
func (b *Program) Create() {
	result := dbCon.Create(b)
	if result.Error != nil {
		panic(result.Error)
	}
}


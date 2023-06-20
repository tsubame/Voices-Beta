//======================================================
//
// 	モデル定義用パッケージ - DB操作用モジュール
//
// 	[索引]
//		□ 0. 初期処理（init）
//
//======================================================
package model

import (
	"fmt"
	"os"
	"time"

	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

// 定数　接続を試行する秒数
const DB_CON_TIMEOUT_SEC = 10

// MySQLホスト
const MY_SQL_HOST = "localhost"

// MySQLポート番号
const MY_SQL_PORT = "3306"

// DB接続用変数　
//var DBCon *gorm.DB
var dbCon *gorm.DB

//======================================================
//
// 0. 初期処理（init）
//
//======================================================

// 初期処理
//
func init() {
	var err error

	// DSNをセット
	dsn := getDSN()
	// MySQL接続
	dialector := mysql.Open(dsn)	
	// GORMでMySQL接続
	if dbCon, err = gorm.Open(dialector); err != nil {
		// エラー時は再接続		
		connectToDB(dialector)
	}

	// マイグレーション
	dbCon.AutoMigrate(&Room{})	
	dbCon.AutoMigrate(&User{})		
	//DBCon.AutoMigrate(&Program{})

	fmt.Println("[db connected!!]")
}

//======================================================
// DSNを返す
//======================================================

// DSNを返す
//	・環境変数からセット。ポート番号のみ
//
func getDSN() string {
	// 環境変数からパラメータをセット
	user 		:= os.Getenv("MYSQL_USER")
	pw 			:= os.Getenv("MYSQL_PASSWORD")
	dbName  := os.Getenv("MYSQL_DATABASE")
	host 		:= os.Getenv("MYSQL_HOST")
	port 		:= MY_SQL_PORT //os.Getenv("MYSQL_PORT")

	// DB接続文字列をセット
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=true", user, pw, host, port, dbName)
	//fm.Println("[DSN]" + dsn)

	// DSN表示（デバッグ用）
	fmt.Println(dsn)

	return dsn
}

//======================================================
// DB接続処理
//======================================================

// DB接続処理
//
func connectToDB(dialector gorm.Dialector) {
	var err error
	count := DB_CON_TIMEOUT_SEC

	// 接続
	if dbCon, err = gorm.Open(dialector); err != nil {
		if 1 < count {			
			count--

			time.Sleep(time.Second * 5)
			//fmt.Printf("retry... count:%v\n", count)
			connectToDB(dialector)

			return
		}
		
		panic(err.Error())
	}
}
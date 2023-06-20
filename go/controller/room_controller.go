//======================================================
//
// コントローラパッケージ - 部屋データ関連コントローラ
// 
//======================================================
package controller

import (
	"fmt"
	"net/http"
	"strconv"
	//"encoding/json"	
	"github.com/gin-gonic/gin"

	"main/model"
)

//======================================================
//
// 1-1. 部屋データを全件JSONで返す
//
//======================================================
 
// 部屋データを全件JSONで返す
//
func GetAllRoomsByJson(c *gin.Context) {	
	// 部屋データをセット
	rooms := model.GetAllRooms()
	// JSONで返す
	c.JSON(http.StatusOK, rooms)
}

//======================================================
//
// 1-2. アクティブな部屋データを全件JSONで返す
//
//======================================================
 
// アクティブな部屋データを全件JSONで返す
//
func GetActiveRoomsByJson(c *gin.Context) {	
	// 部屋データをセット
	rooms := model.GetActiveRooms()
	// JSONで返す
	c.JSON(http.StatusOK, rooms)
}


//======================================================
//
// 1-3. 対象IDの部屋データをJSONで返す
//
//======================================================
 
// 部屋データを全件JSONで返す
//
func GetTargetIDRoomByJson(c *gin.Context) {	
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	// 部屋データをセット
	room := model.GetTargetIDRoom(id)
	// JSONで返す
	c.JSON(http.StatusOK, room)
}

//======================================================
//
// 2. 部屋データを登録
//
//======================================================
 
// 部屋データを登録
//
func InsertRoomData(c *gin.Context) {	
	var rm model.Room
	fmt.Println(c)

	// JSONをパース
	if err := c.ShouldBindJSON(&rm); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}	

	jTxt := fmt.Sprintf("[JSON POSTデータ] title:%s, userID:%d, category:%s, description:%s", rm.Title, rm.OwnerUserId, rm.Category, rm.Description)
	fmt.Println(jTxt)

	// DB登録
	id, _ := rm.Create()

	c.JSON(http.StatusOK, gin.H{"id": id, "title": rm.Title, "owner_user_id": rm.OwnerUserId, "is_active": rm.IsActive})
}
//======================================================
//
// コントローラパッケージ
// 
//======================================================
package controller

import (
	"fmt"
	"net/http"
	//"strconv"
  //"encoding/json"	
	"github.com/gin-gonic/gin"
	//"github.com/tsubame/Voices/model"

	"main/model"
)

//======================================================
//
// 1. 番組データを全件JSONで返す
//
//======================================================
 
// 番組データを全件JSONで返す
//
func GetAllProgramsByJson(c *gin.Context) {	
	// 番組データをセット
	programs := model.GetAllPrograms()
	// JSONで返す
	c.JSON(http.StatusOK, programs)
}

//======================================================
//
// 2. 番組データを登録
//
//======================================================
 
// 番組データを登録
//
func InsertProgramData(c *gin.Context) {	
	var pg model.Program
	fmt.Println(c)

	// JSONをパース
	if err := c.ShouldBindJSON(&pg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}	

	jTxt := fmt.Sprintf("[JSON POSTデータ] title:%s, userID:%d, category:%s, description:%s", pg.Title, pg.UserId, pg.Category, pg.Description)
	fmt.Println(jTxt)

	// DB登録
	pg.Create()

	c.JSON(http.StatusOK, gin.H{"title": pg.Title, "user_id": pg.UserId, "is_ended": pg.IsEnded})	
}
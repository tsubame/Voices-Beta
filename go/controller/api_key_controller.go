//======================================================
//
// コントローラパッケージ
// 
//======================================================
package controller

import (
	"os"
	//"fmt"
	"net/http"
	"github.com/gin-gonic/gin"

	//"main/model"
)

/**
 * APIキーデータ
 */
type ApiKeyData struct {
	ApiKey			string `json:"apiKey"`
	ApiSecret 	string `json:"apiSecret"`
}

//======================================================
//
// 1. SkyWayのAPIキーを返す
//
//======================================================
 
// SkyWayのAPIキーを返す
//
func GetSkywayAPIKey(c *gin.Context) {	
	// 番組データをセット
	var d ApiKeyData
	d.ApiKey 		= os.Getenv("SKYWAY_APP_ID")
	d.ApiSecret = os.Getenv("SKYWAY_SC_KEY")

	// JSONで返す
	c.JSON(http.StatusOK, d)
}

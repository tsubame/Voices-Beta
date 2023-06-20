package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

/**
 * APIサンプル
 */
func SampleAPI(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H {
		"massage": "ok",
		"name": "Kudo",
		"language": "1839",
	})
}

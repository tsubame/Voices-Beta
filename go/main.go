//======================================================
//
// メインパッケージ - メイン処理用エンドポイント
//
//======================================================
package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"	
	"encoding/pem"
	"math/big"
	"fmt"
	"log"
	"os"
	"time"
	"strings"	

	"main/controller"	
)

// 証明書のキーの場所
const createdCertFilePath = "/etc/letsencrypt/archive/voice-drama.net/fullchain1.pem" //"voice-drama.net.pem" //"cert.pem"

// 証明書のキーの場所
const createdCertKeyPath = "/etc/letsencrypt/archive/voice-drama.net/privkey1.pem"; //"voice-drama.net-key.pem" //"key.pem"

// 証明書のキーの場所
const tmpCertFilePath = "cert/tmp_cert.pem"

// 証明書のキーの場所
const tmpCertKeyPath = "cert/tmp_key.pem"

// 証明書のキーを作成するか
const doCreateCertKey = true

// 開発環境のホスト名のキーワード
const devHostNameKeyword = "iMac"

//======================================================
//
// 1. メイン処理（エンドポイント）
//
//======================================================

// メイン処理（エンドポイント）
//
func main() {
	hostname, err := os.Hostname()
	if err != nil {
		fmt.Println("ホスト名の取得に失敗しました:", err)
		return
	}

	fmt.Println("ホスト名:", hostname)

	// ルーティング設定を取得
	r := controller.GetRouter()
	// 証明書作成
	if doCreateCertKey {
		createCertKey()
	}
	
	//r.Run(":3000")

	// 開発環境（http）
	if isDevServer() {
		r.Run(":3000")
	// 本番環境（https）
	} else {
		r.RunTLS(":3000", tmpCertFilePath, tmpCertKeyPath)
	}
}

//======================================================
// 開発環境かを返す
//======================================================

// 開発環境かを返す
func isDevServer() bool {
	const iMacKeyword = "iMac"
	const airKeyword = "Air"
	hostname, err := os.Hostname()
	if err != nil {
		fmt.Println("ホスト名の取得に失敗しました:", err)
		return false
	} 

	fmt.Println(hostname)

	if strings.Contains(hostname,iMacKeyword) {
		return true	
	} else if strings.Contains(hostname, airKeyword) {
		return true	
	}

	return false
}

//======================================================
// 証明書作成
//======================================================

// 証明書作成
//
func createCertKey() {
		// 自己署名証明書の生成
		privKey, err := rsa.GenerateKey(rand.Reader, 2048)
		if err != nil {
			log.Fatal(err)
		}
	
		notBefore := time.Now()
		notAfter := notBefore.Add(365 * 24 * time.Hour)
	
		template := x509.Certificate{
			SerialNumber:          big.NewInt(1),
			Subject:               pkix.Name{CommonName: "voice-drama.net"},
			NotBefore:             notBefore,
			NotAfter:              notAfter,
			KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
			ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
			BasicConstraintsValid: true,
		}
	
		derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &privKey.PublicKey, privKey)
		if err != nil {
			log.Fatal(err)
		}
	
		// 証明書と秘密鍵をPEM形式で保存
		certOut, err := os.Create(tmpCertFilePath)
		if err != nil {
			log.Fatal(err)
		}
		defer certOut.Close()
	
		pem.Encode(certOut, &pem.Block{
			Type:  "CERTIFICATE",
			Bytes: derBytes,
		})
	
		keyOut, err := os.Create(tmpCertKeyPath)
		if err != nil {
			log.Fatal(err)
		}
		defer keyOut.Close()
	
		pem.Encode(keyOut, &pem.Block{
			Type:  "RSA PRIVATE KEY",
			Bytes: x509.MarshalPKCS1PrivateKey(privKey),
		})
	
		fmt.Println("自己署名証明書と秘密鍵が保存されました。")
	}
# goバージョン 
FROM golang:1.19.8-alpine 

# ソースファイルをコピー
COPY . /usr/local/go/src/main
# 作業ディレクトリをセット
WORKDIR /usr/local/go/src/main

# GO Mod DL
RUN go mod download
# main.go起動
CMD ["go", "run", "main.go"]

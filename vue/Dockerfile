# Node.jsの最新のLTS版をベースにする
FROM node:20-alpine3.16 as build-stage

# 作業用ディレクトリの作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーして、依存関係のインストール
COPY vue/package*.json ./

# NPMインストール
RUN npm install

# ソースコードをコピーする
COPY . .

# 起動 
#run npm run serve

# アプリケーションのビルド
#RUN npm run build

# 本番用の軽量なNginxイメージをベースにする
#FROM nginx:alpine

# Nginxの設定ファイルを上書きする
#COPY /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# アプリケーションのビルド結果をNginxの静的ファイルとしてコピーする
#COPY --from=0 /app/dist /usr/share/nginx/html

# ポート80を公開する
#EXPOSE 80

# コンテナ起動時にNginxを実行する
#CMD ["nginx", "-g", "daemon off;"]
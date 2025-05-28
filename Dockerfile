# 公式のnodeイメージを使用
FROM node:20

# 作業ディレクトリ作成
WORKDIR /app

# 依存ファイルをコピーしてインストール
COPY . /app

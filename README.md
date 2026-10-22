# 買い物リスト

## 目的
Webアプリケーションの開発を通じて、フロントエンドからデータベースまでの基本的な仕組みを理解すること
- フロントエンドとバックエンドのデータのやり取り
- Dockerによる開発環境の構築
- Dockerコンテナ間のネットワーク通信

## 主な機能
- 商品一覧の表示
- 商品の登録
- 商品情報の編集
- 商品の削除
- 日付をカレンダーで表示


## 技術スタック
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)


## システム構成
```mermaid
flowchart TB
    User[ユーザー]
    Frontend[React + Vite]
    Backend[FastAPI]
    DB[PostgreSQL]

    User --> Frontend
    Frontend --> |HTTP / REST API| Backend
    Backend -->|DB接続| DB

```

## ディレクトリ構成


## 学習内容
- フロントエンドとバックエンド間の連携
- REST APIの設計
- データベース設計とCRUD処理
- DockerFileの作成, Docker Composeの作成方法
- Dockerコンテナ間の通信設定
- WSLを用いたLinux環境での開発
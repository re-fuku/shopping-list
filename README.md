# 買い物リスト
<p align="center">
    <img src="docs/images/shopping-list.png" width="40%">
    <img src="docs/images/calendar.png" width="40%">
</p>

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
- カレンダー表示する項目の検索機能

## 技術スタック
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## 開発環境
- OS: Ubuntu (WSL2)
- コンテナ: Docker Desktop
- バージョン管理: Git

## システム構成
```mermaid
---
config:
    theme: default
---

flowchart TB
    User[ユーザー]

    subgraph Docker["Docker環境"]
        Frontend[React + Vite]
        Backend[FastAPI]
        DB[PostgreSQL]
    end

    User --> Frontend
    Frontend --> |HTTP / REST API| Backend
    Backend -->|DB接続| DB

```

## 環境構築方法
Dockerが利用できる環境で以下を実施
1. リポジトリのクローン
    ```bash
    git clone https://github.com/re-fuku/shopping-list.git
    cd shopping-list
    ```

2. 環境変数の設定
    .env.exampleをコピーして.envを作成
    ```bash
    cp .env.example .env
    ```

    .env内の以下の3項目を任意の値に変更
    ```dotenv
    POSTGRES_USER=user_name
    POSTGRES_PASSWORD=password
    POSTGRES_DB=db_name
    ```

3. コンテナを起動
    以下のコマンドでコンテナを起動
    ```bash
    docker compose up -d
    ```

### 接続先
- フロントエンド: http://localhost:5173/
- APIドキュメント: http://localhost:8000/docs

## 学習内容
- フロントエンドとバックエンド間の連携
- Reactを使用したフロントエンドの開発
- FastAPIを使用したREST APIの設計とCRUD処理の実装
- PostgreSQLのテーブルの作成方法とデータベース操作
- Dockerfileの作成, Docker Composeによる複数のコンテナの管理
- Dockerコンテナからのデータベース接続と操作
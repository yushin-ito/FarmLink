# FarmLink

## Supabase

型を生成する

```
npx supabase init
npx supabase link --project-ref fqtmezifujskuyljoich
npx supabase gen types typescript --linked > ./src/types/db/schema.ts
```

## Git・GitHub

### 1. ブランチを切る

1. `git checkout dev`で dev ブランチに移動する
1. `git branch feature/開発するブランチ名`で開発するブランチを作成する
   `(例) git branch feature/home-ui`
1. `git checkout 開発するブランチ名`で開発するブランチに移動する
1. `git push origin HEAD`でリモートに反映する

### 2. 開発をする

1. `git checkout 開発するブランチ名`で開発するブランチに移動する
1. `git pull origin dev`で変更内容を取得する

### 3. コミットする

- コミット方法

  ```
  git add -A
  git commit -m "コミットメッセージ"
  git push origin HEAD
  ```

- コミットメッセージ<br/>
  コミットメッセージは `"主題: 内容"`の形式<br/>  
  `(例) git commit -m "Add: ログイン機能を追加"`
- 主題
  ```
  Add: 機能追加
  Change：機能変更
  Remove：機能削除
  Fix: 機能修正
  Clean: 整形
  ```

### 4. マージする

プルリクエストを作成する<br/>
(例) `base: dev` ← `compare home-ui`

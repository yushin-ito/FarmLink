## FarmLink

![version](https://img.shields.io/badge/version-1.0.0-red.svg)
![platform](https://img.shields.io/badge/platform-ios%20|%20android-orange.svg)
![stars](https://img.shields.io/github/stars/yushin-ito/farmlink?color=yellow)
![commit-activity](https://img.shields.io/github/commit-activity/t/yushin-ito/farmlink)
![license](https://img.shields.io/badge/license-MIT-green)

<br>

## 📝 Overview

FarmLink は、**日本の農業の未来を支えるための次世代型の農業支援アプリ**です。  
農業を始める方に、農業の知識や経験がなくても、安心して農業に始められる環境を提供します。  
FarmLink は **「人と人を農業でつなぐ」** ことをコンセプトに、地域社会とのつながりを深める新たなプラットフォームとして日本の農業の衰退を食い止めます。

<br>

## 🔍 Background

ご存知の通り、農業従事者の高齢化や後継者不足により、**日本の農業は衰退しています**。  
このままでは日本の食料自給率や地域経済に深刻な影響を及ぼす可能性があります。  
このような現状の裏には、いくつもの問題が絡み合っています。

**1. 農業を始めたいけど農地がない**  
新規就農者にとって、農地探しのハードルがとても高く、始めたくても始められない現状があります。

**2. 耕作放棄地が年々増加している**  
活用されていない農地は年々増加しており、手入れがないために荒廃している土地も少なくありません。

**3. 農業への知識が不足している**  
新規就農者にとって、専門的な知識が必要な農作業が障壁となり、学べる環境や相談先が少ないのが現状です。

**4. 情報が分散していて探しづらい**  
必要な情報がさまざまな機関に分かれており、農家はたらい回しに会うこともあるようです。

**5. 出荷プロセスでエラーが起こる**  
農薬の記録が紙ベースのため、出荷する際にミスが発覚すれば、大きな損失になってしまいます。

FarmLink は、**農業における「入口」から「出口」までをシームレスに支える**ことで、これらの問題を一気通貫で解決することができます。

<br>

## ✨ Features

### 1. 貸し借り

この機能では、 **「農業を始めたい人」** と **「農地を手放したい人」** をつなぐことで、  
「農業を始めたいけど農地がない」と「耕作放棄地が年々増加している」を解決します。

操作はとてもシンプルです。

**1. マップから気になる農地を発見**  
**2. 所有者とチャットでやり取り**  
**3. アプリ内で決済を完了**

以下の動画は、農地を探してチャットでやり取りするまでの流れです。

<div align="center">
  <video controls src="https://github.com/user-attachments/assets/ab8db972-e0b6-406e-9354-379267b76e3e" muted="false"></video>
</div>

農業を始めたい人にとってはスムーズに農地を確保できる手段として、  
農地を手放したい人にとっては安心して貸し手・買い手を見つける手段として利用できます。

<br>

### 2. コミュニティ

この機能では、**ニーズに合ったカテゴリー別のコミュニティ**で相談することで  
「農業への知識が不足している」と「情報が分散していて探しづらい」を解決します。

操作はとてもシンプルです。

**1. ニーズに合ったコミュニティを選択**  
**2. わからないことは気軽に質問**  
**3. 公式コミュニティで情報をまとめて管理**

以下の動画は、コミュニティを使って相談するまでの流れです。

<div align="center">
  <video controls src="https://github.com/user-attachments/assets/11b0128e-9b2f-49b5-a9a5-671687209a2d" muted="false"></video>
</div>

初心者にとっては、わからないことを気軽に相談できる場として、  
経験者にとっては、自分の知識を共有する場として活用できます。

<br>

### 3. 作業記録

まずは、「出荷プロセスでエラーが起こる」という問題について説明します。  
出荷プロセスとは以下のような流れです。

**1. 農地に農薬を散布する**  
**2. 散布した農薬を記録する**  
**3. 記録簿を農協に提供する**  
**4. 記録簿を農協がチェックする**

しかし、この出荷プロセスでは、間違った農薬を散布してしまったり、間違えて農薬を記録してしまったりしてしまいます。  
この機能では、 **JA 鈴鹿と協力する** ことで、この「出荷プロセスでエラーが起こる」という問題を解決します。

操作はとてもシンプルです。

**1. AI によって最適な農薬を提示**  
**2. 過去の作業記録を見える化**  
**3. Excel シートを自動で生成して送信**

以下の動画は、作業を記録するまでの流れです。

<div align="center">
  <video controls src="https://github.com/user-attachments/assets/91697c9c-ad8b-425f-8511-a36fc5991193" muted="false"></video>
</div>

今までのペーパーワークをすべてオンライン上で行うことで、  
ミスを未然に防ぎ、農業の現場にさらなる安心を届けます。

<br>

## 🔧 Usage

[![Open in VS Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://open.vscode.dev/yushin-ito/farmlink)

1. リポジトリをクローンする

   ```bash
   git clone https://github.com/yushin-ito/farmlink.git
   ```

2. リポジトリに移動する

   ```bash
   cd app
   ```

3. `.env` を作成する

   ```env
   SUPABASE_URL=
   SUPABASE_KEY=
   GOOGLE_MAP_API_KEY_IOS=
   GOOGLE_MAP_API_KEY_ANDROID=
   ```

4. 依存関係をインストールする

   ```bash
   npm install
   ```

5. 開発サーバーを起動する
   ```bash
   npx expo start
   ```

<br>

## ⚡️ Structure

```
farmlink/
├── assets/
├── src/
│   ├── components/     # コンポーネント
│   ├── contexts/       # コンテキスト
│   ├── functions/      # ユーティリティ
│   ├── hooks/          # カスタムフック
│   ├── i18n/           # 国際化
│   ├── navigators/     # 画面遷移
│   ├── screens/        # 画面
│   ├── supabase/       # Supabase
│   └── types/          # 型定義
```

<br>

## 👀 Author

<a href="https://github.com/yushin-ito"><img  src="https://avatars.githubusercontent.com/u/75526539?s=48&v=4" width="64px"></a>
<a href="https://github.com/chibana-kit"><img src="https://avatars.githubusercontent.com/u/108317630?v=4" width="64px"></a>
<a href="https://github.com/r02i31"><img src="https://avatars.githubusercontent.com/u/108317588?v=4" width="64px"></a>
<a href="https://github.com/HipsMaro"><img src="https://avatars.githubusercontent.com/u/108317599?v=4" width="64px"></a>
<a href="https://github.com/ihsikawa"><img src="https://avatars.githubusercontent.com/u/108317813?v=4" width="64px"></a>
<a href="https://github.com/Keisuke373"><img src="https://avatars.githubusercontent.com/u/108318002?v=4" width="64px"></a>
<a href="https://github.com/rikuma77"><img src="https://avatars.githubusercontent.com/u/108317556?v=4" width="64px"></a>

<br>

## 📜 LICENSE

[MIT LICENSE](LICENSE)

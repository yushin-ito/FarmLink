<ol>
  <li>
    <h2>ブランチを切る</h2>
  </li>
  <ol>
    <li><code>git checkout dev</code>でdevブランチに移動する</li>
    <li><code>git branch feature/開発するブランチ名</code>で開発するブランチを作成する</li>
    <li><code>git checkout 開発するブランチ名</code>で開発するブランチに移動する</li>
    <li><code>git push origin HEAD</code>でリモートに反映する</li>
  </ol>
  <li>
    <h2>開発をする</h2>
  </li>
  <ol>
    <li><code>git checkout 開発するブランチ名</code>で開発するブランチに移動する</li>
    <li><code>git pull origin dev</code>で変更内容を取得する</li>
  </ol>
  <li>
    <h2>コミットする</h2>
  </li>
  <ul>
    <li>コミット方法</li>
    <pre><code>git add -A
git commit -m "コミットメッセージ"
git push origin HEAD</code></pre>
    <li>コミットメッセージ</li>
    <p>コミットメッセージは <code>"主題: 内容"</code>の形式</p>
    <li>主題</li>
    <pre><code>Add: 機能追加
Change：機能変更
Remove：機能削除
Fix: 機能修正
Clean: 整形</code></pre>
  </ul>

  <li><h2>マージする</h2></li>
  <p>プルリクエストを作成する</p>
  <p>(例) <code>base: dev</code> ← <code>compare home-ui</code></p>
</ol>

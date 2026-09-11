# (OBSカスタムCSS)

OBS Studioの「ブラウザソース」内にある**カスタムCSS**欄を使用することで、デザインやカラーを自由にカスタマイズできます。

---

## 基本的な使い方

1. **OBS Studio** を起動します。
2. ソース一覧から作成した **「ブラウザ」ソース**（例: `Arbitration Overlay`）をダブルクリック（または右クリック ＞ プロパティ）して設定画面を開きます。
3. 下部にある **「カスタムCSS」** の入力欄に、以下のコードを必要に応じてコピー＆ペーストして貼り付けます。
4. **「OK」** をクリックすると、変更が即座に反映されます。

---

## 1. 背景透過・スタイル変更

### A. 完全透明モード（背景・枠線を消して文字だけ表示）
カード全体の背景色、黒枠、影をすべて除去し、ゲーム画面の上に文字だけを浮かせる設定です。

```css
body {
  background-color: transparent !important;
  margin: 0;
  overflow: hidden;
}

/* カード全体の背景・枠線・影を消去 */
.arb-card {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

```

### B. 背景の透け具合（不透明度）の調整

背景を少し薄暗くして文字を見やすくしたい場合は、`rgba` の数値を調整します。

```css
body {
  background-color: transparent !important;
  margin: 0;
  overflow: hidden;
}

.arb-card {
  /* 末尾の 0.4 が不透明度（0.0: 完全透明 〜 1.0: 濃い黒） */
  background: rgba(15, 23, 42, 0.4) !important;
}

```

---

## 2. 文字色・パーツ別カラーの調整

Current（現在）と Next（次）のタイトル色は個別で変更できます。お好みのカラーコード（`#FFFFFF` や `#FF007F` など）に変更してください。

```css
/* 1. CURRENT のタイトル文字色 */
.section:first-child .title {
  color: #2ecc71 !important; /* 例: ネオングリーン */
}

/* 2. NEXT のタイトル文字色 */
.section:last-child .title {
  color: #3498db !important; /* 例: シアンブルー */
}

/* 3. ミッション名・惑星名・Tier（例: Alator (Mars) S-Tier） */
.current-node, 
.next-node {
  color: #ffffff !important; /* 例: 白 */
}

/* 4. タイマーのテキスト（「Time Left:」や残り時間の数字） */
.timer-container, 
.timer {
  color: #ffcc00 !important; /* 例: イエロー */
}

/* 5. 中央の縦区切り線 */
.divider-v {
  background-color: rgba(255, 255, 255, 0.3) !important; /* 例: 半透明の白 */
}

```

---

## 3. 視認性を高めるドロップシャドウ（文字影）

背景を完全透明にした際、明るいマップ等で文字が見づらくなるのを防ぐための黒影の設定です。

```css
/* 全ての文字にドロップシャドウを付与 */
.arb-card {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9), 0 0 5px rgba(0, 0, 0, 0.8) !important;
}

```

---

## プリセットテーマ例

コードをそのまま貼り付けて使えるおすすめのカラー構成です。

###  Warframe Prime テーマ（ゴールド＆プラズマブルー）

```css
body { background-color: transparent !important; margin: 0; overflow: hidden; }
.arb-card { background: rgba(10, 15, 25, 0.6) !important; border-color: #f3d183 !important; }
.section:first-child .title { color: #f3d183 !important; } /* CURRENT */
.section:last-child .title  { color: #38b6ff !important; } /* NEXT */
.current-node, .next-node { color: #ffffff !important; }
.timer-container, .timer { color: #f3d183 !important; }

```

###  サイバーパンク テーマ（ピンク＆シアン）

```css
body { background-color: transparent !important; margin: 0; overflow: hidden; }
.arb-card { background: transparent !important; border: none !important; box-shadow: none !important; text-shadow: 0 0 6px rgba(0,0,0,0.9) !important; }
.section:first-child .title { color: #ff007f !important; } /* CURRENT: ネオンピンク */
.section:last-child .title  { color: #00f6ff !important; } /* NEXT: シアン */
.current-node, .next-node { color: #ffffff !important; }
.timer-container, .timer { color: #ffe600 !important; }

```

```

```
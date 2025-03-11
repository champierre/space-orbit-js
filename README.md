# Space Orbit JS

[@Toshiya_A](https://x.com/Toshiya_A)氏が開発した未就学児向け軌道設計アプリケーション[Space Orbit](https://zenn.dev/ta168/articles/space-orbit_app)の JavaScript 実装版です。

## 概要

Space Orbit は、自由に宇宙船を発射してその軌道を眺めることができるシンプルなアプリケーションです。地球と月の重力に従って宇宙船が動き、その軌道を視覚的に楽しむことができます。

## 機能

- 画面上の任意の場所からスワイプ/ドラッグして宇宙船を発射
  - スワイプ/ドラッグの方向に宇宙船が発射される
  - スワイプ/ドラッグの速さに応じて初速度が変化
  - Shift キーを押しながらスワイプすると、ランダムな色の軌道を持つ宇宙船が発射される
- 発射された宇宙船は地球と月の重力に従い運動
- 地球をクリックするとすべての宇宙船を消去
- 地球重力を脱する軌道は水色、捉えられている軌道は緑色で表示
- 月の軌道がグレーの線で表示
- 月スイングバイによる加速時にはキラキラエフェクト表示
- 宇宙船が地球または月に衝突すると爆発エフェクトが表示され、宇宙船は消滅

## 技術的詳細

- p5.js を使用した描画処理
- Runge-Kutta 法（RK4）による運動方程式の数値解法
- 地心エネルギーに基づく軌道の色分け
- モジュール化されたコード構造（以下のファイルに分割）
  - `constants.js` - 定数の定義
  - `utils.js` - ユーティリティ関数
  - `effects.js` - 視覚効果の処理
  - `moon.js` - 月の位置と軌道の更新
  - `spacecraft.js` - 宇宙船クラスの定義
  - `input.js` - マウスとタッチ入力の処理
  - `main.js` - メインのセットアップと描画ループ

## 使い方

1. ブラウザで index.html を開く
2. 画面上の任意の場所からスワイプ/ドラッグして宇宙船を発射
   - スワイプ/ドラッグの方向に発射
   - 速さに応じて初速度が変化
   - Shift キーを押しながらスワイプ：ランダムな色の軌道
3. 地球をタップ/クリックするとすべての宇宙船を消去

## 注意事項

- 地球と月は実際の縮尺よりも大きめ（5 倍）に表示しています
- 実際の軌道設計には使用しないでください
- 宇宙船の数に制限はありませんが、多すぎるとパフォーマンスが低下する場合があります

## 仕様

詳細な仕様については[SPECIFICATION.md](SPECIFICATION.md)を参照してください。

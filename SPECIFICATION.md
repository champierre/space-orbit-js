# Space Orbit 仕様書

## 概要

[Space Orbit](https://zenn.dev/ta168/articles/space-orbit_app)は未就学児向けの軌道設計アプリケーションです。ユーザーは自由に宇宙船を発射し、地球と月の重力に従って動く軌道を眺めることができます。

## 機能要件

### 基本機能

- 画面上の任意の場所からスワイプ/ドラッグすることで宇宙船を発射できる
  - スワイプ/ドラッグの方向に宇宙船が発射される
  - 初速度の大きさはスワイプ/ドラッグの速さ（100-1000 ピクセル/秒）に応じて 2-8 の範囲で設定される
  - スワイプ/ドラッグ距離が 20 ピクセル以上、かつ操作時間が 1 秒未満の場合のみ発射される
  - Shift キーを押しながらスワイプすると、ランダムな色の軌道を持つ宇宙船が発射される
- 発射された宇宙船は地球と月の重力に従い運動を続ける
- 地球をタップ/クリックすると全ての宇宙船を消去できる
- 地球重力を脱するスピードを持つ宇宙船の軌道は水色で表示される
- 地球重力に捉えられている宇宙船の軌道は緑色で表示される
- 月の軌道はグレーの線で表示される
- 月スイングバイで一定の加速をすると宇宙船にキラキラエフェクトが表示される
- 宇宙船が地球または月に衝突すると爆発エフェクトが表示され、宇宙船は消滅する

### 表示要素

- 中央に青い地球を配置
- 地球の周りを黄色い月が周回
- 宇宙船の軌道を線で表示
- 宇宙船自体は白い点で表示
- 背景は黒（宇宙空間）

### 制限事項

- 宇宙船の数に制限はありませんが、多すぎるとパフォーマンスが低下する場合があります
- 地球と月は実際の縮尺よりも大きめ（5 倍）に表示
- 実際の軌道設計には使用しないこと

## 技術仕様

### 物理モデル

- 地球と月の重力のみを考慮した運動方程式を使用
  - 地球の重力定数：5000
  - 月の重力定数：100（地球の影響を受けやすくするため弱めに設定）
- 地球中心慣性座標系を採用
- 運動方程式の解法には Runge-Kutta 法（RK4）を使用

### エネルギー計算

- 各宇宙船の地心エネルギー ε（地球に対する運動エネルギーと位置エネルギーの和）を計算
  ```
  ε = (1/2)v² - μE/rE
  ```
  - v: 宇宙船の地球に対する速度の大きさ
  - μE: 地球の重力定数
  - rE: 宇宙船の地球からの距離

### 軌道の色分け

- 通常の場合：
  - 地心エネルギー ε が負の値の場合：緑色（地球重力に捉えられている状態）
  - 地心エネルギー ε が正の値の場合：水色（地球重力圏から脱している状態）
- Shift キーを押しながらスワイプした場合：ランダムな色で表示

### エフェクト

- 地心エネルギー ε の単位時間あたりの増加量が一定以上になっている間、キラキラエフェクトを表示
- これは主に月のスイングバイによる加速時に発生
- 宇宙船が地球または月に衝突した場合、白色の爆発エフェクトを表示

## 実装方針

- JavaScript と p5.js を使用して実装
- 描画処理は p5.js のキャンバス上で行う
- 数値計算（Runge-Kutta 法）は JavaScript で実装
- レスポンシブデザインで様々な画面サイズに対応
- モジュール化されたコード構造で保守性を向上

### コード構成

アプリケーションは以下のモジュールに分割されています：

1. `constants.js` - アプリケーション全体で使用される定数の定義
   - 物体の大きさ（地球・月の半径）
   - 物理パラメータ（重力定数、角速度）
   - 色の定義

2. `utils.js` - ユーティリティ関数
   - ランダムな色の生成など

3. `effects.js` - 視覚効果の処理
   - キラキラエフェクト
   - 爆発エフェクト

4. `moon.js` - 月に関する処理
   - 月の位置計算
   - 月の軌道の描画

5. `spacecraft.js` - 宇宙船に関する処理
   - 宇宙船クラスの定義
   - 運動方程式の数値解法（Runge-Kutta法）
   - 軌道の描画

6. `input.js` - ユーザー入力の処理
   - タッチ/マウスイベントの処理
   - スワイプ検出
   - ウィンドウリサイズ処理

7. `main.js` - メインの処理
   - p5.jsのセットアップ
   - 描画ループ

# Space Orbit JS

未就学児向け軌道設計アプリケーション「Space Orbit」のJavaScript実装版です。
[Space Orbit](https://zenn.dev/ta168/articles/space-orbit_app)を参考に実装しています。

## 概要

Space Orbitは、自由に宇宙船を発射してその軌道を眺めることができるシンプルなアプリケーションです。地球と月の重力に従って宇宙船が動き、その軌道を視覚的に楽しむことができます。


## 機能

- 画面上の任意の場所をクリックして宇宙船を発射
- 発射された宇宙船は地球と月の重力に従い運動
- 地球をクリックするとすべての宇宙船を消去
- 地球重力を脱する軌道は水色、捉えられている軌道は緑色で表示
- 月スイングバイによる加速時にはキラキラエフェクト表示
- 宇宙船が地球または月に衝突すると爆発エフェクトが表示され、宇宙船は消滅

## 技術的詳細

- p5.jsを使用した描画処理
- Runge-Kutta法（RK4）による運動方程式の数値解法
- 地心エネルギーに基づく軌道の色分け

## 使い方

1. ブラウザでindex.htmlを開く
2. 画面上の任意の場所をクリックして宇宙船を発射
3. 地球をクリックするとすべての宇宙船を消去
4. 宇宙船の数は10機程度に抑えることを推奨

## 注意事項

- 地球と月は実際の縮尺よりも大きめ（5倍）に表示しています
- 実際の軌道設計には使用しないでください
- 宇宙船が多すぎるとパフォーマンスが低下する場合があります

## 仕様

詳細な仕様については[SPECIFICATION.md](SPECIFICATION.md)を参照してください。

// p5.jsのセットアップ関数
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  frameRate(60);
  ellipseMode(RADIUS);
  textSize(16);
  textAlign(LEFT, TOP);
  
  // タッチイベントの設定
  setupTouchEvents(canvas);
  
  // 初期化
  moonAngle = 0;
  moonTrail = [];
  updateMoonPosition();
}

// p5.jsの描画ループ
function draw() {
  background(0);
  
  // 月の位置を更新
  updateMoonAngle();
  updateMoonPosition();
  
  // 地球を描画
  fill(EARTH_COLOR);
  noStroke();
  ellipse(width/2, height/2, EARTH_RADIUS, EARTH_RADIUS);
  
  // 月とその軌道を描画
  drawMoon();
  
  // 宇宙船を更新・描画
  updateAndDrawSpacecrafts();
  
  // エフェクトを描画
  drawAllEffects();
}

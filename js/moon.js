// グローバル変数
let moonAngle = 0; // 月の角度
let moonX, moonY; // 月の位置
let moonTrail = []; // 月の軌道の履歴

// 月の位置を更新する関数
function updateMoonPosition() {
  moonX = width/2 + MOON_DISTANCE * cos(moonAngle);
  moonY = height/2 + MOON_DISTANCE * sin(moonAngle);
  
  // 月の軌道の履歴を更新
  moonTrail.push(createVector(moonX, moonY));
  if (moonTrail.length > 720) { // 月の軌道は約2周分（約720ポイント）保存
    moonTrail.shift();
  }
}

// 月の角度を更新する関数
function updateMoonAngle() {
  moonAngle += MOON_ANGULAR_VELOCITY;
}

// 月とその軌道を描画する関数
function drawMoon() {
  // 月の軌道を描画
  noFill();
  stroke(MOON_COLOR); // 月と同じ黄色の軌道
  beginShape();
  for (let i = 0; i < moonTrail.length; i++) {
    vertex(moonTrail[i].x, moonTrail[i].y);
  }
  endShape();
  
  // 月を描画
  fill(MOON_COLOR);
  noStroke();
  ellipse(moonX, moonY, MOON_RADIUS, MOON_RADIUS);
}

// 月の軌道をリセットする関数（リサイズ時などに使用）
function resetMoonTrail() {
  moonTrail = [];
}

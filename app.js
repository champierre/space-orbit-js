// 定数
const EARTH_RADIUS = 30; // 地球の半径（ピクセル）
const MOON_RADIUS = 10; // 月の半径（ピクセル）
const MOON_DISTANCE = 200; // 月の軌道半径（ピクセル）
const MOON_ANGULAR_VELOCITY = 0.005; // 月の角速度
const TRAIL_LENGTH = 100; // 軌道の長さ（ポイント数）

// 重力定数
const MU_EARTH = 5000; // 地球の重力定数
const MU_MOON = 500; // 月の重力定数

// 色
const EARTH_COLOR = [0, 100, 255]; // 地球の色（青）
const MOON_COLOR = [255, 255, 0]; // 月の色（黄色）
const BOUND_ORBIT_COLOR = [0, 255, 0]; // 束縛軌道の色（緑）
const ESCAPE_ORBIT_COLOR = [0, 255, 255]; // 脱出軌道の色（水色）
const SPACECRAFT_COLOR = [255, 255, 255]; // 宇宙船の色（白）

// グローバル変数
let moonAngle = 0; // 月の角度
let moonX, moonY; // 月の位置
let moonTrail = []; // 月の軌道の履歴
let spacecrafts = []; // 宇宙船の配列
let sparkleEffects = []; // キラキラエフェクトの配列
let explosionEffects = []; // 爆発エフェクトの配列

// 宇宙船クラス
class Spacecraft {
  constructor(x, y, vx, vy) {
    this.position = createVector(x, y);
    this.velocity = createVector(vx, vy);
    this.trail = []; // 軌道の履歴
    this.energy = 0; // 地心エネルギー
    this.prevEnergy = 0; // 前フレームの地心エネルギー
    this.sparkle = false; // キラキラエフェクトのフラグ
  }

  // 位置と速度を更新（Runge-Kutta法）
  update() {
    // 地球との衝突チェック
    let distToEarth = dist(this.position.x, this.position.y, width/2, height/2);
    if (distToEarth <= EARTH_RADIUS) {
      // 爆発エフェクトを追加
      explosionEffects.push({
        x: this.position.x,
        y: this.position.y,
        size: 30,
        life: 30, // エフェクトの寿命（フレーム数）
        alpha: 255 // 透明度
      });
      
      // 衝突した宇宙船を配列から削除するためにnullを返す
      return true;
    }
    
    // 月との衝突チェック
    let distToMoon = dist(this.position.x, this.position.y, moonX, moonY);
    if (distToMoon <= MOON_RADIUS) {
      // 爆発エフェクトを追加
      explosionEffects.push({
        x: this.position.x,
        y: this.position.y,
        size: 20, // 月での爆発は少し小さめ
        life: 30, // エフェクトの寿命（フレーム数）
        alpha: 255 // 透明度
      });
      
      // 衝突した宇宙船を配列から削除するためにnullを返す
      return true;
    }
    
    // 現在の地心エネルギーを保存
    this.prevEnergy = this.energy;

    // Runge-Kutta法（RK4）による数値積分
    let k1v = this.calculateAcceleration(this.position);
    let k1r = p5.Vector.mult(this.velocity, 1);

    let tempPos = p5.Vector.add(this.position, p5.Vector.mult(k1r, 0.5));
    let tempVel = p5.Vector.add(this.velocity, p5.Vector.mult(k1v, 0.5));
    let k2v = this.calculateAcceleration(tempPos);
    let k2r = p5.Vector.mult(tempVel, 1);

    tempPos = p5.Vector.add(this.position, p5.Vector.mult(k2r, 0.5));
    tempVel = p5.Vector.add(this.velocity, p5.Vector.mult(k2v, 0.5));
    let k3v = this.calculateAcceleration(tempPos);
    let k3r = p5.Vector.mult(tempVel, 1);

    tempPos = p5.Vector.add(this.position, k3r);
    tempVel = p5.Vector.add(this.velocity, k3v);
    let k4v = this.calculateAcceleration(tempPos);
    let k4r = p5.Vector.mult(tempVel, 1);

    // 速度と位置の更新
    let dv = p5.Vector.mult(
      p5.Vector.add(
        p5.Vector.add(k1v, p5.Vector.mult(k2v, 2)),
        p5.Vector.add(p5.Vector.mult(k3v, 2), k4v)
      ),
      1/6
    );
    let dr = p5.Vector.mult(
      p5.Vector.add(
        p5.Vector.add(k1r, p5.Vector.mult(k2r, 2)),
        p5.Vector.add(p5.Vector.mult(k3r, 2), k4r)
      ),
      1/6
    );

    this.velocity.add(dv);
    this.position.add(dr);

    // 軌道の履歴を更新
    this.trail.push(createVector(this.position.x, this.position.y));
    if (this.trail.length > TRAIL_LENGTH) {
      this.trail.shift();
    }

    // 地心エネルギーの計算
    let rE = dist(this.position.x, this.position.y, width/2, height/2);
    let v = this.velocity.mag();
    this.energy = 0.5 * v * v - MU_EARTH / rE;

    // キラキラエフェクトの判定（エネルギー増加率が閾値を超えた場合）
    let energyIncrease = this.energy - this.prevEnergy;
    if (energyIncrease > 0.1) {
      this.sparkle = true;
      // キラキラエフェクトを追加
      sparkleEffects.push({
        x: this.position.x,
        y: this.position.y,
        life: 20 // エフェクトの寿命（フレーム数）
      });
    } else {
      this.sparkle = false;
    }
  }

  // 加速度を計算（地球と月の重力による）
  calculateAcceleration(pos) {
    // 地球からの重力
    let rEarth = createVector(width/2 - pos.x, height/2 - pos.y);
    let rEarthMag = rEarth.mag();
    let aEarth = p5.Vector.mult(rEarth, MU_EARTH / (rEarthMag * rEarthMag * rEarthMag));

    // 月からの重力
    let rMoon = createVector(moonX - pos.x, moonY - pos.y);
    let rMoonMag = rMoon.mag();
    let aMoon = p5.Vector.mult(rMoon, MU_MOON / (rMoonMag * rMoonMag * rMoonMag));

    // 合計加速度
    return p5.Vector.add(aEarth, aMoon);
  }

  // 宇宙船と軌道を描画
  draw() {
    // 軌道の色を決定（エネルギーに基づく）
    let orbitColor = this.energy < 0 ? BOUND_ORBIT_COLOR : ESCAPE_ORBIT_COLOR;

    // 軌道を描画
    noFill();
    stroke(orbitColor);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();

    // 宇宙船を描画
    fill(SPACECRAFT_COLOR);
    noStroke();
    ellipse(this.position.x, this.position.y, 5, 5);
  }
}

// p5.jsのセットアップ関数
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  ellipseMode(RADIUS);
  
  // 初期化
  moonAngle = 0;
  moonTrail = [];
  updateMoonPosition();
}

// 月の位置を更新
function updateMoonPosition() {
  moonX = width/2 + MOON_DISTANCE * cos(moonAngle);
  moonY = height/2 + MOON_DISTANCE * sin(moonAngle);
  
  // 月の軌道の履歴を更新
  moonTrail.push(createVector(moonX, moonY));
  if (moonTrail.length > 720) { // 月の軌道は約2周分（約720ポイント）保存
    moonTrail.shift();
  }
}

// p5.jsの描画ループ
function draw() {
  background(0);
  
  // 月の位置を更新
  moonAngle += MOON_ANGULAR_VELOCITY;
  updateMoonPosition();
  
  // 地球を描画
  fill(EARTH_COLOR);
  noStroke();
  ellipse(width/2, height/2, EARTH_RADIUS, EARTH_RADIUS);
  
  // 月の軌道を描画
  noFill();
  stroke(100, 100, 100); // グレーの軌道
  beginShape();
  for (let i = 0; i < moonTrail.length; i++) {
    vertex(moonTrail[i].x, moonTrail[i].y);
  }
  endShape();
  
  // 月を描画
  fill(MOON_COLOR);
  noStroke();
  ellipse(moonX, moonY, MOON_RADIUS, MOON_RADIUS);
  
  // 宇宙船を更新・描画
  for (let i = spacecrafts.length - 1; i >= 0; i--) {
    // updateメソッドがtrueを返した場合（地球に衝突した場合）、宇宙船を削除
    if (spacecrafts[i].update()) {
      spacecrafts.splice(i, 1);
    } else {
      spacecrafts[i].draw();
    }
  }
  
  // 爆発エフェクトを描画
  for (let i = explosionEffects.length - 1; i >= 0; i--) {
    let effect = explosionEffects[i];
    
    // エフェクトを描画
    fill(255, 255, 255, effect.alpha); // 白色の爆発
    noStroke();
    
    // 爆発形状
    push();
    translate(effect.x, effect.y);
    
    // 複数の円を描画して爆発を表現
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI * j / 8;
      let distance = effect.size * (1 - effect.life / 30) * 0.5;
      let x = cos(angle) * distance;
      let y = sin(angle) * distance;
      let size = effect.size * (effect.life / 30);
      ellipse(x, y, size, size);
    }
    
    // 中心の大きな円
    fill(255, 255, 255, effect.alpha); // 白色の中心
    ellipse(0, 0, effect.size * (1 - effect.life / 30), effect.size * (1 - effect.life / 30));
    
    pop();
    
    // エフェクトの寿命を減らす
    effect.life--;
    effect.alpha = 255 * (effect.life / 30);
    
    // 寿命が尽きたエフェクトを削除
    if (effect.life <= 0) {
      explosionEffects.splice(i, 1);
    }
  }
  
  // キラキラエフェクトを描画
  for (let i = sparkleEffects.length - 1; i >= 0; i--) {
    let effect = sparkleEffects[i];
    
    // エフェクトを描画
    fill(255, 255, 255, effect.life * 10);
    noStroke();
    
    // キラキラ形状
    push();
    translate(effect.x, effect.y);
    rotate(frameCount * 0.1);
    
    // 星形
    beginShape();
    for (let j = 0; j < 5; j++) {
      let angle = TWO_PI * j / 5 - HALF_PI;
      let x1 = cos(angle) * 10;
      let y1 = sin(angle) * 10;
      vertex(x1, y1);
      
      angle += TWO_PI / 10;
      let x2 = cos(angle) * 5;
      let y2 = sin(angle) * 5;
      vertex(x2, y2);
    }
    endShape(CLOSE);
    pop();
    
    // エフェクトの寿命を減らす
    effect.life--;
    
    // 寿命が尽きたエフェクトを削除
    if (effect.life <= 0) {
      sparkleEffects.splice(i, 1);
    }
  }
}

// マウスクリックイベント
function mousePressed() {
  // 地球をクリックした場合、すべての宇宙船を消去
  let dEarth = dist(mouseX, mouseY, width/2, height/2);
  if (dEarth < EARTH_RADIUS) {
    spacecrafts = [];
    sparkleEffects = [];
    return;
  }
  
  // 宇宙船を追加（制限なし）
  // クリック位置から初速度を計算（中心からの方向に初速度を与える）
  let dirX = mouseX - width/2;
  let dirY = mouseY - height/2;
  let dirMag = sqrt(dirX * dirX + dirY * dirY);
  
  // 初速度の大きさは距離に比例（遠いほど速く）
  let speed = map(dirMag, 0, width/2, 2, 8);
  
  // 方向ベクトルを正規化して速度を設定
  let vx = (dirY) / dirMag * speed; // 接線方向（90度回転）
  let vy = (-dirX) / dirMag * speed;
  
  // 宇宙船を追加
  spacecrafts.push(new Spacecraft(mouseX, mouseY, vx, vy));
}

// ウィンドウリサイズイベント
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

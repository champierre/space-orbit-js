// グローバル変数
let spacecrafts = []; // 宇宙船の配列

// 宇宙船クラス
class Spacecraft {
  constructor(x, y, vx, vy) {
    this.position = createVector(x, y);
    this.velocity = createVector(vx, vy);
    this.trail = []; // 軌道の履歴
    this.energy = 0; // 地心エネルギー
    this.prevEnergy = 0; // 前フレームの地心エネルギー
    this.sparkle = false; // キラキラエフェクトのフラグ
    this.orbitColor = null; // 軌道の色（nullの場合はエネルギーに基づいて決定）
  }

  // 位置と速度を更新（Runge-Kutta法）
  update() {
    // 地球との衝突チェック
    let distToEarth = dist(this.position.x, this.position.y, width/2, height/2);
    if (distToEarth <= EARTH_RADIUS) {
      // 爆発エフェクトを追加
      addExplosionEffect(this.position.x, this.position.y, 30);
      
      // 衝突した宇宙船を配列から削除するためにtrueを返す
      return true;
    }
    
    // 月との衝突チェック
    let distToMoon = dist(this.position.x, this.position.y, moonX, moonY);
    if (distToMoon <= MOON_RADIUS) {
      // 爆発エフェクトを追加
      addExplosionEffect(this.position.x, this.position.y, 20); // 月での爆発は少し小さめ
      
      // 衝突した宇宙船を配列から削除するためにtrueを返す
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
    if (energyIncrease > 0.1 && !isResizing) {
      this.sparkle = true;
      // キラキラエフェクトを追加
      addSparkleEffect(this.position.x, this.position.y);
    } else {
      this.sparkle = false;
    }
    
    return false; // 衝突していない場合はfalseを返す
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
    // 軌道の色を決定
    let orbitColor = this.orbitColor || (this.energy < 0 ? BOUND_ORBIT_COLOR : ESCAPE_ORBIT_COLOR);

    // 軌道を描画
    noFill();
    stroke(...orbitColor);
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

// 宇宙船を作成する関数
function createSpacecraft(x, y, vx, vy, customColor = null) {
  let spacecraft = new Spacecraft(x, y, vx, vy);
  if (customColor) {
    spacecraft.orbitColor = customColor;
  }
  spacecrafts.push(spacecraft);
  return spacecraft;
}

// すべての宇宙船を更新・描画する関数
function updateAndDrawSpacecrafts() {
  for (let i = spacecrafts.length - 1; i >= 0; i--) {
    // updateメソッドがtrueを返した場合（衝突した場合）、宇宙船を削除
    if (spacecrafts[i].update()) {
      spacecrafts.splice(i, 1);
    } else {
      spacecrafts[i].draw();
    }
  }
}

// すべての宇宙船を削除する関数
function clearAllSpacecrafts() {
  spacecrafts = [];
}

// リサイズ時に宇宙船の位置と軌道を更新する関数
function updateSpacecraftsOnResize(offset) {
  spacecrafts.forEach(s => {
    s.position.add(offset);
    s.trail = s.trail.map(p => p5.Vector.add(p, offset));
  });
}

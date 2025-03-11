// グローバル変数
let sparkleEffects = []; // キラキラエフェクトの配列
let explosionEffects = []; // 爆発エフェクトの配列

// キラキラエフェクトを追加する関数
function addSparkleEffect(x, y) {
  sparkleEffects.push({
    x: x,
    y: y,
    life: 20 // エフェクトの寿命（フレーム数）
  });
}

// 爆発エフェクトを追加する関数
function addExplosionEffect(x, y, size) {
  explosionEffects.push({
    x: x,
    y: y,
    size: size,
    life: 30, // エフェクトの寿命（フレーム数）
    alpha: 255 // 透明度
  });
}

// キラキラエフェクトを描画する関数
function drawSparkleEffects() {
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

// 爆発エフェクトを描画する関数
function drawExplosionEffects() {
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
}

// すべてのエフェクトを描画する関数
function drawAllEffects() {
  drawExplosionEffects();
  drawSparkleEffects();
}

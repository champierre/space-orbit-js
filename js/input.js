// グローバル変数
let isResizing = false; // リサイズ中フラグ
let touchStartX = null; // タッチ開始位置X
let touchStartY = null; // タッチ開始位置Y
let touchStartTime = null; // タッチ開始時刻
let lastTouchX = null; // 最後のタッチ位置X
let lastTouchY = null; // 最後のタッチ位置Y

// タッチイベントの処理を設定する関数
function setupTouchEvents(canvas) {
  let canvasEl = canvas.elt;
  
  // タッチイベントの処理
  function handleTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    let rect = canvasEl.getBoundingClientRect();
    let touch = e.touches ? e.touches[0] : null;
    let x = touch ? touch.clientX - rect.left : mouseX;
    let y = touch ? touch.clientY - rect.top : mouseY;
    
    switch(e.type) {
      case 'touchstart':
        touchStartX = x;
        touchStartY = y;
        touchStartTime = millis();
        break;
      case 'touchmove':
        lastTouchX = x;
        lastTouchY = y;
        break;
      case 'touchend':
        handleTouchEnd();
        break;
    }
    return false;
  }
  
  // イベントリスナーの追加
  canvasEl.addEventListener('touchstart', handleTouch, { passive: false });
  canvasEl.addEventListener('touchmove', handleTouch, { passive: false });
  canvasEl.addEventListener('touchend', handleTouch, { passive: false });
  
  // iOS Safariでのスクロール防止
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
}

// タッチ終了時の処理
function handleTouchEnd() {
  if (touchStartX === null || touchStartY === null || touchStartTime === null || lastTouchX === null || lastTouchY === null) {
    // タッチ情報をリセット
    resetTouchInfo();
    return false;
  }

  // 最後のタッチ位置を使用
  let touchEndX = lastTouchX;
  let touchEndY = lastTouchY;

  // 地球をタッチした場合、すべての宇宙船を消去
  let dEarth = dist(touchStartX, touchStartY, width/2, height/2);
  if (dEarth < EARTH_RADIUS) {
    clearAllSpacecrafts();
    sparkleEffects = [];
    resetTouchInfo();
    return false;
  }
  let touchEndTime = millis();

  // スワイプの距離と時間を計算
  let swipeDistance = dist(touchStartX, touchStartY, touchEndX, touchEndY);
  let swipeTime = (touchEndTime - touchStartTime) / 1000; // 秒単位

  // 最小スワイプ距離と最大スワイプ時間
  if (swipeDistance > 20 && swipeTime < 1.0) {
    // スワイプの方向ベクトル
    let dirX = touchEndX - touchStartX;
    let dirY = touchEndY - touchStartY;
    
    // スワイプ速度（ピクセル/秒）
    let swipeSpeed = swipeDistance / swipeTime;
    
    // 速度を適切な範囲に調整（2-8の範囲）
    let speed = map(swipeSpeed, 100, 1000, 2, 8, true);
    
    // 方向ベクトルを正規化
    let dirMag = sqrt(dirX * dirX + dirY * dirY);
    let normalizedVx = dirX / dirMag;
    let normalizedVy = dirY / dirMag;
    
    // 宇宙船を作成
    let customColor = null;
    // Shiftキーが押されている場合、ランダムな色を設定
    if (keyIsPressed && keyCode === SHIFT) {
      customColor = getRandomColor();
    }
    
    createSpacecraft(touchStartX, touchStartY, normalizedVx * speed, normalizedVy * speed, customColor);
  }

  // タッチ情報をリセット
  resetTouchInfo();
  return false;
}

// タッチ情報をリセットする関数
function resetTouchInfo() {
  touchStartX = null;
  touchStartY = null;
  touchStartTime = null;
  lastTouchX = null;
  lastTouchY = null;
}

// マウスダウンイベント
function mousePressed() {
  if (!touches.length) { // タッチデバイスでない場合のみ実行
    touchStartX = mouseX;
    touchStartY = mouseY;
    touchStartTime = millis();
  }
  return false;
}

// マウス移動イベント
function mouseDragged() {
  if (!touches.length) { // タッチデバイスでない場合のみ実行
    lastTouchX = mouseX;
    lastTouchY = mouseY;
  }
  return false;
}

// マウスアップイベント
function mouseReleased() {
  if (!touches.length) { // タッチデバイスでない場合のみ実行
    handleTouchEnd();
  }
  return false;
}

// ウィンドウリサイズイベント
function windowResized() {
  isResizing = true;
  // リサイズ前のキャンバス中心（地球の位置）
  let oldCenter = createVector(width / 2, height / 2);
  
  // キャンバスサイズの更新
  resizeCanvas(windowWidth, windowHeight);
  
  // リサイズ後のキャンバス中心
  let newCenter = createVector(width / 2, height / 2);
  
  // 中心のずれを算出
  let offset = p5.Vector.sub(newCenter, oldCenter);
  
  // 宇宙船の位置と軌道を更新
  updateSpacecraftsOnResize(offset);
  
  // リサイズ時は月の軌道をクリア
  resetMoonTrail();
  
  // リサイズ完了後、フラグをリセット
  setTimeout(() => {
    isResizing = false;
  }, 100);
}

let emotions = [
  {en: "Relaxed", ja: "リラックス", P: 0.7, A: -0.6, D: 0.2},
  {en: "Contented", ja: "満足", P: 0.6, A: -0.3, D: 0.1},
  {en: "Calm", ja: "落ち着いた", P: 0.65, A: -0.5, D: 0.0},
  {en: "Sleepy", ja: "眠い", P: 0.0, A: -0.9, D: -0.3},
  {en: "Bored", ja: "退屈", P: -0.5, A: -0.6, D: -0.4},
  {en: "Miserable", ja: "惨め", P: -0.85, A: -0.4, D: -0.6},
  {en: "Unhappy", ja: "不幸", P: -0.7, A: -0.5, D:-0.4},
  {en: "Annoyed", ja: "いらいら", P: 0.4, A: 0.2, D: -0.1},
  {en: "Angry", ja: "怒り", P: -0.8, A: 0.6, D: 0.6},
  {en: "Excited", ja: "興奮", P: 0.8, A: 0.9, D: 0.4},
  {en: "Aroused", ja: "覚醒", P: 0.5, A: 0.8, D: 0.3},
  {en: "Wide-awake", ja: "目が覚める", P: 0.1, A: 0.9, D: 0.0},
  {en: "Frenzied", ja: "狂乱", P: -0.2, A: 0.95, D: -0.1},
  {en: "Jittery", ja: "神経質", P: -0.5, A: 0.8, D: -0.2},
  {en: "Fearful", ja: "恐れ", P: -0.9, A: 0.8, D: -0.6},
  {en: "Anxious", ja: "不安", P: -0.7, A: 0.65, D: -0.5},
  {en: "Dependent", ja: "依存", P: 0.2, A: -0.1, D: -0.6},
  {en: "Controlled", ja: "支配されている", P: -0.3, A: -0.1, D: -0.8},
  {en: "Influenced", ja: "影響される", P: -0.1, A: 0.0, D: -0.5},
  {en: "Dominant", ja: "支配的", P: 0.1, A: 0.2, D: 0.8}
];

// PADボタンの色
const colorPatterns = [
  // パターン1: 暖色系
  {
    P: {start: [255, 229, 0], end: [150, 100, 0]}, //黄色
    A: {start: [0, 150, 255], end: [0, 30, 100]}, //青
    D: [180, 180, 180]  // グレー
  },
  // パターン2: パステル調
  {
    P: {start: [255, 180, 180], end: [150, 80, 80]}, //ピンク
    A: {start: [180, 220, 255], end: [60, 90, 120]}, //水色
    D: [200, 200, 200]  // ライトグレー
  },
  // パターン3: ビビッド
  {
    P: {start: [255, 100, 100], end: [120, 20, 20]}, //赤
    A: {start: [100, 255, 100], end: [20, 100, 20]}, //緑
    D: [150, 150, 150]  // ダークグレー
  },
  // パターン4: パープル系
  {P: {start: [255, 150, 200], end: [120, 50, 90]}, //ピンクパープル
    A: {start: [200, 150, 255], end: [90, 50, 120]}, //パープルブルー
    D: [170, 170, 170]  // ミディアムグレー
  },
  // パターン5: ゴールド系
  {
    P: {start: [255, 220, 100], end: [150, 100, 30]}, //ゴールド
    A: {start: [100, 200, 255], end: [20, 70, 110]}, //スカイブルー
    D: [192, 192, 192]  // シルバーグレー
  }
];
let currentColorPattern = 0;

let myFont;

let centerX, centerY;

let canvas;

let padValues = [];
let points = [];
let stars = [];
let selectedLabel = null;

let state = "select"; 
let addButton, okButton;
let backButton;

let selectedP = null, selectedA = null, selectedD = null; 
let btnSize = 50;

let visualStartTime = 0; 
let allConstellations = [];

let padLayout = {
  cx: 0,
  cy: 0,
  btnSize: 50,
  spacing: 10,
  scl: 1
};

// visual
let bgStarsFar = [];
let bgStarsMid = [];
let bgStarsNear = [];
let starDrift = 0;
let shootingStarTimer = 0;
let shootingStarInterval = 240;

// タッチイベント
// 3D操作
let touchMode = null; 
let touchStartX, touchStartY;
let pinchStartDist = 0;
let pinchStartZoom = 1;
const TAP_DIST = 20;
const TAP_TIME = 250;

let rotationX = 0, rotationY = 0;
let targetRotationX = 0, targetRotationY = 0;
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };

const ZOOM_ANIMATION_THRESHOLD = 0.5;
const TAP_THRESHOLD = 5;
const TAP_MAX_DURATION = 200;
// ズーム
let zoomLevel = 1;
let targetZoomLevel = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
let initialpinchDistance = 0;
let initialZoom = 1;
// リセット
let lastTap = 0;
let resetViewButton;

let velocityX = 0;
let velocityY = 0;
let lastTouchX = 0;
let lastTouchY = 0;
let lastTouchTime = 0;

let touchFeedback = { x: 0, y: 0, alpha: 0 };

let showGrid = true;

// gallery
let galleryLayout = {
  colCount: 1,
  thumbSize: 150,
  gutter: 20,
  rowStartX: 0,
  topOffset: 0
};
let galleryButton;
let scrollY = 0;
let targetScrollY = 0;
let galleryStars = [];

let upButton, downButton;
const SCROLL_AMOUNT = 150;

let outerPad = 20;
let gutter = 12;
let topOffset = 40;
const designWidth = 430;
let galleryScale = 1;

let activeConstellation = null;

/* =========================================================
   preload
   ========================================================= */
function preload() {
  myFont = loadFont("nicomoji-plus_v2-5.ttf");
}

/* =========================================================
   handleButtonTouchEnd
   ========================================================= */
function handleButtonTouchEnd(e) {
  e.preventDefault();
  this.click();
}


/* =========================================================
   setupStars
   ========================================================= */
function setupStars() {
  // 遠景
  for (let i = 0; i < 800; i++) {
    bgStarsFar.push({
      x: random(-3000, 3000),
      y: random(-3000, 3000),
      z: random(-3000, -1000)
    });
  }

  // 中景
  for (let i = 0; i < 300; i++) {
    bgStarsMid.push({
      x: random(-2000, 2000),
      y: random(-2000, 2000),
      z: random(-1500, -400),
      phase: random(TWO_PI),
      size: random(1.5, 3)
    });
  }

  // 近景（ごく少数）
  for (let i = 0; i < 40; i++) {
    bgStarsNear.push({
      x: random(-1200, 1200),
      y: random(-1200, 1200),
      z: random(-800, -200),
      phase: random(TWO_PI),
      size: random(4, 7)
    });
  }
}

/* =========================================================
   setup
   ========================================================= */
console.log("prepareVisual関数が定義されていますか？", typeof prepareVisual);
function setup() {
  console.log("setup() が呼ばれました");
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  textSize(16);

  lastTouchTime = millis();

  setupStars();

　let touches = [];

  let saved = localStorage.getItem("myConstellations");
  if (saved) {
    try {
      allConstellations = JSON.parse(saved);
    } catch (e) {
      console.warn("localStorage JSON parse error, resetting storage.", e);
      allConstellations = [];
      localStorage.removeItem("myConstellations");
    }
  }
 
  // ボタン作成
  addButton = createButton("追加");
  okButton = createButton("OK");
  backButton = createButton("← 記録ページ");
  galleryButton = createButton("日記一覧");

  // ボタンスタイルの設定
  [addButton, okButton, backButton, galleryButton].forEach(btn => {
	  btn.style('position', 'absolute');
	  btn.style('z-index', '10');
	  btn.style('padding', '8px 16px');
	  btn.style('border-radius', '4px');
	  btn.style('border', '1px solid #666');
	  btn.style('background', 'rgba(50, 60, 90, 0.8)');
	  btn.style('color', '#fff');
	  btn.style('cursor', 'pointer');
	  btn.style('font-family', 'sans-serif');
	  btn.style('font-size', '14px');
	  btn.style('transition', 'all 0.2s');

	  btn.elt.style.touchAction = 'manipulation';
      btn.elt.style.webkitTapHighlightColor = 'transparent';
	});

	console.log("okButtonが作成されました。要素:", okButton.elt);
	  
	// リセットボタン
	resetViewButton = createButton('↻ リセット');
	resetViewButton.position(20, 20);
	resetViewButton.hide();
	  
	resetViewButton.style('position', 'absolute');
	resetViewButton.style('z-index', '10');
	resetViewButton.style('padding', '8px 16px');
	resetViewButton.style('border-radius', '4px');
	resetViewButton.style('border', '1px solid #666');
	resetViewButton.style('background', 'rgba(50, 60, 90, 0.8)');
	resetViewButton.style('color', '#fff');
	resetViewButton.style('cursor', 'pointer');
	resetViewButton.style('font-family', 'sans-serif');
	resetViewButton.style('font-size', '14px');
	resetViewButton.style('transition', 'all 0.2s');

　addButton.mousePressed(addPAD);
  
  backButton.mousePressed(() => {
	  activeConstellation = null;
	  state = "select";
	  updateButtonVisibility();
	  layoutDOMButtons();
	  selectedLabel = null;
	  redraw();
	  galleryStars = [];
	  targetScrollY = 0;
	  scrollY = 0;
	  resetView();
  });

　okButton.mousePressed(() => {
	  console.log("OKボタンが押されました!");
	  
	  // デバッグ用: padValuesの状態を確認
	  console.log("padValuesの状態:", {
	    isArray: Array.isArray(padValues),
	    length: padValues?.length,
	    values: JSON.stringify(padValues)
	  });
	
	  if (!padValues || padValues.length === 0) {
	    console.log("PAD値がありません");
	    return;
	  }

	  state = "visual";
	  updateButtonVisibility();
	  resetVisualView();
	  console.log("状態をvisualに設定しました。現在のstate:", state);
	  
	  // ビジュアルを準備
	  if (prepareVisual(false)) {
	    console.log("prepareVisualが正常に完了しました。state:", state);
	    
	    // 日付と星データの処理
	    let now = new Date();
	    let timestamp = now.toLocaleString();
	    let serialStars = points.map(s => {
	      if (!s || !s.pos) return null;
	      return { 
	        pos: { 
	          x: s.pos.x || 0, 
	          y: s.pos.y || 0, 
	          z: s.pos.z || 0 
	        }, 
	        emo: s.emo 
	      };
	    }).filter(Boolean);
	
	    if (serialStars.length > 0) {
	      let newConstellation = {
	        stars: serialStars, 
	        created: timestamp
	      };

		　activeConstellation = newConstellation;
	      
	      // データを保存
	      if (!Array.isArray(allConstellations)) {
	        allConstellations = [];
	      }
	      allConstellations.push(newConstellation);
	      
	      try {
	        localStorage.setItem("myConstellations", JSON.stringify(allConstellations));
	        console.log("データを保存しました");
	      } catch (e) {
	        console.error("データの保存に失敗しました:", e);
	      }
	    }
	
	    // 状態をリセット
	    padValues = [];
	    selectedP = selectedA = selectedD = null;
	    
	    // 強制的に再描画
	    redraw();
	    console.log("再描画を要求しました。現在のstate:", state);
	  } else {
	    state = "select";
	    updateButtonVisibility();
	    redraw();
	  }
	});

  galleryButton.mousePressed(() => {
	  activeConstellation = null;
	  if (state === "gallery") {
	    state = "select";
	    galleryStars = [];
	    targetScrollY = 0;
	    scrollY = 0;
	    selectedLabel = null;
	  } else {
	    state = "gallery";
	    galleryStars = [];
		targetScrollY = 0;
    	scrollY = 0;
	    // ギャラリー用の星を生成
	    for (let i = 0; i < 400; i++) {
	      galleryStars.push({
	        x: random(-2000, 2000),
	        y: random(-2000, 2000),
	        z: random(-2000, 2000),
	        twinkle: random(1000),
	        baseSize: random(1, 4)
	      });
	    }
	    // サムネイルの再生成
	    allConstellations.forEach(c => {
	      if (c.thumbnail) {
	        c.thumbnail.remove();
	        c.thumbnail = null;
	      }
	    });
	  }
	  updateButtonVisibility();
	  layoutDOMButtons();
	  redraw();
  });

  resetViewButton.mousePressed(function() {
      resetView();
  });

  setupButtonInteractions();

  // 初期状態のボタン表示を更新
  updateButtonVisibility();
  layoutDOMButtons();
  computeBtnSize();

  // タッチデバイス用の設定
  if ('ontouchstart' in window) {
    let style = document.createElement('style');
    style.textContent = `
      button {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      button:active {
        transform: scale(0.98);
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);

	if (canvas && canvas.elt) {
	    canvas.elt.addEventListener('touchstart', touchStarted, { passive: false });
	    canvas.elt.addEventListener('touchmove', touchMoved, { passive: false });
	    canvas.elt.addEventListener('touchend', touchEnded, { passive: false });
	    canvas.elt.addEventListener('touchcancel', touchEnded, { passive: false });
	} else {
	    console.warn('Canvas not ready for touch events');
	}

    // タッチイベントの伝搬を防ぐ
    document.querySelectorAll('button').forEach(btn => {
	    btn.addEventListener('touchend', handleButtonTouchEnd, { passive: false });
	});
  }
}

/* =========================================================
   ボタンの表示/非表示を更新
   ========================================================= */
function updateButtonVisibility() {
  console.log("updateButtonVisibility: state =", state);
  console.trace("updateButtonVisibilityの呼び出し元");  
	
  // すべてのボタンを非表示に
  addButton.hide();
  okButton.hide();
  backButton.hide();
  galleryButton.hide();
  resetViewButton.hide();

  if (state === "select") {
    console.log("selectモードのボタンを表示");
    addButton.show();
    galleryButton.show();
    okButton.show();
    addButton.html("追加");
    galleryButton.html("日記一覧");
    okButton.html("OK");
  } 
  else if (state === "gallery") {
    console.log("galleryモードのボタンを表示");
    backButton.show();
    backButton.html("← 戻る");
  }
  else if (state === "visual") {
    console.log("visualモードのボタンを表示します");
    resetViewButton.show();
    galleryButton.show();
    resetViewButton.position(20, 20);
    galleryButton.position(20, 100);
    resetViewButton.html("↻ リセット");
    backButton.html("← 戻る");
    galleryButton.html("日記一覧");
  } 
}

/* =========================================================
   ボタンレイアウト
   ========================================================= */
function layoutDOMButtons() {
  if (state === "select") {
    // PAD選択画面のレイアウト
    let sidePad = max(8, floor(width * 0.03));
    let bottomPad = max(10, floor(height * 0.04));
    addButton.position(sidePad, height - 80 - bottomPad);
    okButton.position(width/2 - 30, height - 80 - bottomPad);
    galleryButton.position(width - 130, 20);
  } 
  else if (state === "gallery") {
    // 日記一覧画面のレイアウト
    backButton.position(20, 20);
    galleryButton.position(width - 130, 20);
  }
  else if (state === "visual") {
    // 日記表示画面のレイアウト
    backButton.position(20, 20);
    galleryButton.position(width - 130, 20);
  }
}

/* =========================================================
   windowResized
   ========================================================= */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  computeBtnSize();
  layoutDOMButtons();

  if (upButton && downButton) {
    upButton.position(width - 50, height - 100);
    downButton.position(width - 50, height - 50);
  }

  if (state === "gallery") {
    const maxScroll = -calculateMaxScroll();
    targetScrollY = constrain(targetScrollY, maxScroll, 0);
    scrollY = targetScrollY;
  }
}
/* =========================================================
   computeBtnSize
   ========================================================= */
function computeBtnSize(){
  let base = min(width, height);
  btnSize = constrain(floor(base * 0.09), 40, 78); 
  padLayout.btnSize = btnSize;
  padLayout.spacing = floor(btnSize * 0.22);
}

/* =========================================================
   addPAD
   ========================================================= */
function addPAD() {
  if (selectedP !== null && selectedA !== null && selectedD !== null) {
    let p = selectedP / 6;
    let a = selectedA / 6;
    let d = selectedD / 6;
    
    padValues.push({P: p, A: a, D: d});
    console.log("Added PAD values:", p, a, d);
    currentColorPattern = (currentColorPattern + 1) % colorPatterns.length;
    
    selectedP = null;
    selectedA = null;
    selectedD = null;
    
    redraw();
  }
}
/* =========================================================
   prepareVisual
   ========================================================= */
function prepareVisual(changeState = true) {
  console.log("prepareVisualが呼ばれました。changeState =", changeState);
  console.trace("prepareVisualの呼び出し元をトレース");
  console.log("prepareVisualの型:", typeof prepareVisual);
  console.log("prepareVisualの内容:", prepareVisual.toString().substring(0, 100) + "...");
  
  try {
    // 星の位置を計算
    points = [];
    if (!Array.isArray(padValues)) {
      console.error("padValues is not an array");
      return false;
    }

    for (let v of padValues) {
      if (!v || typeof v !== 'object') {
        console.warn("Invalid PAD value:", v);
        continue;
      }
      
      let emo = findClosestEmotion(v.P, v.A, v.D);
      if (!emo) {
        console.warn("No emotion found for PAD values:", v);
        continue;
      }

      let x = map(v.P, 0, 1, -100, 100);
      let y = map(v.A, 0, 1, -100, 100);
      let z = map(v.D, 0, 1, -100, 100);

      // 感情データを追加
      emo.intensity = (v.P + v.A + v.D) / 3;
      
      points.push({
        pos: createVector(x, y, z),
        emo: emo
      });
    }

    if (points.length === 0) {
      console.warn("No valid points to display");
      return false;
    }
    
    // 背景の星を生成
    stars = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: random(-2000, 2000),
        y: random(-2000, 2000),
        z: random(-2000, 2000),
        twinkle: random(1000)
      });
    }

    // 状態をvisualに設定
    if (changeState) {
      state = "visual";
      updateButtonVisibility();
      visualStartTime = millis();
      
      // 3Dビューのリセット
      rotationX = 0;
      rotationY = 0;
      targetRotationX = 0;
      targetRotationY = 0;
      zoomLevel = 1;
      targetZoomLevel = 1;
    }
    
    console.log("prepareVisual completed successfully");
    return true;
  } catch (error) {
    console.error("Error in prepareVisual:", error);
    return false;
  }
}

/* =========================================================
   drawBeautifulStars
   ========================================================= */
function drawBeautifulStars() {
  push();
  noStroke();

  // ===== 遠景 =====
  fill(180, 200, 255, 80);
  for (let s of bgStarsFar) {
    push();
    translate(s.x, s.y, s.z);
    sphere(1.2);
    pop();
  }

  // ===== 中景 =====
  for (let s of bgStarsMid) {
    let tw = 0.5 + 0.5 * sin(frameCount * 0.02 + s.phase);
    let alpha = map(tw, 0, 1, 60, 180);
    fill(200, 220, 255, alpha);

    push();
    translate(s.x, s.y, s.z);
    sphere(s.size * tw);
    pop();
  }

  // ===== 近景 =====
  for (let s of bgStarsNear) {
    let tw = pow(0.5 + 0.5 * sin(frameCount * 0.015 + s.phase), 3);
    let alpha = map(tw, 0, 1, 120, 255);
    fill(255, 255, 220, alpha);

    push();
    translate(s.x, s.y, s.z);
    sphere(s.size * (1 + tw * 0.8));
    pop();
  }

  // ===== 流れ星（軽量）=====
  shootingStarTimer++;
  if (shootingStarTimer > shootingStarInterval) {
    shootingStarTimer = 0;

    push();
    stroke(255, 220, 180, 180);
    strokeWeight(2);
    line(
      random(-800, 800), random(-400, 400), -200,
      random(-1200, -800), random(-400, 400), -600
    );
    pop();
  }

  pop();
}

/* =========================================================
   draw
   ========================================================= */
function draw() {
	
  // フレームレートに基づいた処理
  if (frameCount % 60 === 0) { 
    cleanupThumbnails();
	console.log("drawが実行中です。現在のstate:", state);
  }

  // 状態に応じた描画
  if (state === "select") {
	background(5, 5, 20);
    camera();
    drawPADButtons();
    // タッチフィードバック
    if (touchFeedback && touchFeedback.alpha > 0) {
      push();
      noStroke();
      fill(255, 0, 0, touchFeedback.alpha);
      ellipse(touchFeedback.x, touchFeedback.y, 30, 30);
      touchFeedback.alpha -= 5;
      pop();
    }
  }
  else if (state === "gallery") {
    scrollY = lerp(scrollY, targetScrollY, 0.2);
    drawGallery2D();
  }
	　else if (state === "visual") {
	  resetMatrix();
	  background(5, 5, 20);
	  camera();
	　drawBeautifulStars();
	
	  // 回転・ズームの補間
	  rotationX = lerp(rotationX, targetRotationX, 0.18);
	  rotationY = lerp(rotationY, targetRotationY, 0.18);
	  zoomLevel  = lerp(zoomLevel, targetZoomLevel, 0.12);
	
	  rotateX(rotationX);
	  rotateY(rotationY);
	  scale(zoomLevel);
	
	  // 背景の星
	  push();
	  noStroke();
	  for (let s of stars) {
	    if (random() < 0.02) s.on = !s.on;
	    if (s.baseSize === undefined) s.baseSize = random(1.0, 4.0);
	
	    let blink = s.on ? 1 : 0;
	    let pulse = 0.5 + 0.5 * sin(frameCount * 0.02 + s.twinkle);
	    let intensity = blink * pulse;
	    let starSize = s.baseSize + intensity * random(0.5, 2.0);
	    let alpha = map(intensity, 0, 1, 10, 255);
	
	    fill(200 + random(-20,20), 200 + random(-20,20), 255, alpha);
	    push();
	    translate(s.x, s.y, s.z);
	    sphere(starSize);
	    pop();
	  }
	  pop();
	
	  // ===== メインの日記 =====
	  let main = activeConstellation;
	  if (!main) return;
	
	  push();
	  translate(0, 0, 200);
	  scale(1.5);
	
	  // 枠
	  stroke(150, 80);
	  noFill();
	  box(220);
	
	  // 星
	  for (let p of main.stars) {
	    let px = p.pos?.x ?? 0;
	    let py = p.pos?.y ?? 0;
	    let pz = p.pos?.z ?? 0;
	
	    push();
	    translate(px, py, pz);
	    fill(255, 255, 200);
	    noStroke();
	    sphere(8);
	    pop();
	  }
	
	  // 線（少し待ってから）
	  if (millis() - visualStartTime > 1200) {
	    push();
	    stroke(180, 200, 255, 90);
	    strokeWeight(2);
	    blendMode(ADD);
	
	    for (let a = 0; a < main.stars.length; a++) {
	      for (let b = a + 1; b < main.stars.length; b++) {
	        let aPos = main.stars[a].pos;
	        let bPos = main.stars[b].pos;
	        if (aPos && bPos) {
	          line(
	            aPos.x, aPos.y, aPos.z,
	            bPos.x, bPos.y, bPos.z
	          );
	        }
	      }
	    }
	    pop();
	  }
	
	  // 日付
	  push();
	  translate(0, 120, 0);
	  fill(255);
	  textAlign(CENTER, CENTER);
	  textSize(14);
	  text(main.created, 0, 0);
	  pop();
	
	  pop();
	
	  // 月タイトル（画面固定）
	  if (main.created) {
	    let m = main.created.match(/(\d+)\D+(\d+)\D+(\d+)/);
	    let monthIndex = m ? int(m[2]) - 1 : 0;
	    let monthNames = [
	      "January","February","March","April","May","June",
	      "July","August","September","October","November","December"
	    ];
	
	    push();
	    resetMatrix();
	    noLights();
	    textAlign(CENTER, TOP);
	    textSize(32);
	    fill(255);
	    text(monthNames[monthIndex], width / 2, 20);
	    pop();
	  }
	
	  // タッチフィードバック
	  if (touchFeedback && touchFeedback.alpha > 0) {
	    push();
	    noStroke();
	    fill(255, 255, 255, touchFeedback.alpha);
	    ellipse(touchFeedback.x, touchFeedback.y, 30, 30);
	    touchFeedback.alpha -= 5;
	    pop();
	  }
	}

}
/* =========================================================
   drawPADButtons
   ========================================================= */
function drawPADButtons() {
  let cx = 0;
  let cy = 0;

  let safeW = width * 0.9;
  let safeH = height * 0.75;
  let neededW = (padLayout.btnSize + padLayout.spacing) * 7;
  let scl = 1;
  if (neededW > safeW) {
    scl = safeW / neededW;
  }
  let neededH = padLayout.btnSize * 3 + padLayout.spacing * 2 + 120;
  if (neededH * scl > safeH) {
    scl *= safeH / (neededH * scl);
  }

  padLayout.cx = cx;
  padLayout.cy = cy;
  padLayout.scl = scl; 

  push();
  scale(padLayout.scl); 

  // 案内文を追加
  textSize(25 * padLayout.scl); 
  textAlign(CENTER, CENTER);
  fill(255);
  let guideText = "今の気分に合う色や形をP,A,D１つずつ選んでください";
  let guideY = cy - 250;
  text("今の気分に合う色や形を", 0, guideY);
  text("P,A,D１つずつ選んでください", 0, guideY + 30);

  const colors = colorPatterns[currentColorPattern];

  // P 行
  for(let i = 0; i < 7; i++) {
    let amount = i / 6;
    let r = lerp(colors.P.start[0], colors.P.end[0], amount);
    let g = lerp(colors.P.start[1], colors.P.end[1], amount);
    let b = lerp(colors.P.start[2], colors.P.end[2], amount);
    let col = color(r, g, b);
    
    drawButton(cx + (i-3) * (padLayout.btnSize + padLayout.spacing), 
               cy - 120, 
               padLayout.btnSize, 
               col, 
               i, 
               selectedP === i,
               "rect");
  }
	
  // A 行
  for(let i = 0; i < 7; i++) {
    let amount = i / 6;
    let r = lerp(colors.A.start[0], colors.A.end[0], amount);
    let g = lerp(colors.A.start[1], colors.A.end[1], amount);
    let b = lerp(colors.A.start[2], colors.A.end[2], amount);
    let col = color(r, g, b);
    
    let sides = i + 3;
    drawButton(cx + (i-3) * (padLayout.btnSize + padLayout.spacing), 
               cy, 
               padLayout.btnSize, 
               col, 
               i, 
               selectedA === i,
               "polygon", 
               sides);
  }
  
  // D 行
  for(let i = 0; i < 7; i++) {
    let col = color(colors.D[0], colors.D[1], colors.D[2]);
    let sides = i + 3;
    drawButton(cx + (i-3) * (padLayout.btnSize + padLayout.spacing), 
               cy + 120, 
               padLayout.btnSize, 
               col, 
               i, 
               selectedD === i,
               "polygon", 
               sides);
  }

  drawPADLabels();
  pop();
}

function drawPADLabels() {
  push();
　scale(padLayout.scl);
  textAlign(CENTER, CENTER);
  textSize(btnSize * 0.4);
  fill(255);
  
  const cx = padLayout.cx;
  const cy = padLayout.cy;
  const buttonInterval = padLayout.btnSize + padLayout.spacing;

　const centerBtnX = cx + (3 - 3) * buttonInterval;
  
  // P
  const pY = cy - 120;
  text("P", centerBtnX, pY);

  // A
  const aY = cy;
  text("A", centerBtnX, aY);

  // D
  const dY = cy + 120;
  text("D", centerBtnX, dY);

  pop();
}

/* =========================================================
   drawButton
   ========================================================= */
function drawButton(x,y,btnSize_,col,index,isSelected,shapeType,sides=4){
  push();
  translate(x, y, 0);

  // 選択中のボタンに光るエフェクト
  if (isSelected) {
    push();
    blendMode(ADD);
    noStroke();
    let glowSize = btnSize_ * 2.0;
    let glowColor = color(255, 255, 255, 80);
    fill(glowColor);
    ellipse(0, 0, glowSize, glowSize);
    pop();
  }
	
  push();
  blendMode(ADD);
  noStroke();
  let auraAlpha = isSelected ? 100 : 40;  
  let aura = color(red(col), green(col), blue(col), auraAlpha);
  fill(aura);
  ellipse(0, 0, btnSize_ * 2.2, btnSize_ * 2.2);
  pop();

  let body;
  if (isSelected) {
	// 選択時
    body = color(
      constrain(red(col) + 40, 0, 255),
      constrain(green(col) + 40, 0, 255),
      constrain(blue(col) + 40, 0, 255)
    );
  } else {
	// 非選択時
    body = color(
      constrain(red(col) - 20, 0, 255),
      constrain(green(col) - 20, 0, 255),
      constrain(blue(col) - 20, 0, 255)
    );
  }

  noStroke();
  fill(body);

  let displaySize = isSelected ? btnSize_ * 1.1 : btnSize_;

  if (shapeType === "rect") {
    rectMode(CENTER);
    rect(0, 0, displaySize, displaySize, 8);
  } else if (shapeType === "polygon") {
    polygon(0, 0, displaySize/2, sides);
  }

  pop();
}

/* =========================================================
   タッチイベント
   ========================================================= */
function touchStarted() {
  // ---------- pinch ----------
  if (touches.length === 2 && state === "visual") {
    touchMode = "pinch";
    pinchStartDist = dist(
      touches[0].x, touches[0].y,
      touches[1].x, touches[1].y
    );
    pinchStartZoom = targetZoomLevel;
    return;
  }

  // ---------- single touch ----------
  if (touches.length === 1) {
    touchStartX = touches[0].x;
    touchStartY = touches[0].y;
    lastTouchX = touchStartX;
    lastTouchY = touchStartY;
    touchStartTime = millis();
    touchMode = "tap";
  }

  return;
}

function touchMoved() {
  if (!touchMode) return false;

  // ---------- pinch ----------
  if (touchMode === "pinch" && touches.length === 2) {
    const d = dist(
      touches[0].x, touches[0].y,
      touches[1].x, touches[1].y
    );
    const scale = d / pinchStartDist;
    targetZoomLevel = constrain(
      pinchStartZoom * scale,
      MIN_ZOOM,
      MAX_ZOOM
    );
    return false;
  }

  if (touches.length !== 1) return false;

  const x = touches[0].x;
  const y = touches[0].y;

  const dx = x - lastTouchX;
  const dy = y - lastTouchY;
  const totalDx = x - touchStartX;
  const totalDy = y - touchStartY;

  // tap → mode確定
  if (touchMode === "tap" && dist(0, 0, totalDx, totalDy) > TAP_DIST) {
    if (state === "gallery") {
      touchMode = "scroll";
    } else if (state === "visual") {
      touchMode = "rotate";
    } else {
      touchMode = null;
    }
  }

  // ---------- scroll ----------
  if (touchMode === "scroll" && state === "gallery") {
    targetScrollY += dy;
  }

  // ---------- rotate ----------
  if (touchMode === "rotate" && state === "visual") {
    targetRotationY += dx * 0.004;
    targetRotationX -= dy * 0.004;
  }

  lastTouchX = x;
  lastTouchY = y;

  return false;
}

function touchEnded() {
  if (!touchMode) return false;

  const elapsed = millis() - touchStartTime;
  const moved = dist(
    lastTouchX, lastTouchY,
    touchStartX, touchStartY
  );

  // ---------- tap ----------
  if (touchMode === "tap" && elapsed < TAP_TIME && moved < TAP_DIST) {
    handleTap(touchStartX, touchStartY);
  }

  touchMode = null;
  return;
}

function touchCanceled() {
  touchMode = null;
  return false;
}

// 月ごとにグループ化
function groupByMonth(constellations) {
  const grouped = {};
  for (let i = 0; i < 12; i++) {
    grouped[i] = [];
  }

  if (!Array.isArray(constellations)) {
    console.warn("Invalid constellations data in groupByMonth:", constellations);
    return grouped;
  }
  
  for (let c of constellations) {
    if (!c || !c.created) continue;
    
    try {
      const date = parseDate(c.created);
      if (isNaN(date.getTime())) continue;
      
      const month = date.getMonth();
      if (month >= 0 && month < 12) {
        grouped[month].push(c);
      }
    } catch (e) {
      console.warn("Error processing date:", c.created, e);
      continue;
    }
  }
  
  return grouped;
}

// リセット
function resetView() {
  // 回転とズームをリセット
  rotationX = 0;
  rotationY = 0;
  targetRotationX = 0;
  targetRotationY = 0;
  zoomLevel = 1;
  targetZoomLevel = 1;
  
  // カメラをリセット
  camera();
}

function handleTap(x, y) {
  if (state === "gallery") {
    if (!allConstellations || allConstellations.length === 0) return;

    const {
	    thumbSize,
	    colCount,
	    rowStartX,
	    topOffset,
	    scale
　　 } = galleryLayout;
	  
    x = (x - width / 2) / scale;
  y = (y - height / 2 - scrollY) / scale;

  let currentY = topOffset;

    // 月ごとに分類
    let grouped = {};
	  for (let m = 0; m < 12; m++) grouped[m] = [];
	
	  for (let c of allConstellations) {
	    if (!c.created) continue;
	    let m = c.created.match(/(\d+)\D+(\d+)\D+(\d+)/);
	    if (!m) continue;
	    grouped[int(m[2]) - 1].push(c);
	  }
	
	  for (let month = 0; month < 12; month++) {
	    let list = grouped[month];
	    if (!list.length) continue;
		  
	      currentY += 35;
	
	      for (let i = 0; i < list.length; i++) {
		      let col = i % colCount;
		      let row = floor(i / colCount);
		
		      let tx = rowStartX + col * (thumbSize + gutter);
		      let ty = currentY + row * (thumbSize + gutter + 25);
		
		      if (
		        x >= tx && x <= tx + thumbSize &&
		        y >= ty && y <= ty + thumbSize
		      ) {
		        activeConstellation = list[i];
		        state = "visual";
		        visualStartTime = millis();
		        resetView();
		        return;
		      }
		    }
		
		    currentY += ceil(list.length / colCount) * (thumbSize + gutter + 25) + 20;
	  }
    }

  if (state === "select") {
  const btnSize = padLayout.btnSize * padLayout.scl;
  const spacing = padLayout.spacing * padLayout.scl;
  const centerX = width / 2;
  const centerY = height / 2;
  const hitMargin = 10;

  // P行のボタン
  for (let i = 0; i < 7; i++) {
    const btnX = centerX + (i - 3) * (btnSize + spacing);
    const btnY = centerY - 120 * padLayout.scl;
    
    if (dist(x, y, btnX, btnY) < (btnSize/2 + hitMargin)) {
      selectedP = i;
      touchFeedback = { x: btnX, y: btnY, alpha: 150 };
      console.log(`P${i} tapped at ${x}, ${y} (button at ${btnX}, ${btnY})`);
      redraw();
      return true;
    }
  }
  
  // A行のボタン
  for (let i = 0; i < 7; i++) {
    const btnX = centerX + (i - 3) * (btnSize + spacing);
    const btnY = centerY;
    
    if (dist(x, y, btnX, btnY) < (btnSize/2 + hitMargin)) {
      selectedA = i;
      touchFeedback = { x: btnX, y: btnY, alpha: 150 };
      console.log(`A${i} tapped at ${x}, ${y} (button at ${btnX}, ${btnY})`);
      redraw();
      return true;
    }
  }
  
  // D行のボタン
  for (let i = 0; i < 7; i++) {
    const btnX = centerX + (i - 3) * (btnSize + spacing);
    const btnY = centerY + 120 * padLayout.scl;
    
    if (dist(x, y, btnX, btnY) < (btnSize/2 + hitMargin)) {
      selectedD = i;
      touchFeedback = { x: btnX, y: btnY, alpha: 150 };
      console.log(`D${i} tapped at ${x}, ${y} (button at ${btnX}, ${btnY})`);
      redraw();
      return true;
    }
  }
  
  return false;
  }
}

// 状態変更
function changeState(newState) {
  state = newState;
  updateButtonVisibility();
  layoutDOMButtons();
  
  if (state === "visual") {
    resetView();
    visualStartTime = millis();
  } else if (state === "select") {
    resetView();
    selectedLabel = null;
  } else if (state === "gallery" && galleryStars.length === 0) {
    resetView();
    // ギャラリー用の星を生成
    for (let i = 0; i < 400; i++) {
      galleryStars.push({
        x: random(-2000, 2000),
        y: random(-2000, 2000),
        z: random(-2000, 2000),
        twinkle: random(1000),
        baseSize: random(1, 4)
      });
    }
  }
}

function setupButtonInteractions() {
  function addButtonInteraction(btn, callback) {
    if (!btn) return;
    
    // マウスクリックイベント
    btn.mousePressed(callback);
    
    // タッチイベント
    btn.elt.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      callback();
    }, { passive: false });
  }

  // 追加ボタン
  addButtonInteraction(addButton, function() {
    console.log("追加ボタンが押されました");
    addPAD();
  });

  // OKボタン
  addButtonInteraction(okButton, function() {
    console.log("OKボタンが押されました");
    if (padValues.length > 0) {
      prepareVisual();
      let now = new Date();
      let timestamp = now.toLocaleString();
      let serialStars = points.map(s => ({
        pos: { 
          x: (s.pos && s.pos.x) || 0, 
          y: (s.pos && s.pos.y) || 0, 
          z: (s.pos && s.pos.z) || 0 
        }, 
        emo: s.emo 
      }));

      let newConstellation = {
        stars: serialStars, 
        created: timestamp
      };
      allConstellations.push(newConstellation);
      localStorage.setItem("myConstellations", JSON.stringify(allConstellations));

      state = "visual";
      updateButtonVisibility();
      visualStartTime = millis();
    }
  });

  // 戻るボタン
  addButtonInteraction(backButton, function() {
    console.log("戻るボタンが押されました");
    state = "select";
    updateButtonVisibility();
    layoutDOMButtons();
    selectedLabel = null;
    redraw();
    galleryStars = [];
    targetScrollY = 0;
    scrollY = 0;
    resetView();
  });

  // ギャラリーボタン
  addButtonInteraction(galleryButton, function() {
    console.log("ギャラリーボタンが押されました");
    if (state === "gallery") {
      state = "select";
      galleryStars = [];
      targetScrollY = 0;
      scrollY = 0;
      selectedLabel = null;
    } else {
      state = "gallery";
      galleryStars = [];
      for (let i = 0; i < 400; i++) {
        galleryStars.push({
          x: random(-2000, 2000),
          y: random(-2000, 2000),
          z: random(-2000, 2000),
          twinkle: random(1000),
          baseSize: random(1, 4)
        });
      }
    }
    updateButtonVisibility();
    layoutDOMButtons();
    redraw();
  });

  // リセットビューボタン
  addButtonInteraction(resetViewButton, function() {
    console.log("リセットボタンが押されました");
    resetView();
  });
}

/* =========================================================
   mouseWheel
   ========================================================= */
function mouseWheel(event) {
	  if (state === "visual") {
	    targetZoomLevel -= event.delta * 0.001;
	    targetZoomLevel = constrain(targetZoomLevel, MIN_ZOOM, MAX_ZOOM);
	    return false;
	  }
	  return false;
}

/* =========================================================
   polygon
   ========================================================= */
function polygon(x,y,r,n){
  beginShape();
  for(let i=0;i<n;i++){
    let angle = TWO_PI*i/n;
    vertex(x+cos(angle)*r,y+sin(angle)*r);
  }
  endShape(CLOSE);
}

/* =========================================================
   findClosestEmotion
   ========================================================= */
function findClosestEmotion(p,a,d){
  let best=null, minDist=Infinity;
  for(let e of emotions){
    let dx = p - e.P;
    let dy = a - e.A;
    let dz = d - e.D;
    let dist2 = sqrt(dx*dx + dy*dy + dz*dz);
    if(dist2 < minDist){ minDist = dist2; best = e; }
  }
  return best;
}

/* =========================================================
   screenPos
   ========================================================= */
function screenPos(x, y, z) {
  const mv = this._renderer.uMVMatrix.mat4;
  const p = this._renderer.uPMatrix.mat4;

  let v = [x, y, z, 1];

  let mv_v = [
    mv[0]*v[0] + mv[4]*v[1] + mv[8]*v[2] + mv[12]*v[3],
    mv[1]*v[0] + mv[5]*v[1] + mv[9]*v[2] + mv[13]*v[3],
    mv[2]*v[0] + mv[6]*v[1] + mv[10]*v[2] + mv[14]*v[3],
    mv[3]*v[0] + mv[7]*v[1] + mv[11]*v[2] + mv[15]*v[3]
  ];

  let clip = [
    p[0]*mv_v[0] + p[4]*mv_v[1] + p[8]*mv_v[2] + p[12]*mv_v[3],
    p[1]*mv_v[0] + p[5]*mv_v[1] + p[9]*mv_v[2] + p[13]*mv_v[3],
    p[2]*mv_v[0] + p[6]*mv_v[1] + p[10]*mv_v[2] + p[14]*mv_v[3],
    p[3]*mv_v[0] + p[7]*mv_v[1] + p[11]*mv_v[2] + p[15]*mv_v[3]
  ];

  let ndcX = clip[0] / clip[3];
  let ndcY = clip[1] / clip[3];

  let sx = map(ndcX, -1, 1, 0, width);
  let sy = map(-ndcY, -1, 1, 0, height);

  return createVector(sx, sy);
}

/* =========================================================
   drawGallery
   ========================================================= */
function drawGallery2D() {
　if (frameCount % 120 === 0) {
	  cleanupThumbnails();
  }
  resetMatrix();
  camera();
  background(5, 5, 20); 
  
  // 背景の星を描画
  push();
  noStroke();
  for (let s of galleryStars) {
    if (s.on === undefined) s.on = true;
    if (random() < 0.02) s.on = !s.on;
    let pulse = 0.5 + 0.5 * sin(frameCount * 0.02 + s.twinkle);
    let starSize = s.baseSize + pulse * random(0.5, 2);
    fill(200 + random(-20, 20), 200 + random(-20, 20), 255, 180);
    push();
    translate(s.x, s.y, s.z);
    sphere(starSize);
    pop();
  }
  pop();

  // 画面中央に配置
  translate(-width / 2, -height / 2);

  // デザイン幅とスケールを計算
  galleryScale = min(1, width / designWidth);
  
  push();
  scale(galleryScale);
  translate(0, scrollY);

  // サムネイルサイズとレイアウトを計算
  let thumbSize = 150; 
  let colCount = max(1, floor((width / galleryScale - outerPad * 2) / (thumbSize + gutter)));
  let rowStartX = (width / galleryScale - (thumbSize * colCount + gutter * (colCount - 1))) / 2;
  let y = topOffset;

　galleryLayout.thumbSize = thumbSize;
  galleryLayout.colCount = colCount;
  galleryLayout.rowStartX = rowStartX;
  galleryLayout.topOffset = topOffset;

  // 月ごとに分類
  let grouped = {};
  for (let m = 0; m < 12; m++) grouped[m] = [];
  for (let c of allConstellations) {
    if (!c.created) continue;
    let m = c.created.match(/(\d+)\D+(\d+)\D+(\d+)/);
    if (!m) continue;
    let monthIndex = int(m[2]) - 1;
    grouped[monthIndex].push(c);
  }

  // 月ごとに描画
  for (let month = 0; month < 12; month++) {
    let list = grouped[month];
    if (list.length === 0) continue;

    // 月の見出し
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    let monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    text(monthNames[month], 20, y);  
    y += 35;

	let monthContentHeight = ceil(list.length / colCount) * (thumbSize + gutter + 25) + 20;

    // サムネイルをグリッド状に配置
    for (let i = 0; i < list.length; i++) {
	　const c = list[i]; 
      let col = i % colCount;
      let row = floor(i / colCount);
      let x = rowStartX + col * (thumbSize + gutter);
      let ty = y + row * (thumbSize + gutter + 25);
		
      // タップ/ホバー判定
      let mx = (mouseX - width/2) / galleryScale;
      let my = (mouseY - height/2 - scrollY) / galleryScale;
      
      // サムネイルの背景
	  fill('rgba(5, 5, 20, 0.8)');
	  stroke('rgba(150, 150, 150, 0.5)');
	  strokeWeight(1);
	  rect(x, ty, thumbSize, thumbSize, 8);
		
	  if (!c.thumbnail) {
		  c.thumbnail = generate2DThumbnail(c, thumbSize);
	  }
		
	  if (c.thumbnail) {
		  image(c.thumbnail, x, ty, thumbSize, thumbSize);
	  }
      
      // 日付を表示
      const date = parseDate(c.created);
      let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let formattedDate = `${date.getMonth() + 1}/${date.getDate()}(${weekdays[date.getDay()]}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      fill(200, 220, 255);
      textSize(12);
      textAlign(CENTER, TOP);
      text(formattedDate, x + thumbSize/2, ty + thumbSize + 5);
    }
    
    // 次の月の開始位置を計算
    y += monthContentHeight;;
  }

  let contentHeight = y + 20;

  pop();

  // スクロール範囲を制限
  let maxScroll = calculateMaxScroll();
  targetScrollY = constrain(targetScrollY, -maxScroll, 0);
  scrollY = constrain(scrollY, -maxScroll, 0);
}

function getGalleryPointer() {
  return {
    x: (mouseX - width / 2) / galleryScale,
    y: (mouseY - height / 2 - scrollY) / galleryScale
  };
}
/* =========================================================
   generate2DThumbnail
   ========================================================= */
function generate2DThumbnail(cons, size) {
  // 既存のサムネイルをクリーンアップ
  if (cons.thumbnail) {
    try {
      if (cons.thumbnail.canvas) {
        cons.thumbnail.canvas = null;
      }
      cons.thumbnail.remove();
      cons.thumbnail = null;
    } catch (e) {
      console.warn("Failed to clean up thumbnail:", e);
    }
  }

  // 2Dで描画
  let pg = createGraphics(size, size, P2D); // P2Dレンダラーを明示的に指定
  pg.background(10, 10, 30);

  // 余白
  const padding = size * 0.15;
  const contentSize = size - padding * 2;
  
  // 星の位置を正規化
  let stars = [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  // 座標の範囲を計算
  for (let s of cons.stars) {
    if (!s || !s.pos) continue;
    minX = min(minX, s.pos.x);
    maxX = max(maxX, s.pos.x);
    minY = min(minY, s.pos.y);
    maxY = max(maxY, s.pos.y);
  }
  
  // すべての星が同じ位置にある場合の処理
  if (minX === maxX) {
    minX -= 1;
    maxX += 1;
  }
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }
  
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  const maxRange = max(rangeX, rangeY) * 1.1; // 少し余裕を持たせる
  
  // 中心を計算
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // 星の位置を計算
  for (let s of cons.stars) {
    if (!s || !s.pos) continue;
    
    // 中心を原点に移動して正規化
    let nx = (s.pos.x - centerX) / maxRange + 0.5;
    let ny = (s.pos.y - centerY) / maxRange + 0.5;
    
    // キャンバス上の座標に変換
    stars.push({
      x: padding + nx * contentSize,
      y: padding + ny * contentSize,
      emo: s.emo || { P: 0, A: 0, D: 0 }
    });
  }

  // 線を描画（星より先に描画）
  pg.blendMode(BLEND); // BLENDモードに変更
  pg.strokeCap(ROUND);
  pg.strokeJoin(ROUND);
  
  // 線の描画
  if (stars.length > 1) {
    // 単純に全ての星を線でつなぐ（デモ用）
    pg.stroke(180, 200, 255, 80); // 半透明の水色
    pg.strokeWeight(1.5);
    pg.noFill();
    
    // 各星から最も近い2つの星と線でつなぐ
    for (let i = 0; i < stars.length; i++) {
      let s1 = stars[i];
      let closest = [];
      
      // 他の全ての星との距離を計算
      for (let j = 0; j < stars.length; j++) {
        if (i === j) continue;
        let s2 = stars[j];
        let d = dist(s1.x, s1.y, s2.x, s2.y);
        closest.push({index: j, distance: d});
      }
      
      // 距離が近い順にソート
      closest.sort((a, b) => a.distance - b.distance);
      
      // 最も近い2つの星と線でつなぐ
      for (let k = 0; k < min(2, closest.length); k++) {
        let j = closest[k].index;
        if (i < j) { // 重複を避ける
          pg.line(s1.x, s1.y, stars[j].x, stars[j].y);
        }
      }
    }
  }

  // 星を描画（線の上に重ねる）
  pg.noStroke();
  let starSize = 8 * (size / 200);
  
  for (let s of stars) {
    pg.fill(255, 255, 200, 220);
    pg.ellipse(s.x, s.y, starSize);
  }

  // デバッグ用：境界線を描画
  if (false) { // デバッグ時のみ有効にする
    pg.noFill();
    pg.stroke(255, 0, 0);
    pg.rect(padding, padding, contentSize, contentSize);
  }

  cons.thumbnail = pg;
  cons.lastAccessed = Date.now();
  return pg;
}
/* =========================================================
   最大スクロール量を計算
   ========================================================= */
function calculateMaxScroll() {
  const thumbSize = 150;
  const itemsPerRow = max(1, floor((width - outerPad * 2) / (thumbSize + gutter)));
  
  let totalHeight = topOffset;

  if (!Array.isArray(allConstellations)) {
    console.warn("allConstellations is not an array:", allConstellations);
    return 0;
  }

  const grouped = groupByMonth(allConstellations);
  
  for (let month = 0; month < 12; month++) {
    const monthItems = grouped[month];
    if (monthItems.length === 0) continue;
    
    // 月の見出しの高さ
    totalHeight += 35;
    
    // サムネイル行の高さ
    const rows = ceil(monthItems.length / itemsPerRow);
    totalHeight += rows * (thumbSize + gutter + 25) + 20;
  }
  
  return max(0, totalHeight - height + 100);
}

/* =========================================================
   galleryメモリ管理
   ========================================================= */
function cleanupThumbnails() {
  const MAX_CACHED = 20;
  if (allConstellations.length <= MAX_CACHED) return;
  
  // 最後にアクセスされた日時でソート
  const sorted = [...allConstellations].sort((a, b) => {
    return (b.lastAccessed || 0) - (a.lastAccessed || 0);
  });
  
  // 古いものから削除
  for (let i = MAX_CACHED; i < sorted.length; i++) {
    const c = sorted[i];
    if (c.thumbnail) {
      try {
        if (c.thumbnail.canvas) {
          c.thumbnail.canvas = null;
        }
        c.thumbnail.remove();
        c.thumbnail = null;
      } catch (e) {
        console.warn("Failed to clean up thumbnail:", e);
      }
    }
  }
}

/* =========================================================
   // 日付パースのエラーハンドリング強化
   ========================================================= */
function parseDate(dateStr) {
  if (!dateStr) return new Date();

  let date;
  
  // YYYY/MM/DD HH:MM:SS 形式
  let match = dateStr.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})\D+(\d{1,2})\D+(\d{1,2})/);
  if (match) {
    date = new Date(
      parseInt(match[1]),  // year
      parseInt(match[2]) - 1,  // month (0-based)
      parseInt(match[3]),  // day
      parseInt(match[4] || 0),  // hours
      parseInt(match[5] || 0)   // minutes
    );
  } 
  // MM/DD/YYYY HH:MM:SS 形式
  else if ((match = dateStr.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})\D+(\d{1,2})\D+(\d{1,2})/))) {
    date = new Date(
      parseInt(match[3]),  // year
      parseInt(match[1]) - 1,  // month (0-based)
      parseInt(match[2]),  // day
      parseInt(match[4] || 0),  // hours
      parseInt(match[5] || 0)   // minutes
    );
  }
  // その他の形式
  else {
    date = new Date(dateStr);
  }
  
  // 有効な日付かチェック
  if (isNaN(date.getTime())) {
    console.warn("Invalid date format:", dateStr);
    return new Date(); 
  }
  
  return date;
}

/* =========================================================
   // エラーハンドリング
   ========================================================= */
// セーブ処理
function saveConstellation(constellation) {
  try {
    allConstellations.push(constellation);
    localStorage.setItem("myConstellations", JSON.stringify(allConstellations));
  } catch (e) {
    console.error("Failed to save constellation:", e);
    // ストレージがいっぱいの場合の処理
    if (e.name === 'QuotaExceededError' || 
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        (e.code === 22 && e.name === 'QuotaExceededError')) {
      // 古いデータを削除して再試行
      if (allConstellations.length > 1) {
        allConstellations.shift(); // 最も古いデータを削除
        saveConstellation(constellation); // 再帰的に再試行
      } else {
        alert("保存できるデータの上限に達しました。古いデータを削除してください。");
      }
    }
  }
}

// ロード処理
function loadConstellations() {
  try {
    let saved = localStorage.getItem("myConstellations");
    if (saved) {
      allConstellations = JSON.parse(saved);
      // データの整合性チェック
      allConstellations = allConstellations.filter(c => 
        c && c.stars && Array.isArray(c.stars) && c.created
      );
    }
  } catch (e) {
    console.error("Failed to load constellations:", e);
    allConstellations = [];
    // 壊れたデータを削除
    try {
      localStorage.removeItem("myConstellations");
    } catch (e) {
      console.error("Failed to clear corrupted data:", e);
    }
  }
}

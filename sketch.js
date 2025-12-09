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

let myFont;

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

// 3D操作
// タッチイベント
let touchStartX, touchStartY;
let rotationX = 0, rotationY = 0;
let targetRotationX = 0, targetRotationY = 0;
let isDragging = false;
let isTouching = false;
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };

const TAP_THRESHOLD = 15;
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

// gallery
let galleryButton;
let scrollY = 0;
let targetScrollY = 0;
let galleryStars = [];

let selectedThumbnail = null;
let zoomAnim = 0;
let targetZoom = 0;

let isScrolling = false;
const SCROLL_THRESHOLD = 10;

let outerPad = 20;
let gutter = 12;
let topOffset = 40;

/* =========================================================
   preload
   ========================================================= */
function preload() {
  myFont = loadFont("nicomoji-plus_v2-5.ttf");
}

/* =========================================================
   setup
   ========================================================= */
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  textSize(16);

  lastTouchTime = millis();

　touches = [];

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

  // ボタンクリックイベント
  addButton.mousePressed(addPAD);
  
  okButton.mousePressed(() => {
    if (padValues.length > 0) {
      prepareVisual();
      let now = new Date();
      let timestamp = now.toLocaleString();
      let serialStars = points.map(s => {
        let px = (s.pos && typeof s.pos.x !== "undefined") ? s.pos.x : 0;
        let py = (s.pos && typeof s.pos.y !== "undefined") ? s.pos.y : 0;
        let pz = (s.pos && typeof s.pos.z !== "undefined") ? s.pos.z : 0;
        return { pos: { x: px, y: py, z: pz }, emo: s.emo };
      });

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

  backButton.mousePressed(() => {
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

  galleryButton.mousePressed(() => {
	  if (state === "gallery") {
	    state = "select";
	    galleryStars = [];
	    targetScrollY = 0;
	    scrollY = 0;
	    selectedLabel = null;
	  } else {
	    state = "gallery";
	    galleryStars = [];
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

	canvas.elt.addEventListener('touchstart', touchStarted, { passive: false });
	canvas.elt.addEventListener('touchmove', touchMoved, { passive: false });
    canvas.elt.addEventListener('touchend', touchEnded, { passive: false });
	canvas.elt.addEventListener('touchcancel', touchEnded, { passive: false });

    // タッチイベントの伝搬を防ぐ
    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.click();
      }, { passive: false });
    });
  }
}

/* =========================================================
   ボタンの表示/非表示を更新
   ========================================================= */
function updateButtonVisibility() {
  addButton.hide();
  okButton.hide();
  backButton.hide();
  galleryButton.hide();
  resetViewButton.hide();

  if (state === "select") {
    addButton.show();
    okButton.show();
    galleryButton.show();
    galleryButton.html("日記一覧");
  } 
  else if (state === "gallery") {
    backButton.show();
	backButton.html("← 記録ページ");
    galleryButton.html("戻る");
  }
  else if (state === "visual") {
    backButton.show();
    galleryButton.show();
    galleryButton.html("日記一覧");
    resetViewButton.show();
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
  computeBtnSize();
  layoutDOMButtons();
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
  let p = (selectedP !== null ? selectedP : 3) / 6; 
  let a = (selectedA !== null ? selectedA : 3) / 6;
  let d = (selectedD !== null ? selectedD : 3) / 6;
  
  padValues.push({P: p, A: a, D: d});
}

/* =========================================================
   prepareVisual
   ========================================================= */
function prepareVisual() {
  points = [];
  for (let v of padValues) {
    let emo = findClosestEmotion(v.P, v.A, v.D);
    let x = map(v.P, 0, 1, -100, 100);
    let y = map(v.A, 0, 1, -100, 100);
    let z = map(v.D, 0, 1, -100, 100);
    points.push({pos:createVector(x,y,z), emo:emo});
  }
  stars = [];
  for (let i = 0; i < 400; i++) {
    stars.push({
      x: random(-2000, 2000),
      y: random(-2000, 2000),
      z: random(-2000, 2000),
      twinkle: random(1000)
    });
  }
}

/* =========================================================
   draw
   ========================================================= */
function draw() {
  if (frameCount % 60 === 0) { 
		    cleanupThumbnails();
  }
	
  background(5, 5, 20);

  if (state === "select") {
    camera();
    drawPADButtons();
    return;
  } 
  else if (state === "gallery") {
    drawGallery2D();
	if (selectedThumbnail && targetZoom > 0.5) {
	    return;
	}
    return;
  }
  else if (state === "visual") {
	  camera();
      orbitControl();

	  if (touches.length > 0 && isTouching) {
	    let touch = touches[0];
	    let dx = touch.x - touchStartPos.x;
	    let dy = touch.y - touchStartPos.y;
	    
	    targetRotationY += dx * 0.01;
	    targetRotationX += dy * 0.01;
	    
	    touchStartPos = { x: touch.x, y: touch.y };
	  }
	  
	  // 3D操作
	  rotationX = lerp(rotationX, targetRotationX, 0.1);
	  rotationY = lerp(rotationY, targetRotationY, 0.1);
	  rotateX(rotationX);
 	  rotateY(rotationY);
	  zoomLevel = lerp(zoomLevel, targetZoomLevel, 0.1);
	  scale(zoomLevel);
		  
	  // ★ 星空の描画
	  push(); 
	  noStroke();
	  for (let s of stars) {
	    if (random() < 0.02) s.on = !s.on;
	    if (s.baseSize === undefined) s.baseSize = random(1.0, 4.0);
	    let blink = (s.on ? 1 : 0);
	    let pulse = 0.5 + 0.5 * sin(frameCount * 0.02 + s.twinkle);
	    let intensity = blink * pulse;
	    let starSize = s.baseSize + intensity * random(0.5, 2.0);
	    let alpha = map(intensity, 0, 1, 10, 255);
	    let r = 200 + random(-20, 20);
	    let g = 200 + random(-20, 20);
	    let b = 255;
	    fill(r, g, b, alpha);
	    push();
	    translate(s.x, s.y, s.z);
	    sphere(starSize);
	    pop();
	  }
	  pop();
	
	  if (allConstellations.length === 0) return;
	  let latest = allConstellations[allConstellations.length - 1];
	  let latestMonth = -1;
	
	  if (latest?.created) {
	    let m = latest.created.match(/(\d+)\D+(\d+)\D+(\d+)/);
	    if (m) latestMonth = int(m[2]);
	  }
	
	  let sameMonthConstellations = [];
	  for (let c of allConstellations) {
	    if (!c.created) continue;
	    let m = c.created.match(/(\d+)\D+(\d+)\D+(\d+)/);
	    if (!m) continue;
	    if (int(m[2]) === latestMonth) sameMonthConstellations.push(c);
	  }
	
	  let displayList = [...sameMonthConstellations];
	  let idx = displayList.indexOf(latest);
	  if (idx !== -1) displayList.splice(idx, 1);
	  displayList.push(latest);
	
	  for (let i = 0; i < displayList.length; i++) {
	    let constellation = displayList[i];
	    push();
	    if (i === displayList.length - 1) {
	      translate(0, 0, 200);
	      scale(1.5);
	    } else {
	      let col = i % 5;
	      let arow = floor(i / 5);
	      translate(-600 + col * 250, -300 + arow * 250, -800);
	      scale(0.6);
	    }
	
	    stroke(150, 80);
	    noFill();
	    box(220);
	
	    for (let p of constellation.stars) {
	      let px = p.pos?.x ?? 0;
	      let py = p.pos?.y ?? 0;
	      let pz = p.pos?.z ?? 0;
	
	      push();
	      translate(px, py, pz);
	      let flicker = 220 + 35 * sin(frameCount*0.1 + i*37);
	      fill(255, 255, 200, flicker);
	      noStroke();
	      sphere(8);
	      pop();
	    }
	
	    if (millis() - visualStartTime > 1200) {
	      push();
	      stroke(180, 200, 255, 90);
	      strokeWeight(2);
	      blendMode(ADD);
	      for (let a = 0; a < constellation.stars.length; a++) {
	        for (let b = a+1; b < constellation.stars.length; b++) {
	          let aPos = constellation.stars[a].pos;
	          let bPos = constellation.stars[b].pos;
	          if (aPos && bPos) {
	            line(aPos.x, aPos.y, aPos.z, bPos.x, bPos.y, bPos.z);
	          }
	        }
	      }
	      pop();
	    }
	
	    push();
	    translate(0, 120, 0);
	    fill(255);
	    textAlign(CENTER, CENTER);
	    textSize(14);
	    text(constellation.created, 0, 0);
	    pop();
	
	    pop();
	  }
	
	  if (allConstellations.length > 0) {
	   latest = allConstellations[allConstellations.length - 1];
	   let m = latest?.created?.match(/(\d+)\D+(\d+)\D+(\d+)/);
	   let monthIndex = m ? int(m[2]) - 1 : 0;
	   let monthNames = [
	     "January","February","March","April","May","June",
	     "July","August","September","October","November","December"
	   ];
	   push();
	   resetMatrix();               
	   applyMatrix(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
	   noLights();
	   textAlign(CENTER, TOP);
	   textSize(32);
	   fill(255);
	   text(monthNames[monthIndex], width/2, 20);
	   pop();
	 }
	 
	  if (selectedLabel) {
	    push();
	    camera();
	    fill(255);
	    textAlign(CENTER, CENTER);
	    textSize(20);
	    text(selectedLabel, width/2, height-40);
	    pop();
	  }

	  if (state === "visual" && !isDragging) {
	    // 慣性を適用
	    if (abs(velocityX) > 0.001 || abs(velocityY) > 0.001) {
	      targetRotationY += velocityX * 2;
	      targetRotationX += velocityY * 2;
	      
	      // 減衰
	      velocityX *= 0.95;
	      velocityY *= 0.95;
	    } else {
	      velocityX = 0;
	      velocityY = 0;
	    }
	  }
	} 
	
	// タッチフィードバックの描画
  if (touchFeedback && touchFeedback.alpha > 0) {
    push();
    noStroke();
    fill(255, 255, 255, touchFeedback.alpha);
    ellipse(touchFeedback.x, touchFeedback.y, 30, 30);
    touchFeedback.alpha -= 5;
    pop();
  }
}

/* =========================================================
   drawPADButtons
   ========================================================= */
function drawPADButtons(){
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
  // P 行
  for(let i=0;i<7;i++){
    let col = lerpColor(color(255,150,0), color(0,100,255), i/6);
    drawButton(cx + (i-3)*(padLayout.btnSize+padLayout.spacing), cy-120, padLayout.btnSize, col, i, selectedP===i, "rect");
  }
  // A 行
  for(let i=0;i<7;i++){
    let col = lerpColor(color(255,220,0), color(0,0,100), i/6);
    let sides = int(map(i,0,6,3,30));
    drawButton(cx + (i-3)*(padLayout.btnSize+padLayout.spacing), cy, padLayout.btnSize, col, i, selectedA===i, "polygon", sides);
  }
  // D 行
  for(let i=0;i<7;i++){
    let col = color(200);
    let sides = int(map(i,0,6,4,30));
    drawButton(cx + (i-3)*(padLayout.btnSize+padLayout.spacing), cy+120, padLayout.btnSize, col, i, selectedD===i, "polygon", sides);
  }
  pop();
}

/* =========================================================
   drawButton
   ========================================================= */
function drawButton(x,y,btnSize_,col,index,isSelected,shapeType,sides=4){
  push();
  translate(x, y, 0);

  push();
  blendMode(ADD);
  noStroke();
  let auraAlpha = isSelected ? 100 : 40;  
  let aura = color(red(col), green(col), blue(col), auraAlpha);
  fill(aura);
  ellipse(0, 0, btnSize_ * 2.2, btnSize_ * 2.2);
  pop();

  let body = color(
    constrain(red(col) + 20, 0, 255),
    constrain(green(col) + 20, 0, 255),
    constrain(blue(col) + 20, 0, 255)
  );

  noStroke();
  fill(body);

  if (shapeType === "rect") {
    rectMode(CENTER);
    rect(0, 0, btnSize_, btnSize_, 8);
  } else if (shapeType === "polygon") {
    polygon(0, 0, btnSize_/2, sides);
  }

  pop();
}

/* =========================================================
   mousePressed
   ========================================================= */
function mousePressed() {
  if (touches.length > 0) {
    return false;
  }
	
  if (state === "visual") {
    if (allConstellations.length === 0) return;
    let currentConstellation = allConstellations[allConstellations.length - 1];
    let minDist = 50;
    let nearest = null;
	
	let mx = mouseX;
    let my = mouseY;
	  
    for (let p of currentConstellation.stars) {
      let px = p.pos?.x ?? 0;
      let py = p.pos?.y ?? 0;
      let pz = p.pos?.z ?? 0;
      let sp = screenPos(px, py, pz);
      let sx = sp.x;
      let sy = sp.y;
      let d = dist(mx, my, sx, sy);
      if (d < minDist) {
        minDist = d; 
        nearest = p; 
      }
    }
    if (nearest) {
      let emo = nearest.emo || {en:"", ja:""};
      selectedLabel = emo.en + "(" + (emo.ja || "") + ")";
      setTimeout(() => { selectedLabel = null; }, 3000);
    }
    return;
  } 
  else if (state === "gallery") {
    handleGalleryClick();
    return false;
  }
  else if (state === "select") {
    let mx = (mouseX - width/2) / padLayout.scl;
    let my = (mouseY - height/2) / padLayout.scl;
    let cx = padLayout.cx;
    let cy = padLayout.cy;

    // P 行
    for (let i = 0; i < 7; i++) {
      let bx = cx + (i-3)*(padLayout.btnSize+padLayout.spacing);
      let by = cy - 120;
      if (dist(mx, my, bx, by) < padLayout.btnSize/2 * 1.2) {
        selectedP = i;
        // タッチフィードバック
        touchFeedback = {
          x: x,
          y: y,
          alpha: 100
        };
        return;
      }
    }

    // A 行
    for (let i = 0; i < 7; i++) {
      let bx = cx + (i-3)*(padLayout.btnSize+padLayout.spacing);
      let by = cy;
      if (dist(mx, my, bx, by) < padLayout.btnSize/2 * 1.2) {
        selectedA = i;
        // タッチフィードバック
        touchFeedback = {
          x: x,
          y: y,
          alpha: 100
        };
        return;
      }
    }

    // D 行 
    for (let i = 0; i < 7; i++) {
      let bx = cx + (i-3)*(padLayout.btnSize+padLayout.spacing);
      let by = cy + 120;
      if (dist(mx, my, bx, by) < padLayout.btnSize/2 * 1.2) {
        selectedD = i;
        // タッチフィードバック
        touchFeedback = {
          x: x,
          y: y,
          alpha: 100
        };
        return;
      }
    }
  return false;
  }
}

/* =========================================================
   タッチイベント
   ========================================================= */
function touchStarted(event) {
  if (event) event.preventDefault();

  // タッチ位置の更新
  if (event && event.touches && event.touches[0]) {
    const touch = event.touches[0];
    const rect = canvas.elt.getBoundingClientRect();
    touchStartX = touch.clientX - rect.left;
    touchStartY = touch.clientY - rect.top;
    isTouching = true;
    touchStartTime = millis();
    touchStartPos = { x: touch.clientX, y: touch.clientY };
    
    // マウス座標の同期
    mouseX = touchStartX;
    mouseY = touchStartY;

	// PADボタンのタップ処理
    if (state === "select") {
      if (handlePadButtonTap(touchStartX, touchStartY)) {
        return false;
      }
    } else {
    isTouching = true;
    touchStartTime = millis();
    touchStartX = mouseX;
    touchStartY = mouseY;
    touchStartPos = { x: mouseX, y: mouseY };
	}
  }

  // 2本指タッチ（ピンチ操作）の初期化
  if (event.touches && event.touches.length === 2) {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
    initialZoom = zoomLevel;
    return false;
  }
  
  // ボタンのタッチ判定
  if (state === "select" || state === "gallery" || state === "visual") {
    const buttons = [addButton, okButton, backButton, galleryButton, resetViewButton].filter(btn => btn && btn.elt);
    
    for (const btn of buttons) {
      const rect = btn.elt.getBoundingClientRect();
      if (touchStartX + rect.left >= rect.left && 
          touchStartX + rect.left <= rect.right && 
          touchStartY + rect.top >= rect.top && 
          touchStartY + rect.top <= rect.bottom) {
        btn.elt.style.transform = 'scale(0.95)';
        btn.elt.style.opacity = '0.9';
        setTimeout(() => {
          if (btn.mousePressed) btn.mousePressed();
          btn.elt.style.transform = '';
          btn.elt.style.opacity = '';
        }, 50);
        return false;
      }
    }
  }

  // その他のタッチ処理
  if (state === "visual") {
    isDragging = true;
  }
	  
  return false;
}

function touchMoved(event) {
  if (!event.touches || event.touches.length === 0) return false;
  if (event) event.preventDefault();
  isTouching = false;
  return false;
  
  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;
  const deltaX = Math.abs(currentX - touchStartX);
  const deltaY = Math.abs(currentY - touchStartY);
  
  // ギャラリーモードでのスクロール処理
  if (state === "gallery") {
    // 縦方向のスクロールのみ処理
    if (deltaY > 5 && deltaY > deltaX) {
      event.preventDefault();
      const delta = currentY - touchStartY;
      targetScrollY -= delta * 2;
      touchStartY = currentY;
      return false;
    }
    return true;
  }
  
  // 2本指タッチ（ピンチ操作）
  if (event.touches.length === 2) {
    event.preventDefault();
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    
    if (initialPinchDistance > 0) {
      const scale = currentDistance / initialPinchDistance;
      targetZoomLevel = constrain(initialZoom * scale, MIN_ZOOM, MAX_ZOOM);
    }
    return false;
  }
  
  // ビジュアルモードでの回転操作
  if (state === "visual" && isDragging) {
    event.preventDefault();
    const currentTime = millis();
    const deltaX = currentX - lastTouchX;
    const deltaY = currentY - lastTouchY;
    
    // 速度計算
    if (lastTouchTime > 0) {
      const deltaTime = currentTime - lastTouchTime;
      if (deltaTime > 0) {
        velocityX = deltaX / deltaTime * 0.5;
        velocityY = deltaY / deltaTime * 0.5;
      }
    }
    
    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    
    lastTouchX = currentX;
    lastTouchY = currentY;
    lastTouchTime = currentTime;
    
    return false;
  }
  
  return true;
}

function touchEnded(event) {
  if (!event) return true;
  
  // タップ判定（短いタッチ）
  if (state === "gallery" && millis() - touchStartTime < 200) {
    if (event.changedTouches && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartPos.x;
      const dy = touch.clientY - touchStartPos.y;
      
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        // ギャラリーのタップ処理
        handleGalleryTap(touch.clientX, touch.clientY);
      }
    }
  }
  
  // ビジュアルモードの慣性処理
  if (state === "visual") {
    const now = millis();
    const deltaTime = now - lastTouchTime;
    
    if (deltaTime > 0 && lastTouchX !== undefined && lastTouchY !== undefined) {
      if (event.changedTouches && event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const dx = touch.clientX - lastTouchX;
        const dy = touch.clientY - lastTouchY;
        velocityX = dx / deltaTime * 0.5;
        velocityY = dy / deltaTime * 0.5;
      }
    }
  }
  
  isTouching = false;
  isDragging = false;
  
  return false;
}

function touchCanceled(event) {
  return touchEnded(event);
}

// ギャラリーのタップ処理
function handleGalleryTap(x, y) {
  if (selectedThumbnail) {
    // 閉じるボタンの判定
    const buttonSize = 30 * zoomAnim;
    const buttonX = width/2 + (thumbSize * zoomAnim)/2 - buttonSize/2 - 10;
    const buttonY = height/2 - (thumbSize * zoomAnim)/2 - buttonSize/2 - 10;
    
    if (dist(x, y, buttonX, buttonY) < buttonSize/2) {
      targetZoom = 0;
      setTimeout(() => {
        if (targetZoom === 0) selectedThumbnail = null;
      }, 300);
    }
    return;
  }

  // サムネイルのタップ判定
  const galleryScale = min(1, width / 430);
  const offsetX = (width - (430 * galleryScale)) / 2;
  const offsetY = -scrollY;
  const colCount = max(1, floor((430 - outerPad * 2) / (150 + gutter)));
  const thumbSize = 150 * galleryScale;
  const rowHeight = thumbSize + 25;
  
  // 表示範囲内のサムネイルのみチェック
  const startRow = max(0, floor((-scrollY - 100) / rowHeight));
  const endRow = min(
    Math.ceil(allConstellations.length / colCount),
    startRow + Math.ceil((height + 200) / rowHeight)
  );
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < colCount; col++) {
      const idx = row * colCount + col;
      if (idx >= allConstellations.length) continue;
      
      const tx = offsetX + outerPad * galleryScale + col * (thumbSize + gutter * galleryScale);
      const ty = offsetY + topOffset * galleryScale + row * rowHeight;
      
      if (x >= tx && x <= tx + thumbSize && y >= ty && y <= ty + thumbSize) {
        selectedThumbnail = allConstellations[idx];
        targetZoom = 1;
        return;
      }
    }
  }
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
  
  // 慣性をリセット
  velocityX = 0;
  velocityY = 0;
  
  // タッチ状態をリセット
  isTouching = false;
  isDragging = false;
  
  // カメラをリセット
  camera();
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

function touchCanceled(event) {
  return touchEnded(event);
}

function touchCanceled(e) {
  e.preventDefault();
  return false;
}

// ギャラリー
function handleGalleryClick() {
    const DESIGN_WIDTH = 430;
    const THUMBNAIL_SIZE = 150;
    const CLOSE_BUTTON_RADIUS = 30;
    const ZOOM_ANIMATION_THRESHOLD = 0.5;
    
    // 座標変換
    const galleryScale = min(1, width / DESIGN_WIDTH);
    const offsetX = (width - DESIGN_WIDTH * galleryScale) / 2;
    const mx = (mouseX - offsetX) / galleryScale;
    const my = (mouseY - scrollY) / galleryScale;

    // サムネイルグリッドの計算
    const colCount = max(1, floor((width / galleryScale - outerPad * 2) / (THUMBNAIL_SIZE + gutter)));
    const rowStartX = (width / galleryScale - (THUMBNAIL_SIZE * colCount + gutter * (colCount - 1))) / 2;
    
    // サムネイルのクリック検出
    if (checkThumbnailClicks(mx, my, rowStartX, colCount, THUMBNAIL_SIZE)) {
        return;
    }
    
    // 拡大表示中の処理
    if (selectedThumbnail) {
        handleZoomedViewInteraction();
    }
    
    return false;
}

// サムネイルのクリックを検出
function checkThumbnailClicks(mx, my, rowStartX, colCount, thumbSize) {
    let y = topOffset;

    for (let month = 0; month < 12; month++) {
        const monthlyConstellations = allConstellations.filter(c => {
            const m = c.created.match(/(\d+)\D+(\d+)\D+(\d+)/);
            return m && int(m[2]) - 1 === month;
        });

        if (monthlyConstellations.length === 0) continue;

        y += 35;

        // サムネイルのクリックを検出
        for (let i = 0; i < monthlyConstellations.length; i++) {
            const col = i % colCount;
            const row = floor(i / colCount);
            const tx = rowStartX + col * (thumbSize + gutter);
            const ty = y + row * (thumbSize + gutter + 25);

            if (mx >= tx && mx <= tx + thumbSize && 
                my >= ty && my <= ty + thumbSize) {
                selectedThumbnail = monthlyConstellations[i];
                targetZoom = 1;
                return true;
            }
        }

        y += ceil(monthlyConstellations.length / colCount) * (thumbSize + gutter + 25) + 20;
    }
    
    return false;
}

function handleZoomedViewInteraction() {
    const zoomedThumbSize = min(width, height) * 0.7;
    const closeButtonX = width/2 + (zoomedThumbSize/2 - 20);
    const closeButtonY = height/2 - (zoomedThumbSize/2 - 20);
    const distanceToClose = dist(mouseX, mouseY, closeButtonX, closeButtonY);
    
    // 閉じるボタンまたは背景がクリックされたか
    const isCloseButtonClicked = distanceToClose < 30;
    const isBackgroundClicked = zoomAnim > ZOOM_ANIMATION_THRESHOLD;
    
    if (isCloseButtonClicked || isBackgroundClicked) {
        targetZoom = 0;
        setTimeout(() => {
            if (targetZoom === 0) {
                selectedThumbnail = null;
            }
        }, 300);
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

// PADボタン
function checkPadButtonTouch(x, y) {
  const btnSize = padLayout.btnSize * padLayout.scl;
  const spacing = padLayout.spacing * padLayout.scl;
  const centerX = width / 2;
  const centerY = height / 2;

  const padHitMargin = 5;
  
  // P行のボタン
  for (let i = 0; i < 7; i++) {
    const btnX = centerX + (i - 3) * (btnSize + spacing);
    const btnY = centerY - 120 * padLayout.scl;
    
    if (dist(x, y, btnX, btnY) < (btnSize/2 + hitMargin)) {
      selectedP = i;
      touchFeedback = { x: btnX, y: btnY, alpha: 150 };
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
      redraw();
      return true;
    }
  }
  return false;
}
/* =========================================================
   mouseWheel
   ========================================================= */
function mouseWheel(event) {
    if (state === "gallery") {
        if (selectedThumbnail && targetZoom > 0.5) {
            return false;
        }
        targetScrollY -= event.delta * 0.5;
        targetScrollY = constrain(targetScrollY, -3000, 0);
        return false;
    } else if (state === "visual") {
        targetZoomLevel -= event.delta * 0.001;
        targetZoomLevel = constrain(targetZoomLevel, MIN_ZOOM, MAX_ZOOM);
        return false;
    }
    return true;
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
  let designWidth = 430;
  let galleryScale = min(1, width / designWidth);

  // スクロール処理
  let scrollEasing = 0.1;
  if (abs(scrollY - targetScrollY) < 0.5) {
    scrollY = targetScrollY;
  } else {
    scrollY = lerp(scrollY, targetScrollY, scrollEasing);
  }

  push();
  scale(galleryScale);
  translate(0, scrollY);

  // サムネイルサイズとレイアウトを計算
  let thumbSize = 150; 
  let colCount = max(1, floor((width / galleryScale - outerPad * 2) / (thumbSize + gutter)));
  let rowStartX = (width / galleryScale - (thumbSize * colCount + gutter * (colCount - 1))) / 2;
  let y = topOffset;
  let contentHeight = 0;

  // 月ごとに分類
  let grouped = {};
  for (let m = 0; m < 12; m++) grouped[m] = [];
  for (let c of allConstellations) {
    let m = c.created.match(/(\d+)\D+(\d+)\D+(\d+)/);
    if (!m) continue;
    let monthIndex = int(m[2]) - 1;
    grouped[monthIndex].push(c);
  }

  const viewportTop = -scrollY / galleryScale;
  const viewportBottom = viewportTop + height / galleryScale;

  for (let month = 0; month < 12; month++) {
    let list = grouped[month];
    if (list.length === 0) continue;
    contentHeight += 35;
    contentHeight += ceil(list.length / colCount) * (thumbSize + gutter + 25) + 20;
  }

  // 月ごとに描画
  for (let month = 0; month < 12; month++) {
    let list = grouped[month];
    if (list.length === 0) continue;

	if (y + 35 < viewportTop - 100 || y > viewportBottom) {
        y += 35 + ceil(list.length / colCount) * (thumbSize + gutter + 25) + 20;
        continue;
    }

    // 月の見出し
    fill(255);
    textSize(24); // 少し小さく
    textAlign(LEFT, TOP);
    let monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    text(monthNames[month], 20, y);  
    y += 35;

    // サムネイルをグリッド状に配置
    for (let i = 0; i < list.length; i++) {
	  let col = i % colCount;
	  let row = floor(i / colCount);
	  let x = rowStartX + col * (thumbSize + gutter);
	  let ty = y + row * (thumbSize + gutter + 25);

	  if (ty + thumbSize < viewportTop || ty > viewportBottom) {
	    continue;
	  }
		
      // マウスオーバー判定
      let mx = (mouseX - width/2) / galleryScale;
      let my = (mouseY - height/2 - scrollY) / galleryScale;
      let isHovered = (mx > x && mx < x + thumbSize && 
                      my > ty && my < ty + thumbSize);
      
      // サムネイルの背景
      fill(isHovered ? 'rgba(80, 100, 160, 0.3)' : 'rgba(5, 5, 20, 0.8)');
	  stroke(isHovered ? 'rgba(150, 180, 255, 0.8)' : 'rgba(150, 150, 150, 0.5)');
	  strokeWeight(isHovered ? 2 : 1);
	  rect(x, ty, thumbSize, thumbSize, 8);

	  if (!list[i].thumbnail) {
		list[i].thumbnail = generate2DThumbnail(list[i], thumbSize);
	  }

	  if (list[i].thumbnail) {
		  let scale = isHovered ? 1.05 : 1.0;
		  let offset = (thumbSize * scale - thumbSize) / 2;
		  image(list[i].thumbnail, 
		       x + (thumbSize - thumbSize * scale)/2, 
		       ty + (thumbSize - thumbSize * scale)/2, 
		       thumbSize * scale, thumbSize * scale);
	  }

      // ホバー時に少し拡大
      let scale = isHovered ? 1.05 : 1.0;
      let offset = (thumbSize * scale - thumbSize) / 2;
      image(list[i].thumbnail, 
           x + (thumbSize - thumbSize * scale)/2, 
           ty + (thumbSize - thumbSize * scale)/2, 
           thumbSize * scale, thumbSize * scale);
      
      // 日付を表示
      let date = new Date(list[i].created);
      let weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      let formattedDate = `${date.getMonth() + 1}/${date.getDate()}(${weekdays[date.getDay()]}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      fill(200, 220, 255);
      textSize(12);
      textAlign(CENTER, TOP);
      text(formattedDate, x + thumbSize/2, ty + thumbSize + 5);
      
      // クリック判定
      if (isHovered && mouseIsPressed) {
        selectedThumbnail = list[i];
        targetZoom = 1;
        // 画面中央にスクロール
        let targetY = -(ty + thumbSize/2 - height/galleryScale/2);
        targetScrollY = constrain(targetY, -y, 0);
      }
    }
    
    // 次の月の開始位置を計算
    y += ceil(list.length / colCount) * (thumbSize + gutter + 25) + 20;
  }

  pop();

  // スクロール範囲を制限
  let maxScroll = max(0, contentHeight - height/galleryScale + 100);
  targetScrollY = constrain(targetScrollY, -maxScroll, 0);
  scrollY = constrain(scrollY, -maxScroll, 0);

  // 拡大表示を描画
  if (selectedThumbnail) {
    push();
    translate(width/2, height/2);
    drawZoomedThumbnail();
    pop();
  }
}

/* =========================================================
   generate2DThumbnail
   ========================================================= */
function generate2DThumbnail(cons, size) {	
  if (cons.thumbnail) {
    try {
      if (cons.thumbnail.canvas) {
        cons.thumbnail.canvas = null;
      }
      cons.thumbnail = null;
    } catch (e) {
      console.warn("Failed to clean up thumbnail:", e);
    }
  }
    
    // 新しいサムネイルを生成
    let pg = createGraphics(size, size);

  // 枠の描画
  pg.stroke(150, 80);  
  pg.strokeWeight(1);
  pg.noFill();
  pg.rect(0, 0, size, size, 4);
  
  // 星の位置を計算
  let stars = cons.stars.map(s => ({
    x: s.pos.x,
    y: s.pos.y,
    size: s.size || 1 
  }));

  // 星の位置を正規化
  let minX = min(...stars.map(s => s.x));
  let maxX = max(...stars.map(s => s.x));
  let minY = min(...stars.map(s => s.y));
  let maxY = max(...stars.map(s => s.y));
  
  // 正規化用の範囲を計算
  let range = max(maxX - minX, maxY - minY, 1);
  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;

  const normalize = (val, minVal, maxVal, newMin, newMax) => {
    return ((val - minVal) / (maxVal - minVal)) * (newMax - newMin) + newMin;
  };
  
  // 星を描画
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    let x = map(s.x, centerX - range/2, centerX + range/2, size * 0.1, size * 0.9);
    let y = map(s.y, centerY - range/2, centerY + range/2, size * 0.1, size * 0.9);
    
    // 星の光の輪
    let gradient = pg.drawingContext.createRadialGradient(
      x, y, 0, 
      x, y, 3
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
    
    pg.drawingContext.fillStyle = gradient;
    pg.drawingContext.beginPath();
    pg.drawingContext.arc(x, y, 3, 0, TWO_PI); 
    pg.drawingContext.fill();
    
    // 星の中心（小さな白い点）
    pg.noStroke();
    pg.fill(255, 255, 255);
    pg.ellipse(x, y, 1, 1);
  }
    
    // 星同士を線でつなぐ（すべての星を繋ぐ）
  pg.stroke(255, 200, 255, 0.8);
  pg.strokeWeight(0.8);
  pg.blendMode(ADD);
  
  // すべての星の組み合わせに対して線を引く
  for (let i = 0; i < stars.length; i++) {
    let x1 = normalize(stars[i].x, minX, maxX, size * 0.15, size * 0.85);
    let y1 = normalize(stars[i].y, minY, maxY, size * 0.15, size * 0.85);
    
    for (let j = i + 1; j < stars.length; j++) {
      let x2 = normalize(stars[j].x, minX, maxX, size * 0.15, size * 0.85);
      let y2 = normalize(stars[j].y, minY, maxY, size * 0.15, size * 0.85);
      
      let d = dist(x1, y1, x2, y2);
      let alpha = map(d, 0, size * 0.7, 100, 20, true);
      pg.stroke(255, 200, 255, alpha);
      
      // 線を引く
      pg.line(x1, y1, x2, y2);
    }
  }
  pg.blendMode(BLEND);

  cons.thumbnail = pg;
  cons.lastAccessed = Date.now();
  return pg;
}

/* =========================================================
   drawZoomedThumbnail
   ========================================================= */
function drawZoomedThumbnail() {
  if (!selectedThumbnail) return;
    
    // スムーズなズームアニメーション
    zoomAnim = lerp(zoomAnim, targetZoom, 0.15);
    if (zoomAnim < 0.01 && targetZoom === 0) {
        // クリーンアップ
        if (selectedThumbnail.thumbnail) {
            selectedThumbnail.thumbnail.remove();
            selectedThumbnail.thumbnail = null;
        }
        selectedThumbnail = null;
        return;
    }
  
  push();
  // 背景のオーバーレイ（タッチ操作を可能にするため）
  fill(0, 0, 0, zoomAnim * 200);
  rectMode(CORNER);
  rect(-width/2, -height/2, width, height);
  
  // スケール計算
  let scale = 0.7 + zoomAnim * 0.3;
  scale(scale);
  
  // サムネイルサイズ
  let thumbSize = min(width, height) * 0.7;
  
  // サムネイルの背景
  fill(15, 20, 40);
  stroke(100, 150, 255, 80);
  strokeWeight(1);
  let cornerRadius = 12 * (0.7 + zoomAnim * 0.3);
  rect(-thumbSize/2, -thumbSize/2, thumbSize, thumbSize, cornerRadius);
  
  // サムネイルを描画
  if (!selectedThumbnail.thumbnail || 
    selectedThumbnail.thumbnail.width !== thumbSize) {
    if (selectedThumbnail.thumbnail) {
        selectedThumbnail.thumbnail.remove();
    }
    selectedThumbnail.thumbnail = generate2DThumbnail(selectedThumbnail, thumbSize);
  }
  
  imageMode(CENTER);
  image(selectedThumbnail.thumbnail, 0, 0, thumbSize, thumbSize);
  
  // 日付を表示
  let date = parseDate(selectedThumbnail.created);
  let weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  let formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${weekdays[date.getDay()]}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  textAlign(CENTER, TOP);
  textSize(18 * (0.7 + zoomAnim * 0.3)); // ズームに応じてテキストサイズも調整
  fill(200, 220, 255);
  text(formattedDate, 0, thumbSize/2 + 20);
  
  // 閉じるボタン
  if (zoomAnim > 0.5) { // 表示閾値を下げる
    // 閉じるボタンの背景（円形）
    let buttonSize = 40 * (0.7 + zoomAnim * 0.3); // ズームに応じてサイズ調整
    let buttonX = thumbSize/2 - 25;
    let buttonY = -thumbSize/2 + 25;
    
    // ホバー/タップ判定
    let isOver = dist(mouseX - width/2, mouseY - height/2, buttonX * scale, buttonY * scale) < buttonSize/2;
    
    // ボタンの背景
    fill(isOver ? 255 : 255, isOver ? 120 : 100, isOver ? 120 : 100, 200);
    noStroke();
    circle(buttonX, buttonY, buttonSize);
    
    // 閉じるボタンの「×」マーク
    fill(255);
    textSize(24 * (0.7 + zoomAnim * 0.3));
    textAlign(CENTER, CENTER);
    text("×", buttonX, buttonY);
    
    // タップ/クリック処理
    if (isOver && (mouseIsPressed || touches.length > 0)) {
      targetZoom = 0;
      setTimeout(() => {
        if (targetZoom === 0) selectedThumbnail = null;
      }, 300);
    }
    
    // カーソルをポインターに変更
    if (isOver) {
      cursor('pointer');
    }
  }
  pop();
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
        if (c !== selectedThumbnail && c.thumbnail) {
            c.thumbnail.remove();
            c.thumbnail = null;
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

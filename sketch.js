  let capture;
  let overlayGraphics;

  function setup() {
    createCanvas(windowWidth, windowHeight); // 全視窗畫布
    background('#656d4a'); // 設定背景顏色

    // 嘗試啟用攝影機
    try {
      capture = createCapture(VIDEO, (stream) => {
        console.log("攝影機啟用成功");
      });
      capture.size(windowWidth * 0.8, windowHeight * 0.8); // 設定影像大小為視窗的 80%
      capture.hide(); // 隱藏原始的 HTML 視訊元素

      // 建立與視訊畫面相同大小的 Graphics
      overlayGraphics = createGraphics(capture.width, capture.height);
    } catch (error) {
      console.error("無法啟用攝影機:", error);
      noLoop(); // 停止 draw() 的執行
      alert("無法啟用攝影機，請檢查設備或權限。");
    }
  }

  function draw() {
    if (!capture || !capture.loadedmetadata) return; // 如果攝影機未啟用或未準備好，跳過繪製
    background('#656d4a'); // 確保背景顏色持續更新

    // 更新 overlayGraphics
    drawGridWithCircles();

    // 翻轉畫布以水平翻轉影像
    push(); // 儲存當前繪圖狀態
    translate(width, 0); // 將原點移到畫布右上角
    scale(-1, 1); // 水平翻轉畫布

    // 繪製攝影機影像
    image(
      capture,
      (width - capture.width) / 2, // 計算影像水平居中的位置
      (height - capture.height) / 2, // 計算影像垂直居中的位置
      capture.width,
      capture.height
    );

    // 繪製 Graphics 在視訊上方
    image(
      overlayGraphics,
      (width - capture.width) / 2, // 與視訊水平對齊
      (height - capture.height) / 2, // 與視訊垂直對齊
      capture.width,
      capture.height
    );

    pop(); // 恢復繪圖狀態
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布
    if (capture) {
      capture.size(windowWidth * 0.8, windowHeight * 0.8); // 更新影像大小
      overlayGraphics = createGraphics(capture.width, capture.height); // 重新建立 Graphics
    }
  }

  function drawGridWithCircles() {
    if (!overlayGraphics || !capture) return;
    overlayGraphics.background(0); // 設定背景為黑色
    overlayGraphics.noStroke(); // 移除線條

    // 繪製網格與圓
    for (let x = 0; x < overlayGraphics.width; x += 80) {
      for (let y = 0; y < overlayGraphics.height; y += 80) {
        // 從攝影機影像中取得顏色
        let col = capture.get(x, y); // 取得對應位置的顏色
        overlayGraphics.fill(col); // 設定圓的顏色
        overlayGraphics.ellipse(x + 40, y + 40, 75, 75); // 繪製圓，中心點位於單位內
      }
    }
  }

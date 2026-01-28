const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// ================= GPU OPTIMIZATION =================
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

// ================= IMAGE HANDLING (BASE64) =================
function getBase64Image() {
  try {
    const imgPath = path.join(__dirname, 'gambar.png');
    const bitmap = fs.readFileSync(imgPath);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  } catch (e) {
    return "";
  }
}

const imageData = getBase64Image();

let mainWindow = null;
let splashWindow = null;

// ================= SPLASH HTML SOURCE =================
const splashHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #000; 
    color: #fff;
    height: 100vh; 
    width: 100vw;
    overflow: hidden;
    display: flex; 
    flex-direction: column;
  }

  /* MAIN CONTAINER - Split Layout */
  .main-container {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%);
    position: relative;
    overflow: hidden;
  }

  /* Decorative Background Effects */
  .main-container::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(79, 168, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulseGlow 4s ease-in-out infinite;
  }

  @keyframes pulseGlow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.15); opacity: 0.5; }
  }

  /* LEFT SECTION - Text Content */
  .text-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 40px 60px 60px;
    position: relative;
    z-index: 10;
    animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .logo-mark {
    width: 50px;
    height: 4px;
    background: linear-gradient(90deg, #4fa8ff, #00d4ff);
    margin-bottom: 30px;
    box-shadow: 0 0 20px rgba(79, 168, 255, 0.5);
    animation: expandWidth 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes expandWidth {
    from { width: 0; opacity: 0; }
    to { width: 50px; opacity: 1; }
  }

  h1 {
    font-size: 48px;
    font-weight: 900;
    line-height: 1.1;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    background: linear-gradient(180deg, #ffffff 0%, #b0b0b0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 10px rgba(0,0,0,0.7));
  }

  .subtitle {
    font-size: 12px;
    color: #666;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 45px;
    opacity: 0.7;
  }

  .author-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 18px;
    background: rgba(79, 168, 255, 0.08);
    border: 1px solid rgba(79, 168, 255, 0.25);
    border-radius: 30px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #4fa8ff;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
    width: fit-content;
    animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
    transition: all 0.3s ease;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .author-badge::before {
    content: '';
    width: 7px;
    height: 7px;
    background: #4fa8ff;
    border-radius: 50%;
    box-shadow: 0 0 10px #4fa8ff;
    animation: dotBlink 2s ease-in-out infinite;
  }

  @keyframes dotBlink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }

  /* RIGHT SECTION - Image Display */
  .image-section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    background: radial-gradient(circle at center, rgba(79, 168, 255, 0.04) 0%, transparent 70%);
  }

  .image-wrapper {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: floatIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
  }

  @keyframes floatIn {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .hero-image {
    max-width: 100%;
    max-height: 320px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 8px 35px rgba(79, 168, 255, 0.25));
    animation: gentleFloat 4s ease-in-out infinite;
  }

  /* Floating animation yang halus banget */
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  /* Glow effect behind image */
  .image-wrapper::before {
    content: '';
    position: absolute;
    width: 75%;
    height: 75%;
    background: radial-gradient(circle, rgba(79, 168, 255, 0.15) 0%, transparent 70%);
    filter: blur(50px);
    z-index: -1;
    animation: glowPulse 4s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.12); }
  }

  /* FOOTER & PROGRESS BAR */
  .footer {
    height: 100px;
    background: linear-gradient(180deg, #050505 0%, #000 100%);
    padding: 0 60px;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    border-top: 1px solid #1a1a1a;
    position: relative;
    z-index: 20;
  }

  .status-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    font-size: 10px;
    font-weight: 600;
    color: #555;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  #txt {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
  }

  /* Animated dot indicator */
  #txt::before {
    content: '';
    width: 5px;
    height: 5px;
    background: #4fa8ff;
    border-radius: 50%;
    box-shadow: 0 0 8px #4fa8ff;
    animation: dotPulse 1.5s ease-in-out infinite;
  }

  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.7); }
  }

  /* Animated dots untuk loading text */
  .dots {
    display: inline-block;
    width: 20px;
    text-align: left;
  }

  #pct { 
    color: #4fa8ff; 
    font-size: 15px; 
    font-weight: 800;
    letter-spacing: 0.5px;
    min-width: 45px;
    text-align: right;
  }

  .progress-track {
    width: 100%;
    height: 5px;
    background: #0a0a0a;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.6);
  }

  .progress-fill {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #0055ff 0%, #0088ff 50%, #00d4ff 100%);
    box-shadow: 
      0 0 25px rgba(0, 150, 255, 0.5),
      0 0 45px rgba(0, 150, 255, 0.2);
    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    border-radius: 10px;
  }

  /* Glow di ujung progress bar */
  .progress-fill::before {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 14px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    filter: blur(4px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .progress-fill.active::before {
    opacity: 1;
  }

  /* Shimmer effect */
  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.25) 50%, 
      transparent 100%);
    animation: shimmer 2.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  /* FADE OUT ANIMATION - Super smooth */
  .fade-out {
    opacity: 0;
    transform: scale(1.02);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
</head>
<body>
  <div class="main-container">
    <!-- LEFT: Text Content -->
    <div class="text-section">
      <div class="logo-mark"></div>
      <h1>ANY IMAGE<br>CONVERTER</h1>
      <div class="subtitle">Image Converter</div>
      <div class="author-badge">by Danishtzy24</div>
    </div>

    <!-- RIGHT: Image Display -->
    <div class="image-section">
      <div class="image-wrapper">
        <img src="${imageData}" class="hero-image" alt="App Illustration">
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="status-info">
      <span id="txt">Initializing<span class="dots"></span></span>
      <span id="pct">0%</span>
    </div>
    <div class="progress-track">
      <div id="bar-fill" class="progress-fill"></div>
    </div>
  </div>

  <script>
    const { ipcRenderer } = require('electron');
    let current = 0;
    let dotInterval;

    // Animated dots function
    function animateDots() {
      const dotsEl = document.querySelector('.dots');
      let count = 0;
      
      dotInterval = setInterval(() => {
        count = (count + 1) % 4;
        dotsEl.textContent = '.'.repeat(count);
      }, 400);
    }

    animateDots();

    ipcRenderer.on('update', (e, d) => {
      const txtEl = document.getElementById('txt');
      const barFill = document.getElementById('bar-fill');
      
      // Update text (tanpa dots karena sudah ada animasi)
      txtEl.innerHTML = d.msg + '<span class="dots"></span>';
      
      // Clear interval lama sebelum buat baru
      if (dotInterval) clearInterval(dotInterval);
      animateDots();
      
      // Update progress bar
      barFill.style.width = d.p + '%';
      
      // Tambah class active untuk glow effect di ujung
      if (d.p > 0) {
        barFill.classList.add('active');
      }
      
      // Smooth percentage counter
      const target = d.p;
      const step = () => {
        if (current < target) {
          current += Math.ceil((target - current) / 10); // Lebih smooth
          if (current > target) current = target;
          document.getElementById('pct').innerText = current + '%';
          requestAnimationFrame(step);
        }
      };
      step();
    });

    ipcRenderer.on('fade', () => {
      clearInterval(dotInterval);
      document.body.classList.add('fade-out');
    });
  </script>
</body>
</html>
`;

// ================= WINDOW CREATION =================
async function createSplash() {
  splashWindow = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    transparent: false,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false
    }
  });

  await splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashHTML)}`);
}

function update(msg, p) {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send('update', { msg, p });
  }
}

function createMain() {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'Logo.ico'),
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.center();
  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', async () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      // Trigger fade out
      splashWindow.webContents.send('fade');
      
      // Wait for fade animation
      await new Promise(r => setTimeout(r, 700));
      
      // Close splash
      splashWindow.close();
      splashWindow = null;
      
      // Small delay before showing main
      await new Promise(r => setTimeout(r, 100));
    }
    
    // Fade in main window
    mainWindow.setOpacity(0);
    mainWindow.show();
    
    // Smooth fade in
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.1;
      if (opacity >= 1) {
        mainWindow.setOpacity(1);
        clearInterval(fadeIn);
      } else {
        mainWindow.setOpacity(opacity);
      }
    }, 20);
  });
}

// ================= APP LIFECYCLE =================
app.whenReady().then(async () => {
  await createSplash();

  // Timing yang lebih natural (total ~2 detik)
  await new Promise(r => setTimeout(r, 300));
  update('Loading Graphics', 20);
  
  await new Promise(r => setTimeout(r, 500));
  update('Optimizing Engine', 55);
  
  await new Promise(r => setTimeout(r, 600));
  update('Preparing UI', 85);
  
  await new Promise(r => setTimeout(r, 400));
  update('Almost Ready', 95);
  
  await new Promise(r => setTimeout(r, 300));
  update('Launching', 100);
  
  await new Promise(r => setTimeout(r, 200));

  createMain();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplash().then(() => {
      setTimeout(() => createMain(), 2000);
    });
  }
});
/* ==========================================
   1. DATA PLAYLIST & KUTIPAN SURAT
   ========================================== */
const playlist = [
  {
    title: "Acoustic Romance",
    artist: "Sweet Instrumental",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=120&auto=format&fit=crop"
  },
  {
    title: "Dreamy Garden",
    artist: "Chill Lofi",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=120&auto=format&fit=crop"
  },
  {
    title: "Warm Embrace",
    artist: "Piano Soft Melodies",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover: "https://images.unsplash.com/photo-1494972308805-463bc619b34e?q=80&w=120&auto=format&fit=crop"
  }
];

const letterMessage = `Hai kamu yang spesial banget,\n\nBuket bunga digital ini sengaja aku bikin khusus buat kamu, biar kamu tau seberapa berharganya kamu di dunia ini.\n\nSama kayak bunga-bunga yang mekar cantik dengan caranya sendiri, kamu juga punya pesona unik yang selalu bikin hari-hari orang di sekitarmu jadi lebih berwarna.\n\nSemoga hari-harimu selalu penuh kehangatan, bahagia terus, dan senyuman manis itu gak pernah pudar, ya.\n\nMakasih banyak udah jadi orang yang luar biasa baik. Tetep bersinar ya! ✨🌸`;

/* ==========================================
   2. DEKLARASI STATE UTAMA
   ========================================== */
let currentSongIndex = 0;
let isPlaying = false;
let isGiftOpened = false;
let isLetterOpened = false;
let typingTimer = null;

// DOM Elements
const giftScreen = document.getElementById('gift-screen');
const mainContent = document.getElementById('main-content');
const openGiftBtn = document.getElementById('open-gift-btn');
const mainGiftBox = document.getElementById('main-gift-box');
const bgContainer = document.getElementById('bg-container');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const musicTitle = document.getElementById('music-title');
const musicArtist = document.getElementById('music-artist');
const albumCover = document.getElementById('album-cover');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const volumeSlider = document.getElementById('volume-slider');
const themeToggle = document.getElementById('theme-toggle');
const openLetterBtn = document.getElementById('open-letter-btn');
const letterModal = document.getElementById('letter-modal');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const typewriterContent = document.getElementById('typewriter-content');
const letterSignature = document.getElementById('letter-signature');
const closeLetterBtn = document.getElementById('close-letter-btn');
const saveMemoryBtn = document.getElementById('save-memory-btn');
const bouquetWrapper = document.getElementById('bouquet-wrapper');
const backGlow = document.getElementById('back-glow');
const toastNotif = document.getElementById('toast-notif');
const flowerPopup = document.getElementById('flower-popup');
const popupFlowerName = document.getElementById('popup-flower-name');
const popupFlowerIcon = document.getElementById('popup-flower-icon');
const popupMessage = document.getElementById('popup-message');

/* ==========================================
   3. INISIALISASI & DETEKSI TEMA
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
  loadSong(currentSongIndex);
  audioPlayer.volume = parseFloat(volumeSlider.value);

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);
  }

  generatePassiveParticles();
});

/* ==========================================
   4. ANIMASI PEMBUKA KADO
   ========================================== */
openGiftBtn.addEventListener('click', triggerGiftOpening);
mainGiftBox.addEventListener('click', triggerGiftOpening);

function triggerGiftOpening() {
  if (isGiftOpened) return;
  isGiftOpened = true;

  mainGiftBox.classList.add('opened');
  playGlowSoundEffects();
  burstPetalsAndLight();

  setTimeout(() => {
    giftScreen.style.opacity = '0';
    mainContent.style.display = 'flex';
    
    setTimeout(() => {
      mainContent.style.opacity = '1';
      bouquetWrapper.classList.add('grow-anim');
      playMusic();

      setTimeout(() => {
        bouquetWrapper.classList.remove('grow-anim');
        bouquetWrapper.classList.add('idle-anim');
      }, 5000);
    }, 50);

    setTimeout(() => {
      giftScreen.remove();
    }, 1000);
  }, 1500);
}

/* ==========================================
   5. SISTEM PEMUTAR MUSIK
   ========================================== */
function loadSong(index) {
  const song = playlist[index];
  audioPlayer.src = song.src;
  musicTitle.textContent = song.title;
  musicArtist.textContent = song.artist;
  albumCover.src = song.cover;
  progressBar.style.width = '0%';
}

function playMusic() {
  isPlaying = true;
  audioPlayer.play().then(() => {
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    albumCover.style.animationPlayState = 'running';
    albumCover.style.boxShadow = 'var(--glow-intensity)';
  }).catch(err => {
    console.log("Auto-play dicegah oleh browser: ", err);
  });
}

function pauseMusic() {
  isPlaying = false;
  audioPlayer.pause();
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  albumCover.style.animationPlayState = 'paused';
  albumCover.style.boxShadow = 'none';
}

playBtn.addEventListener('click', () => {
  if (isPlaying) { pauseMusic(); } else { playMusic(); }
});

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) playMusic();
});

nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) playMusic();
});

audioPlayer.addEventListener('timeupdate', () => {
  const { duration, currentTime } = audioPlayer;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
});

progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;
  if (duration) {
    audioPlayer.currentTime = (clickX / width) * duration;
  }
});

volumeSlider.addEventListener('input', (e) => {
  audioPlayer.volume = e.target.value;
});

audioPlayer.addEventListener('ended', () => {
  nextBtn.click();
});

/* ==========================================
   6. SISTEM LOVE LETTER
   ========================================== */
openLetterBtn.addEventListener('click', () => {
  letterModal.classList.add('open');
});

envelopeWrapper.addEventListener('click', (e) => {
  if (e.target.classList.contains('close-letter-btn')) return;
  
  if (!envelopeWrapper.classList.contains('opened')) {
    envelopeWrapper.classList.add('opened');
    setTimeout(() => {
      typewriterContent.style.display = 'block';
      startTypewriter(letterMessage);
    }, 1100);
  }
});

function startTypewriter(text) {
  typewriterContent.innerHTML = '';
  letterSignature.style.opacity = '0';
  let i = 0;
  
  if (typingTimer) clearInterval(typingTimer);

  typingTimer = setInterval(() => {
    if (i < text.length) {
      const char = text.charAt(i);
      if (char === '\n') {
        typewriterContent.innerHTML += '<br>';
      } else {
        typewriterContent.innerHTML += char;
      }
      i++;
      typewriterContent.scrollTop = typewriterContent.scrollHeight;
    } else {
      clearInterval(typingTimer);
      letterSignature.style.opacity = '1';
    }
  }, 35);
}

closeLetterBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  envelopeWrapper.classList.remove('opened');
  letterModal.classList.remove('open');
  
  setTimeout(() => {
    typewriterContent.style.display = 'none';
    typewriterContent.innerHTML = '';
    letterSignature.style.opacity = '0';
  }, 600);
});

/* ==========================================
   7. INTERAKSI BUNGA (POPUP PESAN)
   ========================================== */
function flowerClicked(flowerName, message, icon, element) {
  element.classList.remove('clicked');
  void element.offsetWidth;
  element.classList.add('clicked');

  popupFlowerIcon.textContent = icon;
  popupFlowerName.textContent = flowerName;
  popupMessage.textContent = message;

  flowerPopup.classList.add('show');

  if (window.popupTimeout) clearTimeout(window.popupTimeout);
  window.popupTimeout = setTimeout(() => {
    flowerPopup.classList.remove('show');
  }, 5000);

  const rect = element.getBoundingClientRect();
  createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.interactive-flower') && !e.target.closest('#flower-popup')) {
    flowerPopup.classList.remove('show');
  }
});

/* ==========================================
   8. FITUR SAVE MEMORY (SCREENSHOT DIGITAL)
   ========================================== */
saveMemoryBtn.addEventListener('click', () => {
  showToast("📸 Bentar ya, lagi foto buket cantiknya...", "✨");

  const captureArea = document.getElementById('capture-area');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bgToUse = isDark ? '#2D1D25' : '#FFF8F2';

  html2canvas(captureArea, {
    backgroundColor: bgToUse,
    scale: 2,
    logging: false,
    useCORS: true
  }).then(canvas => {
    const imageUri = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `Floria-Bouquet-Memory-${Date.now()}.png`;
    link.href = imageUri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Sip! Buketnya udah kesimpen di galeri kamu! 💝", "💝");
  }).catch(err => {
    console.error("Gagal menangkap gambar: ", err);
    showToast("Yah, gagal nyimpen nih. Coba lagi deh! ❌", "❌");
  });
});

function showToast(message, icon) {
  toastNotif.querySelector('#toast-icon').textContent = icon;
  toastNotif.querySelector('#toast-message').textContent = message;
  toastNotif.classList.add('show');

  setTimeout(() => {
    toastNotif.classList.remove('show');
  }, 3500);
}

/* ==========================================
   9. PENGUBAH TEMA (DARK / LIGHT MODE)
   ========================================== */
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  let newTheme = 'light';
  
  if (currentTheme !== 'dark') { newTheme = 'dark'; }

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggleIcon(newTheme);
  showToast(newTheme === 'dark' ? "Wah, taman malamnya udah aktif nih... 🌙" : "Pagi yang cerah datang lagi! ☀️", "🌙");
});

function updateThemeToggleIcon(theme) {
  if (theme === 'dark') {
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    themeToggle.style.color = '#FFD700';
  } else {
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeToggle.style.color = 'var(--title-color)';
  }
}

/* ==========================================
   10. PENGUBAH TEMA GALERI (BOUQUET COLOR SWITCH)
   ========================================== */
function changeBouquetTheme(themeName, selectedCardElement) {
  document.querySelectorAll('.gallery-card').forEach(card => card.classList.remove('active'));
  selectedCardElement.classList.add('active');

  const stop1 = document.getElementById('rose-stop-1');
  const stop2 = document.getElementById('rose-stop-2');
  const petal1 = document.getElementById('rose-petal-1');
  const petal2 = document.getElementById('rose-petal-2');
  const petal3 = document.getElementById('rose-petal-3');
  const core = document.getElementById('rose-core');

  const leftP1 = document.getElementById('rose-left-p1');
  const leftP2 = document.getElementById('rose-left-p2');
  const leftCore = document.getElementById('rose-left-core');

  const rightP1 = document.getElementById('rose-right-p1');
  const rightP2 = document.getElementById('rose-right-p2');
  const rightCore = document.getElementById('rose-right-core');

  const tulip1 = document.getElementById('tulip-stop-1');
  const tulip2 = document.getElementById('tulip-stop-2');
  const tulipLCenter = document.getElementById('tulip-l-center');
  const tulipRCenter = document.getElementById('tulip-r-center');

  const lavenderStop1 = document.getElementById('lavender-stop-1');
  const lavenderStop2 = document.getElementById('lavender-stop-2');

  const daisyPetalStop = document.getElementById('daisy-stop');

  const wrapStop = document.getElementById('wrap-stop');
  const ribbonL = document.getElementById('ribbon-l-loop');
  const ribbonR = document.getElementById('ribbon-r-loop');
  const ribbonKnot = document.getElementById('ribbon-knot');
  const ribbonTail1 = document.getElementById('ribbon-tail-1');
  const ribbonTail2 = document.getElementById('ribbon-tail-2');

  showToast(`Bentar ya, lagi ganti tema buket jadi ${themeName.toUpperCase()}...`, "🎨");

  if (themeName === 'pink') {
    stop1.setAttribute('stop-color', '#FFD1DF');
    stop2.setAttribute('stop-color', '#E89AAE');
    petal1.setAttribute('fill', '#E89AAE');
    petal2.setAttribute('fill', '#D98CA3');
    petal3.setAttribute('fill', '#F8C8DC');
    core.setAttribute('fill', '#B35F76');

    leftP1.setAttribute('fill', '#E89AAE'); leftP2.setAttribute('fill', '#F8C8DC'); leftCore.setAttribute('fill', '#B35F76');
    rightP1.setAttribute('fill', '#E89AAE'); rightP2.setAttribute('fill', '#F8C8DC'); rightCore.setAttribute('fill', '#B35F76');

    tulip1.setAttribute('stop-color', '#FFB5C5');
    tulip2.setAttribute('stop-color', '#D98CA3');
    tulipLCenter.setAttribute('fill', '#E89AAE');
    tulipRCenter.setAttribute('fill', '#E89AAE');

    lavenderStop1.setAttribute('stop-color', '#E1D5F5');
    lavenderStop2.setAttribute('stop-color', '#A594F2');
    daisyPetalStop.setAttribute('stop-color', '#FFF2F2');

    wrapStop.setAttribute('stop-color', '#FCDFEA');
    setRibbonColor('#E89AAE', '#D98CA3');

  } else if (themeName === 'white') {
    stop1.setAttribute('stop-color', '#FFFFFF');
    stop2.setAttribute('stop-color', '#E5EAD7');
    petal1.setAttribute('fill', '#EBF1E5');
    petal2.setAttribute('fill', '#D0DAC2');
    petal3.setAttribute('fill', '#F5F7F1');
    core.setAttribute('fill', '#8A9A76');

    leftP1.setAttribute('fill', '#EBF1E5'); leftP2.setAttribute('fill', '#F5F7F1'); leftCore.setAttribute('fill', '#8A9A76');
    rightP1.setAttribute('fill', '#EBF1E5'); rightP2.setAttribute('fill', '#F5F7F1'); rightCore.setAttribute('fill', '#8A9A76');

    tulip1.setAttribute('stop-color', '#FFFFFF');
    tulip2.setAttribute('stop-color', '#DFE6D5');
    tulipLCenter.setAttribute('fill', '#E5EAD7');
    tulipRCenter.setAttribute('fill', '#E5EAD7');

    lavenderStop1.setAttribute('stop-color', '#EAF0F6');
    lavenderStop2.setAttribute('stop-color', '#B6CADB');
    daisyPetalStop.setAttribute('stop-color', '#EBF1E5');

    wrapStop.setAttribute('stop-color', '#E6EDE0');
    setRibbonColor('#BACDB0', '#9BB58E');

  } else if (themeName === 'lavender') {
    stop1.setAttribute('stop-color', '#EAD5FF');
    stop2.setAttribute('stop-color', '#B088F5');
    petal1.setAttribute('fill', '#A573F4');
    petal2.setAttribute('fill', '#864AF1');
    petal3.setAttribute('fill', '#D4B8FF');
    core.setAttribute('fill', '#5D17B3');

    leftP1.setAttribute('fill', '#A573F4'); leftP2.setAttribute('fill', '#D4B8FF'); leftCore.setAttribute('fill', '#5D17B3');
    rightP1.setAttribute('fill', '#A573F4'); rightP2.setAttribute('fill', '#D4B8FF'); rightCore.setAttribute('fill', '#5D17B3');

    tulip1.setAttribute('stop-color', '#D0B3FF');
    tulip2.setAttribute('stop-color', '#9966FF');
    tulipLCenter.setAttribute('fill', '#A573F4');
    tulipRCenter.setAttribute('fill', '#A573F4');

    lavenderStop1.setAttribute('stop-color', '#FFFFFF');
    lavenderStop2.setAttribute('stop-color', '#D2C4FB');
    daisyPetalStop.setAttribute('stop-color', '#F3EBFD');

    wrapStop.setAttribute('stop-color', '#E4D5FC');
    setRibbonColor('#B088F5', '#864AF1');

  } else if (themeName === 'mixed') {
    stop1.setAttribute('stop-color', '#FFE1C6');
    stop2.setAttribute('stop-color', '#FFA07A');
    petal1.setAttribute('fill', '#FF8C66');
    petal2.setAttribute('fill', '#E26D5C');
    petal3.setAttribute('fill', '#FFD1B3');
    core.setAttribute('fill', '#BF4343');

    leftP1.setAttribute('fill', '#FF8C66'); leftP2.setAttribute('fill', '#FFD1B3'); leftCore.setAttribute('fill', '#BF4343');
    rightP1.setAttribute('fill', '#FF8C66'); rightP2.setAttribute('fill', '#FFD1B3'); rightCore.setAttribute('fill', '#BF4343');

    tulip1.setAttribute('stop-color', '#FFEAA7');
    tulip2.setAttribute('stop-color', '#FDCB6E');
    tulipLCenter.setAttribute('fill', '#FFB86C');
    tulipRCenter.setAttribute('fill', '#FFB86C');

    lavenderStop1.setAttribute('stop-color', '#E9FFDB');
    lavenderStop2.setAttribute('stop-color', '#7ED321');
    daisyPetalStop.setAttribute('stop-color', '#FFEAD1');

    wrapStop.setAttribute('stop-color', '#FFE9D6');
    setRibbonColor('#FFA07A', '#E26D5C');
  }

  function setRibbonColor(fillCol, strokeCol) {
    ribbonL.setAttribute('fill', fillCol); ribbonL.setAttribute('stroke', strokeCol);
    ribbonR.setAttribute('fill', fillCol); ribbonR.setAttribute('stroke', strokeCol);
    ribbonKnot.setAttribute('fill', strokeCol);
    ribbonTail1.setAttribute('stroke', fillCol);
    ribbonTail2.setAttribute('stroke', fillCol);
  }
}

/* ==========================================
   11. ENGINE PARTIKEL & ANIMASI HALUS
   ========================================== */
function generatePassiveParticles() {
  for (let i = 0; i < 15; i++) { createSinglePetal(); }
  for (let i = 0; i < 10; i++) { createSingleBokeh(); }
}

function createSinglePetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  
  const size = Math.random() * 15 + 10;
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.left = `${Math.random() * 100}vw`;
  
  const duration = Math.random() * 8 + 6;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${Math.random() * 5}s`;
  petal.style.opacity = Math.random() * 0.6 + 0.3;
  
  bgContainer.appendChild(petal);

  petal.addEventListener('animationiteration', () => {
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 8 + 6}s`;
  });
}

function createSingleBokeh() {
  const bokeh = document.createElement('div');
  bokeh.classList.add('bokeh');
  
  const size = Math.random() * 80 + 40;
  bokeh.style.width = `${size}px`;
  bokeh.style.height = `${size}px`;
  bokeh.style.left = `${Math.random() * 90}vw`;
  bokeh.style.top = `${Math.random() * 80 + 10}vh`;
  
  const duration = Math.random() * 10 + 10;
  bokeh.style.animationDuration = `${duration}s`;
  bokeh.style.animationDelay = `${Math.random() * 5}s`;
  
  bgContainer.appendChild(bokeh);
}

function burstPetalsAndLight() {
  const screenCenterX = window.innerWidth / 2;
  const screenCenterY = window.innerHeight / 2;

  for (let i = 0; i < 35; i++) {
    const petal = document.createElement('div');
    petal.classList.add('cursor-petal');
    petal.style.left = `${screenCenterX}px`;
    petal.style.top = `${screenCenterY}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 200 + 100;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    
    const colors = ['#F8C8DC', '#E89AAE', '#D98CA3', '#FFF8F2', '#E1D5F5'];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    bgContainer.appendChild(petal);

    petal.animate([
      { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', opacity: 0.9 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random() * 720}deg) scale(0.3)`, opacity: 0 }
    ], {
      duration: Math.random() * 1000 + 1200,
      easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
      fill: 'forwards'
    });

    setTimeout(() => { petal.remove(); }, 2200);
  }
}

function createSparkleBurst(x, y) {
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.width = `${Math.random() * 10 + 6}px`;
    sparkle.style.height = sparkle.style.width;
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = 'radial-gradient(circle, #FFFFFF 0%, rgba(248, 200, 220, 0.8) 100%)';
    sparkle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 1)';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    
    document.body.appendChild(sparkle);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 60 + 20;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    sparkle.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 }
    ], {
      duration: Math.random() * 500 + 600,
      easing: 'ease-out',
      fill: 'forwards'
    });

    setTimeout(() => { sparkle.remove(); }, 1200);
  }
}

let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrailTime > 80) {
    lastTrailTime = now;
    
    const petal = document.createElement('div');
    petal.classList.add('cursor-petal');
    petal.style.left = `${e.clientX}px`;
    petal.style.top = `${e.clientY}px`;
    
    const scale = Math.random() * 0.5 + 0.6;
    petal.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${Math.random() * 360}deg)`;
    
    bgContainer.appendChild(petal);
    
    setTimeout(() => { petal.remove(); }, 1000);
  }
});

document.addEventListener('touchmove', (e) => {
  const now = Date.now();
  if (now - lastTrailTime > 100 && e.touches.length > 0) {
    lastTrailTime = now;
    const touch = e.touches[0];
    
    const petal = document.createElement('div');
    petal.classList.add('cursor-petal');
    petal.style.left = `${touch.clientX}px`;
    petal.style.top = `${touch.clientY}px`;
    petal.style.transform = `translate(-50%, -50%) scale(0.7) rotate(${Math.random() * 360}deg)`;
    
    bgContainer.appendChild(petal);
    
    setTimeout(() => { petal.remove(); }, 1000);
  }
}, { passive: true });

/* ==========================================
   12. FALLBACK AUDIO HELPER
   ========================================== */
function playGlowSoundEffects() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (err) {}
}
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const musicBtn = document.getElementById("musicBtn");
const toTop = document.getElementById("toTop");
const audio = document.getElementById("bgMusic");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Tutup" : "Menu";
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "Menu";
  }
});

audio.volume = 0.45;
audio.muted = false;

let userPaused = false;

function setMusicState(playing) {
  musicBtn.setAttribute("aria-pressed", String(playing));
  musicBtn.classList.toggle("is-playing", playing);
  musicBtn.title = playing ? "Jeda musik" : "Putar musik";
  musicBtn.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
}

function playMusic() {
  if (userPaused) return Promise.resolve();
  audio.muted = false;
  return audio.play().then(() => {
    setMusicState(true);
  }).catch(() => {
    audio.muted = true;
    return audio.play().then(() => {
      audio.muted = false;
      setMusicState(!audio.paused);
    });
  }).catch(() => {
    setMusicState(false);
  });
}

playMusic();
window.addEventListener("load", playMusic);
audio.addEventListener("canplay", playMusic);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) playMusic();
});

const retry = window.setInterval(() => {
  if (!userPaused && audio.paused) playMusic();
}, 700);

audio.addEventListener("playing", () => {
  setMusicState(true);
  window.clearInterval(retry);
});

["pointerdown", "keydown", "touchstart", "wheel"].forEach((eventName) => {
  window.addEventListener(eventName, (event) => {
    if (event.target.closest && event.target.closest("#musicBtn")) return;
    playMusic();
  }, { passive: true });
});

musicBtn.addEventListener("click", () => {
  if (audio.paused) {
    userPaused = false;
    playMusic();
  } else {
    userPaused = true;
    audio.pause();
    setMusicState(false);
  }
});

audio.addEventListener("play", () => setMusicState(true));
audio.addEventListener("pause", () => setMusicState(false));

window.addEventListener("scroll", () => {
  toTop.hidden = window.scrollY < 320;
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const pdfModal = document.getElementById("pdfModal");
const pdfFrame = document.getElementById("pdfFrame");
const pdfTitle = document.getElementById("pdfTitle");
const pdfClose = document.getElementById("pdfClose");

function openPdf(url, title) {
  pdfTitle.textContent = title || "Sertifikat";
  pdfFrame.src = url;
  pdfModal.hidden = false;
  document.body.classList.add("modal-open");
  pdfClose.focus();
}

function closePdf() {
  pdfModal.hidden = true;
  pdfFrame.src = "";
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".js-pdf").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openPdf(link.getAttribute("href"), link.dataset.title);
  });
});

pdfClose.addEventListener("click", closePdf);

pdfModal.addEventListener("click", (event) => {
  if (event.target === pdfModal) closePdf();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !pdfModal.hidden) closePdf();
});

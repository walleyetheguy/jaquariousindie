const revealSelectors = [
  ".content-wrapper",
  ".info-panel",
  ".release",
  ".surf-bear",
  ".release-label",
  ".giant-title",
  ".song-block-text",
  ".third-col"
];

const rootStyle = document.documentElement.style;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const makeLinksOpenSeparately = () => {
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    link.target = "_blank";
    link.rel = Array.from(new Set(`${link.rel} noopener`.trim().split(/\s+/))).join(" ");
  });
};

makeLinksOpenSeparately();

if (finePointer.matches) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let cursorFrame = 0;

  const writeCursorVars = () => {
    cursorFrame = 0;
    const driftX = (cursorX - window.innerWidth / 2) * 0.035;
    const driftY = (cursorY - window.innerHeight / 2) * 0.035;

    rootStyle.setProperty("--cursor-x", `${cursorX}px`);
    rootStyle.setProperty("--cursor-y", `${cursorY}px`);
    rootStyle.setProperty("--cursor-drift-x", `${driftX}px`);
    rootStyle.setProperty("--cursor-drift-y", `${driftY}px`);
  };

  const trackCursor = (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    if (!cursorFrame) {
      cursorFrame = window.requestAnimationFrame(writeCursorVars);
    }
  };

  writeCursorVars();
  window.addEventListener("pointermove", trackCursor, { passive: true });
  window.addEventListener("pointerdown", () => document.body.classList.add("is-cursor-pressing"));
  window.addEventListener("pointerup", () => document.body.classList.remove("is-cursor-pressing"));
  window.addEventListener("pointerleave", () => document.body.classList.remove("is-cursor-pressing"));
  window.addEventListener("resize", writeCursorVars);
}

const revealElements = document.querySelectorAll(revealSelectors.join(","));

revealElements.forEach((element, index) => {
  if (!element.matches(".release, .surf-bear")) {
    element.classList.add("scroll-reveal");
  }

  element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 360)}ms`);
});

const reveal = (element) => element.classList.add("is-visible");

const revealOnScroll = () => {
  const triggerLine = window.innerHeight * 0.92;

  revealElements.forEach((element) => {
    if (element.classList.contains("is-visible")) return;

    const rect = element.getBoundingClientRect();

    if (rect.top < triggerLine && rect.bottom > -80) {
      reveal(element);
    }
  });
};

revealOnScroll();
window.addEventListener("load", revealOnScroll);
window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("resize", revealOnScroll);

const fixedName = document.querySelector(".fixed-name");

if (fixedName) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const mix = (start, end, amount) => Math.round(start + (end - start) * amount);

  const updateFixedNameContrast = () => {
    const contentSection = document.querySelector(".content-section");
    const collageSection = document.querySelector(".collage-container");
    const giantTitle = document.querySelector(".giant-title");
    const fixedTop = fixedName.getBoundingClientRect().top;
    const fixedHeight = fixedName.offsetHeight || fixedName.getBoundingClientRect().height;
    const giantTitleTop = giantTitle
      ? giantTitle.getBoundingClientRect().top + window.scrollY
      : null;
    const defaultDistance = Math.max(window.innerHeight * 1.45, 980);
    const transitionStart = contentSection
      ? contentSection.offsetTop + contentSection.offsetHeight * 0.58 - fixedTop
      : window.innerHeight * 0.75;
    const transitionEnd = collageSection
      ? collageSection.offsetTop - fixedTop - Math.min(window.innerHeight * 0.12, 120)
      : transitionStart + defaultDistance;
    const rawProgress = clamp(
      (window.scrollY - transitionStart) / Math.max(transitionEnd - transitionStart, 1),
      0,
      1
    );
    const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
    const color = mix(5, 255, progress);
    const shadow = mix(255, 0, progress);
    const accentRed = mix(255, 108, progress);
    const accentGreen = mix(78, 216, progress);
    const accentBlue = mix(216, 255, progress);
    const fadeEnd = giantTitleTop
      ? giantTitleTop - fixedTop - fixedHeight * 0.45
      : transitionEnd + window.innerHeight * 0.45;
    const fadeStart = fadeEnd - Math.max(window.innerHeight * 0.58, fixedHeight * 2.1);
    const rawFade = clamp(
      (window.scrollY - fadeStart) / Math.max(fadeEnd - fadeStart, 1),
      0,
      1
    );
    const fadeProgress = rawFade * rawFade * (3 - 2 * rawFade);
    const opacity = 1 - fadeProgress;

    fixedName.style.setProperty("--fixed-name-color", `${color} ${color} ${color}`);
    fixedName.style.setProperty("--fixed-name-shadow", `${shadow} ${shadow} ${shadow}`);
    fixedName.style.setProperty("--fixed-name-accent", `${accentRed} ${accentGreen} ${accentBlue}`);
    fixedName.style.setProperty("--fixed-name-opacity", opacity.toFixed(3));
  };

  updateFixedNameContrast();
  window.addEventListener("scroll", updateFixedNameContrast, { passive: true });
  window.addEventListener("resize", updateFixedNameContrast);
}

const platformNames = [
  "Spotify",
  "Apple Music",
  "Audiomack",
  "SoundCloud",
  "Shazam",
  "YouTube",
  "TikTok",
  "iTunes",
  "Amazon Music"
];

const songs = {
  "manipulate": {
    title: "manipulate",
    artist: "Jaquarious Indie",
    description: "A stark rock single framed by a dark, glitched-out cover of repeated figures.",
    cover: "manipulate-cover.jpg",
    audio: "audio/manipulate.mp3",
    links: {
      "Spotify": "https://open.spotify.com/track/3LVuqh1bBioPoWu9bTAGJb",
      "Apple Music": "https://music.apple.com/us/song/manipulate/1864976223",
      "Audiomack": "https://audiomack.com/jaquarious-indie/song/manipulate",
      "SoundCloud": "https://soundcloud.com/jaquariousindie/manipulate",
      "Shazam": "https://www.shazam.com/en-us/song/1864976223/manipulate",
      "YouTube": "https://music.youtube.com/playlist?list=OLAK5uy_ktPmUv63AAGy_2QpMPDArZlR2waRUoeJ4",
      "TikTok": "https://www.tiktok.com/music/manipulate-7589424694077507585",
      "iTunes": "https://music.apple.com/us/song/manipulate/1864976223",
      "Amazon Music": "https://www.amazon.com/manipulate-Jaquarious-indie/dp/B0GD2CRD5P"
    }
  },
  "hurl": {
    title: "hurl",
    artist: "Jaquarious Indie & pooterdabooter",
    description: "A rough-edged track with the strange bear-at-the-window artwork.",
    cover: "ab67616d00001e02c1e1d7ab012e745e2cb8024a.png",
    audio: "audio/hurl.wav",
    links: {
      "Spotify": "https://open.spotify.com/track/5528GqWRpAzQ1sgymgXbYy",
      "Apple Music": "https://music.apple.com/gb/album/hurl-single/6767566495",
      "Audiomack": "https://audiomack.com/jaquarious-indie/song/hurl",
      "SoundCloud": "https://soundcloud.com/jaquariousindie/hurl",
      "Shazam": "https://www.shazam.com/en-us/song/6767566496/hurl",
      "YouTube": "https://music.youtube.com/playlist?list=OLAK5uy_kPV_bLCUw20uWsZwWB5XASVkwOZpSwrfk",
      "TikTok": "https://www.tiktok.com/music/hurl-7637536463453980673",
      "iTunes": "https://music.apple.com/gb/album/hurl-single/6767566495",
      "Amazon Music": "https://music.amazon.com/albums/B0H12B3J83"
    }
  },
  "witch": {
    title: "witch",
    artist: "Jaquarious Indie",
    description: "A tense, lo-fi release with a quiet, off-center cover image.",
    cover: "ab67616d00001e021503941b177af86dbe0a7107.png",
    audio: "audio/witch.mp3",
    links: {
      "Spotify": "https://open.spotify.com/track/4XGxEAgYTKeSiDDUviTbNz",
      "Apple Music": "https://music.apple.com/us/song/witch/1889539075",
      "Audiomack": "https://audiomack.com/jaquarious-indie/song/witch",
      "SoundCloud": "https://soundcloud.com/jaquariousindie/witch",
      "Shazam": "https://www.shazam.com/song/1889539075/witch",
      "YouTube": "https://music.youtube.com/playlist?list=OLAK5uy_n4pG9MbHy8EeHJiE_XUKZ679L9hnaWIx8",
      "TikTok": "https://www.tiktok.com/music/witch-7623532124847835137",
      "iTunes": "https://music.apple.com/us/song/witch/1889539075",
      "Amazon Music": "https://www.amazon.com/witch/dp/B0GVKP95XT"
    }
  },
  "ltn": {
    title: "LTN",
    artist: "Jaquarious Indie",
    description: "One of the central Jaquarious Indie tracks, paired here with its cover art and preview.",
    cover: "artworks-Hl8M06lVMhAF-0-t500x500.png",
    audio: "audio/ltn.mp3",
    links: {
      "Spotify": "https://open.spotify.com/track/0nEJVpSS3uaTIrq8zJogio",
      "Apple Music": "https://music.apple.com/us/album/ltn-single/1873315153",
      "Audiomack": "https://audiomack.com/jaquarious-indie/song/ltn",
      "SoundCloud": "https://soundcloud.com/jaquariousindie/ltn",
      "Shazam": "https://www.shazam.com/song/1873315156/ltn",
      "YouTube": "https://music.youtube.com/watch?v=yos2_Fz_COE",
      "TikTok": "https://www.tiktok.com/music/original-sound-7603782050272889613",
      "iTunes": "https://music.apple.com/us/album/ltn-single/1873315153",
      "Amazon Music": "https://music.amazon.com/albums/B0GKPTPDLC"
    }
  },
  "i-think": {
    title: "i think",
    artist: "oftentimes & Jaquarious Indie",
    description: "The latest release highlighted on the site, released May 23, 2026.",
    cover: "images.png",
    audio: "audio/i-think.wav",
    links: {
      "Spotify": "https://open.spotify.com/track/0SzN6b1ivbWw0K5ls8WOdS",
      "Apple Music": "https://music.apple.com/gb/album/i-think-single/6771933877",
      "Audiomack": "https://audiomack.com/oftentimes-695f2c2d81d92/song/i-think-6451282",
      "SoundCloud": "https://soundcloud.com/search?q=Jaquarious%20indie",
      "Shazam": "https://www.shazam.com/artist/jaquarious-indie/1853684947",
      "YouTube": "https://www.youtube.com/watch?v=-uwacuWHD_Q",
      "TikTok": "https://www.tiktok.com/music/i-think-7642506174881105921",
      "iTunes": "https://music.apple.com/gb/album/i-think-single/6771933877",
      "Amazon Music": "https://music.amazon.com/albums/B0H2KBKQHP"
    }
  }
};

const songTriggers = document.querySelectorAll(".song-trigger[data-song-id]");
const songModal = document.querySelector("#song-modal");
const songModalPanel = document.querySelector(".song-modal__panel");
const songModalCover = document.querySelector("#song-modal-cover");
const songModalArtist = document.querySelector("#song-modal-artist");
const songModalTitle = document.querySelector("#song-modal-title");
const songModalDescription = document.querySelector("#song-modal-description");
const songModalPlatforms = document.querySelector("#song-modal-platforms");
const songModalPlayer = document.querySelector("#song-modal-player");
const songPlayerToggle = document.querySelector("#song-player-toggle");
const songPlayerBack = document.querySelector("#song-player-back");
const songPlayerForward = document.querySelector("#song-player-forward");
const songPlayerProgress = document.querySelector("#song-player-progress");
const songPlayerTime = document.querySelector("#song-player-time");
const songPlayerVolume = document.querySelector("#song-player-volume");
const welcomeAudio = document.querySelector("#welcome-audio");
const welcomeAudioButton = document.querySelector("#welcome-audio-button");
const hoverPreview = window.matchMedia("(hover: hover) and (pointer: fine)");
const previewPlayers = new Map();
const savedPreviewTimes = new Map();
const previewFadeFrames = new Map();
const forgetPreviewTimers = new Map();
const previewVolume = 0.58;
const previewFadeDuration = 160;
const previewMemoryDuration = 10000;

let activePreviewId = null;
let blockedPreviewId = null;
let lastFocusedElement = null;
let modalSongId = null;
let isSeekingModalPlayer = false;
let audioPreviewsUnlocked = false;

const getSong = (songId) => songs[songId];

const showAudioUnlockPrompt = () => {
  if (audioPreviewsUnlocked) return;

  welcomeAudio?.classList.remove("is-dismissed");
  document.body.classList.add("welcome-audio-open");
};

const hideAudioUnlockPrompt = () => {
  welcomeAudio?.classList.add("is-dismissed");
  document.body.classList.remove("welcome-audio-open");
};

if (welcomeAudio) {
  document.body.classList.add("welcome-audio-open");
  window.addEventListener("load", () => welcomeAudioButton?.focus({ preventScroll: true }));
}

const clearPreviewForgetTimer = (songId) => {
  const timer = forgetPreviewTimers.get(songId);

  if (!timer) return;

  window.clearTimeout(timer);
  forgetPreviewTimers.delete(songId);
};

const schedulePreviewForget = (songId) => {
  clearPreviewForgetTimer(songId);

  forgetPreviewTimers.set(songId, window.setTimeout(() => {
    const player = previewPlayers.get(songId);
    const modalIsUsingSong = songModal?.classList.contains("is-open") && modalSongId === songId;

    if (activePreviewId !== songId && !modalIsUsingSong && (!player || player.paused)) {
      savedPreviewTimes.set(songId, 0);
    }

    forgetPreviewTimers.delete(songId);
  }, previewMemoryDuration));
};

const savePreviewTime = (songId, time) => {
  const safeTime = Number.isFinite(time) && time > 0 ? time : 0;

  savedPreviewTimes.set(songId, safeTime);

  if (safeTime > 0) {
    schedulePreviewForget(songId);
  } else {
    clearPreviewForgetTimer(songId);
  }
};

const getSavedPreviewTime = (songId) => savedPreviewTimes.get(songId) || 0;

const cancelPreviewFade = (songId) => {
  const frame = previewFadeFrames.get(songId);

  if (!frame) return;

  window.cancelAnimationFrame(frame);
  previewFadeFrames.delete(songId);
};

const fadePreviewVolume = (songId, targetVolume, onComplete) => {
  const player = previewPlayers.get(songId);

  if (!player) return;

  cancelPreviewFade(songId);

  if (targetVolume > 0) {
    player.muted = false;
  }

  const startVolume = player.volume;
  const startedAt = performance.now();

  const step = (now) => {
    const rawProgress = Math.min((now - startedAt) / previewFadeDuration, 1);
    const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);

    player.volume = startVolume + (targetVolume - startVolume) * progress;

    if (rawProgress < 1) {
      previewFadeFrames.set(songId, window.requestAnimationFrame(step));
      return;
    }

    player.volume = targetVolume;
    previewFadeFrames.delete(songId);

    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  previewFadeFrames.set(songId, window.requestAnimationFrame(step));
};

const getPreviewPlayer = (songId) => {
  const song = getSong(songId);

  if (!song) return null;
  if (previewPlayers.has(songId)) return previewPlayers.get(songId);

  const player = new Audio(song.audio);
  player.preload = "metadata";
  player.muted = true;
  player.volume = 0;
  player.addEventListener("ended", () => {
    cancelPreviewFade(songId);
    savePreviewTime(songId, 0);

    if (activePreviewId === songId) {
      activePreviewId = null;
    }
  });

  previewPlayers.set(songId, player);
  savedPreviewTimes.set(songId, 0);

  return player;
};

const pausePreview = (songId = activePreviewId, options = {}) => {
  if (!songId) return;

  const player = previewPlayers.get(songId);

  if (!player) return;

  const { fade = true, remember = true } = options;

  const finishPause = () => {
    if (remember) {
      savePreviewTime(songId, player.ended ? 0 : player.currentTime);
    }

    player.pause();
    player.volume = 0;
    player.muted = true;

    if (activePreviewId === songId) {
      activePreviewId = null;
    }
  };

  if (fade && !player.paused && player.volume > 0) {
    fadePreviewVolume(songId, 0, finishPause);
    return;
  }

  cancelPreviewFade(songId);
  finishPause();
};

const playPreview = (songId) => {
  const player = getPreviewPlayer(songId);

  if (!player) return;

  if (!audioPreviewsUnlocked) {
    blockedPreviewId = songId;
    showAudioUnlockPrompt();
    return;
  }

  clearPreviewForgetTimer(songId);

  if (activePreviewId && activePreviewId !== songId) {
    pausePreview(activePreviewId);
  }

  const savedTime = getSavedPreviewTime(songId);

  if (player.paused && Number.isFinite(savedTime) && savedTime > 0 && !player.ended) {
    player.currentTime = savedTime;
  }

  activePreviewId = songId;
  blockedPreviewId = null;
  player.muted = true;
  player.volume = 0;

  const playAttempt = player.play();

  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt
      .then(() => fadePreviewVolume(songId, previewVolume))
      .catch(() => {
      blockedPreviewId = songId;
      pausePreview(songId, { fade: false });
    });
  } else {
    fadePreviewVolume(songId, previewVolume);
  }
};

const retryBlockedPreview = () => {
  if (!audioPreviewsUnlocked || !blockedPreviewId || !hoverPreview.matches) return;

  const hoveredTrigger = document.querySelector(`.song-trigger[data-song-id="${blockedPreviewId}"]:hover`);

  if (hoveredTrigger) {
    playPreview(blockedPreviewId);
  }
};

const unlockAudioPreviews = () => {
  if (audioPreviewsUnlocked) return;

  audioPreviewsUnlocked = true;
  hideAudioUnlockPrompt();
  retryBlockedPreview();
};

welcomeAudio?.addEventListener("pointerdown", unlockAudioPreviews, { capture: true });
welcomeAudioButton?.addEventListener("click", unlockAudioPreviews);

const setPlayerTime = (player, time) => {
  if (!player || !Number.isFinite(time) || time < 0) return;

  const applyTime = () => {
    try {
      player.currentTime = time;
    } catch {
      // Some browsers reject early seeks until metadata is ready.
    }
  };

  if (player.readyState > 0) {
    applyTime();
    return;
  }

  player.addEventListener("loadedmetadata", applyTime, { once: true });
};

const pauseAllPreviews = (handoffSongId = null) => {
  previewPlayers.forEach((player, songId) => {
    pausePreview(songId, {
      fade: false,
      remember: songId !== handoffSongId
    });
  });
};

const formatSongTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

const formatSongDuration = (seconds) => (
  Number.isFinite(seconds) && seconds > 0 ? formatSongTime(seconds) : "--:--"
);

const updateModalPlayerUi = () => {
  if (!songModalPlayer) return;

  const duration = Number.isFinite(songModalPlayer.duration) ? songModalPlayer.duration : 0;
  const currentTime = Number.isFinite(songModalPlayer.currentTime) ? songModalPlayer.currentTime : 0;

  if (songPlayerToggle) {
    const isPaused = songModalPlayer.paused || songModalPlayer.ended;
    songPlayerToggle.textContent = isPaused ? "Play" : "Pause";
    songPlayerToggle.setAttribute("aria-label", isPaused ? "Play song" : "Pause song");
  }

  if (songPlayerProgress && !isSeekingModalPlayer) {
    songPlayerProgress.max = duration > 0 ? duration.toString() : "100";
    songPlayerProgress.value = duration > 0 ? currentTime.toString() : Math.min(currentTime, 100).toString();
  }

  if (songPlayerTime) {
    songPlayerTime.textContent = `${formatSongTime(currentTime)} / ${formatSongDuration(duration)}`;
  }
};

const seekModalPlayer = (delta) => {
  if (!songModalPlayer) return;

  const duration = Number.isFinite(songModalPlayer.duration) ? songModalPlayer.duration : Infinity;
  const nextTime = Math.min(Math.max(songModalPlayer.currentTime + delta, 0), duration);

  setPlayerTime(songModalPlayer, nextTime);
  updateModalPlayerUi();
};

const toggleModalPlayer = () => {
  if (!songModalPlayer || !modalSongId) return;

  if (songModalPlayer.paused || songModalPlayer.ended) {
    const playAttempt = songModalPlayer.play();

    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => updateModalPlayerUi());
    }

    updateModalPlayerUi();
    return;
  }

  songModalPlayer.pause();
  updateModalPlayerUi();
};

const openSongModal = (songId) => {
  const song = getSong(songId);

  if (!song || !songModal) return;

  const previewPlayer = previewPlayers.get(songId);
  const handoffTime = previewPlayer && !previewPlayer.ended
    ? previewPlayer.currentTime
    : getSavedPreviewTime(songId);

  pauseAllPreviews(songId);
  clearPreviewForgetTimer(songId);

  lastFocusedElement = document.activeElement;
  modalSongId = songId;

  songModalCover.src = song.cover;
  songModalCover.alt = `Artwork for ${song.title}`;
  songModalArtist.textContent = song.artist;
  songModalTitle.textContent = song.title;
  songModalDescription.textContent = song.description;

  if (songModalPlayer) {
    songModalPlayer.src = song.audio;
    songModalPlayer.volume = songPlayerVolume
      ? Number(songPlayerVolume.value)
      : previewVolume;
    setPlayerTime(songModalPlayer, handoffTime);
    updateModalPlayerUi();

    const modalPlayAttempt = songModalPlayer.play();

    if (modalPlayAttempt && typeof modalPlayAttempt.catch === "function") {
      modalPlayAttempt
        .then(updateModalPlayerUi)
        .catch(() => {
          setPlayerTime(songModalPlayer, handoffTime);
          updateModalPlayerUi();
        });
    } else {
      updateModalPlayerUi();
    }
  }

  songModalPlatforms.replaceChildren();

  platformNames.forEach((platformName) => {
    const platformUrl = song.links?.[platformName];
    if (!platformUrl) return;

    const link = document.createElement("a");
    link.href = platformUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = platformName;
    songModalPlatforms.append(link);
  });

  songModal.classList.add("is-open");
  songModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("song-modal-open");
  songModalPanel.focus({ preventScroll: true });
};

const closeSongModal = () => {
  if (!songModal || !songModal.classList.contains("is-open")) return;

  if (songModalPlayer && modalSongId) {
    savePreviewTime(modalSongId, songModalPlayer.ended ? 0 : songModalPlayer.currentTime);
    songModalPlayer.pause();
  }

  songModal.classList.remove("is-open");
  songModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("song-modal-open");
  modalSongId = null;

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus({ preventScroll: true });
  }
};

if (songModalPlayer) {
  songModalPlayer.controls = false;

  songModalPlayer.addEventListener("loadedmetadata", updateModalPlayerUi);
  songModalPlayer.addEventListener("timeupdate", updateModalPlayerUi);
  songModalPlayer.addEventListener("play", updateModalPlayerUi);
  songModalPlayer.addEventListener("pause", () => {
    updateModalPlayerUi();

    if (!modalSongId || songModalPlayer.ended) return;

    savePreviewTime(modalSongId, songModalPlayer.currentTime);
  });

  songModalPlayer.addEventListener("ended", () => {
    updateModalPlayerUi();

    if (!modalSongId) return;

    savePreviewTime(modalSongId, 0);
  });
}

if (songPlayerToggle) {
  songPlayerToggle.addEventListener("click", toggleModalPlayer);
}

if (songPlayerBack) {
  songPlayerBack.addEventListener("click", () => seekModalPlayer(-10));
}

if (songPlayerForward) {
  songPlayerForward.addEventListener("click", () => seekModalPlayer(10));
}

if (songPlayerProgress && songModalPlayer) {
  songPlayerProgress.addEventListener("pointerdown", () => {
    isSeekingModalPlayer = true;
  });

  songPlayerProgress.addEventListener("pointerup", () => {
    isSeekingModalPlayer = false;
    updateModalPlayerUi();
  });

  songPlayerProgress.addEventListener("input", () => {
    setPlayerTime(songModalPlayer, Number(songPlayerProgress.value));

    if (songPlayerTime) {
      const duration = Number.isFinite(songModalPlayer.duration) ? songModalPlayer.duration : 0;
      songPlayerTime.textContent = `${formatSongTime(Number(songPlayerProgress.value))} / ${formatSongDuration(duration)}`;
    }
  });
}

if (songPlayerVolume && songModalPlayer) {
  songPlayerVolume.addEventListener("input", () => {
    songModalPlayer.volume = Number(songPlayerVolume.value);
  });
}

songTriggers.forEach((trigger) => {
  const songId = trigger.dataset.songId;

  if (!getSong(songId)) return;

  trigger.addEventListener("click", () => openSongModal(songId));
  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openSongModal(songId);
  });
});

if (hoverPreview.matches) {
  document.addEventListener("pointerover", (event) => {
    const trigger = event.target.closest?.(".song-trigger[data-song-id]");

    if (!trigger || trigger.contains(event.relatedTarget)) return;

    playPreview(trigger.dataset.songId);
  });

  document.addEventListener("pointerout", (event) => {
    const trigger = event.target.closest?.(".song-trigger[data-song-id]");

    if (!trigger || trigger.contains(event.relatedTarget)) return;

    pausePreview(trigger.dataset.songId);
  });
}

document.querySelectorAll("[data-song-modal-close]").forEach((closeTarget) => {
  closeTarget.addEventListener("click", closeSongModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSongModal();
  }
});

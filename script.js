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
    const fixedTop = fixedName.getBoundingClientRect().top;
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

    fixedName.style.setProperty("--fixed-name-color", `${color} ${color} ${color}`);
    fixedName.style.setProperty("--fixed-name-shadow", `${shadow} ${shadow} ${shadow}`);
    fixedName.style.setProperty("--fixed-name-accent", `${accentRed} ${accentGreen} ${accentBlue}`);
  };

  updateFixedNameContrast();
  window.addEventListener("scroll", updateFixedNameContrast, { passive: true });
  window.addEventListener("resize", updateFixedNameContrast);
}

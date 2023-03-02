 const SCRIPT_DEBUG = false

  /* VIDEO */

  const videoContainer = document.querySelector("[data-brandsync-video]");

  videoContainer.setAttribute(
    "x-data",
    JSON.stringify({ scroll: 0, muted: true, fit: null })
  );
  videoContainer.setAttribute(
    "x-init",
    `() => {
      scroll = window.scrollY

      const calculateFit = () => {
        fit = window.innerWidth / window.innerHeight > 16/9
          ? 'horizontal'
          : 'vertical'
      }

      calculateFit()
      window.addEventListener('resize', calculateFit)
    }`
  );
  videoContainer.setAttribute("x-on:scroll.window", `scroll = window.scrollY`);
  videoContainer.setAttribute(
    "x-effect",
    `() => {
      if (scroll > 200 && scroll <= 550 && $refs.video.paused) {
        $refs.video.play()
      }

      if (scroll > 550) {
        $refs.video.pause()
      }
    }`
  );

  const video = document.createElement("video");
  video.src = videoContainer.getAttribute("data-brandsync-video");
  // For testing, because the BrandSync video is broken:
  // video.src =
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  video.muted = true;
  video.setAttribute("x-ref", "video");
  video.setAttribute(
    ":style",
    `fit === 'vertical' ? {
      height: '20vh',
      transform: \`
        scale(\${Math.min(scroll / 100 + 1, 5)})
        translateX(\${
          Math.min(
            scroll,
            ((window.innerHeight * 16) / 9 - window.innerWidth) / 2
          ) / 5
        }px)
        translateY(-\${
          scroll > 500 ? Math.min(scroll - 500, window.innerHeight) : 0
        }px)
      \`
    } : {
      width: '20vw',
      transform: \`
        scale(\${Math.min(scroll / 100 + 1, 5)})
        translateY(\${(() => {
          let value =
            Math.min(
              scroll,
              ((window.innerWidth * 9) / 16 - window.innerHeight) / 2
            ) / 5;
          if (scroll > 500) {
            value -= Math.min(scroll - 500, window.innerHeight);
          }
          return value;
        })()}px)
      \`
    }`
  );
  video.style =
    "position: fixed;bottom: 0;right: 0;transform-origin: bottom right; z-index: 50;";
  videoContainer.appendChild(video);

  const videoButtons = document.createElement("div");
  videoButtons.style =
    "position: fixed; top: 7rem; right: 1rem; z-index: 1000; display: flex; column-gap: 1rem;";
  videoButtons.innerHTML = `
  <button
    style="appearance: none; border: none; background-color: black; color: white; padding: 0.75rem; border-radius: 99rem;"
    @click="$refs.video.muted = !muted; muted = !muted"
    x-show="scroll >= 400 && scroll <= 550"
    x-transition
  >
    <div x-show="!muted">
      <svg style="display: block; height: 1.5rem; width: 1.5rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    </div>
    <div x-show="muted">
      <svg style="display: block; height: 1.5rem; width: 1.5rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    </div>
  </button>
  <button
    style="appearance: none; border: none; background-color: black; color: white; padding: 0.75rem; border-radius: 99rem;"
    @click="$refs.video.currentTime = 0"
    x-show="scroll >= 400 && scroll <= 550"
    x-transition
  >
    <svg style="display: block; height: 1.5rem; width: 1.5rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  </button>`;
  videoContainer.appendChild(videoButtons);

  /* CURSOR */

  const cursorTextArray = Array.from(
    document.querySelectorAll("[data-brandsync-cursor-text]")
  ).map((el) => ({
    baseElement: el,
    overlayElement: null,
    strategy: el.classList.contains("thanks-panel_text") ? "overlay" : "inline",
  }));

  for (const entry of cursorTextArray) {
    const duplicatedCursorText = entry.baseElement.cloneNode(true);
    duplicatedCursorText.style =
      "opacity: 0; transition: opacity 0.25s; color: transparent; background-clip: text; -webkit-background-clip: text; background-position: center; background-size: cover;";
    duplicatedCursorText.style.backgroundImage = `url(https://uploads-ssl.webflow.com/63ff44e96d759d26652026db/6400d8c47173b76f976646bb_BrandSync_Blend.png)`;
    entry.overlayElement = duplicatedCursorText;

    if (entry.strategy === "overlay") {
      document.body.appendChild(duplicatedCursorText);
      duplicatedCursorText.style.position = "fixed";
      duplicatedCursorText.style.zIndex = 999;
    } else {
      entry.baseElement.parentElement.appendChild(duplicatedCursorText)
      entry.baseElement.parentElement.style.position = "relative"
      duplicatedCursorText.style.position = "absolute";
      duplicatedCursorText.style.inset = 0;
      duplicatedCursorText.style.filter = "invert(1)";
    }
  }

  const cursor = document.createElement("div");
  cursor.style =
    "position: fixed; display: none; z-index: 998; mix-blend-mode: difference;";
  const cursorBall = document.createElement("div");
  cursorBall.style =
    "height: 1rem; width: 1rem; background-color: white; border-radius: 99rem; transition: transform 200ms;";
  cursor.appendChild(cursorBall);
  document.body.appendChild(cursor);

  const noCursorZones = ["#personas"];

  let cursorX = 0;
  let cursorY = 0;
  let cursorOnPage = false;
  let mouseDown = false;

  document.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursorOnPage = true;
    update();
  });

  document.addEventListener("mouseleave", () => {
    cursorOnPage = false;
  });

  document.addEventListener("mousedown", () => {
    mouseDown = true;
  });

  document.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  const canHover = window.matchMedia('(hover: hover)').matches

  function update() {
    const overlappingNoCursorZone = noCursorZones.some(selector => {
      const el = document.querySelector(selector);
      const bounds = el.getBoundingClientRect();
      return cursorX > bounds.left &&
        cursorX < bounds.right &&
        cursorY > bounds.top &&
        cursorY < bounds.bottom;
    });

    if (overlappingNoCursorZone || !canHover) {
      cursor.style.display = "none";
      document.body.style.cursor = "";
      return;
    }

    // Disable real cursor to allow for custom cursor.
    document.body.style.cursor = "none";

    if (cursorOnPage) {
      cursor.style.display = "block";
    } else {
      cursor.style.display = "none";
    }

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    let overlapping = false;

    for (let entry of cursorTextArray) {
      const textBounds = entry.baseElement.getBoundingClientRect();

      if (entry.strategy === "overlay") {
        entry.overlayElement.style.top = `${textBounds.top}px`;
        entry.overlayElement.style.left = `${textBounds.left}px`;
      }

      entry.overlayElement.style.marginTop = 0;
      const computedStyle = getComputedStyle(entry.baseElement);
      entry.overlayElement.style.width = computedStyle.width;
      entry.overlayElement.style.fontSize = computedStyle.fontSize;
      entry.overlayElement.style.textAlign = computedStyle.textAlign;
      entry.overlayElement.style.transform = computedStyle.transform;

      const thisElementOverlapping =
        cursorX > textBounds.left &&
        cursorX < textBounds.right &&
        cursorY > textBounds.top &&
        cursorY < textBounds.bottom;

      if (thisElementOverlapping) {
        overlapping = true;
      }
    }

    const smallScreen = window.innerWidth < 479;

    let scale = 1;
    if (overlapping && !smallScreen) scale *= 12;
    if (mouseDown && !overlapping) scale *= 0.75;
    cursorBall.style.transform = `scale(${scale})`;

    for (const { baseElement, overlayElement } of cursorTextArray) {
      const textBounds = baseElement.getBoundingClientRect();

      if (overlapping && cursorOnPage && !smallScreen) {
        overlayElement.style.opacity = 1;
      } else if (!SCRIPT_DEBUG) {
        overlayElement.style.opacity = 0;
      }

      if (!SCRIPT_DEBUG) {
        overlayElement.style.clipPath = `circle(${overlapping ? `6rem` : "1rem"
          } at calc(${cursorX - textBounds.left}px + 0.5rem) calc(${cursorY - textBounds.top
          }px + 0.5rem)`;
      }
    }

    requestAnimationFrame(update);
  }

  update();

  /* FIX PERSONA ANIMATION */

  window.addEventListener("pageshow", () => {
    document.querySelectorAll('.personas_link .personas_image-wrapper').forEach(el => {
      console.log(el)
      gsap.to(el, {
        scale: 1,
        y: 0
      })
    })
  })

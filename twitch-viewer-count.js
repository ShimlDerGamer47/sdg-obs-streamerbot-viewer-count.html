document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search);

  let viewerNumberParam = params.get("viewerNumber");
  let viewerNumber =
    viewerNumberParam != null ? String(viewerNumberParam) : null;

  const delay = Number.isFinite(parseInt(params.get("delay"), 10))
    ? parseInt(params.get("delay"), 10)
    : 5000;

  const initialDelay = Number.isFinite(parseInt(params.get("initialDelay"), 10))
    ? parseInt(params.get("initialDelay"), 10)
    : 500;

  const fontFamilyVar = "--font-family-var";
  const robotoBold = getComputedStyle(html)
    .getPropertyValue(fontFamilyVar)
    .trim();

  const rootBackgroundColorVar = "--background-color-var";
  const cssBackgroundColor = getComputedStyle(html)
    .getPropertyValue(rootBackgroundColorVar)
    .trim();

  const rootBorderVar = "--border-var";
  const cssBorder = getComputedStyle(html)
    .getPropertyValue(rootBorderVar)
    .trim();

  const rootBorderColorVar = "--border-color-var";
  const cssBorderColor = getComputedStyle(html)
    .getPropertyValue(rootBorderColorVar)
    .trim();

  const body = document.body;
  const mainDiv = document.getElementById("mainContainerId");
  const subDiv = document.getElementById("subContainerId");
  const twitchLogoImgDiv = document.getElementById("twitchLogoImgContainerId");
  const twitchImgLogo = document.getElementById("twitchImgLogoId");
  const twitchViewerCountDiv = document.getElementById(
    "twitchViewerCountContainerId"
  );
  const twitchViewerCountHone = document.getElementById("twitchViewerCountId");

  if (
    !mainDiv ||
    !subDiv ||
    !twitchLogoImgDiv ||
    !twitchImgLogo ||
    !twitchViewerCountDiv ||
    !twitchViewerCountHone
  ) {
    console.error(
      "Required DOM elements missing. Aborting viewer count script."
    );
    return;
  }

  function htmlSecurityToken() {
    const elementArray = [
      mainDiv,
      twitchLogoImgDiv,
      twitchImgLogo,
      twitchViewerCountDiv,
      twitchViewerCountHone,
    ];

    const eventArray = ["copy", "dragstart", "keydown", "select"];

    const dataStyle = {
      fontFamily: robotoBold,
      border: cssBorder || `1px solid ${cssBorderColor}`,
      WebkitUserSelect: "none",
      userSelect: "none",
      cursor: "default",
      pointerEvents: "none",
    };

    elementArray.forEach((element) => {
      if (!element) return;

      eventArray.forEach((event) => {
        if (!event) return;
        element.addEventListener(event, (e) => e.preventDefault());
      });

      Object.assign(element.style, dataStyle);
    });

    const changeDataStyle = {
      fontFamily: robotoBold,
      WebkitUserSelect: "none",
      userSelect: "none",
      cursor: "default",
      pointerEvents: "none",
    };

    eventArray.forEach((event) => {
      if (!event) return;
      subDiv.addEventListener(event, (e) => e.preventDefault());
    });

    Object.assign(subDiv.style, changeDataStyle);
  }
  htmlSecurityToken();

  function debounce(fn, wait = 80) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function getBaseFontSizePx(el) {
    const fs = getComputedStyle(el).fontSize;
    const n = parseFloat(fs);
    return Number.isFinite(n) ? n : 50;
  }

  function copyImportantTextStyles(sourceEl, targetEl) {
    const cs = getComputedStyle(sourceEl);
    targetEl.style.fontFamily = cs.fontFamily;
    targetEl.style.fontWeight = cs.fontWeight;
    targetEl.style.letterSpacing = cs.letterSpacing;
    targetEl.style.whiteSpace = "normal";
    targetEl.style.lineHeight = cs.lineHeight;
    targetEl.style.textTransform = cs.textTransform;
    targetEl.style.padding = "0";
    targetEl.style.margin = "0";
    targetEl.style.boxSizing = "border-box";
  }

  function adjustFontSizeToFit() {
    try {
      if (!twitchViewerCountHone || !twitchViewerCountDiv) return;

      const baseFontSize = getBaseFontSizePx(twitchViewerCountHone);
      const meas = document.createElement("div");
      meas.innerHTML = twitchViewerCountHone.innerHTML || "";
      copyImportantTextStyles(twitchViewerCountHone, meas);

      meas.style.position = "absolute";
      meas.style.visibility = "hidden";
      meas.style.left = "-9999px";
      meas.style.top = "-9999px";
      meas.style.width = "auto";
      meas.style.height = "auto";
      meas.style.whiteSpace = "normal";
      meas.style.display = "inline-block";
      meas.style.fontSize = `${baseFontSize}px`;

      document.body.appendChild(meas);

      const containerWidth =
        twitchViewerCountDiv.clientWidth ||
        twitchViewerCountDiv.offsetWidth ||
        350;
      const containerHeight =
        twitchViewerCountDiv.clientHeight ||
        twitchViewerCountDiv.offsetHeight ||
        150;

      const measuredWidth = meas.scrollWidth;
      meas.style.width = `${containerWidth}px`;
      const measuredHeight = meas.scrollHeight;

      const scaleX = measuredWidth > 0 ? containerWidth / measuredWidth : 1;
      const scaleY = measuredHeight > 0 ? containerHeight / measuredHeight : 1;
      const scale = Math.min(scaleX, scaleY, 1);

      const finalFontSize = Math.max(8, Math.floor(baseFontSize * scale));

      twitchViewerCountHone.style.fontSize = `${finalFontSize}px`;
      twitchViewerCountHone.style.lineHeight = "1.05";

      document.body.removeChild(meas);
    } catch (e) {
      console.warn("adjustFontSizeToFit failed:", e);
    }
  }

  const adjustFontSizeToFitDebounced = debounce(adjustFontSizeToFit, 80);

  if (window.ResizeObserver) {
    try {
      const ro = new ResizeObserver(adjustFontSizeToFitDebounced);
      ro.observe(twitchViewerCountDiv);
      ro.observe(subDiv);
    } catch (e) {
      window.addEventListener("resize", adjustFontSizeToFitDebounced);
    }
  } else {
    window.addEventListener("resize", adjustFontSizeToFitDebounced);
  }

  (function bodyMorePropertyToken() {
    const eventArray = ["copy", "dragstart", "keydown", "select"];

    eventArray.forEach((event) =>
      body.addEventListener(event, (e) => e.preventDefault())
    );

    const dataStyle = {
      fontFamily: robotoBold,
      background: cssBackgroundColor,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      margin: "0",
      WebkitUserSelect: "none",
      userSelect: "none",
      cursor: "default",
      pointerEvents: "none",
    };

    Object.assign(body.style, dataStyle);
  })();

  [subDiv, twitchLogoImgDiv, twitchViewerCountDiv].forEach((el) => {
    el.style.visibility = "hidden";
    el.style.opacity = 0;
    el.style.pointerEvents = "none";
  });

  let animationRunning = false;

  function animateElement(el, keyframes, options) {
    return new Promise((resolve) => {
      try {
        const anim = el.animate(keyframes, options);
        anim.onfinish = () => {
          if (options && options.fill === "forwards" && keyframes.length > 0) {
            const last = keyframes[keyframes.length - 1];
            Object.assign(el.style, last);
          }
          resolve();
        };

        setTimeout(
          () => resolve(),
          options && options.duration ? options.duration + 40 : 300
        );
      } catch (e) {
        if (keyframes && keyframes.length) {
          const last = keyframes[keyframes.length - 1];
          try {
            Object.assign(el.style, last);
          } catch (__) {}
        }
        setTimeout(resolve, 40);
      }
    });
  }

  async function runAnimationSequence() {
    if (animationRunning) return;
    animationRunning = true;

    try {
      adjustFontSizeToFit();
      await new Promise((r) => requestAnimationFrame(() => r()));

      subDiv.style.visibility = "visible";
      await animateElement(
        subDiv,
        [
          {
            opacity: 0,
            transform: "scale(0.985) translateY(8px)",
            filter: "blur(3px)",
          },
          {
            opacity: 1,
            transform: "scale(1) translateY(0)",
            filter: "blur(0px)",
          },
        ],
        { duration: 750, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      );

      twitchLogoImgDiv.style.visibility = "visible";
      await animateElement(twitchLogoImgDiv, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 750,
        easing: "cubic-bezier(.2,.9,.2,1)",
        fill: "forwards",
      });

      twitchViewerCountDiv.style.visibility = "visible";
      await animateElement(
        twitchViewerCountDiv,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 750, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      );

      await new Promise((r) => setTimeout(r, Math.max(0, delay)));

      await animateElement(
        twitchViewerCountDiv,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 750, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      );
      twitchViewerCountDiv.style.visibility = "hidden";

      await animateElement(twitchLogoImgDiv, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 750,
        easing: "cubic-bezier(.2,.9,.2,1)",
        fill: "forwards",
      });
      twitchLogoImgDiv.style.visibility = "hidden";

      await animateElement(
        subDiv,
        [
          {
            opacity: 1,
            transform: "scale(1) translateY(0)",
            filter: "blur(0px)",
          },
          {
            opacity: 0,
            transform: "scale(0.985) translateY(8px)",
            filter: "blur(3px)",
          },
        ],
        { duration: 750, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      );
      subDiv.style.visibility = "hidden";
    } catch (e) {
      console.warn("Animation sequence failed:", e);
      try {
        [twitchViewerCountDiv, twitchLogoImgDiv, subDiv].forEach((el) => {
          el.style.visibility = "hidden";
          el.style.opacity = 0;
          el.style.animation = "none";
          el.style.transition = "none";
        });
      } catch {}
    } finally {
      animationRunning = false;
    }
  }

  function setViewerText(value) {
    const str = value == null ? "" : String(value);
    twitchViewerCountHone.textContent = "";

    twitchViewerCountHone.appendChild(document.createTextNode("Viewer:"));
    twitchViewerCountHone.appendChild(document.createElement("br"));
    twitchViewerCountHone.appendChild(document.createTextNode(str));
    twitchViewerCountHone.classList.add("text-underline");

    adjustFontSizeToFitDebounced();
  }

  async function updateViewerNumber(num) {
    if (num == null) return;

    const safe = typeof num === "number" ? Math.floor(num) : String(num);
    viewerNumber = String(safe);

    setViewerText(viewerNumber);

    setTimeout(() => {
      runAnimationSequence().catch((e) => console.warn(e));
    }, Math.max(0, initialDelay));
  }

  window.updateViewerNumber = updateViewerNumber;

  if (viewerNumber != null) {
    updateViewerNumber(viewerNumber);
  } else {
    twitchViewerCountHone.textContent = "";
    twitchViewerCountHone.classList.remove("text-underline");
  }
});

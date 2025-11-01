document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search);

  let viewerNumber = params.get("viewerNumber");
  const delay = parseInt(params.get("delay"), 10) || 2000;

  let client;
  try {
    client = new StreamerbotClient({
      host: "127.0.0.1",
      port: 8080,
      endpoint: "/",
      subscribe: {},
    });
  } catch (error) {
    console.log("Streamer.bot nicht verbunden:", error);
  }

  const fontFamilyVar = "--font-family-var";
  const robotoBold = getComputedStyle(html)
    .getPropertyValue(fontFamilyVar)
    .trim();

  const rootBackgroundColorVar = "--background-color-var";
  const cssBackgroundColor = getComputedStyle(html)
    .getPropertyValue(rootBackgroundColorVar)
    .trim();

  const rootBorderColorVar = "--border-color-var";
  const cssBorderColor = getComputedStyle(html)
    .getPropertyValue(rootBorderColorVar)
    .trim();

  const rootBorderVar = "--border-var";
  const cssBorder = getComputedStyle(html)
    .getPropertyValue(rootBorderVar)
    .trim();

  const body = document.body;

  const timer = 750;
  const animationFadeIn = `fade-in ${timer}ms cubic-bezier(.2,.9,.2,1) forwards`;
  const animationFadeOut = `fade-out ${timer}ms cubic-bezier(.2,.9,.2,1) forwards`;
  const transitionProperty = `animation ${timer}ms cubic-bezier(.2,.9,.2,1), visibility ${timer}ms cubic-bezier(.2,.9,.2,1), opacity ${timer}ms cubic-bezier(.2,.9,.2,1)`;
  const hidden = "hidden";
  const visible = "visible";
  const zeroNumber = 0;
  const oneNumber = 1;
  const none = "none";

  const initialDelayParam = parseInt(params.get("initialDelay"), 10);
  const initialDelay = Number.isFinite(initialDelayParam)
    ? initialDelayParam
    : 500;

  function bodyMorePropertyToken() {
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
  }
  bodyMorePropertyToken();

  const $ = (id) => document.getElementById(id);

  const mainDiv = $("mainContainerId");
  const subDiv = $("subContainerId");
  const twitchLogoImgDiv = $("twitchLogoImgContainerId");
  const twitchImgLogo = $("twitchImgLogoId");
  const twitchViewerCountDiv = $("twitchViewerCountContainerId");
  const twitchViewerCountHone = $("twitchViewerCountId");

  twitchViewerCountHone.innerText = "";
  twitchViewerCountHone.classList.remove("text-underline");

  [subDiv, twitchLogoImgDiv, twitchViewerCountDiv].forEach((el) => {
    if (!el) return;
    el.style.visibility = hidden;
    el.style.opacity = zeroNumber;
    el.style.animation = none;
    el.style.transition = none;
  });

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
  }

  const adjustFontSizeToFitDebounced = debounce(adjustFontSizeToFit, 80);

  if (window.ResizeObserver && twitchViewerCountDiv) {
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

  let animationStarted = false;
  function startAnimationSequence() {
    if (animationStarted) return;
    animationStarted = true;

    setTimeout(() => {
      twitchViewerNumberTextToken();

      adjustFontSizeToFit();

      subDiv.style.visibility = visible;
      subDiv.style.opacity = oneNumber;
      subDiv.style.animation = none;
      subDiv.style.transition = transitionProperty;

      twitchLogoImgDiv.style.visibility = hidden;
      twitchLogoImgDiv.style.opacity = zeroNumber;
      twitchLogoImgDiv.style.animation = none;
      twitchLogoImgDiv.style.transition = transitionProperty;

      twitchViewerCountDiv.style.visibility = hidden;
      twitchViewerCountDiv.style.opacity = zeroNumber;
      twitchViewerCountDiv.style.animation = none;
      twitchViewerCountDiv.style.transition = transitionProperty;

      let animationPhase = 0;

      function onLogoEnd(e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();

        if (animationPhase === 1) {
          adjustFontSizeToFit();

          twitchViewerCountDiv.style.visibility = visible;
          twitchViewerCountDiv.style.opacity = oneNumber;
          twitchViewerCountDiv.style.animation = animationFadeIn;
          twitchViewerCountDiv.style.transition = transitionProperty;

          animationPhase = 2;
        } else if (animationPhase === 4) {
          animationPhase = 5;

          animateSubOut();
        }
      }

      function onViewerEnd(e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();

        if (animationPhase === 2) {
          setTimeout(() => {
            twitchViewerCountDiv.style.opacity = zeroNumber;
            twitchViewerCountDiv.style.animation = animationFadeOut;
            twitchViewerCountDiv.style.transition = transitionProperty;
            animationPhase = 3;
          }, delay);
        } else if (animationPhase === 3) {
          twitchViewerCountDiv.style.visibility = hidden;
          twitchViewerCountDiv.style.opacity = zeroNumber;
          twitchViewerCountDiv.style.animation = none;
          twitchViewerCountDiv.style.transition = none;

          twitchLogoImgDiv.style.opacity = zeroNumber;
          twitchLogoImgDiv.style.animation = animationFadeOut;
          twitchLogoImgDiv.style.transition = transitionProperty;
          animationPhase = 4;
        }
      }

      function removeLogoViewerListeners() {
        try {
          twitchLogoImgDiv.removeEventListener("animationend", onLogoEnd);
          twitchViewerCountDiv.removeEventListener("animationend", onViewerEnd);
        } catch (e) {}
      }

      function animateSubIn() {
        const anim = subDiv.animate(
          [
            {
              opacity: 0,
              transform: "scale(0.985) translateY(8px)",
              filter: "blur(3px)",
              offset: 0,
            },
            {
              opacity: 1,
              transform: "scale(1) translateY(0)",
              filter: "blur(0px)",
              offset: 1,
            },
          ],
          {
            duration: timer,
            easing: "cubic-bezier(.2,.9,.2,1)",
            fill: "forwards",
          }
        );

        anim.onfinish = () => {
          animationPhase = 1;

          twitchLogoImgDiv.style.visibility = visible;
          twitchLogoImgDiv.style.opacity = oneNumber;
          twitchLogoImgDiv.style.animation = animationFadeIn;
          twitchLogoImgDiv.style.transition = transitionProperty;
        };
      }

      function animateSubOut() {
        const anim = subDiv.animate(
          [
            {
              opacity: 1,
              transform: "scale(1) translateY(0)",
              filter: "blur(0px)",
              offset: 0,
            },
            {
              opacity: 0,
              transform: "scale(0.985) translateY(8px)",
              filter: "blur(3px)",
              offset: 1,
            },
          ],
          {
            duration: timer,
            easing: "cubic-bezier(.2,.9,.2,1)",
            fill: "forwards",
          }
        );

        anim.onfinish = () => {
          subDiv.style.visibility = hidden;
          subDiv.style.opacity = zeroNumber;
          subDiv.style.animation = none;
          subDiv.style.transition = none;

          removeLogoViewerListeners();
          animationStarted = false;
        };
      }

      twitchLogoImgDiv.addEventListener("animationend", onLogoEnd);
      twitchViewerCountDiv.addEventListener("animationend", onViewerEnd);

      [twitchLogoImgDiv, twitchViewerCountDiv].forEach((el) => {
        el.addEventListener("animationcancel", (ev) => {
          ev.preventDefault();
          el.style.visibility = visible;
          el.style.opacity = oneNumber;
          el.style.animation = none;
          el.style.transition = none;
        });
      });

      animationPhase = 0;
      animateSubIn();
    }, initialDelay);
  }

  function twitchViewerNumberTextToken() {
    if (viewerNumber) {
      twitchViewerCountHone.textContent = "Viewer:";
      twitchViewerCountHone.appendChild(document.createElement("br"));
      twitchViewerCountHone.appendChild(
        document.createTextNode(String(viewerNumber))
      );
      twitchViewerCountHone.classList.add("text-underline");
      adjustFontSizeToFitDebounced();
    }
  }

  function htmlElementsSecurityToken() {
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

    const changeDataStyle = {
      fontFamily: robotoBold,
      border: "2px solid rgb(0, 0, 0)",
      WebkitUserSelect: "none",
      userSelect: "none",
      cursor: "default",
      pointerEvents: "none",
    };

    elementArray.forEach((element) => {
      if (!element) return;
      eventArray.forEach((event) =>
        element.addEventListener(event, (e) => e.preventDefault())
      );
      if (dataStyle) Object.assign(element.style, dataStyle);
    });

    eventArray.forEach((event) =>
      subDiv.addEventListener(event, (e) => e.preventDefault())
    );
    if (changeDataStyle) Object.assign(subDiv.style, changeDataStyle);
  }

  window.updateViewerNumber = function (num) {
    if (num == null) return;

    viewerNumber = String(num);
    twitchViewerNumberTextToken();
    startAnimationSequence();
  };

  function findViewerNumberInObject(obj) {
    if (!obj || typeof obj !== "object") return null;
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v == null) continue;
      if (
        /viewer|viewers|viewerCount|viewerNumber|views/i.test(k) &&
        (typeof v === "number" || /^\d+$/.test(String(v)))
      ) {
        return Number(v);
      }
      if (typeof v === "object") {
        const res = findViewerNumberInObject(v);
        if (res != null) return res;
      }
    }
    return null;
  }

  if (client && typeof client.on === "function") {
    try {
      client.on("*", (data) => {
        try {
          const maybe =
            findViewerNumberInObject(data) ||
            findViewerNumberInObject(data?.payload) ||
            findViewerNumberInObject(data?.data);
          if (maybe != null) {
            window.updateViewerNumber(maybe);
          }
        } catch (err) {
          console.error(
            "Fehler beim Auswerten eines Streamer.bot Events:",
            err
          );
        }
      });
    } catch (err) {
      console.warn("Fehler beim Registrieren des Streamer.bot Listeners:", err);
    }
  }

  twitchViewerNumberTextToken();
  htmlElementsSecurityToken();

  if (viewerNumber) {
    startAnimationSequence();
  }
});

(function () {
  const languageToggleCallbacks = new WeakMap();
  const languageToggleButtons = new WeakSet();

  function normalizeLanguage(language) {
    return Object.prototype.hasOwnProperty.call(MathLabData.languages, language)
      ? language
      : MathLabData.defaultLanguage;
  }

  function readStoredLanguage() {
    try {
      return localStorage.getItem(MathLabData.storageKey);
    } catch (error) {
      return null;
    }
  }

  function writeStoredLanguage(language) {
    try {
      localStorage.setItem(MathLabData.storageKey, language);
    } catch (error) {
      // The UI can still update even when storage is unavailable.
    }
  }

  function getLanguage() {
    return normalizeLanguage(readStoredLanguage());
  }

  function setLanguage(language) {
    const normalizedLanguage = normalizeLanguage(language);
    writeStoredLanguage(normalizedLanguage);
    document.documentElement.lang = normalizedLanguage;
    applyText();
  }

  function text(path, values = {}) {
    const language = getLanguage();
    const parts = path.split(".");
    let current = MathLabData.languages[language];
    for (const part of parts) current = current?.[part];
    const template = typeof current === "string" ? current : path;
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
  }

  function applyText(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = text(node.dataset.i18n);
    });
    root.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.textContent = text("common.languageToggle");
    });
  }

  function bindLanguageToggle(onChange) {
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      languageToggleCallbacks.set(button, onChange);
      if (languageToggleButtons.has(button)) return;
      languageToggleButtons.add(button);
      button.addEventListener("click", () => {
        const next = getLanguage() === "zh-CN" ? "en-US" : "zh-CN";
        setLanguage(next);
        languageToggleCallbacks.get(button)?.(next);
      });
    });
  }

  function numberText(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0";
    return Number.isInteger(number) ? String(number) : String(MathLabModels.round(number, 2));
  }

  function fillSelectUnits(select) {
    select.querySelectorAll("option").forEach((option) => {
      option.textContent = text(`units.${option.value}`);
    });
  }

  function createPlayback({ duration = 2400, onProgress, onReset }) {
    let progress = 0;
    let playing = false;
    let frameId = 0;
    let lastTime = 0;
    const playbackDuration = Math.max(1, Number(duration) || 2400);

    function render() {
      onProgress?.(progress, playing);
    }

    function tick(now) {
      if (!lastTime) lastTime = now;
      const delta = now - lastTime;
      lastTime = now;
      progress = MathLabModels.clamp(progress + delta / playbackDuration, 0, 1);
      if (!playing || progress >= 1) {
        playing = false;
        frameId = 0;
        lastTime = 0;
        render();
        return;
      }
      render();
      frameId = requestAnimationFrame(tick);
    }

    return {
      playPause() {
        if (playing) {
          playing = false;
          cancelAnimationFrame(frameId);
          frameId = 0;
          lastTime = 0;
          render();
          return;
        }
        if (progress >= 1) progress = 0;
        playing = true;
        lastTime = 0;
        render();
        frameId = requestAnimationFrame(tick);
      },
      reset() {
        playing = false;
        cancelAnimationFrame(frameId);
        frameId = 0;
        progress = 0;
        lastTime = 0;
        onReset?.();
        render();
      },
      setProgress(value) {
        playing = false;
        cancelAnimationFrame(frameId);
        frameId = 0;
        progress = MathLabModels.clamp(value, 0, 1);
        lastTime = 0;
        render();
      },
      getProgress() {
        return progress;
      }
    };
  }

  function makeSvgDraggable(svg, handle, callbacks = {}) {
    let dragging = false;

    function pointFromEvent(event) {
      const matrix = svg.getScreenCTM();
      if (!matrix) return null;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      return point.matrixTransform(matrix.inverse());
    }

    function releasePointer(event) {
      if (handle.hasPointerCapture?.(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }
    }

    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      releasePointer(event);
      callbacks.onEnd?.(pointFromEvent(event));
    }

    handle.addEventListener("pointerdown", (event) => {
      dragging = true;
      handle.setPointerCapture(event.pointerId);
      callbacks.onStart?.(pointFromEvent(event));
    });

    handle.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      callbacks.onMove?.(pointFromEvent(event));
    });

    handle.addEventListener("pointerup", (event) => {
      endDrag(event);
    });

    handle.addEventListener("pointercancel", (event) => {
      endDrag(event);
    });

    handle.addEventListener("lostpointercapture", (event) => {
      endDrag(event);
    });
  }

  window.MathLab = {
    getLanguage,
    setLanguage,
    text,
    applyText,
    bindLanguageToggle,
    numberText,
    fillSelectUnits,
    createPlayback,
    makeSvgDraggable
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = getLanguage();
    applyText();
  });
})();

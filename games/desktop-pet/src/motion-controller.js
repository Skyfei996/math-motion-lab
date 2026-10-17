const MOTION_CONFIG = Object.freeze({
  "motion.gege.ambient_curiosity": { visual: "ambient", duration: 1750 },
  "motion.gege.notice_observe": { visual: "notice", duration: 1000 },
  "motion.gege.touch_response": { visual: "touch", duration: 1250 },
  "motion.gege.reminder_alert": { visual: "reminder", duration: 2000 },
  "motion.gege.safe_fail_retry": { visual: "safe-fail", duration: 1750 },
  "motion.gege.understand_restate": { visual: "understand", duration: 2250 },
  "task.share.picnic_feed": { visual: "picnic-feast", duration: 3000 }
});

export function createGegeMarkup() {
  return `
    <span class="gege" data-motion="idle">
      <span class="gege-hat" aria-hidden="true"></span>
      <span class="gege-antenna"></span>
      <span class="gege-arm gege-arm--left"></span>
      <span class="gege-arm gege-arm--right"></span>
      <span class="gege-foot gege-foot--left"></span>
      <span class="gege-foot gege-foot--right"></span>
      <span class="gege-body">
        <span class="gege-face">
          <span class="gege-eye"></span>
          <span class="gege-eye"></span>
          <span class="gege-mouth"></span>
        </span>
        <span class="gege-steps"><i></i><i></i><i></i></span>
      </span>
    </span>
  `;
}

export function mountGege(host, size) {
  host.setAttribute("aria-hidden", "true");
  host.style.setProperty("--pet-size", `${size}px`);
  host.innerHTML = createGegeMarkup();
  return host.querySelector(".gege");
}

export class MotionController {
  constructor(element, { reducedMotion = false } = {}) {
    this.element = element;
    this.reducedMotion = reducedMotion;
    this.timer = null;
    this.resolveCurrent = null;
  }

  setReducedMotion(reducedMotion) {
    this.reducedMotion = reducedMotion;
    if (reducedMotion) this.finish();
  }

  finish() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    this.element.dataset.motion = "idle";
    if (this.resolveCurrent) {
      this.resolveCurrent();
      this.resolveCurrent = null;
    }
  }

  play(motionId) {
    const config = MOTION_CONFIG[motionId];
    if (!config) return Promise.resolve(false);

    this.finish();
    if (this.reducedMotion) {
      this.element.dataset.motion = config.visual;
      this.element.getBoundingClientRect();
      this.element.dataset.motion = "idle";
      this.element.dispatchEvent(new CustomEvent("motioncomplete", { detail: { motionId } }));
      return Promise.resolve(true);
    }

    this.element.dataset.motion = "idle";
    this.element.getBoundingClientRect();
    this.element.dataset.motion = config.visual;

    return new Promise((resolve) => {
      this.resolveCurrent = () => resolve(true);
      this.timer = window.setTimeout(() => {
        this.timer = null;
        this.element.dataset.motion = "idle";
        this.element.dispatchEvent(new CustomEvent("motioncomplete", { detail: { motionId } }));
        this.resolveCurrent?.();
        this.resolveCurrent = null;
      }, config.duration);
    });
  }
}

export class RewardScene {
  constructor(platter, target, { onFeed, onAnnounce }) {
    this.platter = platter;
    this.target = target;
    this.onFeed = onFeed;
    this.onAnnounce = onAnnounce;
    this.ready = false;
    this.activeDrag = null;

    this.buildFruitDots();
    this.platter.addEventListener("pointerdown", (event) => this.startDrag(event));
    this.platter.addEventListener("click", (event) => {
      if (event.detail === 0) this.deliverFromKeyboard();
    });
    this.platter.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      this.deliverFromKeyboard();
    });
    window.addEventListener("pointermove", (event) => this.drag(event));
    window.addEventListener("pointerup", (event) => this.endDrag(event));
    window.addEventListener("pointercancel", (event) => this.cancelDrag(event));
    window.addEventListener("blur", () => this.cancelDrag());
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.cancelDrag();
    });
  }

  buildFruitDots() {
    const fruitTray = this.platter.querySelector(".platter-fruits");
    for (let index = 0; index < 12; index += 1) {
      const fruit = document.createElement("i");
      fruit.setAttribute("aria-hidden", "true");
      fruitTray.append(fruit);
    }
  }

  setReady(ready) {
    this.ready = ready;
    this.platter.hidden = !ready;
    this.platter.disabled = !ready;
    this.target.dataset.feedReady = String(ready);
    if (!ready) this.resetPlatter();
  }

  startDrag(event) {
    if (!this.ready || event.button !== 0) return;
    const rect = this.platter.getBoundingClientRect();
    this.platter.setPointerCapture(event.pointerId);
    this.platter.classList.add("is-dragging");
    this.platter.style.left = `${rect.left}px`;
    this.platter.style.top = `${rect.top}px`;
    this.platter.style.width = `${rect.width}px`;
    this.platter.style.height = `${rect.height}px`;
    this.activeDrag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      targetActive: false
    };
  }

  drag(event) {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) return;
    this.platter.style.left = `${event.clientX - this.activeDrag.offsetX}px`;
    this.platter.style.top = `${event.clientY - this.activeDrag.offsetY}px`;
    const targetActive = this.isOverTarget(event.clientX, event.clientY);
    this.activeDrag.targetActive = targetActive;
    this.target.dataset.dropActive = String(targetActive);
  }

  async endDrag(event) {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) return;
    const accepted = (
      this.activeDrag.targetActive
      || this.isOverTarget(event.clientX, event.clientY)
    ) && await this.onFeed();

    this.activeDrag = null;
    this.target.dataset.dropActive = "false";
    if (accepted) {
      this.placeForFeeding();
      return;
    }
    this.resetPlatter();
  }

  async deliverFromKeyboard() {
    if (!this.ready) return;
    if (!await this.onFeed()) return;
    this.placeForFeeding();
    this.onAnnounce("已经把野餐果盘递给格格。");
  }

  isOverTarget(x, y) {
    const rect = this.target.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  placeForFeeding() {
    const targetRect = this.target.getBoundingClientRect();
    this.ready = false;
    this.platter.disabled = true;
    this.platter.classList.remove("is-dragging");
    this.platter.classList.add("is-delivered");
    this.platter.style.left = `${targetRect.left + targetRect.width * 0.68}px`;
    this.platter.style.top = `${targetRect.top + targetRect.height * 0.58}px`;
    this.platter.style.width = "";
    this.platter.style.height = "";
    this.target.dataset.feedReady = "false";
    this.target.dataset.dropActive = "false";
  }

  cancelDrag(event) {
    if (!this.activeDrag) return;
    if (event && event.pointerId !== this.activeDrag.pointerId) return;
    this.activeDrag = null;
    this.target.dataset.dropActive = "false";
    this.resetPlatter();
  }

  resetPlatter() {
    this.platter.classList.remove("is-dragging", "is-delivered");
    this.platter.style.removeProperty("left");
    this.platter.style.removeProperty("top");
    this.platter.style.removeProperty("width");
    this.platter.style.removeProperty("height");
  }
}

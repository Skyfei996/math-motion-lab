const PLATE_X = [22, 50, 78];
const FRUIT_OFFSETS = {
  1: [[0, 0]],
  2: [[-15, 0], [15, 0]],
  3: [[-16, 9], [16, 9], [0, -10]],
  4: [[-15, -9], [15, -9], [-15, 12], [15, 12]],
  5: [[-19, -9], [0, -12], [19, -9], [-11, 12], [11, 12]]
};

export class ShareScene {
  constructor(root, { onMove, onAnnounce }) {
    this.root = root;
    this.onMove = onMove;
    this.onAnnounce = onAnnounce;
    this.assignments = null;
    this.interactive = false;
    this.selectedFruit = null;
    this.activeDrag = null;

    this.buildScene();
    window.addEventListener("blur", () => this.cancelDrag());
    window.addEventListener("pointermove", (event) => this.drag(event));
    window.addEventListener("pointerup", (event) => this.endDrag(event));
    window.addEventListener("pointercancel", (event) => this.cancelDrag(event));
    this.root.addEventListener("keydown", (event) => this.handleStageKeydown(event));
  }

  buildScene() {
    for (let plate = 0; plate < 3; plate += 1) {
      const friend = document.createElement("div");
      friend.className = "friend-card";
      friend.style.setProperty("--friend-x", `${PLATE_X[plate]}%`);
      friend.textContent = `朋友${plate + 1}`;
      this.root.append(friend);

      const plateElement = document.createElement("button");
      plateElement.type = "button";
      plateElement.className = "plate";
      plateElement.dataset.plate = String(plate);
      plateElement.style.setProperty("--plate-x", `${PLATE_X[plate]}%`);
      plateElement.innerHTML = `<span class="plate-count">0颗</span>`;
      plateElement.addEventListener("click", () => this.moveSelectedTo(plate));
      this.root.append(plateElement);
    }

    for (let fruitIndex = 0; fruitIndex < 12; fruitIndex += 1) {
      const fruit = document.createElement("button");
      fruit.type = "button";
      fruit.className = "fruit";
      fruit.dataset.fruit = String(fruitIndex);
      fruit.setAttribute("aria-label", `第${fruitIndex + 1}颗果子`);
      fruit.addEventListener("pointerdown", (event) => this.startDrag(event, fruitIndex));
      fruit.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.selectFruit(fruitIndex);
        }
      });
      this.root.append(fruit);
    }
  }

  setInteractive(interactive) {
    this.interactive = interactive;
    this.root.dataset.interactive = String(interactive);
    for (const fruit of this.root.querySelectorAll(".fruit")) {
      fruit.tabIndex = interactive ? 0 : -1;
      fruit.disabled = !interactive;
    }
    for (const plate of this.root.querySelectorAll(".plate")) {
      plate.tabIndex = interactive ? 0 : -1;
      plate.disabled = !interactive;
    }
    if (!interactive) this.clearSelection();
  }

  renderPool() {
    this.assignments = null;
    this.setInteractive(false);
    const fruits = [...this.root.querySelectorAll(".fruit")];
    fruits.forEach((fruit, index) => {
      const column = index % 6;
      const row = Math.floor(index / 6);
      fruit.style.removeProperty("left");
      fruit.style.removeProperty("top");
      fruit.style.setProperty("--fruit-left", `${27 + column * 9}%`);
      fruit.style.setProperty("--fruit-top", `${25 + row * 13}%`);
      fruit.dataset.plate = "";
    });
    this.updatePlateCounts([0, 0, 0]);
  }

  renderAssignments(assignments) {
    this.assignments = [...assignments];
    const grouped = [[], [], []];
    assignments.forEach((plate, fruitIndex) => grouped[plate].push(fruitIndex));

    grouped.forEach((fruitIndexes, plate) => {
      const offsets = FRUIT_OFFSETS[fruitIndexes.length] ?? FRUIT_OFFSETS[5];
      fruitIndexes.forEach((fruitIndex, index) => {
        const fruit = this.root.querySelector(`[data-fruit="${fruitIndex}"]`);
        const [offsetX, offsetY] = offsets[index] ?? [0, 0];
        fruit.style.removeProperty("left");
        fruit.style.removeProperty("top");
        fruit.style.setProperty("--fruit-left", `calc(${PLATE_X[plate]}% + ${offsetX}px)`);
        fruit.style.setProperty("--fruit-top", `calc(52% + ${offsetY}px)`);
        fruit.dataset.plate = String(plate);
      });
    });

    this.updatePlateCounts(grouped.map((items) => items.length));
  }

  updatePlateCounts(counts) {
    counts.forEach((count, plate) => {
      const plateElement = this.root.querySelector(`[data-plate="${plate}"]`);
      plateElement.querySelector(".plate-count").textContent = `${count}颗`;
      plateElement.setAttribute("aria-label", `第${plate + 1}只盘子，现在有${count}颗果子`);
    });
  }

  selectFruit(fruitIndex) {
    if (!this.interactive) return;
    this.selectedFruit = fruitIndex;
    for (const fruit of this.root.querySelectorAll(".fruit")) {
      fruit.dataset.selected = String(Number(fruit.dataset.fruit) === fruitIndex);
    }
    this.onAnnounce(`已选择第${fruitIndex + 1}颗果子。按数字1、2或3，把它移到对应盘子。`);
  }

  clearSelection() {
    this.selectedFruit = null;
    for (const fruit of this.root.querySelectorAll(".fruit")) {
      fruit.dataset.selected = "false";
    }
  }

  moveSelectedTo(targetPlate) {
    if (!this.interactive || this.selectedFruit === null) return;
    const accepted = this.onMove(this.selectedFruit, targetPlate);
    if (!accepted && this.assignments) this.renderAssignments(this.assignments);
    this.clearSelection();
  }

  handleStageKeydown(event) {
    if (!this.interactive || this.selectedFruit === null) return;
    if (!["1", "2", "3"].includes(event.key)) return;
    event.preventDefault();
    this.moveSelectedTo(Number(event.key) - 1);
  }

  startDrag(event, fruitIndex) {
    if (!this.interactive || event.button !== 0) return;
    const fruit = event.currentTarget;
    const stageRect = this.root.getBoundingClientRect();
    fruit.setPointerCapture(event.pointerId);
    fruit.classList.add("is-dragging");
    this.activeDrag = {
      fruit,
      fruitIndex,
      pointerId: event.pointerId,
      stageRect,
      targetPlate: null
    };

  }

  drag(event) {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) return;
    const { fruit, stageRect } = this.activeDrag;
    fruit.style.left = `${event.clientX - stageRect.left}px`;
    fruit.style.top = `${event.clientY - stageRect.top}px`;

    let targetPlate = null;
    for (const plate of this.root.querySelectorAll(".plate")) {
      const rect = plate.getBoundingClientRect();
      const active = event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom;
      plate.dataset.dropActive = String(active);
      if (active) targetPlate = Number(plate.dataset.plate);
    }
    this.activeDrag.targetPlate = targetPlate;
  }

  endDrag(event) {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) return;
    const { fruit, fruitIndex } = this.activeDrag;
    let { targetPlate } = this.activeDrag;

    for (const plate of this.root.querySelectorAll(".plate")) {
      const rect = plate.getBoundingClientRect();
      plate.dataset.dropActive = "false";
      if (
        event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom
      ) {
        targetPlate = Number(plate.dataset.plate);
      }
    }

    fruit.classList.remove("is-dragging");
    this.activeDrag = null;
    const accepted = targetPlate !== null && this.onMove(fruitIndex, targetPlate);
    if (!accepted && this.assignments) this.renderAssignments(this.assignments);
  }

  cancelDrag(event) {
    if (!this.activeDrag) return;
    if (event && event.pointerId !== this.activeDrag.pointerId) return;
    this.activeDrag.fruit.classList.remove("is-dragging");
    this.activeDrag = null;
    for (const plate of this.root.querySelectorAll(".plate")) {
      plate.dataset.dropActive = "false";
    }
    if (this.assignments) this.renderAssignments(this.assignments);
  }
}

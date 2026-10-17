(function () {
  const SCALE = 32;
  const geometry = window.MathLabModels.geometry;
  const $ = (id) => document.getElementById(id);
  const ids = ["language-button", "length-label", "length-input",
    "add-button", "change-button", "shape-button", "single-mode", "group-mode", "connect-mode", "split-mode", "labels-button",
    "undo-button", "copy-button", "paste-button", "style-button", "style-panel", "more-button", "more-menu", "color-palette",
    "color-label", "color-input", "fill-label", "fill-input", "fill-palette", "fill-hint", "clear-fill",
    "width-label", "width-input", "dash-label", "dash-input", "handle-size-label", "handle-size-input",
    "delete-button", "clear-button", "save-shape-button", "library-button", "library-panel", "library-list",
    "save-canvas", "split-button", "merge-button", "back-link", "canvas-status", "shape-name",
    "perimeter-value", "formula", "canvas", "shape-layer", "selection-box",
    "empty-state", "empty-title", "empty-copy", "hint", "segment-count", "shape-dialog",
    "shape-form", "dialog-title", "shape-type-label", "shape-type", "quantity-label", "quantity-input", "shape-fields",
    "shape-error", "cancel-shape", "create-shape", "zoom-in", "zoom-out", "zoom-reset", "zoom-fit",
    "shortcuts-button", "shortcuts-dialog", "shortcuts-title", "shortcut-list", "close-shortcuts",
    "name-dialog", "name-form", "name-dialog-title", "name-label", "name-input", "name-error", "cancel-name", "confirm-name",
    "split-dialog", "split-form", "split-dialog-title", "split-source", "split-kind", "split-kind-label",
    "split-count-field", "split-count-label", "split-count", "split-lengths-field", "split-lengths-label",
    "split-lengths", "split-error", "cancel-split", "confirm-split"];
  const ui = Object.fromEntries(ids.map((id) => [id, $(id)]));
  const words = {
    "zh-CN": {
      title: "几何画布",
      lengthLabel: "线段长度", add: "＋ 添加线段", change: "修改长度",
      addShape: "＋ 添加图形", single: "移动线段", group: "移动图形", connect: "连线", splitMode: "点击拆分",
      splitButton: "按长度拆分…", mergeButton: "合并线段", splitTitle: "拆分线段", splitKind: "拆分方式",
      splitEqual: "平均拆分", splitCustom: "指定每段长度", splitCount: "份数", splitLengths: "每段长度（用逗号分隔）",
      splitSource: (length) => "当前线段：" + length + " 厘米", splitConfirm: "拆分",
      splitInvalid: "请输入至少 2 份，或输入大于 0 的每段长度。", splitSum: "各段长度之和须等于原线段长度。",
      splitPointInvalid: "请在线段内部点击，避开两端。", mergeInvalid: "只能合并同一直线上、相接、无分支且样式相同的线段。",
      color: "颜色", palette: "常用颜色", fillColor: "填充颜色", fillPalette: "常用填充颜色",
      clearFill: "清除填充", fillHint: "先选中封闭区域", handleSize: "圆点大小", undo: "撤回", copy: "复制", paste: "粘贴",
      width: "线宽", dash: "线型", solid: "实线", dashed: "虚线",
      showLabels: "显示长度", hideLabels: "隐藏长度", remove: "删除选中", clear: "清空画布",
      style: "样式 ▾", more: "更多 ▾", zoomIn: "放大", zoomOut: "缩小", zoomReset: "重置缩放", fit: "适应",
      shortcuts: "快捷键 ?", shortcutsTitle: "快捷键", closeShortcuts: "关闭",
      saveShape: "保存图形", library: "素材库 ▾", saveCanvas: "保存整张画布", backToCatalog: "返回目录",
      insert: "放入", rename: "改名", renameSaved: "重命名素材", removeSaved: "删除这条素材", libraryEmpty: "还没有保存的图形",
      nameLabel: "名称", nameRequired: "请输入名称。", save: "保存",
      combo: "线段组合", wholeCanvas: "整张画布",
      emptyShape: "还没有图形", openShape: "尚未围合", chooseShape: "请选择一个图形",
      waiting: "等待围合", emptyFormula: "添加线段或图形后显示",
      total: "线段总长", unit: "厘米", approximate: "约",
      emptyTitle: "从一条线段开始", emptyCopy: "添加线段，或在弹窗中输入尺寸添加图形，然后自由拖动。",
      emptyHint: "1 格 = 1 厘米；滚动画布可平移视野，按住 Ctrl 滚动可缩放。",
      invalidLength: "请输入大于 0 的线段长度。",
      invalidShape: "请输入大于 0 的图形尺寸。",
      invalidQuantity: "创建数量须为大于 0 的整数。",
      invalidWidth: "线宽须为大于 0 的数字。",
      invalidHandleSize: "圆点大小须为大于或等于 0 的数字。",
      invalidTriangle: "这三条边无法围成三角形，请调整边长。",
      invalidTrapezoid: "这四条边无法围成梯形；上底和下底也不能相等。",
      clearConfirm: "要清空当前画布吗？",
      dialogTitle: "添加图形", typeLabel: "图形", quantity: "创建数量", cancel: "取消", create: "添加到画布",
      count: (segments, curves) => segments + " 条线段 · " + curves + " 个曲线图形",
      manyTotal: (segments, value) => segments + " 条线段，总长：" + value + " 厘米",
      polygon: (n) => n + " 边形",
      items: (n) => "已选 " + n + " 个对象",
      shape: { square: "正方形", rectangle: "长方形", rhombus: "菱形", parallelogram: "平行四边形",
        trapezoid: "梯形", quadrilateral: "四边形", triangle: "三角形", "equilateral-triangle": "等边三角形",
        circle: "圆形", ellipse: "椭圆", polygon: "多边形" },
      fields: { side: "边长", width: "长", height: "宽／高", first: "第一边", second: "第二边",
        third: "第三边", bottom: "下底", top: "上底", left: "左腰", right: "右腰",
        radius: "半径", radiusX: "横半径", radiusY: "纵半径" }
    },
    "en-US": {
      title: "Geometry Canvas",
      lengthLabel: "Length", add: "+ Segment", change: "Change",
      addShape: "+ Shape", single: "Segment", group: "Shape", connect: "Connect", splitMode: "Click to split",
      splitButton: "Split by length…", mergeButton: "Merge segments", splitTitle: "Split segment", splitKind: "Method",
      splitEqual: "Equal parts", splitCustom: "Set each length", splitCount: "Parts", splitLengths: "Lengths (comma separated)",
      splitSource: (length) => "Selected segment: " + length + " cm", splitConfirm: "Split",
      splitInvalid: "Enter at least 2 parts, or positive lengths for each part.", splitSum: "The lengths must add up to the original segment.",
      splitPointInvalid: "Click inside the segment, away from its endpoints.", mergeInvalid: "Select touching, straight, unbranched segments with matching styles.",
      color: "Color", palette: "Common colors", fillColor: "Fill color", fillPalette: "Common fill colors",
      clearFill: "Clear fill", fillHint: "Select a closed shape first", handleSize: "Endpoint size", undo: "Undo", copy: "Copy", paste: "Paste",
      width: "Line width", dash: "Line style", solid: "Solid", dashed: "Dashed",
      showLabels: "Show lengths", hideLabels: "Hide lengths", remove: "Delete", clear: "Clear canvas",
      style: "Style ▾", more: "More ▾", zoomIn: "Zoom in", zoomOut: "Zoom out", zoomReset: "Reset zoom", fit: "Fit",
      shortcuts: "Shortcuts ?", shortcutsTitle: "Keyboard shortcuts", closeShortcuts: "Close",
      saveShape: "Save shape", library: "Library ▾", saveCanvas: "Save whole canvas", backToCatalog: "Catalog",
      insert: "Insert", rename: "Rename", renameSaved: "Rename saved item", removeSaved: "Remove this saved shape", libraryEmpty: "No saved shapes yet",
      nameLabel: "Name", nameRequired: "Enter a name.", save: "Save",
      combo: "Segment group", wholeCanvas: "Whole canvas",
      emptyShape: "No shapes yet", openShape: "Not closed yet", chooseShape: "Select a shape",
      waiting: "Close the outline", emptyFormula: "Add a segment or shape to begin",
      total: "Segment total", unit: "cm", approximate: "About",
      emptyTitle: "Start with one segment", emptyCopy: "Add a segment, or enter dimensions to add a shape. Then arrange them yourself.",
      emptyHint: "One cell = 1 cm. Scroll to pan the canvas; hold Ctrl and scroll to zoom.",
      invalidLength: "Enter a segment length above zero.",
      invalidShape: "Enter shape dimensions above zero.",
      invalidQuantity: "Enter a whole number of shapes above zero.",
      invalidWidth: "Enter a line width above zero.",
      invalidHandleSize: "Enter an endpoint size of zero or above.",
      invalidTriangle: "These three sides cannot make a triangle. Adjust the lengths.",
      invalidTrapezoid: "These four sides cannot make a trapezoid. The bases must also differ.",
      clearConfirm: "Clear the current canvas?",
      dialogTitle: "Add shape", typeLabel: "Shape", quantity: "Quantity", cancel: "Cancel", create: "Add to canvas",
      count: (segments, curves) => segments + " segments · " + curves + " curved shapes",
      manyTotal: (segments, value) => segments + " segments, total length: " + value + " cm",
      polygon: (n) => n + "-sided polygon",
      items: (n) => n + " objects selected",
      shape: { square: "Square", rectangle: "Rectangle", rhombus: "Rhombus", parallelogram: "Parallelogram",
        trapezoid: "Trapezoid", quadrilateral: "Quadrilateral", triangle: "Triangle", "equilateral-triangle": "Equilateral triangle",
        circle: "Circle", ellipse: "Ellipse", polygon: "Polygon" },
      fields: { side: "Side", width: "Length", height: "Width / height", first: "First side", second: "Second side",
        third: "Third side", bottom: "Bottom base", top: "Top base", left: "Left leg", right: "Right leg",
        radius: "Radius", radiusX: "Horizontal radius", radiusY: "Vertical radius" }
    }
  };
  const shapeFields = {
    square: [["side", 4]], rectangle: [["width", 6], ["height", 3]],
    triangle: [["first", 4], ["second", 4], ["third", 4]],
    trapezoid: [["bottom", 6], ["top", 4], ["left", 3], ["right", 3]],
    ellipse: [["radiusX", 4], ["radiusY", 2]], circle: [["radius", 3]]
  };
  let initialLanguage = "zh-CN";
  try { if (localStorage.getItem("math-lab-language") === "en-US") initialLanguage = "en-US"; } catch (_) {}
  let savedLibrary = [];
  try {
    const stored = JSON.parse(localStorage.getItem("geometry-canvas-library") || "[]");
    if (Array.isArray(stored)) savedLibrary = stored.filter((item) => item && typeof item.name === "string" &&
      Array.isArray(item.segments) && Array.isArray(item.curves));
  } catch (_) {}
  const ZOOM_MIN = 0.25, ZOOM_MAX = 4;
  const state = {
    language: initialLanguage, segments: [], curves: [], selected: new Set(), mode: "single",
    labelsVisible: true, drag: null, error: null, nextId: 1,
    pan: { x: 0, y: 0 }, zoom: 1, connectMode: false, splitMode: false, spaceDown: false, handleSize: 3,
    history: [], clipboard: null, pasteCount: 0, library: savedLibrary, nameAction: null,
    faceFills: new Map(), selectedFaceKey: null,
    drawStyle: { color: "#087f75", width: 5, dash: "solid" },
    layout: { x: 80, y: 80, rowHeight: 0 }
  };
  const t = () => words[state.language];
  const fmt = (value) => String(Number(value.toPrecision(15)));
  const key = (id) => String(id);
  const cloneSegments = (segments) => segments.map((s) => ({ ...s, a: { ...s.a }, b: { ...s.b } }));
  const cloneCurves = (curves) => curves.map((c) => ({ ...c }));
  const palette = [
    ["#172033", "黑色", "Black"], ["#64748b", "灰色", "Gray"], ["#d52a1e", "红色", "Red"],
    ["#e67e22", "橙色", "Orange"], ["#f2c94c", "黄色", "Yellow"], ["#229954", "绿色", "Green"],
    ["#087f75", "青色", "Teal"], ["#2563eb", "蓝色", "Blue"], ["#7c3aed", "紫色", "Purple"],
    ["#c02675", "粉色", "Pink"]
  ];
  const shortcutRows = [
    ["N", "添加线段", "Add segment"], ["Shift + N", "添加图形", "Add shape"],
    ["1 / 2 / 3 / 4", "移动线段／移动图形／连线／点击拆分", "Segment / shape / connect / click to split"],
    ["X / J", "按长度拆分／合并所选", "Split by length / merge selection"],
    ["Ctrl + A", "全选画布对象", "Select all objects"],
    ["Ctrl + C / V", "复制／粘贴", "Copy / paste"],
    ["Ctrl + drag", "移动时锁定水平／垂直；连线和伸缩按 1 厘米", "Axis lock when moving; 1 cm steps when drawing or resizing"],
    ["Ctrl + Z", "撤回", "Undo"], ["Delete", "删除选中", "Delete selection"],
    ["L", "显示／隐藏长度", "Show / hide lengths"],
    ["S / B / M", "样式／素材库／更多", "Style / library / more"],
    ["F", "适应全部内容", "Fit all content"],
    ["Ctrl + + / - / 0", "放大／缩小／重置", "Zoom in / out / reset"],
    ["Space + drag", "临时平移画布", "Temporarily pan canvas"],
    ["Esc", "关闭面板／取消选择", "Close panel / clear selection"],
    ["?", "查看快捷键", "Show shortcuts"]
  ];
  function renderShortcuts() {
    ui["shortcuts-title"].textContent = t().shortcutsTitle;
    ui["close-shortcuts"].textContent = t().closeShortcuts;
    ui["shortcut-list"].innerHTML = shortcutRows.map(([keys, zh, en]) =>
      '<div class="shortcut-row"><span>' + (state.language === "zh-CN" ? zh : en) +
      '</span><kbd>' + keys + '</kbd></div>').join("");
  }
  function snapshot() {
    return { segments: cloneSegments(state.segments), curves: cloneCurves(state.curves),
      selected: [...state.selected], labelsVisible: state.labelsVisible, nextId: state.nextId,
      drawStyle: { ...state.drawStyle }, layout: { ...state.layout },
      handleSize: state.handleSize, pan: { ...state.pan }, zoom: state.zoom,
      faceFills: [...state.faceFills], selectedFaceKey: state.selectedFaceKey };
  }
  function record(before = snapshot()) { state.history.push(before); }
  function undo() {
    if (!state.history.length) return;
    const before = state.history.pop();
    state.segments = before.segments; state.curves = before.curves;
    state.selected = new Set(before.selected); state.labelsVisible = before.labelsVisible;
    state.nextId = before.nextId;
    state.drawStyle = before.drawStyle; state.layout = before.layout;
    state.handleSize = before.handleSize; state.pan = before.pan;
    state.faceFills = new Map(before.faceFills || []); state.selectedFaceKey = before.selectedFaceKey || null;
    state.zoom = before.zoom || 1; state.error = null; render();
  }
  const lengthIsValid = (value) => Number.isFinite(value) && value > 0 && Number.isFinite(value * SCALE);
  const validCoordinates = (segments, curves) => segments.every(({ a, b }) => [a, b].every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))) &&
    curves.every(({ cx, cy, rx, ry }) => [cx, cy, rx, ry].every(Number.isFinite));
  function nextPosition(width, height) {
    if (state.layout.x > 80 && state.layout.x + width > 940) {
      state.layout.x = 80;
      state.layout.y += state.layout.rowHeight + 48;
      state.layout.rowHeight = 0;
    }
    const position = { x: state.layout.x, y: state.layout.y };
    state.layout.x += width + 48;
    state.layout.rowHeight = Math.max(state.layout.rowHeight, height);
    return position;
  }
  function syncViewport() {
    const box = ui.canvas.getBoundingClientRect();
    const width = box.width || ui.canvas.clientWidth || 1000;
    const height = box.height || ui.canvas.clientHeight || 520;
    const zoom = state.zoom;
    ui.canvas.setAttribute("viewBox", [state.pan.x, state.pan.y, width / zoom, height / zoom].join(" "));
    const background = ui.canvas.parentElement.style;
    background.backgroundSize = 32 * zoom + "px " + 32 * zoom + "px";
    background.backgroundPosition = -state.pan.x * zoom + "px " + -state.pan.y * zoom + "px";
    ui["zoom-reset"].textContent = Math.round(zoom * 100) + "%";
  }
  function setZoom(next, clientX, clientY) {
    const rect = ui.canvas.getBoundingClientRect();
    const x = clientX === undefined ? rect.width / 2 : clientX - (rect.left || 0);
    const y = clientY === undefined ? rect.height / 2 : clientY - (rect.top || 0);
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
    if (clamped === state.zoom) return;
    const centerX = state.pan.x + x / state.zoom, centerY = state.pan.y + y / state.zoom;
    state.zoom = clamped;
    state.pan.x = centerX - x / clamped;
    state.pan.y = centerY - y / clamped;
    syncViewport();
  }
  function zoomFit() {
    const points = [];
    state.segments.forEach((segment) => points.push(segment.a, segment.b));
    state.curves.forEach((curve) => points.push(
      { x: curve.cx - curve.rx, y: curve.cy - curve.ry }, { x: curve.cx + curve.rx, y: curve.cy + curve.ry }));
    if (!points.length) { state.zoom = 1; state.pan = { x: 0, y: 0 }; syncViewport(); return; }
    const rect = ui.canvas.getBoundingClientRect();
    const minX = Math.min(...points.map((p) => p.x)), maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y)), maxY = Math.max(...points.map((p) => p.y));
    const next = Math.min(ZOOM_MAX, 2, Math.max(ZOOM_MIN, Math.min(
      (rect.width - 96) / Math.max(maxX - minX, 1), (rect.height - 96) / Math.max(maxY - minY, 1))));
    state.zoom = next;
    state.pan.x = (minX + maxX) / 2 - rect.width / next / 2;
    state.pan.y = (minY + maxY) / 2 - rect.height / next / 2;
    syncViewport();
  }
  ui.canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 120 : 1;
    if (event.ctrlKey || event.metaKey) {
      setZoom(state.zoom * Math.exp(-event.deltaY * unit * 0.002), event.clientX, event.clientY);
      return;
    }
    let dx = event.deltaX * unit, dy = event.deltaY * unit;
    if (event.shiftKey && !dx) { dx = dy; dy = 0; }
    if (!dx && !dy) return;
    state.pan.x += dx / state.zoom;
    state.pan.y += dy / state.zoom;
    syncViewport();
  }, { passive: false });
  function styleFor(item) {
    return { color: item.color || "#087f75", width: item.width || 5, dash: item.dash || "solid" };
  }
  function fillStyle(item) {
    if (item.fill === "none") return "fill:transparent;fill-opacity:0";
    if (/^#[0-9a-f]{6}$/i.test(item.fill || "")) return "fill:" + item.fill + ";fill-opacity:1";
    return "fill:" + styleFor(item).color + ";fill-opacity:.16";
  }
  function dashPattern(style) { return style.dash === "dashed" ? style.width * 3 + " " + style.width * 2 : "none"; }
  const components = () => geometry.connectedSegmentComponents(state.segments);
  const groupFor = (id) => components().find((group) => group.some((segment) => segment.id === id)) || [];
  const faceKey = (ids) => ids.map(Number).sort((a, b) => a - b).join(",");
  function faceFillRecords(segments) {
    const ids = new Set(segments.map((segment) => segment.id));
    const current = new Set(faces().map((face) => face.key));
    return [...state.faceFills].filter(([name]) => current.has(name) &&
      name.split(",").every((id) => ids.has(Number(id)))).map(([name, fill]) =>
      ({ ids: name.split(",").map(Number), fill }));
  }
  function remapFaceFills(removed, added) {
    const remove = new Set(removed);
    const updated = new Map();
    state.faceFills.forEach((fill, name) => {
      const ids = name.split(",").map(Number);
      const next = ids.some((id) => remove.has(id))
        ? faceKey(ids.filter((id) => !remove.has(id)).concat(added)) : name;
      updated.set(next, fill);
      if (state.selectedFaceKey === name) state.selectedFaceKey = next;
    });
    state.faceFills = updated;
  }
  const faces = () => components().flatMap((group) => geometry.boundedSegmentFaces(group).map((face) => {
    const ids = face.segmentIndexes.map((index) => group[index].id);
    return { ...face, group, ids, key: faceKey(ids) };
  }));
  function faceFill(face) {
    if (state.faceFills.has(face.key)) return state.faceFills.get(face.key);
    const inherited = face.segmentIndexes.map((index) => face.group[index].fill).filter((fill) => fill !== undefined);
    return inherited.length && inherited.every((fill) => fill === inherited[0]) ? inherited[0] : undefined;
  }
  const selectedFace = () => state.selectedFaceKey && faces().find((face) => face.key === state.selectedFaceKey &&
    state.selected.size === face.group.length &&
    face.group.every((segment) => state.selected.has(key(segment.id))));
  const selectedSegments = () => state.segments.filter((segment) => state.selected.has(key(segment.id)));
  function expandSelectionToGroups() {
    const selected = new Set(state.selected);
    selectedSegments().forEach((segment) => groupFor(segment.id).forEach((item) => selected.add(key(item.id))));
    state.selected = selected;
  }
  function activeObject() {
    const all = components().map((segments) => ({ type: "segments", segments }))
      .concat(state.curves.map((curve) => ({ type: "curve", curve })));
    if (state.selected.size === 0) return all.length === 1 ? all[0] : null;
    const selectedGroups = all.filter((object) => object.type === "curve"
      ? state.selected.has(key(object.curve.id))
      : object.segments.some((segment) => state.selected.has(key(segment.id))));
    return selectedGroups.length === 1 ? selectedGroups[0] : null;
  }
  function groupState(group) {
    return geometry.looseSegmentPerimeterState(group, SCALE);
  }
  function shapeName(shape, count) {
    return t().shape[shape] || (count >= 5 ? t().polygon(count) : t().shape.polygon);
  }
  function renderCanvas() {
    let markup = "";
    const unitsPerPixel = 1 / (Math.abs(ui.canvas.getScreenCTM()?.a) || 1);
    components().forEach((group) => {
      const model = groupState(group);
      if (model.closed) markup += '<polygon class="fill-shape" data-group="' + group[0].id + '" style="' +
        fillStyle({ ...group[0], fill: state.faceFills.get(faceKey(group.map((item) => item.id))) ?? group[0].fill }) + '" points="' +
        model.vertices.map((p) => p.x + "," + p.y).join(" ") + '" />';
      else geometry.boundedSegmentFaces(group).forEach((face) => {
        const ids = face.segmentIndexes.map((index) => group[index].id);
        const id = faceKey(ids);
        markup += '<polygon class="fill-shape" data-face="' + id + '"' +
          (state.selectedFaceKey === id && state.selected.size === group.length &&
            group.every((item) => state.selected.has(key(item.id))) ? ' data-selected="true"' : "") + ' style="' +
          fillStyle({ color: group[face.segmentIndexes[0]].color, fill: faceFill({ ...face, group, key: id }) }) + '" points="' +
          face.vertices.map((point) => point.x + "," + point.y).join(" ") + '" />';
      });
    });
    state.curves.forEach((curve) => {
      const style = styleFor(curve);
      markup += '<ellipse class="curve' + (state.selected.has(key(curve.id)) ? ' selected' : '') +
        '" data-id="' + curve.id + '" cx="' + curve.cx + '" cy="' + curve.cy +
        '" rx="' + curve.rx + '" ry="' + curve.ry + '" vector-effect="non-scaling-stroke" style="stroke:' + style.color +
        ';stroke-width:' + style.width + ';stroke-dasharray:' + dashPattern(style) +
        ';' + fillStyle(curve) + '" />';
    });
    state.segments.forEach((segment) => {
      const { a, b, id, length } = segment;
      const style = styleFor(segment);
      const dx = b.x - a.x, dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 1;
      const labelX = (a.x + b.x) / 2 - dy / distance * 24 * unitsPerPixel;
      const labelY = (a.y + b.y) / 2 + dx / distance * 24 * unitsPerPixel;
      if (state.selected.has(key(id))) markup += '<line class="selection-halo" x1="' + a.x +
        '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" vector-effect="non-scaling-stroke" style="stroke-width:' +
        (style.width + 6) + ';stroke-dasharray:' + dashPattern(style) + '" />';
      markup += '<line class="stick' + (state.selected.has(key(id)) ? ' selected' : '') +
        '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" vector-effect="non-scaling-stroke"' +
        ' style="stroke:' + style.color + ';stroke-width:' + style.width +
        ';stroke-dasharray:' + dashPattern(style) + '" />';
      markup += '<line class="hit-stick" data-id="' + id + '" x1="' + a.x +
        '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" vector-effect="non-scaling-stroke" style="stroke-width:' +
        Math.max(28, style.width + 16) + '" aria-label="' + fmt(length) + ' cm" />';
      const drawing = state.drag && state.drag.kind === "draw" && state.drag.id === id;
      if (state.labelsVisible && !drawing) markup += '<text class="edge-label" x="' + labelX +
        '" y="' + (labelY + 5 * unitsPerPixel) + '" style="font-size:' +
        18 * unitsPerPixel + 'px">' + fmt(length) + '</text>';
    });
    state.segments.forEach(({ id, a, b }) => {
      markup += '<circle class="joint" cx="' + a.x + '" cy="' + a.y + '" r="' + state.handleSize * unitsPerPixel + '" vector-effect="non-scaling-stroke" />';
      markup += '<circle class="joint" cx="' + b.x + '" cy="' + b.y + '" r="' + state.handleSize * unitsPerPixel + '" vector-effect="non-scaling-stroke" />';
      markup += '<circle class="hit-joint" data-id="' + id + '" data-endpoint="a" cx="' + a.x + '" cy="' + a.y + '" r="' + Math.max(10, state.handleSize + 6) * unitsPerPixel + '" />';
      markup += '<circle class="hit-joint" data-id="' + id + '" data-endpoint="b" cx="' + b.x + '" cy="' + b.y + '" r="' + Math.max(10, state.handleSize + 6) * unitsPerPixel + '" />';
    });
    ui["shape-layer"].innerHTML = markup;
  }
  function render() {
    const w = t(), count = state.segments.length + state.curves.length;
    const active = activeObject();
    const face = state.selectedFaceKey ? selectedFace() : null;
    const fillTarget = face ? { type: "face", face } : state.selected.size && active &&
      (active.type === "curve" || groupState(active.segments).closed) ? active : null;
    const fillItem = fillTarget && (fillTarget.type === "face" ? { fill: faceFill(face) } :
      fillTarget.type === "curve" ? fillTarget.curve :
        { fill: state.faceFills.get(faceKey(fillTarget.segments.map((item) => item.id))) ?? fillTarget.segments[0].fill });
    syncViewport();
    const selectedItem = state.segments.find((item) => state.selected.has(key(item.id))) ||
      state.curves.find((item) => state.selected.has(key(item.id)));
    if (selectedItem) state.drawStyle = styleFor(selectedItem);
    document.documentElement.lang = state.language;
    document.title = w.title + " - Math Motion Lab";
    ui["language-button"].textContent = state.language === "zh-CN" ? "EN" : "中文";
    ui["length-label"].textContent = w.lengthLabel;
    ui["add-button"].textContent = w.add;
    ui["change-button"].textContent = w.change;
    ui["shape-button"].textContent = w.addShape;
    ui["color-label"].textContent = w.color;
    ui["style-button"].textContent = w.style;
    ui["more-button"].textContent = w.more;
    ui["shortcuts-button"].textContent = w.shortcuts;
    if (ui["shortcuts-dialog"].open) renderShortcuts();
    ui["color-palette"].setAttribute("aria-label", w.palette);
    ui["zoom-in"].setAttribute("aria-label", w.zoomIn);
    ui["zoom-out"].setAttribute("aria-label", w.zoomOut);
    ui["zoom-reset"].setAttribute("aria-label", w.zoomReset);
    ui["zoom-fit"].textContent = w.fit;
    ui["color-palette"].innerHTML = palette.map(([color, zh, en]) =>
      '<button type="button" class="color-swatch" data-color="' + color + '" style="background:' + color +
      '" title="' + (state.language === "zh-CN" ? zh : en) + '" aria-label="' +
      (state.language === "zh-CN" ? zh : en) + '"></button>').join("");
    ui["fill-label"].textContent = w.fillColor;
    ui["fill-palette"].setAttribute("aria-label", w.fillPalette);
    ui["fill-palette"].innerHTML = palette.map(([color, zh, en]) =>
      '<button type="button" class="color-swatch" data-color="' + color + '" style="background:' + color +
      '" title="' + (state.language === "zh-CN" ? zh : en) + '" aria-label="' +
      (state.language === "zh-CN" ? zh : en) + '"' + (fillTarget ? "" : " disabled") + '></button>').join("");
    ui["fill-input"].value = /^#[0-9a-f]{6}$/i.test(fillItem?.fill || "") ? fillItem.fill : "#f2c94c";
    ui["fill-input"].disabled = !fillTarget;
    ui["clear-fill"].textContent = w.clearFill;
    ui["clear-fill"].disabled = !fillTarget || fillItem.fill === "none";
    ui["fill-hint"].textContent = w.fillHint;
    ui["fill-hint"].hidden = Boolean(fillTarget);
    ui["handle-size-label"].textContent = w.handleSize;
    ui["handle-size-input"].value = String(state.handleSize);
    ui["connect-mode"].textContent = w.connect;
    ui["split-mode"].textContent = w.splitMode;
    ui["split-button"].textContent = w.splitButton;
    ui["merge-button"].textContent = w.mergeButton;
    ui["undo-button"].textContent = w.undo;
    ui["copy-button"].textContent = w.copy;
    ui["paste-button"].textContent = w.paste;
    ui["undo-button"].disabled = state.history.length === 0;
    ui["copy-button"].disabled = state.selected.size === 0;
    ui["paste-button"].disabled = !state.clipboard;
    ui["connect-mode"].classList.toggle("active", state.connectMode);
    ui["connect-mode"].setAttribute("aria-pressed", String(state.connectMode));
    ui["split-mode"].classList.toggle("active", state.splitMode);
    ui["split-mode"].setAttribute("aria-pressed", String(state.splitMode));
    ui.canvas.parentElement.classList.toggle("pan-active", state.spaceDown);
    ui.canvas.parentElement.classList.toggle("connect-active", state.connectMode);
    ui.canvas.parentElement.classList.toggle("split-active", state.splitMode);
    ui["width-label"].textContent = w.width;
    ui["dash-label"].textContent = w.dash;
    ui["color-input"].value = state.drawStyle.color;
    ui["width-input"].value = String(state.drawStyle.width);
    ui["dash-input"].value = state.drawStyle.dash;
    [...ui["dash-input"].options].forEach((option) => { option.textContent = w[option.value]; });
    ui["single-mode"].textContent = w.single;
    ui["group-mode"].textContent = w.group;
    ui["labels-button"].textContent = state.labelsVisible ? w.hideLabels : w.showLabels;
    ui["labels-button"].setAttribute("aria-pressed", String(state.labelsVisible));
    ui["delete-button"].textContent = w.remove + (state.selected.size > 1
      ? (state.language === "zh-CN" ? "（" + state.selected.size + "）" : " (" + state.selected.size + ")") : "");
    ui["clear-button"].textContent = w.clear;
    ui["save-shape-button"].textContent = w.saveShape;
    ui["save-shape-button"].disabled = state.selected.size === 0;
    ui["library-button"].textContent = w.library;
    ui["save-canvas"].textContent = w.saveCanvas;
    ui["save-canvas"].disabled = count === 0;
    ui["back-link"].textContent = w.backToCatalog;
    renderLibrary();
    ui["empty-title"].textContent = w.emptyTitle;
    ui["empty-copy"].textContent = w.emptyCopy + " " + w.emptyHint;
    ui["segment-count"].textContent = w.count(state.segments.length, state.curves.length);
    ui["empty-state"].hidden = count > 0;
    ui["change-button"].disabled = selectedSegments().length !== 1 || state.selected.size !== 1;
    ui["split-button"].disabled = selectedSegments().length !== 1 || state.selected.size !== 1;
    ui["merge-button"].disabled = selectedSegments().length < 2 || selectedSegments().length !== state.selected.size;
    ui["delete-button"].disabled = state.selected.size === 0;
    ui["clear-button"].disabled = count === 0;
    for (const mode of ["single", "group"]) {
      ui[mode + "-mode"].classList.toggle("active", !state.connectMode && !state.splitMode && state.mode === mode);
      ui[mode + "-mode"].setAttribute("aria-pressed", String(!state.connectMode && !state.splitMode && state.mode === mode));
    }
    let name = w.chooseShape;
    let perimeter = "";
    let formula = "";
    if (active && active.type === "segments") {
      const model = groupState(active.segments);
      name = model.closed ? shapeName(model.shape, active.segments.length) : w.openShape;
      perimeter = model.closed ? fmt(model.perimeter) + " " + w.unit : w.waiting;
      const lengths = active.segments.map(({ length }) => fmt(length));
      formula = active.segments.length <= 12
        ? (model.closed ? "" : w.total + "：") + lengths.join(" + ") + " = " + fmt(model.totalLength) + " " + w.unit
        : w.manyTotal(active.segments.length, fmt(model.totalLength));
    } else if (active && active.type === "curve") {
      const curve = active.curve;
      const length = geometry.curvedPerimeter(curve.kind, curve.rx / SCALE, curve.ry / SCALE);
      name = shapeName(curve.kind, 0);
      perimeter = w.approximate + " " + fmt(length) + " " + w.unit;
      formula = curve.kind === "circle"
        ? "2 × π × " + fmt(curve.rx / SCALE) + " ≈ " + fmt(length) + " " + w.unit
        : w.approximate + " " + fmt(length) + " " + w.unit;
    } else if (state.selected.size > 1) {
      name = w.items(state.selected.size);
    }
    if (face) {
      const boundary = face.segmentIndexes.map((index) => face.group[index]);
      const model = groupState(boundary);
      if (model.closed) {
        name = shapeName(model.shape, boundary.length);
        perimeter = fmt(model.perimeter) + " " + w.unit;
        formula = boundary.map(({ length }) => fmt(length)).join(" + ") + " = " + fmt(model.perimeter) + " " + w.unit;
      }
    }
    if (state.error) { name = ""; perimeter = ""; formula = ""; }
    ui["shape-name"].textContent = name;
    ui["perimeter-value"].textContent = perimeter;
    ui.formula.textContent = formula;
    ui.hint.textContent = state.error || "";
    ui.hint.classList.toggle("error", Boolean(state.error));
    ui["canvas-status"].hidden = !(state.error || active);
    renderCanvas();
  }
  function persistLibrary() {
    try { localStorage.setItem("geometry-canvas-library", JSON.stringify(state.library)); } catch (_) {}
  }
  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function renderLibrary() {
    const w = t();
    ui["library-list"].innerHTML = state.library.length
      ? state.library.map((item, index) =>
        '<div class="library-row"><span>' + escapeHtml(item.name) + '</span>' +
        '<button type="button" class="button" data-insert="' + index + '">' + w.insert + '</button>' +
        '<button type="button" class="button" data-rename="' + index + '">' + w.rename + '</button>' +
        '<button type="button" class="button" data-remove="' + index + '" aria-label="' + w.removeSaved + '">×</button></div>').join("")
      : '<p class="library-empty">' + w.libraryEmpty + '</p>';
  }
  function libraryName(base, ignoredIndex = -1) {
    const used = new Set(state.library.filter((_, index) => index !== ignoredIndex).map((item) => item.name));
    if (!used.has(base)) return base;
    let suffix = 2;
    while (used.has(base + " " + suffix)) suffix += 1;
    return base + " " + suffix;
  }
  function libraryEntry(segments, curves, base) {
    const points = segments.flatMap((s) => [s.a, s.b])
      .concat(curves.flatMap((c) => [{ x: c.cx - c.rx, y: c.cy - c.ry }, { x: c.cx + c.rx, y: c.cy + c.ry }]));
    const minX = Math.min(...points.map((p) => p.x)), minY = Math.min(...points.map((p) => p.y));
    return { name: libraryName(base),
      faceFills: faceFillRecords(segments).map(({ ids, fill }) =>
        ({ indexes: ids.map((id) => segments.findIndex((segment) => segment.id === id)), fill })),
      segments: segments.map((s) => ({ length: s.length, color: s.color, fill: s.fill, width: s.width, dash: s.dash,
        a: { x: s.a.x - minX, y: s.a.y - minY }, b: { x: s.b.x - minX, y: s.b.y - minY } })),
      curves: curves.map((c) => ({ kind: c.kind, rx: c.rx, ry: c.ry, color: c.color, fill: c.fill, width: c.width, dash: c.dash,
        cx: c.cx - minX, cy: c.cy - minY })) };
  }
  function insertSaved(index) {
    const item = state.library[index];
    if (!item) return;
    const points = item.segments.flatMap((s) => [s.a, s.b])
      .concat(item.curves.flatMap((c) => [{ x: c.cx - c.rx, y: c.cy - c.ry }, { x: c.cx + c.rx, y: c.cy + c.ry }]));
    if (!points.length) return;
    record();
    const minX = Math.min(...points.map((p) => p.x)), maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y)), maxY = Math.max(...points.map((p) => p.y));
    const rect = ui.canvas.getBoundingClientRect();
    const shiftX = state.pan.x + (rect.width || 1000) / state.zoom / 2 - (minX + maxX) / 2;
    const shiftY = state.pan.y + (rect.height || 520) / state.zoom / 2 - (minY + maxY) / 2;
    const ids = [], newSegmentIds = [];
    item.segments.forEach((s) => {
      const id = nextId(); ids.push(key(id));
      newSegmentIds.push(id);
      state.segments.push({ id, length: s.length, color: s.color, fill: s.fill, width: s.width, dash: s.dash,
        a: { x: s.a.x + shiftX, y: s.a.y + shiftY }, b: { x: s.b.x + shiftX, y: s.b.y + shiftY } });
    });
    item.curves.forEach((c) => {
      const id = nextId(); ids.push(key(id));
      state.curves.push({ id, kind: c.kind, rx: c.rx, ry: c.ry, color: c.color, fill: c.fill, width: c.width, dash: c.dash,
        cx: c.cx + shiftX, cy: c.cy + shiftY });
    });
    (Array.isArray(item.faceFills) ? item.faceFills : []).forEach(({ indexes, fill }) => {
      if (Array.isArray(indexes) && (fill === "none" || /^#[0-9a-f]{6}$/i.test(fill || "")) &&
        indexes.every((index) => newSegmentIds[index] !== undefined)) {
        state.faceFills.set(faceKey(indexes.map((index) => newSegmentIds[index])), fill);
      }
    });
    state.selected = new Set(ids);
    state.error = null;
    render();
  }
  function nextId() { return state.nextId++; }
  function readLength() {
    const value = Number(ui["length-input"].value);
    if (!ui["length-input"].value || !lengthIsValid(value)) {
      state.error = t().invalidLength; render(); return null;
    }
    return value;
  }
  function addSegment() {
    const length = readLength();
    if (length === null) return;
    record();
    const position = nextPosition(length * SCALE, 44);
    const id = nextId();
    state.segments.push({ id, length, ...state.drawStyle,
      a: { x: position.x, y: position.y + 22 },
      b: { x: position.x + length * SCALE, y: position.y + 22 } });
    state.selected = new Set([key(id)]);
    state.error = null;
    render();
  }
  function shapeFieldMarkup(kind) {
    return shapeFields[kind].map(([name, value]) =>
      '<label class="dialog-field"><span>' + t().fields[name] + '（' + t().unit + '）</span>' +
      '<input name="' + name + '" type="number" min="0.01" step="any" value="' + value + '" required /></label>'
    ).join("");
  }
  function renderDialog() {
    const kind = ui["shape-type"].value || "square";
    ui["dialog-title"].textContent = t().dialogTitle;
    ui["shape-type-label"].textContent = t().typeLabel;
    ui["quantity-label"].textContent = t().quantity;
    ui["cancel-shape"].textContent = t().cancel;
    ui["create-shape"].textContent = t().create;
    ui["shape-type"].innerHTML = ["square", "rectangle", "triangle", "trapezoid", "ellipse", "circle"]
      .map((type) => '<option value="' + type + '"' + (type === kind ? ' selected' : '') + '>' + t().shape[type] + '</option>').join("");
    ui["shape-fields"].innerHTML = shapeFieldMarkup(kind);
    ui["shape-error"].textContent = "";
  }
  function polygonPoints(kind, value) {
    if (kind === "square") {
      const s = value.side;
      return [{ x: 0, y: 0 }, { x: s, y: 0 }, { x: s, y: -s }, { x: 0, y: -s }];
    }
    if (kind === "rectangle") {
      const w = value.width, h = value.height;
      return [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: -h }, { x: 0, y: -h }];
    }
    if (kind === "triangle") {
      const a = value.first, b = value.second, c = value.third;
      if (Math.max(a, b, c) >= a + b + c - Math.max(a, b, c)) return null;
      const x = (a * a + c * c - b * b) / (2 * a);
      const h = Math.sqrt(Math.max(0, c * c - x * x));
      return [{ x: 0, y: 0 }, { x: a, y: 0 }, { x, y: -h }];
    }
    const d = value.bottom - value.top;
    if (Math.abs(d) < 1e-8) return null;
    const x = (value.left ** 2 - value.right ** 2 + d ** 2) / (2 * d);
    const h2 = value.left ** 2 - x ** 2;
    if (h2 <= 1e-8) return null;
    const h = Math.sqrt(h2);
    return [{ x: 0, y: 0 }, { x: value.bottom, y: 0 }, { x: x + value.top, y: -h }, { x, y: -h }];
  }
  function placeShape() {
    const kind = ui["shape-type"].value;
    const quantity = Number(ui["quantity-input"].value);
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      ui["shape-error"].textContent = t().invalidQuantity; return;
    }
    const value = Object.fromEntries(shapeFields[kind].map(([name]) =>
      [name, Number(ui["shape-fields"].querySelector('[name="' + name + '"]').value)]));
    if (Object.values(value).some((number) => !Number.isFinite(number) || number <= 0)) {
      ui["shape-error"].textContent = t().invalidShape; return;
    }
    if (kind === "circle" || kind === "ellipse") {
      const rx = (kind === "circle" ? value.radius : value.radiusX) * SCALE;
      const ry = (kind === "circle" ? value.radius : value.radiusY) * SCALE;
      if (!Number.isFinite(rx) || !Number.isFinite(ry)) { ui["shape-error"].textContent = t().invalidShape; return; }
      record();
      const newCurves = [];
      for (let index = 0; index < quantity; index += 1) {
        const position = nextPosition(rx * 2, ry * 2);
        newCurves.push({ id: nextId(), kind, cx: position.x + rx, cy: position.y + ry,
          rx, ry, ...state.drawStyle });
      }
      newCurves.forEach((curve) => state.curves.push(curve));
      state.selected = quantity === 1 ? new Set([key(newCurves[0].id)]) : new Set();
    } else {
      const points = polygonPoints(kind, value);
      if (!points) { ui["shape-error"].textContent = kind === "triangle" ? t().invalidTriangle : t().invalidTrapezoid; return; }
      const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      if (![minX, maxX, minY, maxY].every(Number.isFinite) ||
        !Number.isFinite((maxX - minX) * SCALE) || !Number.isFinite((maxY - minY) * SCALE)) {
        ui["shape-error"].textContent = t().invalidShape; return;
      }
      record();
      const newSegments = [];
      let lastGroup = [];
      for (let copy = 0; copy < quantity; copy += 1) {
        const position = nextPosition((maxX - minX) * SCALE, (maxY - minY) * SCALE);
        const placed = points.map((p) => ({ x: position.x + (p.x - minX) * SCALE,
          y: position.y + (p.y - minY) * SCALE }));
        lastGroup = placed.map((a, index) => ({
          id: nextId(), length: Math.hypot(placed[(index + 1) % placed.length].x - a.x,
            placed[(index + 1) % placed.length].y - a.y) / SCALE,
          a: { ...a }, b: { ...placed[(index + 1) % placed.length] }, ...state.drawStyle
        }));
        lastGroup.forEach((segment) => newSegments.push(segment));
      }
      newSegments.forEach((segment) => state.segments.push(segment));
      state.selected = quantity === 1 ? new Set(lastGroup.map((segment) => key(segment.id))) : new Set();
    }
    state.error = null;
    ui["shape-dialog"].close();
    render();
  }
  function changeLength() {
    const length = readLength();
    if (length === null || state.selected.size !== 1) return;
    const segment = selectedSegments()[0];
    if (!segment) return;
    const dx = segment.b.x - segment.a.x, dy = segment.b.y - segment.a.y;
    const old = Math.hypot(dx, dy) || 1;
    const candidate = cloneSegments(state.segments);
    const item = candidate.find((entry) => entry.id === segment.id);
    item.length = length;
    item.b = { x: item.a.x + dx / old * length * SCALE, y: item.a.y + dy / old * length * SCALE };
    if (!validCoordinates(candidate, state.curves)) { state.error = t().invalidLength; render(); return; }
    record();
    state.segments = candidate;
    state.error = null;
    render();
  }
  function splitSegment(segment, lengths) {
    const pieces = geometry.splitSegmentByLengths(segment, lengths, SCALE);
    if (!pieces) return false;
    record();
    const index = state.segments.findIndex((item) => item.id === segment.id);
    pieces.forEach((piece, part) => { piece.id = part === 0 ? segment.id : nextId(); });
    remapFaceFills([segment.id], pieces.map((piece) => piece.id));
    state.segments.splice(index, 1, ...pieces);
    state.selected = new Set(pieces.map((piece) => key(piece.id)));
    state.error = null;
    render();
    return true;
  }
  function mergeSelection() {
    const selected = selectedSegments();
    if (selected.length < 2 || selected.length !== state.selected.size) return;
    const merged = geometry.mergeCollinearSegments(selected, state.segments, SCALE);
    if (!merged) { state.error = t().mergeInvalid; render(); return; }
    record();
    const selectedIds = new Set(selected.map((item) => item.id));
    const index = state.segments.findIndex((item) => selectedIds.has(item.id));
    remapFaceFills([...selectedIds], [merged.id]);
    state.segments = state.segments.filter((item) => !selectedIds.has(item.id));
    state.segments.splice(index, 0, merged);
    state.selected = new Set([key(merged.id)]);
    state.error = null;
    closePanels();
    render();
  }
  function openSplitDialog() {
    const selected = selectedSegments();
    if (selected.length !== 1 || state.selected.size !== 1) return;
    const segment = selected[0], w = t();
    ui["split-dialog-title"].textContent = w.splitTitle;
    ui["split-source"].textContent = w.splitSource(fmt(segment.length));
    ui["split-kind-label"].textContent = w.splitKind;
    ui["split-kind"].options[0].textContent = w.splitEqual;
    ui["split-kind"].options[1].textContent = w.splitCustom;
    ui["split-count-label"].textContent = w.splitCount;
    ui["split-lengths-label"].textContent = w.splitLengths;
    ui["cancel-split"].textContent = w.cancel;
    ui["confirm-split"].textContent = w.splitConfirm;
    ui["split-kind"].value = "equal";
    ui["split-count"].value = "2";
    ui["split-lengths"].value = fmt(segment.length / 2) + ", " + fmt(segment.length / 2);
    ui["split-count-field"].hidden = false;
    ui["split-lengths-field"].hidden = true;
    ui["split-error"].textContent = "";
    closePanels();
    ui["split-dialog"].showModal();
  }
  ui["split-kind"].addEventListener("change", () => {
    const custom = ui["split-kind"].value === "custom";
    ui["split-count-field"].hidden = custom;
    ui["split-lengths-field"].hidden = !custom;
    ui["split-error"].textContent = "";
  });
  ui["split-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    const segment = selectedSegments()[0];
    if (!segment || state.selected.size !== 1) { ui["split-dialog"].close(); return; }
    let lengths;
    if (ui["split-kind"].value === "equal") {
      const count = Number(ui["split-count"].value);
      if (!Number.isSafeInteger(count) || count < 2) {
        ui["split-error"].textContent = t().splitInvalid; return;
      }
      lengths = Array.from({ length: count }, (_, index) =>
        index === count - 1 ? segment.length - segment.length / count * (count - 1) : segment.length / count);
    } else {
      lengths = ui["split-lengths"].value.trim().split(/[,，、;；\s]+/).map(Number);
      if (lengths.length < 2 || lengths.some((length) => !lengthIsValid(length))) {
        ui["split-error"].textContent = t().splitInvalid; return;
      }
    }
    if (Math.abs(lengths.reduce((sum, length) => sum + length, 0) - segment.length) >
      1e-8 * Math.max(1, segment.length)) {
      ui["split-error"].textContent = t().splitSum; return;
    }
    if (!splitSegment(segment, lengths)) { ui["split-error"].textContent = t().splitInvalid; return; }
    ui["split-dialog"].close();
  });
  ui["cancel-split"].addEventListener("click", () => ui["split-dialog"].close());
  ui["split-button"].addEventListener("click", openSplitDialog);
  ui["merge-button"].addEventListener("click", mergeSelection);
  function toCanvas(event) {
    const point = ui.canvas.createSVGPoint();
    point.x = event.clientX; point.y = event.clientY;
    return point.matrixTransform(ui.canvas.getScreenCTM().inverse());
  }
  function translateSelection(originalSegments, originalCurves, selected, dx, dy) {
    const segments = cloneSegments(originalSegments);
    const curves = cloneCurves(originalCurves);
    segments.forEach((segment) => {
      if (!selected.has(key(segment.id))) return;
      for (const end of ["a", "b"]) { segment[end].x += dx; segment[end].y += dy; }
    });
    curves.forEach((curve) => {
      if (selected.has(key(curve.id))) { curve.cx += dx; curve.cy += dy; }
    });
    return { segments, curves };
  }
  function snapSingleSegment(id) {
    const segment = state.segments.find((item) => item.id === id);
    if (!segment) return;
    let closest = null;
    for (const end of ["a", "b"]) for (const other of state.segments) {
      if (other.id === id) continue;
      for (const otherEnd of ["a", "b"]) {
        const dx = other[otherEnd].x - segment[end].x, dy = other[otherEnd].y - segment[end].y;
        const distance = Math.hypot(dx, dy);
        if (distance <= 18 && (!closest || distance < closest.distance)) closest = { dx, dy, distance };
      }
    }
    if (!closest) return;
    const moved = translateSelection(state.segments, state.curves, new Set([key(id)]), closest.dx, closest.dy);
    if (validCoordinates(moved.segments, moved.curves)) state.segments = moved.segments;
  }
  function selectionFromBox(box) {
    const selected = new Set();
    state.segments.forEach(({ id, a, b }) => {
      if ([a, b].every((p) => p.x >= box.left && p.x <= box.right && p.y >= box.top && p.y <= box.bottom)) selected.add(key(id));
    });
    state.curves.forEach(({ id, cx, cy, rx, ry }) => {
      if (cx - rx >= box.left && cx + rx <= box.right && cy - ry >= box.top && cy + ry <= box.bottom) selected.add(key(id));
    });
    return selected;
  }
  function showSelectionBox(start, pointer) {
    const left = Math.min(start.x, pointer.x), top = Math.min(start.y, pointer.y);
    ui["selection-box"].hidden = false;
    ui["selection-box"].setAttribute("x", left);
    ui["selection-box"].setAttribute("y", top);
    ui["selection-box"].setAttribute("width", Math.abs(pointer.x - start.x));
    ui["selection-box"].setAttribute("height", Math.abs(pointer.y - start.y));
  }
  ui.canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.button !== 1) return;
    ui.canvas.focus?.({ preventScroll: true });
    if (state.spaceDown || event.button === 1) {
      state.drag = { kind: "pan", screenX: event.clientX, screenY: event.clientY,
        panX: state.pan.x, panY: state.pan.y };
      ui.canvas.parentElement.classList.toggle("pan-dragging", true);
      ui.canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    const target = event.target;
    if (state.splitMode) {
      const segment = state.segments.find((item) => key(item.id) === target.dataset.id);
      if (!segment || target.dataset.endpoint !== undefined) return;
      const pointer = toCanvas(event);
      const dx = segment.b.x - segment.a.x, dy = segment.b.y - segment.a.y;
      const ratio = ((pointer.x - segment.a.x) * dx + (pointer.y - segment.a.y) * dy) / (dx * dx + dy * dy);
      if (!Number.isFinite(ratio) || ratio <= 0 || ratio >= 1 ||
        segment.length * Math.min(ratio, 1 - ratio) < 0.01) {
        state.error = t().splitPointInvalid; render(); return;
      }
      splitSegment(segment, [segment.length * ratio, segment.length * (1 - ratio)]);
      event.preventDefault();
      return;
    }
    if (state.connectMode) {
      const endpoint = target.dataset.endpoint;
      if (endpoint === undefined) return;
      const source = state.segments.find((item) => key(item.id) === target.dataset.id);
      if (!source) return;
      record();
      const anchor = { ...source[endpoint] };
      const id = nextId();
      state.segments.push({ id, length: 0.01, a: anchor, b: { ...anchor }, ...state.drawStyle });
      state.selected = new Set([key(id)]);
      state.error = null;
      state.drag = { kind: "draw", id, moved: false };
      render();
      ui.canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    const face = target.dataset.face && faces().find((item) => item.key === target.dataset.face);
    const groupId = face ? String(face.group[0].id) : target.dataset.group;
    const id = target.dataset.id === undefined ? groupId : target.dataset.id;
    const start = toCanvas(event);
    state.selectedFaceKey = face ? face.key : null;
    if (id === undefined) {
      state.drag = { kind: "box", start, pointer: start, moved: false };
      ui["selection-box"].hidden = true;
    } else {
      const segment = state.segments.find((item) => key(item.id) === id);
      const endpoint = target.dataset.endpoint;
      if (segment) ui["length-input"].value = fmt(segment.length);
      if (event.shiftKey && segment && !endpoint) {
        if (state.selected.has(id)) state.selected.delete(id);
        else state.selected.add(id);
        state.error = null; render(); event.preventDefault(); return;
      }
      if (endpoint && segment) {
        const group = groupFor(segment.id);
        state.selected = new Set([id]);
        state.drag = { kind: "joint", id: segment.id, endpoint, start,
          segments: cloneSegments(state.segments), curves: cloneCurves(state.curves),
          groupIds: group.map((item) => item.id), moved: false, before: snapshot(), resized: false };
      } else {
        if (segment && state.mode === "group") expandSelectionToGroups();
        if (face) {
          state.selected = new Set(face.group.map((item) => key(item.id)));
        } else if (groupId !== undefined) {
          state.selected = new Set(groupFor(Number(groupId)).map((item) => key(item.id)));
        } else if (!state.selected.has(id)) {
          state.selected = new Set(segment && state.mode === "group"
            ? groupFor(segment.id).map((item) => key(item.id)) : [id]);
        }
        state.drag = { kind: "move", start, segments: cloneSegments(state.segments),
          curves: cloneCurves(state.curves), selected: new Set(state.selected), moved: false, before: snapshot() };
      }
      state.error = null;
      render();
    }
    ui.canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  ui.canvas.addEventListener("pointermove", (event) => {
    const drag = state.drag;
    if (!drag) return;
    if (drag.kind === "pan") {
      state.pan.x = drag.panX - (event.clientX - drag.screenX) / state.zoom;
      state.pan.y = drag.panY - (event.clientY - drag.screenY) / state.zoom;
      syncViewport();
      return;
    }
    if (drag.kind === "draw") {
      const pointer = toCanvas(event);
      const segment = state.segments.find((item) => item.id === drag.id);
      if (!segment) { state.drag = null; return; }
      let target = pointer;
      if (event.ctrlKey) {
        const dx = pointer.x - segment.a.x, dy = pointer.y - segment.a.y;
        const distance = Math.hypot(dx, dy);
        const snapped = Math.round(distance / SCALE) * SCALE;
        target = distance ? { x: segment.a.x + dx / distance * snapped,
          y: segment.a.y + dy / distance * snapped } : { ...segment.a };
      } else {
        let best = null;
        for (const other of state.segments) {
          if (other.id === drag.id) continue;
          for (const end of ["a", "b"]) {
            const snapX = other[end].x - pointer.x, snapY = other[end].y - pointer.y;
            const distance = Math.hypot(snapX, snapY);
            if (distance <= 18 && (!best || distance < best.distance)) best = { x: other[end].x, y: other[end].y, distance };
          }
        }
        if (best) target = best;
      }
      segment.b = { x: target.x, y: target.y };
      segment.length = Math.max(0.01, Math.hypot(segment.b.x - segment.a.x, segment.b.y - segment.a.y) / SCALE);
      drag.moved = Math.hypot(segment.b.x - segment.a.x, segment.b.y - segment.a.y) >= 3;
      ui["length-input"].value = fmt(segment.length);
      render();
      return;
    }
    const pointer = toCanvas(event);
    let dx = pointer.x - drag.start.x, dy = pointer.y - drag.start.y;
    if (drag.kind === "box") {
      drag.pointer = pointer;
      if (Math.hypot(dx, dy) >= 3) drag.moved = true;
      if (drag.moved) showSelectionBox(drag.start, pointer);
      return;
    }
    if (Math.hypot(dx, dy) < 1.5 && !drag.moved) return;
    let candidate;
    if (drag.kind === "move") {
      drag.ctrlConstrained = Boolean(event.ctrlKey);
      if (event.ctrlKey) {
        if (!drag.axisLock) drag.axisLock = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        if (drag.axisLock === "x") dy = 0;
        else dx = 0;
      } else drag.axisLock = null;
      candidate = translateSelection(drag.segments, drag.curves, drag.selected, dx, dy);
    } else {
      const group = drag.groupIds.map((id) => drag.segments.find((segment) => segment.id === id));
      const index = group.findIndex((segment) => segment.id === drag.id);
      const segment = group[index];
      const origin = segment[drag.endpoint];
      const anchor = segment[drag.endpoint === "a" ? "b" : "a"];
      const axisX = (origin.x - anchor.x) / (segment.length * SCALE);
      const axisY = (origin.y - anchor.y) / (segment.length * SCALE);
      const along = dx * axisX + dy * axisY;
      const across = dx * axisY - dy * axisX;
      const resize = Math.abs(along) > 3 && Math.abs(across) <= Math.abs(along) * Math.tan(Math.PI / 10);
      let target = { x: origin.x + dx, y: origin.y + dy };
      if (resize) {
        const change = event.ctrlKey ? Math.round(along / SCALE) : along / SCALE;
        const newLength = Math.max(0.01, segment.length + change);
        group[index] = { ...segment, length: newLength };
        target = { x: anchor.x + axisX * newLength * SCALE, y: anchor.y + axisY * newLength * SCALE };
      }
      const moved = geometry.moveLooseJoint(group, index, drag.endpoint, target, SCALE);
      const replacements = new Map(moved.map((segment) => [segment.id, segment]));
      candidate = { segments: drag.segments.map((segment) => replacements.get(segment.id) || segment),
        curves: drag.curves };
      drag.resized = resize;
    }
    if (!validCoordinates(candidate.segments, candidate.curves)) return;
    if (drag.kind === "joint" && !geometry.looseSegmentPerimeterState(
      candidate.segments.filter((segment) => drag.groupIds.includes(segment.id)), SCALE).valid) return;
    drag.moved = true;
    state.segments = candidate.segments;
    state.curves = candidate.curves;
    if (drag.kind === "joint" && drag.resized) ui["length-input"].value = fmt(state.segments.find((item) => item.id === drag.id).length);
    render();
  });
  function finishDrag() {
    const drag = state.drag;
    if (!drag) return;
    if (drag.kind === "pan") {
      ui.canvas.parentElement.classList.toggle("pan-dragging", false);
      state.drag = null; render(); return;
    }
    if (drag.kind === "draw") {
      if (!drag.moved) {
        state.segments = state.segments.filter((segment) => segment.id !== drag.id);
        state.selected.clear();
        state.history.pop();
      }
      state.drag = null;
      render();
      return;
    }
    if (drag.kind === "box") {
      ui["selection-box"].hidden = true;
      if (drag.moved) {
        const box = { left: Math.min(drag.start.x, drag.pointer.x), right: Math.max(drag.start.x, drag.pointer.x),
          top: Math.min(drag.start.y, drag.pointer.y), bottom: Math.max(drag.start.y, drag.pointer.y) };
        state.selected = selectionFromBox(box);
      } else state.selected.clear();
    } else if (drag.kind === "move" && drag.moved && drag.selected.size === 1 && !drag.ctrlConstrained) {
      const id = Number([...drag.selected][0]);
      snapSingleSegment(id);
    }
    if (drag.moved && drag.before) {
      record(drag.before);
    }
    state.drag = null;
    render();
  }
  ui.canvas.addEventListener("pointerup", finishDrag);
  ui.canvas.addEventListener("pointercancel", finishDrag);
  ui["add-button"].addEventListener("click", addSegment);
  ui["change-button"].addEventListener("click", changeLength);
  function openShapeDialog() { renderDialog(); ui["shape-dialog"].showModal(); }
  ui["shape-button"].addEventListener("click", openShapeDialog);
  function openShortcuts() { closePanels(); renderShortcuts(); ui["shortcuts-dialog"].showModal(); }
  ui["shortcuts-button"].addEventListener("click", openShortcuts);
  ui["close-shortcuts"].addEventListener("click", () => ui["shortcuts-dialog"].close());
  ui["shape-type"].addEventListener("change", () => {
    ui["shape-fields"].innerHTML = shapeFieldMarkup(ui["shape-type"].value);
    ui["shape-error"].textContent = "";
  });
  ui["shape-form"].addEventListener("submit", (event) => { event.preventDefault(); placeShape(); });
  ui["cancel-shape"].addEventListener("click", () => ui["shape-dialog"].close());
  function setMoveMode(mode) {
    state.connectMode = false;
    state.splitMode = false;
    state.mode = mode;
    if (mode === "single") { state.selected.clear(); state.selectedFaceKey = null; }
    if (mode === "group" && state.selected.size) expandSelectionToGroups();
    render();
  }
  for (const mode of ["single", "group"]) {
    ui[mode + "-mode"].addEventListener("click", () => setMoveMode(mode));
  }
  ui["undo-button"].addEventListener("click", undo);
  function copySelected() {
    if (!state.selected.size) return;
    state.clipboard = { segments: cloneSegments(selectedSegments()),
      curves: cloneCurves(state.curves.filter((curve) => state.selected.has(key(curve.id)))),
      faceFills: faceFillRecords(selectedSegments()) };
    state.pasteCount = 0;
    render();
  }
  function paste() {
    if (!state.clipboard) return;
    record();
    state.pasteCount += 1;
    const points = state.clipboard.segments.flatMap(({ a, b }) => [a, b]);
    state.clipboard.curves.forEach(({ cx, cy, rx, ry }) => {
      points.push({ x: cx - rx, y: cy - ry }, { x: cx + rx, y: cy + ry });
    });
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const shiftX = (maxX - minX + 48) * state.pasteCount;
    const shiftY = 48 * state.pasteCount;
    const ids = [], idMap = new Map();
    state.clipboard.segments.forEach((segment) => {
      const id = nextId(); ids.push(key(id));
      idMap.set(segment.id, id);
      state.segments.push({ ...segment, id,
        a: { x: segment.a.x + shiftX, y: segment.a.y + shiftY },
        b: { x: segment.b.x + shiftX, y: segment.b.y + shiftY } });
    });
    state.clipboard.curves.forEach((curve) => {
      const id = nextId(); ids.push(key(id));
      state.curves.push({ ...curve, id, cx: curve.cx + shiftX, cy: curve.cy + shiftY });
    });
    (state.clipboard.faceFills || []).forEach(({ ids: oldIds, fill }) => {
      if (oldIds.every((id) => idMap.has(id))) state.faceFills.set(faceKey(oldIds.map((id) => idMap.get(id))), fill);
    });
    state.selected = new Set(ids);
    const width = ui.canvas.getBoundingClientRect().width || 1000;
    if (minX + shiftX >= state.pan.x + width / state.zoom - 60) state.pan.x = minX + shiftX - 80;
    render();
  }
  function closePanels() {
    ui["style-panel"].hidden = true;
    ui["more-menu"].hidden = true;
    ui["library-panel"].hidden = true;
    ui["style-button"].setAttribute("aria-expanded", "false");
    ui["more-button"].setAttribute("aria-expanded", "false");
    ui["library-button"].setAttribute("aria-expanded", "false");
  }
  function togglePanel(button, panel) {
    const opening = Boolean(panel.hidden);
    closePanels();
    if (opening) {
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
    }
  }
  ui["style-button"].addEventListener("click", () => togglePanel(ui["style-button"], ui["style-panel"]));
  ui["more-button"].addEventListener("click", () => togglePanel(ui["more-button"], ui["more-menu"]));
  ui["library-button"].addEventListener("click", () => togglePanel(ui["library-button"], ui["library-panel"]));
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest && event.target.closest(".menu-wrap")) return;
    closePanels();
  });
  ui["connect-mode"].addEventListener("click", () => {
    state.connectMode = !state.connectMode;
    if (state.connectMode) state.splitMode = false;
    render();
  });
  ui["split-mode"].addEventListener("click", () => {
    state.splitMode = !state.splitMode;
    if (state.splitMode) state.connectMode = false;
    render();
  });
  ui["save-shape-button"].addEventListener("click", () => {
    if (!state.selected.size) return;
    const segments = selectedSegments();
    const curves = state.curves.filter((curve) => state.selected.has(key(curve.id)));
    if (!segments.length && !curves.length) return;
    const active = activeObject();
    let base = t().combo;
    if (active && active.type === "segments") {
      const model = groupState(active.segments);
      if (model.closed) base = shapeName(model.shape, active.segments.length);
    } else if (active && active.type === "curve") base = shapeName(active.curve.kind, 0);
    state.library.push(libraryEntry(segments, curves, base));
    persistLibrary();
    render();
  });
  function openNameDialog(action, index = -1) {
    state.nameAction = { action, index };
    ui["name-dialog-title"].textContent = action === "save" ? t().saveCanvas : t().renameSaved;
    ui["name-label"].textContent = t().nameLabel;
    ui["cancel-name"].textContent = t().cancel;
    ui["confirm-name"].textContent = t().save;
    ui["name-input"].value = action === "save" ? libraryName(t().wholeCanvas) : state.library[index].name;
    ui["name-error"].textContent = "";
    closePanels();
    ui["name-dialog"].showModal();
    ui["name-input"].select?.();
  }
  ui["save-canvas"].addEventListener("click", () => {
    if (state.segments.length || state.curves.length) openNameDialog("save");
  });
  ui["name-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    const name = ui["name-input"].value.trim();
    if (!name) { ui["name-error"].textContent = t().nameRequired; return; }
    const action = state.nameAction;
    if (!action) return;
    if (action.action === "save") {
      state.library.push(libraryEntry(state.segments, state.curves, name));
    } else if (state.library[action.index]) {
      state.library[action.index].name = libraryName(name, action.index);
    }
    persistLibrary();
    state.nameAction = null;
    ui["name-dialog"].close();
    ui["library-panel"].hidden = false;
    ui["library-button"].setAttribute("aria-expanded", "true");
    render();
  });
  ui["cancel-name"].addEventListener("click", () => { state.nameAction = null; ui["name-dialog"].close(); });
  ui["name-dialog"].addEventListener("close", () => { state.nameAction = null; });
  ui["library-list"].addEventListener("click", (event) => {
    const data = event.target.dataset || {};
    if (data.insert !== undefined) { insertSaved(Number(data.insert)); closePanels(); return; }
    if (data.rename !== undefined) {
      const index = Number(data.rename);
      if (state.library[index]) openNameDialog("rename", index);
      return;
    }
    if (data.remove !== undefined) {
      state.library.splice(Number(data.remove), 1);
      persistLibrary();
      render();
    }
  });
  ui["copy-button"].addEventListener("click", () => { copySelected(); closePanels(); });
  ui["paste-button"].addEventListener("click", () => { paste(); closePanels(); });
  ui["zoom-in"].addEventListener("click", () => setZoom(state.zoom * 1.25));
  ui["zoom-out"].addEventListener("click", () => setZoom(state.zoom / 1.25));
  ui["zoom-reset"].addEventListener("click", () => setZoom(1));
  ui["zoom-fit"].addEventListener("click", zoomFit);
  ui["color-palette"].addEventListener("click", (event) => {
    const color = event.target.dataset.color;
    if (!color) return;
    applyStyle("color", color);
  });
  function applyFill(fill) {
    if (fill !== "none" && !/^#[0-9a-f]{6}$/i.test(fill)) return;
    const face = state.selectedFaceKey ? selectedFace() : null;
    if (face) {
      if (state.faceFills.get(face.key) === fill) return;
      record();
      state.faceFills.set(face.key, fill);
      state.error = null;
      render();
      return;
    }
    const active = activeObject();
    if (!state.selected.size || !active ||
      (active.type === "segments" && !groupState(active.segments).closed)) return;
    const items = active.type === "curve" ? [active.curve] : active.segments;
    const name = active.type === "segments" ? faceKey(items.map((item) => item.id)) : null;
    if (items.every((item) => item.fill === fill) && (!name || state.faceFills.get(name) === fill)) return;
    record();
    items.forEach((item) => { item.fill = fill; });
    if (name) state.faceFills.set(name, fill);
    state.error = null;
    render();
  }
  ui["fill-palette"].addEventListener("click", (event) => {
    if (event.target.dataset.color) applyFill(event.target.dataset.color);
  });
  ui["fill-input"].addEventListener("change", () => applyFill(ui["fill-input"].value));
  ui["clear-fill"].addEventListener("click", () => applyFill("none"));
  function toggleLabels() { record(); state.labelsVisible = !state.labelsVisible; render(); }
  ui["labels-button"].addEventListener("click", toggleLabels);
  function applyStyle(property, value) {
    if (property === "color" && !/^#[0-9a-f]{6}$/i.test(value)) return;
    if (property === "width" && (!Number.isFinite(value) || value <= 0)) {
      state.error = t().invalidWidth; render(); return;
    }
    if (property === "dash" && !["solid", "dashed"].includes(value)) return;
    if (state.drawStyle[property] === value && ![...state.selected].some((id) => {
      const item = state.segments.find((segment) => key(segment.id) === id) || state.curves.find((curve) => key(curve.id) === id);
      return item && item[property] !== value;
    })) return;
    record();
    state.drawStyle[property] = value;
    state.segments.forEach((segment) => { if (state.selected.has(key(segment.id))) segment[property] = value; });
    state.curves.forEach((curve) => { if (state.selected.has(key(curve.id))) curve[property] = value; });
    state.error = null;
    render();
  }
  ui["color-input"].addEventListener("change", () => applyStyle("color", ui["color-input"].value));
  ui["width-input"].addEventListener("change", () => applyStyle("width", Number(ui["width-input"].value)));
  ui["dash-input"].addEventListener("change", () => applyStyle("dash", ui["dash-input"].value));
  ui["handle-size-input"].addEventListener("change", () => {
    const size = Number(ui["handle-size-input"].value);
    if (!ui["handle-size-input"].value || !Number.isFinite(size) || size < 0) {
      state.error = t().invalidHandleSize; render(); return;
    }
    if (size !== state.handleSize) { record(); state.handleSize = size; }
    state.error = null; render();
  });
  function removeSelected() {
    if (!state.selected.size) return;
    record();
    const removed = new Set([...state.selected].map(Number));
    [...state.faceFills.keys()].forEach((name) => {
      if (name.split(",").some((id) => removed.has(Number(id)))) state.faceFills.delete(name);
    });
    state.segments = state.segments.filter((segment) => !state.selected.has(key(segment.id)));
    state.curves = state.curves.filter((curve) => !state.selected.has(key(curve.id)));
    state.selected.clear();
    state.selectedFaceKey = null;
    render();
  }
  ui["delete-button"].addEventListener("click", removeSelected);
  function isEditable(node) {
    return ["INPUT", "TEXTAREA", "SELECT"].includes(node?.tagName?.toUpperCase()) || Boolean(node?.isContentEditable);
  }
  document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Escape") {
      if (ui["shortcuts-dialog"].open) ui["shortcuts-dialog"].close();
      else if (ui["shape-dialog"].open) ui["shape-dialog"].close();
      else if (ui["split-dialog"].open) ui["split-dialog"].close();
      else if (ui["name-dialog"].open) { state.nameAction = null; ui["name-dialog"].close(); }
      else if (!ui["style-panel"].hidden || !ui["more-menu"].hidden || !ui["library-panel"].hidden) closePanels();
      else if (!isEditable(document.activeElement)) {
        if (state.connectMode) state.connectMode = false;
        else if (state.splitMode) state.splitMode = false;
        else { state.selected.clear(); state.selectedFaceKey = null; }
        render();
      } else return;
      event.preventDefault();
      return;
    }
    if (ui["shape-dialog"].open || ui["shortcuts-dialog"].open || ui["name-dialog"].open || ui["split-dialog"].open ||
      isEditable(document.activeElement) || isEditable(event.target) || state.drag) return;
    if (event.repeat || event.altKey) return;
    if (event.code === "Space" || event.key === " ") {
      if (document.activeElement?.tagName?.toUpperCase() === "BUTTON") return;
      state.spaceDown = true; render(); event.preventDefault(); return;
    }
    if ((event.ctrlKey || event.metaKey) && !event.altKey) {
      const key = event.key.toLowerCase();
      if (["z", "c", "v", "a"].includes(key) && !(key === "z" && event.shiftKey)) {
        event.preventDefault();
        if (key === "z") undo();
        else if (key === "c") copySelected();
        else if (key === "v") paste();
        else { state.selected = new Set(state.segments.concat(state.curves).map((item) => String(item.id))); render(); }
      } else if (key === "=" || key === "+") { event.preventDefault(); setZoom(state.zoom * 1.25); }
      else if (key === "-") { event.preventDefault(); setZoom(state.zoom / 1.25); }
      else if (key === "0") { event.preventDefault(); setZoom(1); }
      return;
    }
    if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); removeSelected(); return; }
    if (event.key === "?") { event.preventDefault(); openShortcuts(); return; }
    const shortcut = event.key.toLowerCase();
    if (event.shiftKey && shortcut !== "n") return;
    const actions = {
      n: () => event.shiftKey ? openShapeDialog() : addSegment(),
      1: () => setMoveMode("single"), 2: () => setMoveMode("group"),
      3: () => { state.connectMode = true; state.splitMode = false; render(); },
      4: () => { state.splitMode = true; state.connectMode = false; render(); },
      x: openSplitDialog,
      j: mergeSelection,
      l: toggleLabels,
      s: () => togglePanel(ui["style-button"], ui["style-panel"]),
      b: () => togglePanel(ui["library-button"], ui["library-panel"]),
      m: () => togglePanel(ui["more-button"], ui["more-menu"]),
      f: zoomFit
    };
    if (actions[shortcut]) { event.preventDefault(); actions[shortcut](); }
  });
  document.addEventListener("keyup", (event) => {
    if (event.code === "Space") { state.spaceDown = false; render(); }
  });
  ui["clear-button"].addEventListener("click", () => {
    if (!(state.segments.length + state.curves.length) || !window.confirm(t().clearConfirm)) return;
    record();
    state.segments = []; state.curves = []; state.selected.clear();
    state.faceFills.clear(); state.selectedFaceKey = null;
    state.layout = { x: 80, y: 80, rowHeight: 0 }; state.pan = { x: 0, y: 0 }; state.zoom = 1;
    state.error = null; closePanels(); render();
  });
  window.addEventListener?.("resize", syncViewport);
  window.addEventListener?.("blur", () => {
    if (state.spaceDown) { state.spaceDown = false; render(); }
  });
  ui["language-button"].addEventListener("click", () => {
    state.language = state.language === "zh-CN" ? "en-US" : "zh-CN";
    try { localStorage.setItem("math-lab-language", state.language); } catch (_) {}
    if (ui["shape-dialog"].open) renderDialog();
    render();
  });
  render();
})();

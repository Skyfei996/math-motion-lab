const DEFAULT_MARGIN = 8;
const DEFAULT_RIGHT_OFFSET = 24;
const DEFAULT_BOTTOM_OFFSET = 24;

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeDisplay(display, index) {
  const area = display?.workArea ?? display;
  if (
    !area
    || !finiteNumber(area.x)
    || !finiteNumber(area.y)
    || !finiteNumber(area.width)
    || !finiteNumber(area.height)
    || area.width <= 0
    || area.height <= 0
  ) return null;

  return {
    id: String(display.id ?? display.name ?? `display-${index}`),
    primary: Boolean(display.primary),
    x: area.x,
    y: area.y,
    width: area.width,
    height: area.height
  };
}

function containsPoint(display, x, y) {
  return x >= display.x
    && x < display.x + display.width
    && y >= display.y
    && y < display.y + display.height;
}

function clamp(value, minimum, maximum) {
  if (maximum < minimum) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

export function resolveWindowPlacement({
  displays,
  windowSize,
  savedPlacement = null,
  margin = DEFAULT_MARGIN
}) {
  const normalizedDisplays = Array.isArray(displays)
    ? displays.map(normalizeDisplay).filter(Boolean)
    : [];
  if (normalizedDisplays.length === 0) return null;

  const width = finiteNumber(windowSize?.width) && windowSize.width > 0
    ? windowSize.width
    : 112;
  const height = finiteNumber(windowSize?.height) && windowSize.height > 0
    ? windowSize.height
    : 128;

  const savedX = finiteNumber(savedPlacement?.x) ? savedPlacement.x : null;
  const savedY = finiteNumber(savedPlacement?.y) ? savedPlacement.y : null;
  const savedDisplay = normalizedDisplays.find(
    (display) => display.id === savedPlacement?.displayId
  );
  const displayAtSavedPoint = savedX === null || savedY === null
    ? null
    : normalizedDisplays.find((display) => containsPoint(display, savedX, savedY));
  const display = displayAtSavedPoint
    ?? savedDisplay
    ?? normalizedDisplays.find((item) => item.primary)
    ?? normalizedDisplays[0];

  const desiredX = savedX ?? display.x + display.width - width - DEFAULT_RIGHT_OFFSET;
  const desiredY = savedY ?? display.y + display.height - height - DEFAULT_BOTTOM_OFFSET;
  const minimumX = display.x + margin;
  const minimumY = display.y + margin;
  const maximumX = display.x + display.width - width - margin;
  const maximumY = display.y + display.height - height - margin;

  return {
    displayId: display.id,
    x: Math.round(clamp(desiredX, minimumX, maximumX)),
    y: Math.round(clamp(desiredY, minimumY, maximumY)),
    width,
    height
  };
}

export function resolveTaskWindowPlacement({
  displays,
  petBounds,
  windowSize,
  margin = DEFAULT_MARGIN,
  gap = 12
}) {
  const normalizedDisplays = Array.isArray(displays)
    ? displays.map(normalizeDisplay).filter(Boolean)
    : [];
  if (normalizedDisplays.length === 0) return null;

  const width = finiteNumber(windowSize?.width) && windowSize.width > 0
    ? windowSize.width
    : 560;
  const height = finiteNumber(windowSize?.height) && windowSize.height > 0
    ? windowSize.height
    : 420;
  const petX = finiteNumber(petBounds?.x) ? petBounds.x : null;
  const petY = finiteNumber(petBounds?.y) ? petBounds.y : null;
  const petWidth = finiteNumber(petBounds?.width) ? petBounds.width : 112;
  const petHeight = finiteNumber(petBounds?.height) ? petBounds.height : 128;
  const petCenterX = petX === null ? null : petX + petWidth / 2;
  const petCenterY = petY === null ? null : petY + petHeight / 2;
  const display = petCenterX === null || petCenterY === null
    ? normalizedDisplays.find((item) => item.primary) ?? normalizedDisplays[0]
    : normalizedDisplays.find(
      (item) => containsPoint(item, petCenterX, petCenterY)
    ) ?? normalizedDisplays.find((item) => item.primary) ?? normalizedDisplays[0];

  const minimumX = display.x + margin;
  const minimumY = display.y + margin;
  const maximumX = display.x + display.width - width - margin;
  const maximumY = display.y + display.height - height - margin;
  const rightX = petX === null
    ? display.x + (display.width - width) / 2
    : petX + petWidth + gap;
  const leftX = petX === null ? rightX : petX - width - gap;
  const desiredX = rightX <= maximumX ? rightX : leftX;
  const desiredY = petY === null
    ? display.y + (display.height - height) / 2
    : petY + (petHeight - height) / 2;

  return {
    displayId: display.id,
    x: Math.round(clamp(desiredX, minimumX, maximumX)),
    y: Math.round(clamp(desiredY, minimumY, maximumY)),
    width,
    height
  };
}

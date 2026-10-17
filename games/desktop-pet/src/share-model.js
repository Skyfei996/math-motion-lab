export const SHARE_CONSTANTS = Object.freeze({
  fruitCount: 12,
  plateCount: 3,
  targetPerPlate: 4,
  initialCounts: Object.freeze([5, 4, 3])
});

export function createAssignments(counts = SHARE_CONSTANTS.initialCounts) {
  if (!Array.isArray(counts) || counts.length !== SHARE_CONSTANTS.plateCount) {
    throw new Error("Share counts must contain exactly three plates.");
  }

  if (
    counts.some((count) => !Number.isInteger(count) || count < 0)
    || counts.reduce((total, count) => total + count, 0) !== SHARE_CONSTANTS.fruitCount
  ) {
    throw new Error("Share counts must contain twelve whole fruits.");
  }

  return counts.flatMap((count, plate) => Array(count).fill(plate));
}

export function countAssignments(assignments) {
  if (!Array.isArray(assignments)) return null;

  const counts = Array(SHARE_CONSTANTS.plateCount).fill(0);
  for (const plate of assignments) {
    if (!Number.isInteger(plate) || plate < 0 || plate >= SHARE_CONSTANTS.plateCount) {
      return null;
    }
    counts[plate] += 1;
  }
  return counts;
}

export function analyzeAssignments(assignments) {
  const counts = countAssignments(assignments);
  const valid = Boolean(counts) && assignments.length === SHARE_CONSTANTS.fruitCount;

  if (!valid) {
    return {
      valid: false,
      balanced: false,
      counts: counts ?? [],
      total: Array.isArray(assignments) ? assignments.length : 0,
      targetPerPlate: SHARE_CONSTANTS.targetPerPlate
    };
  }

  return {
    valid: true,
    balanced: counts.every((count) => count === SHARE_CONSTANTS.targetPerPlate),
    counts,
    total: assignments.length,
    targetPerPlate: SHARE_CONSTANTS.targetPerPlate
  };
}

export function moveFruit(assignments, fruitIndex, targetPlate) {
  const analysis = analyzeAssignments(assignments);
  if (!analysis.valid) return null;
  if (!Number.isInteger(fruitIndex) || fruitIndex < 0 || fruitIndex >= assignments.length) return null;
  if (!Number.isInteger(targetPlate) || targetPlate < 0 || targetPlate >= SHARE_CONSTANTS.plateCount) return null;
  if (assignments[fruitIndex] === targetPlate) return null;

  const nextAssignments = [...assignments];
  nextAssignments[fruitIndex] = targetPlate;
  return nextAssignments;
}

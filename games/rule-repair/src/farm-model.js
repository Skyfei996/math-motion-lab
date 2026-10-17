const CHICKEN_LEGS = 2;
const RABBIT_LEGS = 4;
const EXTRA_LEGS_PER_RABBIT = RABBIT_LEGS - CHICKEN_LEGS;

function toWholeNumber(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
}

export function analyzeFarm(headsInput, legsInput) {
  const heads = toWholeNumber(headsInput);
  const legs = toWholeNumber(legsInput);

  if (heads === null || heads <= 0) {
    return { valid: false, reason: "invalid-heads" };
  }

  if (legs === null || legs < heads * CHICKEN_LEGS) {
    return { valid: false, reason: "too-few-legs" };
  }

  if (legs > heads * RABBIT_LEGS) {
    return { valid: false, reason: "too-many-legs" };
  }

  const baselineLegs = heads * CHICKEN_LEGS;
  const extraLegs = legs - baselineLegs;

  if (extraLegs % EXTRA_LEGS_PER_RABBIT !== 0) {
    return { valid: false, reason: "unpairable-extra-legs" };
  }

  const rabbits = extraLegs / EXTRA_LEGS_PER_RABBIT;
  const chickens = heads - rabbits;

  return {
    valid: true,
    heads,
    legs,
    baselineLegs,
    extraLegs,
    pairCount: rabbits,
    rabbits,
    chickens,
    checkedHeads: chickens + rabbits,
    checkedLegs: chickens * CHICKEN_LEGS + rabbits * RABBIT_LEGS
  };
}

export function legsForTrial(headsInput, rabbitCountInput) {
  const heads = toWholeNumber(headsInput);
  const rabbits = toWholeNumber(rabbitCountInput);

  if (heads === null || heads < 0 || rabbits === null || rabbits < 0 || rabbits > heads) {
    return null;
  }

  return heads * CHICKEN_LEGS + rabbits * EXTRA_LEGS_PER_RABBIT;
}

export function compareLegs(currentInput, targetInput) {
  const current = toWholeNumber(currentInput);
  const target = toWholeNumber(targetInput);

  if (current === null || target === null) return null;

  const difference = target - current;
  return {
    difference,
    relation: difference === 0 ? "match" : difference > 0 ? "missing" : "extra",
    amount: Math.abs(difference)
  };
}

export function groupExtraLegs(extraLegsInput) {
  const extraLegs = toWholeNumber(extraLegsInput);

  if (extraLegs === null || extraLegs < 0) {
    return { valid: false, groups: 0, remainder: 0 };
  }

  return {
    valid: extraLegs % EXTRA_LEGS_PER_RABBIT === 0,
    groups: Math.floor(extraLegs / EXTRA_LEGS_PER_RABBIT),
    remainder: extraLegs % EXTRA_LEGS_PER_RABBIT
  };
}

export const FARM_CONSTANTS = Object.freeze({
  chickenLegs: CHICKEN_LEGS,
  rabbitLegs: RABBIT_LEGS,
  extraLegsPerRabbit: EXTRA_LEGS_PER_RABBIT
});


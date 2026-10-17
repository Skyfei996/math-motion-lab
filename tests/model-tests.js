const assert = require("assert");

global.window = global;
require("../assets/lab-models.js");

const { geometry, quantity, patterns } = MathLabModels;

assert.deepStrictEqual(geometry.squarePerimeterState(5), {
  side: 5,
  before: 40,
  after: 30,
  reduced: 10,
  length: 10,
  width: 5
});

const squarePoints = [{ x: 0, y: 0 }, { x: 128, y: 0 }, { x: 128, y: 128 }, { x: 0, y: 128 }];
assert.strictEqual(geometry.canvasPerimeterState([4, 4, 4, 4], squarePoints, true).shape, "square");
assert.strictEqual(geometry.canvasPerimeterState([4, 4, 4, 4], squarePoints, true).perimeter, 16);
assert.strictEqual(geometry.canvasPerimeterState([4, 4], squarePoints.slice(0, 3), false).perimeter, null);
assert.strictEqual(geometry.canCloseLengths([4, 4, 4, 4]), true);
assert.strictEqual(geometry.canCloseLengths([8, 1, 1]), false);
assert.strictEqual(geometry.canvasPerimeterState([4, 4, 4], [
  { x: 0, y: 0 }, { x: 128, y: 0 }, { x: 64, y: 64 * Math.sqrt(3) }
], true).shape, "equilateral-triangle");
const openPoints = [{ x: 0, y: 0 }, { x: 128, y: 0 }, { x: 128, y: 128 }, { x: 256, y: 128 }];
const pulledOpen = openPoints.map(({ x, y }) => ({ x, y }));
pulledOpen[1].x += 35;
const solvedOpen = geometry.solveOpenCanvas(pulledOpen, [128, 128, 128], [1]);
assert.ok(geometry.canvasPerimeterState([4, 4, 4], solvedOpen, false).maxError < 0.025);
const shiftedSide = openPoints.map(({ x, y }) => ({ x, y }));
shiftedSide[1].x += 25;
shiftedSide[2].x += 25;
const followedSide = geometry.solveOpenCanvas(shiftedSide, [128, 128, 128], [1, 2]);
assert.ok(geometry.canvasPerimeterState([4, 4, 4], followedSide, false).maxError < 0.025);
const draggedSquare = squarePoints.map(({ x, y }) => ({ x, y }));
draggedSquare[2].x += 24;
draggedSquare[2].y += 18;
const reshaped = geometry.solveClosedCanvas(draggedSquare, [128, 128, 128, 128], [2]);
const reshapedState = geometry.canvasPerimeterState([4, 4, 4, 4], reshaped, true);
assert.strictEqual(reshapedState.valid, true);
assert.strictEqual(reshapedState.perimeter, 16);
assert.ok(reshapedState.maxError < 0.025);
assert.strictEqual(reshapedState.shape, "rhombus");
assert.strictEqual(geometry.canvasPerimeterState([6, 3, 6, 3], [
  { x: 0, y: 0 }, { x: 192, y: 0 }, { x: 192, y: 96 }, { x: 0, y: 96 }
], true).shape, "rectangle");
const shiftedRectangleSide = [{ x: 0, y: 0 }, { x: 192, y: 0 }, { x: 192, y: 96 }, { x: 0, y: 96 }];
shiftedRectangleSide[0].x += 20;
shiftedRectangleSide[1].x += 20;
const slantedRectangle = geometry.solveClosedCanvas(shiftedRectangleSide, [192, 96, 192, 96], [0, 1]);
assert.strictEqual(geometry.canvasPerimeterState([6, 3, 6, 3], slantedRectangle, true).shape, "parallelogram");
assert.strictEqual(geometry.canvasPerimeterState([6, 3, 6, 3], slantedRectangle, true).perimeter, 18);
assert.strictEqual(geometry.canvasPerimeterState([4, 4, 4, 4], [
  { x: 0, y: 0 }, { x: 128, y: 128 }, { x: 0, y: 128 }, { x: 128, y: 0 }
], true).valid, false);

const looseSquare = squarePoints.map((a, index) => ({ length: 4, a: { ...a }, b: { ...squarePoints[(index + 1) % 4] } }));
assert.strictEqual(geometry.looseSegmentPerimeterState(looseSquare).shape, "square");
const movedStick = looseSquare.map(({ length, a, b }) => ({ length, a: { ...a }, b: { ...b } }));
movedStick[0].a.x += 40;
movedStick[0].b.x += 40;
assert.strictEqual(geometry.looseSegmentPerimeterState(movedStick).closed, false);
assert.strictEqual(geometry.looseSegmentPerimeterState(movedStick).totalLength, 16);
assert.deepStrictEqual(movedStick.slice(1), looseSquare.slice(1));
const movedJoint = geometry.moveLooseJoint(looseSquare, 1, "a", { x: 160, y: 40 });
assert.ok(Math.abs(movedJoint[1].a.x - 160) < 1e-8 && Math.abs(movedJoint[1].a.y - 40) < 1e-8);
assert.strictEqual(geometry.looseSegmentPerimeterState(movedJoint).closed, true);
assert.strictEqual(geometry.looseSegmentPerimeterState(movedJoint).shape, "rhombus");
assert.strictEqual(geometry.looseSegmentPerimeterState(movedJoint).perimeter, 16);
const axisSnapped = geometry.moveLooseJoint([looseSquare[0]], 0, "b", { x: 127, y: 9 });
assert.ok(Math.abs(axisSnapped[0].b.y - axisSnapped[0].a.y) < 1e-8);
assert.ok(Math.abs(Math.hypot(axisSnapped[0].b.x - axisSnapped[0].a.x, axisSnapped[0].b.y - axisSnapped[0].a.y) - 128) < 1e-8);
assert.strictEqual(geometry.looseSegmentPerimeterState([{ length: 4, a: { x: 0, y: 0 }, b: { x: 100, y: 0 } }]).valid, false);
const looseBowtiePoints = [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 0, y: 128 }, { x: 128, y: 0 }];
const looseBowtie = looseBowtiePoints.map((a, index) => ({ length: Math.hypot(looseBowtiePoints[(index + 1) % 4].x - a.x, looseBowtiePoints[(index + 1) % 4].y - a.y) / 32, a, b: looseBowtiePoints[(index + 1) % 4] }));
assert.strictEqual(geometry.looseSegmentPerimeterState(looseBowtie).closed, false);
assert.strictEqual(geometry.connectedSegmentComponents(looseSquare).length, 1);
const separateStick = { id: 99, length: 2, a: { x: 300, y: 300 }, b: { x: 364, y: 300 } };
assert.strictEqual(geometry.connectedSegmentComponents([...looseSquare, separateStick]).length, 2);
const identifiedSquare = looseSquare.map((segment, index) => ({ ...segment, id: index + 1 }));
assert.deepStrictEqual(geometry.moveLooseJoint(identifiedSquare, 1, "a", { x: 160, y: 40 }).map((segment) => segment.id), [1, 2, 3, 4]);
const splitSide = geometry.splitSegmentByLengths(identifiedSquare[0], [1, 1, 2]);
assert.deepStrictEqual(splitSide.map((segment) => segment.length), [1, 1, 2]);
assert.deepStrictEqual(splitSide[0].b, splitSide[1].a);
assert.deepStrictEqual(splitSide[1].b, splitSide[2].a);
assert.strictEqual(geometry.looseSegmentPerimeterState([...splitSide, ...identifiedSquare.slice(1)]).perimeter, 16);
assert.strictEqual(geometry.looseSegmentPerimeterState([...splitSide, ...identifiedSquare.slice(1)]).shape, "square");
assert.strictEqual(geometry.splitSegmentByLengths(identifiedSquare[0], [1, 2]), null);
const mergedSide = geometry.mergeCollinearSegments(splitSide, splitSide);
assert.strictEqual(mergedSide.length, 4);
assert.deepStrictEqual(mergedSide.a, identifiedSquare[0].a);
assert.deepStrictEqual(mergedSide.b, identifiedSquare[0].b);
const branch = { id: 20, length: 2, a: { ...splitSide[0].b }, b: { x: 32, y: -64 } };
assert.strictEqual(geometry.mergeCollinearSegments(splitSide, [...splitSide, branch]), null);
assert.strictEqual(geometry.connectedSegmentComponents([...splitSide, branch]).length, 1);
assert.strictEqual(geometry.looseSegmentPerimeterState([...splitSide, ...identifiedSquare.slice(1), branch]).closed, false);
assert.strictEqual(geometry.boundedSegmentFaces([...splitSide, ...identifiedSquare.slice(1), branch]).length, 1);
const dividedSquare = [
  { id: 1, length: 2, a: { x: 0, y: 0 }, b: { x: 64, y: 0 } },
  { id: 2, length: 2, a: { x: 64, y: 0 }, b: { x: 128, y: 0 } },
  { id: 3, length: 4, a: { x: 128, y: 0 }, b: { x: 128, y: 128 } },
  { id: 4, length: 2, a: { x: 128, y: 128 }, b: { x: 64, y: 128 } },
  { id: 5, length: 2, a: { x: 64, y: 128 }, b: { x: 0, y: 128 } },
  { id: 6, length: 4, a: { x: 0, y: 128 }, b: { x: 0, y: 0 } },
  { id: 7, length: 4, a: { x: 64, y: 0 }, b: { x: 64, y: 128 } }
];
assert.deepStrictEqual(geometry.boundedSegmentFaces(dividedSquare).map((face) => face.area), [8192, 8192]);
assert.strictEqual(geometry.looseSegmentPerimeterState(dividedSquare).closed, false);
assert.strictEqual(geometry.mergeCollinearSegments([identifiedSquare[0], identifiedSquare[1]], identifiedSquare), null);
assert.strictEqual(geometry.mergeCollinearSegments([splitSide[0], { ...splitSide[1], color: "#000000" }], splitSide), null);
assert.strictEqual(geometry.mergeCollinearSegments([splitSide[0], { ...splitSide[1], fill: "#229954" }], splitSide), null);
assert.ok(Math.abs(geometry.curvedPerimeter("circle", 3) - 6 * Math.PI) < 1e-10);
assert.ok(Math.abs(geometry.curvedPerimeter("ellipse", 3, 3) - 6 * Math.PI) < 1e-10);
assert.strictEqual(geometry.curvedPerimeter("ellipse", 0, 2), null);
assert.strictEqual(geometry.canvasPerimeterState([6, 3, 4, 3], [
  { x: 0, y: 0 }, { x: 192, y: 0 }, { x: 160, y: -Math.sqrt(8) * 32 }, { x: 32, y: -Math.sqrt(8) * 32 }
], true).shape, "trapezoid");

assert.deepStrictEqual(geometry.rectangleToSquareState(225, 5), {
  valid: true,
  area: 225,
  factor: 5,
  squareSide: 15,
  originalLength: 75,
  originalWidth: 3,
  originalArea: 225,
  transformedLength: 15,
  transformedWidth: 15,
  transformedArea: 225,
  squareTable: Array.from({ length: 20 }, (_, index) => ({ value: index + 1, square: (index + 1) ** 2 })),
  resultOnes: 5,
  possibleOnes: [5],
  rangeStart: 10,
  rangeEnd: 20,
  rangeCandidates: [15],
  sideDigits: 2
});

const rectangle144 = geometry.rectangleToSquareState(144, 3);
assert.strictEqual(rectangle144.valid, true);
assert.strictEqual(rectangle144.squareSide, 12);
assert.strictEqual(rectangle144.originalLength, 36);
assert.strictEqual(rectangle144.originalWidth, 4);
assert.deepStrictEqual(rectangle144.possibleOnes, [2, 8]);
assert.deepStrictEqual(rectangle144.rangeCandidates, [12, 18]);

const rectangle400 = geometry.rectangleToSquareState(400, 4);
assert.strictEqual(rectangle400.valid, true);
assert.strictEqual(rectangle400.squareSide, 20);
assert.strictEqual(rectangle400.originalLength, 80);
assert.strictEqual(rectangle400.originalWidth, 5);
assert.deepStrictEqual(rectangle400.rangeCandidates, [10, 20]);

assert.strictEqual(geometry.rectangleToSquareState(200, 5).reason, "not-square");
assert.strictEqual(geometry.rectangleToSquareState(144, 5).reason, "non-whole-width");
assert.strictEqual(geometry.rectangleToSquareState(225, 1).reason, "invalid-factor");

assert.strictEqual(geometry.lineRelationState("parallel", 30, 100).intersects, false);
assert.strictEqual(geometry.lineRelationState("intersect", 30, 100).intersects, true);

assert.deepStrictEqual(quantity.equalSharingState(12, 3), {
  total: 12,
  groups: 3,
  each: 4,
  remainder: 0,
  dividesEvenly: true
});

assert.deepStrictEqual(quantity.equalSharingState(14, 3), {
  total: 14,
  groups: 3,
  each: 4,
  remainder: 2,
  dividesEvenly: false
});

assert.deepStrictEqual(quantity.fractionState(2, 4), {
  numerator: 2,
  denominator: 4,
  value: 0.5
});

assert.deepStrictEqual(quantity.notebookPromotionState(34, 6, 5), {
  valid: true,
  studentCount: 34,
  unitPrice: 6,
  buyCount: 5,
  giftPerGroup: 1,
  groupSize: 6,
  fullGroups: 5,
  remainder: 4,
  completeGroupPaid: 25,
  paidCount: 29,
  giftCount: 5,
  receivedCount: 34,
  extraCount: 0,
  totalCost: 174,
  previousPaidCount: 28,
  previousGiftCount: 5,
  previousReceivedCount: 33
});

const exactNotebookPromotion = quantity.notebookPromotionState(30, 6, 5);
assert.strictEqual(exactNotebookPromotion.fullGroups, 5);
assert.strictEqual(exactNotebookPromotion.remainder, 0);
assert.strictEqual(exactNotebookPromotion.paidCount, 25);
assert.strictEqual(exactNotebookPromotion.giftCount, 5);
assert.strictEqual(exactNotebookPromotion.receivedCount, 30);
assert.strictEqual(exactNotebookPromotion.totalCost, 150);

const extraNotebookPromotion = quantity.notebookPromotionState(35, 6, 5);
assert.strictEqual(extraNotebookPromotion.remainder, 5);
assert.strictEqual(extraNotebookPromotion.paidCount, 30);
assert.strictEqual(extraNotebookPromotion.giftCount, 6);
assert.strictEqual(extraNotebookPromotion.receivedCount, 36);
assert.strictEqual(extraNotebookPromotion.extraCount, 1);
assert.strictEqual(extraNotebookPromotion.previousReceivedCount, 34);

const changedNotebookPromotion = quantity.notebookPromotionState(26, 7, 4);
assert.strictEqual(changedNotebookPromotion.groupSize, 5);
assert.strictEqual(changedNotebookPromotion.fullGroups, 5);
assert.strictEqual(changedNotebookPromotion.remainder, 1);
assert.strictEqual(changedNotebookPromotion.paidCount, 21);
assert.strictEqual(changedNotebookPromotion.receivedCount, 26);
assert.strictEqual(changedNotebookPromotion.totalCost, 147);

assert.strictEqual(quantity.notebookPromotionState(0, 6, 5).reason, "invalid-student-count");
assert.strictEqual(quantity.notebookPromotionState(34, 0, 5).reason, "invalid-unit-price");
assert.strictEqual(quantity.notebookPromotionState(34, 6, 1).reason, "invalid-buy-count");

assert.deepStrictEqual(quantity.fractionState(0, 4), {
  numerator: 0,
  denominator: 4,
  value: 0
});

assert.deepStrictEqual(quantity.fractionState(9, 4), {
  numerator: 4,
  denominator: 4,
  value: 1
});

assert.deepStrictEqual(quantity.fractionState(1, 0), {
  numerator: 1,
  denominator: 1,
  value: 1
});

assert.deepStrictEqual(quantity.fractionState(1, 3), {
  numerator: 1,
  denominator: 3,
  value: 0.333
});

assert.deepStrictEqual(quantity.chickenRabbitState("8", "22"), {
  valid: true,
  heads: 8n,
  legs: 22n,
  allChickenLegs: 16n,
  allRabbitLegs: 32n,
  extraLegs: 6n,
  extraLegsPerRabbit: 2n,
  rabbits: 3n,
  chickens: 5n,
  checkedHeads: 8n,
  checkedLegs: 22n
});

const largeChickenRabbit = quantity.chickenRabbitState("10000", "30000");
assert.strictEqual(largeChickenRabbit.valid, true);
assert.strictEqual(largeChickenRabbit.chickens, 5000n);
assert.strictEqual(largeChickenRabbit.rabbits, 5000n);

const hugeHeads = 1000000000000000000000000000000n;
const hugeChickenRabbit = quantity.chickenRabbitState(hugeHeads, hugeHeads * 3n);
assert.strictEqual(hugeChickenRabbit.valid, true);
assert.strictEqual(hugeChickenRabbit.chickens, hugeHeads / 2n);
assert.strictEqual(hugeChickenRabbit.rabbits, hugeHeads / 2n);
assert.deepStrictEqual(quantity.chickenRabbitState("8", "21"), {
  valid: false,
  reason: "odd-legs",
  heads: 8n,
  legs: 21n
});
assert.strictEqual(quantity.chickenRabbitState("8", "14").reason, "too-few-legs");
assert.strictEqual(quantity.chickenRabbitState("8", "34").reason, "too-many-legs");
assert.strictEqual(quantity.chickenRabbitState("0", "0").reason, "invalid-heads");
assert.strictEqual(quantity.chickenRabbitState("8.5", "22").reason, "invalid-heads");

assert.deepStrictEqual(quantity.penTransferState("30", "15", "8"), {
  valid: true,
  ningPens: 30n,
  qingPens: 15n,
  multiple: 8n,
  total: 45n,
  totalParts: 9n,
  onePart: 5n,
  transfer: 10n,
  finalNing: 40n,
  finalQing: 5n,
  checkedTotal: 45n,
  checkedMultiple: 8n
});

const secondPenTransfer = quantity.penTransferState("24", "12", "5");
assert.strictEqual(secondPenTransfer.valid, true);
assert.strictEqual(secondPenTransfer.onePart, 6n);
assert.strictEqual(secondPenTransfer.transfer, 6n);
assert.strictEqual(secondPenTransfer.finalNing, 30n);
assert.strictEqual(secondPenTransfer.finalQing, 6n);

const partialPartPenTransfer = quantity.penTransferState("20", "10", "4");
assert.strictEqual(partialPartPenTransfer.valid, true);
assert.strictEqual(partialPartPenTransfer.onePart, 6n);
assert.strictEqual(partialPartPenTransfer.transfer, 4n);
assert.strictEqual(partialPartPenTransfer.checkedMultiple, 4n);

assert.strictEqual(quantity.penTransferState("0", "15", "8").reason, "invalid-ning");
assert.strictEqual(quantity.penTransferState("30", "0", "8").reason, "invalid-qing");
assert.strictEqual(quantity.penTransferState("30", "15", "1").reason, "invalid-multiple");
assert.strictEqual(quantity.penTransferState("31", "15", "8").reason, "non-whole-part");
assert.strictEqual(quantity.penTransferState("40", "5", "8").reason, "no-transfer");
assert.strictEqual(quantity.penTransferState("36", "4", "4").reason, "wrong-direction");

assert.deepStrictEqual(quantity.bookshelfMultipleState("200", "40", "3"), {
  valid: true,
  removedFromFirst: 200n,
  addedToSecond: 40n,
  multiple: 3n,
  gap: 240n,
  differenceParts: 2n,
  firstAfter: 120n,
  secondAfter: 360n,
  originalEach: 320n,
  checkedFirstAfter: 120n,
  checkedSecondAfter: 360n,
  checkedGap: 240n,
  checkedMultiple: 3n
});

const changedBookshelfMultiple = quantity.bookshelfMultipleState("150", "30", "3");
assert.strictEqual(changedBookshelfMultiple.valid, true);
assert.strictEqual(changedBookshelfMultiple.gap, 180n);
assert.strictEqual(changedBookshelfMultiple.firstAfter, 90n);
assert.strictEqual(changedBookshelfMultiple.originalEach, 240n);

const fourTimesBookshelfMultiple = quantity.bookshelfMultipleState("210", "60", "4");
assert.strictEqual(fourTimesBookshelfMultiple.valid, true);
assert.strictEqual(fourTimesBookshelfMultiple.differenceParts, 3n);
assert.strictEqual(fourTimesBookshelfMultiple.firstAfter, 90n);
assert.strictEqual(fourTimesBookshelfMultiple.secondAfter, 360n);
assert.strictEqual(fourTimesBookshelfMultiple.originalEach, 300n);

assert.strictEqual(quantity.bookshelfMultipleState("0", "40", "3").reason, "invalid-removed");
assert.strictEqual(quantity.bookshelfMultipleState("200", "0", "3").reason, "invalid-added");
assert.strictEqual(quantity.bookshelfMultipleState("200", "40", "1").reason, "invalid-multiple");
assert.strictEqual(quantity.bookshelfMultipleState("200", "41", "3").reason, "non-whole-part");

assert.deepStrictEqual(quantity.boxTransferDifferenceState("90", "4", "6"), {
  valid: true,
  totalBags: 90n,
  movedToSecond: 4n,
  firstStillMore: 6n,
  remainingAfterExcess: 84n,
  equalShare: 42n,
  firstAfter: 48n,
  secondAfter: 42n,
  firstOriginal: 52n,
  secondOriginal: 38n,
  checkedTotal: 90n,
  checkedFirstAfter: 48n,
  checkedSecondAfter: 42n,
  checkedDifference: 6n
});

const changedBoxTransferDifference = quantity.boxTransferDifferenceState("84", "3", "8");
assert.strictEqual(changedBoxTransferDifference.valid, true);
assert.strictEqual(changedBoxTransferDifference.remainingAfterExcess, 76n);
assert.strictEqual(changedBoxTransferDifference.equalShare, 38n);
assert.strictEqual(changedBoxTransferDifference.firstAfter, 46n);
assert.strictEqual(changedBoxTransferDifference.secondAfter, 38n);
assert.strictEqual(changedBoxTransferDifference.firstOriginal, 49n);
assert.strictEqual(changedBoxTransferDifference.secondOriginal, 35n);

assert.strictEqual(quantity.boxTransferDifferenceState("0", "4", "6").reason, "invalid-total");
assert.strictEqual(quantity.boxTransferDifferenceState("90", "0", "6").reason, "invalid-transfer");
assert.strictEqual(quantity.boxTransferDifferenceState("90", "4", "0").reason, "invalid-difference");
assert.strictEqual(quantity.boxTransferDifferenceState("90", "4", "90").reason, "difference-too-large");
assert.strictEqual(quantity.boxTransferDifferenceState("90", "4", "5").reason, "non-whole-half");
assert.strictEqual(quantity.boxTransferDifferenceState("10", "4", "2").reason, "transfer-too-large");

assert.deepStrictEqual(quantity.quotientRemainderSumState("17", "6", "479"), {
  valid: true,
  quotient: 17n,
  remainder: 6n,
  totalSum: 479n,
  equalParts: 18n,
  knownNumbersTotal: 29n,
  equalPartsTotal: 450n,
  divisor: 25n,
  dividend: 431n,
  checkedQuotient: 17n,
  checkedRemainder: 6n,
  checkedSum: 479n
});

const secondQuotientRemainderSum = quantity.quotientRemainderSumState("9", "4", "137");
assert.strictEqual(secondQuotientRemainderSum.valid, true);
assert.strictEqual(secondQuotientRemainderSum.divisor, 12n);
assert.strictEqual(secondQuotientRemainderSum.dividend, 112n);

const exactQuotientRemainderSum = quantity.quotientRemainderSumState("6", "0", "111");
assert.strictEqual(exactQuotientRemainderSum.valid, true);
assert.strictEqual(exactQuotientRemainderSum.divisor, 15n);
assert.strictEqual(exactQuotientRemainderSum.dividend, 90n);

assert.strictEqual(quantity.quotientRemainderSumState("0", "6", "479").reason, "invalid-quotient");
assert.strictEqual(quantity.quotientRemainderSumState("17", "-1", "479").reason, "invalid-remainder");
assert.strictEqual(quantity.quotientRemainderSumState("17", "6", "0").reason, "invalid-total-sum");
assert.strictEqual(quantity.quotientRemainderSumState("17", "6", "20").reason, "total-too-small");
assert.strictEqual(quantity.quotientRemainderSumState("17", "6", "480").reason, "non-whole-divisor");
assert.strictEqual(quantity.quotientRemainderSumState("8", "9", "107").reason, "remainder-not-less");

assert.deepStrictEqual(quantity.cupBottleWeightState("3", "440", "5", "600"), {
  valid: true,
  firstCups: 3n,
  firstTotalWeight: 440n,
  secondCups: 5n,
  secondTotalWeight: 600n,
  fewerSource: "first",
  moreSource: "second",
  fewerCups: 3n,
  fewerTotalWeight: 440n,
  moreCups: 5n,
  moreTotalWeight: 600n,
  cupDifference: 2n,
  weightDifference: 160n,
  cupWaterWeight: 80n,
  fewerWaterWeight: 240n,
  moreWaterWeight: 400n,
  bottleWeight: 200n,
  checkedFirstTotal: 440n,
  checkedSecondTotal: 600n
});

const reversedCupBottleWeight = quantity.cupBottleWeightState("5", "600", "3", "440");
assert.strictEqual(reversedCupBottleWeight.valid, true);
assert.strictEqual(reversedCupBottleWeight.fewerSource, "second");
assert.strictEqual(reversedCupBottleWeight.moreSource, "first");
assert.strictEqual(reversedCupBottleWeight.cupWaterWeight, 80n);
assert.strictEqual(reversedCupBottleWeight.bottleWeight, 200n);

const changedCupBottleWeight = quantity.cupBottleWeightState("4", "470", "7", "650");
assert.strictEqual(changedCupBottleWeight.valid, true);
assert.strictEqual(changedCupBottleWeight.cupDifference, 3n);
assert.strictEqual(changedCupBottleWeight.weightDifference, 180n);
assert.strictEqual(changedCupBottleWeight.cupWaterWeight, 60n);
assert.strictEqual(changedCupBottleWeight.bottleWeight, 230n);
assert.strictEqual(changedCupBottleWeight.checkedFirstTotal, 470n);
assert.strictEqual(changedCupBottleWeight.checkedSecondTotal, 650n);

assert.strictEqual(quantity.cupBottleWeightState("0", "440", "5", "600").reason, "invalid-first-cups");
assert.strictEqual(quantity.cupBottleWeightState("3", "0", "5", "600").reason, "invalid-first-total");
assert.strictEqual(quantity.cupBottleWeightState("3", "440", "0", "600").reason, "invalid-second-cups");
assert.strictEqual(quantity.cupBottleWeightState("3", "440", "5", "0").reason, "invalid-second-total");
assert.strictEqual(quantity.cupBottleWeightState("3", "440", "3", "600").reason, "same-cup-count");
assert.strictEqual(quantity.cupBottleWeightState("3", "600", "5", "440").reason, "weight-direction-mismatch");
assert.strictEqual(quantity.cupBottleWeightState("3", "440", "5", "601").reason, "non-whole-cup-weight");
assert.strictEqual(quantity.cupBottleWeightState("3", "240", "5", "400").reason, "non-positive-bottle-weight");

assert.deepStrictEqual(quantity.waterMeasureState("500", "800", "1100"), {
  valid: true,
  bottleACapacity: 500n,
  bottleBCapacity: 800n,
  targetAmount: 1100n,
  largeBottle: "b",
  smallBottle: "a",
  largeCapacity: 800n,
  smallCapacity: 500n,
  residual: 300n,
  remainingAfterResidual: 800n,
  checkedDifference: 300n,
  checkedTotal: 1100n,
  states: {
    initial: { smallBottle: 0n, largeBottle: 0n, targetBasin: 0n },
    filledLarge: { smallBottle: 0n, largeBottle: 800n, targetBasin: 0n },
    afterTransfer: { smallBottle: 500n, largeBottle: 300n, targetBasin: 0n },
    savedResidual: { smallBottle: 500n, largeBottle: 0n, targetBasin: 300n },
    refilledLarge: { smallBottle: 500n, largeBottle: 800n, targetBasin: 300n },
    final: { smallBottle: 500n, largeBottle: 0n, targetBasin: 1100n }
  }
});

const reversedWaterMeasure = quantity.waterMeasureState("800", "500", "1100");
assert.strictEqual(reversedWaterMeasure.valid, true);
assert.strictEqual(reversedWaterMeasure.largeBottle, "a");
assert.strictEqual(reversedWaterMeasure.smallBottle, "b");
assert.strictEqual(reversedWaterMeasure.residual, 300n);
assert.strictEqual(reversedWaterMeasure.checkedTotal, 1100n);

const secondWaterMeasure = quantity.waterMeasureState("600", "1000", "1400");
assert.strictEqual(secondWaterMeasure.valid, true);
assert.strictEqual(secondWaterMeasure.residual, 400n);
assert.strictEqual(secondWaterMeasure.remainingAfterResidual, 1000n);
assert.strictEqual(secondWaterMeasure.checkedTotal, 1400n);

assert.strictEqual(quantity.waterMeasureState("0", "800", "1100").reason, "invalid-bottle-a");
assert.strictEqual(quantity.waterMeasureState("500", "0", "1100").reason, "invalid-bottle-b");
assert.strictEqual(quantity.waterMeasureState("500", "800", "0").reason, "invalid-target");
assert.strictEqual(quantity.waterMeasureState("500", "500", "1000").reason, "equal-capacities");
const unsupportedWaterTarget = quantity.waterMeasureState("500", "800", "1200");
assert.strictEqual(unsupportedWaterTarget.reason, "unsupported-target");
assert.strictEqual(unsupportedWaterTarget.supportedTarget, 1100n);

const waterExplore100 = quantity.waterMeasureExploreState("500", "800", "100");
assert.strictEqual(waterExplore100.valid, true);
assert.strictEqual(waterExplore100.fundamentalUnit, 100n);
assert.strictEqual(waterExplore100.minimumOperations, 9);
assert.strictEqual(waterExplore100.checkedThrough, 8);
assert.deepStrictEqual(
  waterExplore100.path.map((operation) => operation.type),
  [
    "fill-b",
    "pour-b-to-a",
    "empty-a",
    "pour-b-to-a",
    "fill-b",
    "pour-b-to-a",
    "empty-a",
    "pour-b-to-a",
    "pour-b-to-target"
  ]
);
assert.deepStrictEqual(waterExplore100.final, { bottleA: 500n, bottleB: 0n, targetBasin: 100n });

const waterExplore1100 = quantity.waterMeasureExploreState("500", "800", "1100");
assert.strictEqual(waterExplore1100.valid, true);
assert.strictEqual(waterExplore1100.minimumOperations, 5);
assert.deepStrictEqual(
  waterExplore1100.path.map((operation) => operation.type),
  ["fill-b", "pour-b-to-a", "pour-b-to-target", "fill-b", "pour-b-to-target"]
);
assert.deepStrictEqual(waterExplore1100.final, { bottleA: 500n, bottleB: 0n, targetBasin: 1100n });

assert.strictEqual(quantity.waterMeasureExploreState("500", "800", "200").minimumOperations, 5);
assert.strictEqual(quantity.waterMeasureExploreState("500", "800", "300").minimumOperations, 3);
assert.strictEqual(quantity.waterMeasureExploreState("800", "500", "100").minimumOperations, 9);
const waterExploreOtherUnit = quantity.waterMeasureExploreState("600", "1000", "1400");
assert.strictEqual(waterExploreOtherUnit.valid, true);
assert.strictEqual(waterExploreOtherUnit.fundamentalUnit, 200n);
assert.strictEqual(waterExploreOtherUnit.final.targetBasin, 1400n);

const waterExploreImpossible = quantity.waterMeasureExploreState("500", "800", "150");
assert.strictEqual(waterExploreImpossible.valid, false);
assert.strictEqual(waterExploreImpossible.reason, "not-measurable");
assert.strictEqual(waterExploreImpossible.fundamentalUnit, 100n);
assert.strictEqual(quantity.waterMeasureExploreState("0", "800", "100").reason, "invalid-bottle-a");
assert.strictEqual(quantity.waterMeasureExploreState("500", "0", "100").reason, "invalid-bottle-b");
assert.strictEqual(quantity.waterMeasureExploreState("500", "800", "0").reason, "invalid-target");
assert.strictEqual(quantity.waterMeasureExploreState("1", "1", "500001").reason, "search-too-large");

const trailingZeros = quantity.trailingZerosState("45", "2");
assert.strictEqual(trailingZeros.valid, true);
assert.strictEqual(trailingZeros.minimumMultiplier, 20n);
assert.strictEqual(trailingZeros.product, 900n);
assert.strictEqual(trailingZeros.actualTrailingZeros, 2);
assert.deepStrictEqual(
  trailingZeros.rounds.map((round) => [round.before, round.action, round.roundMultiplier, round.afterLock]),
  [
    [45n, "times-two", 2n, 9n],
    [9n, "times-ten", 10n, 9n]
  ]
);

assert.strictEqual(quantity.trailingZerosState("12", "2").minimumMultiplier, 25n);
assert.strictEqual(quantity.trailingZerosState("120", "2").minimumMultiplier, 5n);
assert.strictEqual(quantity.trailingZerosState("125", "3").minimumMultiplier, 8n);
assert.strictEqual(quantity.trailingZerosState("100", "2").minimumMultiplier, 1n);
assert.strictEqual(quantity.trailingZerosState("999", "2").minimumMultiplier, 100n);
assert.strictEqual(quantity.trailingZerosState("0", "2").reason, "invalid-multiplicand");
assert.strictEqual(quantity.trailingZerosState("1001", "2").reason, "invalid-multiplicand");
assert.strictEqual(quantity.trailingZerosState("45", "0").reason, "invalid-target-zeros");
assert.strictEqual(quantity.trailingZerosState("45", "1001").reason, "too-many-target-zeros");

assert.deepStrictEqual(quantity.trainBridgeState(800, 1600, 40), {
  valid: true,
  trainLength: 800,
  bridgeLength: 1600,
  speed: 40,
  totalDistance: 2400,
  personCrossing: {
    distance: 1600,
    fullSeconds: 40,
    remainderDistance: 0,
    dividesEvenly: true,
    exactAtHundredth: true,
    time: 40
  },
  trainClearing: {
    distance: 800,
    fullSeconds: 20,
    remainderDistance: 0,
    dividesEvenly: true,
    exactAtHundredth: true,
    time: 20
  },
  fullCrossing: {
    distance: 2400,
    fullSeconds: 60,
    remainderDistance: 0,
    dividesEvenly: true,
    exactAtHundredth: true,
    time: 60
  }
});

const changedTrainBridge = quantity.trainBridgeState(300, 900, 20);
assert.strictEqual(changedTrainBridge.personCrossing.time, 45);
assert.strictEqual(changedTrainBridge.trainClearing.time, 15);
assert.strictEqual(changedTrainBridge.fullCrossing.time, 60);

const decimalTrainBridge = quantity.trainBridgeState(250, 1000, 40);
assert.strictEqual(decimalTrainBridge.personCrossing.time, 25);
assert.strictEqual(decimalTrainBridge.trainClearing.time, 6.25);
assert.strictEqual(decimalTrainBridge.fullCrossing.time, 31.25);
assert.strictEqual(decimalTrainBridge.trainClearing.dividesEvenly, false);
assert.strictEqual(decimalTrainBridge.trainClearing.remainderDistance, 10);
assert.strictEqual(decimalTrainBridge.trainClearing.exactAtHundredth, true);

const repeatingTrainBridge = quantity.trainBridgeState(1, 1, 3);
assert.strictEqual(repeatingTrainBridge.personCrossing.time, 0.33);
assert.strictEqual(repeatingTrainBridge.personCrossing.exactAtHundredth, false);

assert.strictEqual(quantity.trainBridgeState(0, 1600, 40).reason, "invalid-train-length");
assert.strictEqual(quantity.trainBridgeState(800, "bridge", 40).reason, "invalid-bridge-length");
assert.strictEqual(quantity.trainBridgeState(800, 1600, -1).reason, "invalid-speed");

function greatestCommonDivisor(left, right) {
  let a = left;
  let b = right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

for (let multiplicand = 1n; multiplicand <= 1000n; multiplicand += 1n) {
  for (let targetZeros = 1; targetZeros <= 8; targetZeros += 1) {
    const targetPlace = 10n ** BigInt(targetZeros);
    const expectedMultiplier = targetPlace / greatestCommonDivisor(multiplicand, targetPlace);
    const result = quantity.trailingZerosState(multiplicand, targetZeros);
    assert.strictEqual(result.minimumMultiplier, expectedMultiplier);
    assert.strictEqual(result.product % targetPlace, 0n);
  }
}

const rental = quantity.vehicleRentalState(15, 355, 40, 720, 25, 500);
assert.strictEqual(rental.totalPeople, 370);
assert.deepStrictEqual(rental.best, {
  big: 8,
  small: 2,
  vehicles: 10,
  bigSeats: 320,
  smallSeats: 50,
  remainingPeople: 50,
  seats: 370,
  emptySeats: 0,
  cost: 6760
});
assert.strictEqual(rental.bigSeatCost, 18);
assert.strictEqual(rental.smallSeatCost, 20);
assert.strictEqual(rental.plans.every((plan) => plan.seats >= rental.totalPeople), true);
assert.strictEqual(rental.allBigCount, 10);
assert.strictEqual(rental.allSmallCount, 15);
assert.strictEqual(rental.startType, "big");
assert.strictEqual(rental.allBigPlan.cost, 7200);
assert.strictEqual(rental.allSmallPlan.cost, 7500);
assert.strictEqual(rental.teachingPlans.length, 11);
assert.deepStrictEqual(
  rental.teachingPlans.map((plan) => [plan.big, plan.small, plan.cost]),
  [
    [10, 0, 7200],
    [9, 1, 6980],
    [8, 2, 6760],
    [7, 4, 7040],
    [6, 6, 7320],
    [5, 7, 7100],
    [4, 9, 7380],
    [3, 10, 7160],
    [2, 12, 7440],
    [1, 14, 7720],
    [0, 15, 7500]
  ]
);
assert.deepStrictEqual(rental.bestPlans, [rental.teachingPlans[2]]);
assert.deepStrictEqual(rental.teachingPlans[1], {
  big: 9,
  small: 1,
  vehicles: 10,
  bigSeats: 360,
  smallSeats: 25,
  remainingPeople: 10,
  seats: 385,
  emptySeats: 15,
  cost: 6980
});

const smallCheaperRental = quantity.vehicleRentalState(15, 355, 40, 720, 25, 300);
assert.strictEqual(smallCheaperRental.smallSeatCost, 12);
assert.strictEqual(smallCheaperRental.startType, "small");
assert.strictEqual(smallCheaperRental.allBigPlan.cost, 7200);
assert.strictEqual(smallCheaperRental.allSmallPlan.cost, 4500);
assert.strictEqual(smallCheaperRental.teachingPlans.length, 16);
assert.deepStrictEqual(
  smallCheaperRental.teachingPlans.slice(0, 3).map((plan) => [plan.big, plan.small, plan.cost]),
  [
    [0, 15, 4500],
    [1, 14, 4920],
    [2, 13, 5340]
  ]
);
assert.deepStrictEqual(smallCheaperRental.best, {
  big: 0,
  small: 15,
  vehicles: 15,
  bigSeats: 0,
  smallSeats: 375,
  remainingPeople: 370,
  seats: 375,
  emptySeats: 5,
  cost: 4500
});

const tiedRental = quantity.vehicleRentalState(0, 80, 40, 800, 20, 400);
assert.deepStrictEqual(
  tiedRental.bestPlans.map((plan) => [plan.big, plan.small, plan.cost]),
  [
    [2, 0, 1600],
    [1, 2, 1600],
    [0, 4, 1600]
  ]
);

assert.strictEqual(geometry.canFormTriangle(3, 4, 7).valid, false);
assert.strictEqual(geometry.canFormTriangle(3, 4, 5).valid, true);

[3, 5, 7, 9, 11, 13, 15, 17].forEach((order) => {
  const magicSquare = patterns.magicSquareState(order);
  assert.strictEqual(magicSquare.valid, true);
  assert.strictEqual(magicSquare.magicSum, (order * (order * order + 1)) / 2);
  assert.strictEqual(magicSquare.verified, true);
  assert.strictEqual(new Set(magicSquare.cells.flat()).size, order * order);
  assert.deepStrictEqual(
    magicSquare.cells.flat().sort((left, right) => left - right),
    Array.from({ length: order * order }, (_, index) => index + 1)
  );
});
assert.strictEqual(patterns.magicSquareState(4).reason, "invalid-odd-order");

[4, 8, 12, 16].forEach((order) => {
  const magicSquare = patterns.magicSquareDoublyEvenState(order, "inside");
  assert.strictEqual(magicSquare.valid, true);
  assert.strictEqual(magicSquare.verified, true);
  assert.strictEqual(magicSquare.magicSum, (order * (order * order + 1)) / 2);
  assert.deepStrictEqual(
    magicSquare.cells.flat().sort((left, right) => left - right),
    Array.from({ length: order * order }, (_, index) => index + 1)
  );
});
assert.strictEqual(patterns.magicSquareDoublyEvenState(6).reason, "invalid-doubly-even-order");

[6, 10, 14, 18].forEach((order) => {
  const magicSquare = patterns.magicSquareSinglyEvenState(order);
  const reconstructed = magicSquare.initialCells.map((row) => [...row]);
  magicSquare.swapPairs.forEach(({ from, to }) => {
    [reconstructed[from[0]][from[1]], reconstructed[to[0]][to[1]]] = [
      reconstructed[to[0]][to[1]],
      reconstructed[from[0]][from[1]]
    ];
  });

  assert.strictEqual(magicSquare.valid, true);
  assert.strictEqual(magicSquare.verified, true);
  assert.strictEqual(magicSquare.magicSum, (order * (order * order + 1)) / 2);
  assert.strictEqual(magicSquare.ordinarySwapRows.length, magicSquare.half - 1);
  assert.strictEqual(magicSquare.specialSwapRow.row, magicSquare.band);
  assert.strictEqual(magicSquare.rightBand, Math.max(0, magicSquare.band - 1));
  magicSquare.swapRows.forEach((rowPlan) => {
    assert.strictEqual(rowPlan.swaps.length, magicSquare.band + magicSquare.rightBand);
  });
  assert.strictEqual(
    magicSquare.rowBalance.initialUpperSum
      + magicSquare.rowBalance.leftCount * magicSquare.rowBalance.leftChange
      - magicSquare.rowBalance.rightCount * magicSquare.rowBalance.rightChange,
    magicSquare.magicSum
  );
  assert.deepStrictEqual(reconstructed, magicSquare.cells);
  assert.deepStrictEqual(
    magicSquare.cells.flat().sort((left, right) => left - right),
    Array.from({ length: order * order }, (_, index) => index + 1)
  );
});
assert.strictEqual(patterns.magicSquareSinglyEvenState(8).reason, "invalid-singly-even-order");

console.log("model tests passed");

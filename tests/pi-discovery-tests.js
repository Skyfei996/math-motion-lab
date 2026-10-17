"use strict";
const assert = require("node:assert/strict");
const M = require("../lessons/pi-discovery/models.js");
let previous = Infinity;
for (let n = 6; n <= 768; n *= 2) {
  const b = M.polygonBounds(n);
  assert(b.lower < Math.PI && Math.PI < b.upper, `π must be bounded at ${n} edges`);
  assert(b.upper - b.lower < previous);
  assert(Math.abs(b.lower - n * Math.sin(Math.PI / n)) < 1e-13);
  assert(Math.abs(b.upper - n * Math.tan(Math.PI / n)) < 1e-13);
  const display = M.outwardBounds(n);
  assert(Number(display.lower) <= b.lower && Number(display.upper) >= b.upper);
  previous = b.upper - b.lower;
}
assert.equal(M.polygonBounds(6).lower, 3);
assert.throws(() => M.polygonBounds(7), RangeError);
assert.equal(M.wallis(0), 2);
assert.equal(M.wallis(1), 8/3);
let last = 2;
for (const n of [1,2,10,100,1000,10000]) { const value=M.wallis(n); assert(value>last && value<Math.PI); last=value; }
assert.throws(() => M.wallis(-1), RangeError);
assert.equal(M.machin(0), 0);
assert(Math.abs(M.machin(1) - (16/5 - 4/239)) < 1e-15);
for (let n=1;n<=9;n++) {
  assert(Math.abs(M.machin(n) - (M.machin(n-1)+M.machinStep(n))) < 1e-15);
  assert(Math.abs(M.machin(n)-Math.PI) < Math.abs(M.machin(n-1)-Math.PI));
}
assert(Math.abs(M.machin(9)-Math.PI) < 1e-13);
assert.throws(() => M.machin(10), RangeError);
for (const n of [1,2,4,8]) assert(Math.abs(M.machin(n)-Math.PI)<Math.abs(M.wallis(n)-Math.PI));
const small = M.circumference(1,3.14,.01);
assert(small.fits && Math.abs(small.error - .001592653589793) < 1e-14);
assert(!M.circumference(100,3.14,.01).fits);
assert(M.circumference(100,3.1416,.001).fits);
assert(!M.circumference(1000000,3.1416,1).fits);
assert(M.circumference(1,3.1416,1).estimated > Math.PI);
assert(Math.abs(M.circumference(10,3.14,1).error / small.error - 10) < 1e-10);
assert.throws(() => M.circumference(0,3.14,1),RangeError);
for (const radius of [44,108]) {
  for (let step=0; step<=20; step++) {
    const progress=step/20;
    let length=0, lastPoint=M.ropePoint(radius,progress,0);
    for (let i=1;i<=360;i++) {
      const p=M.ropePoint(radius,progress,i/360);
      length+=Math.hypot(p.x-lastPoint.x,p.y-lastPoint.y);
      assert(p.y<=1e-9 && p.y>=-radius*2.5, 'Unbending must stay above the bench and inside the stage');
      lastPoint=p;
    }
    assert(Math.abs(length-2*Math.PI*radius)<.01, `Rope length must remain constant at ${progress}`);
    assert(Math.abs(lastPoint.y)<1e-9, 'Both marks stay on the bench');
  }
  assert(Math.abs(M.ropePoint(radius,1,1).x/(2*radius)-Math.PI)<1e-14);
}
const one=M.rolling(1),ten=M.rolling(10),accurate=M.rolling(10,1,3.1416);
assert(Math.abs(ten.error-10*one.error)<1e-13);
assert(accurate.error<0 && Math.abs(accurate.error)<Math.abs(ten.error));
assert(Math.abs(ten.actual-ten.angle*.5)<1e-13, 'No-slip distance equals radius times angle');
for(const [oldN,newN] of [[6,12],[12,24],[24,96]]){
  for(const t of [.01,.25,.5,.75,1]){
    const points=M.refiningOuter(oldN,newN,150,t);
    points.forEach((p,i)=>{
      const q=points[(i+1)%newN],edge=Math.hypot(q.x-p.x,q.y-p.y);
      if(edge>1e-6) assert(Math.abs(p.x*q.y-p.y*q.x)/edge>=150-1e-7,'Outer path must never cut through the circle during refinement');
    });
  }
}
console.log("PASS: polygon bounds, rounding, series, rope length/viewport/marks, diameter ratio, rolling error and no-slip motion.");

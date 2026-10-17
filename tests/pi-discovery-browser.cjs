'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  try {
    const page=await browser.newPage({viewport:{width:1366,height:768}});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:8766/');
    await page.locator('a[href="lessons/pi-discovery/index.html"]').click();
    await page.waitForURL('**/pi-discovery/index.html');
    const chapter=c=>page.locator(`[data-chapter="${c}"]`).click();
    const next=()=>page.locator('#next').click();
    const screenshot=name=>page.screenshot({path:path.join(os.tmpdir(),`pi-scenes-${name}.png`)});
    const end=()=>page.locator('#experience').getAttribute('aria-busy').then(v=>v==='false');
    async function settle(){await page.waitForFunction(()=>document.querySelector('#experience').getAttribute('aria-busy')==='false');}
    async function contrast(){
      const failures=await page.locator('button:visible').evaluateAll(elements=>{
        const lum=c=>{const a=c.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
        return elements.map(el=>{let bg=getComputedStyle(el).backgroundColor,p=el;while(bg==='rgba(0, 0, 0, 0)'&&p.parentElement){p=p.parentElement;bg=getComputedStyle(p).backgroundColor;}const a=lum(bg),b=lum(getComputedStyle(el).color);return {label:el.textContent,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};}).filter(x=>x.ratio<4.5);
      });assert.deepEqual(failures,[],'Button contrast');
    }
    const shotStops=[0,15,25,31,37];
    for(const size of [{width:1366,height:768},{width:1440,height:900}]){
      await page.setViewportSize(size);await chapter(0);
      for(let i=0;i<38;i++){
        assert.equal(await page.locator('#progress').textContent(),`${i+1} / 38`);
        const metrics=await page.evaluate(()=>{const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};};return {height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll('#next,#previous,#replay')].map(rect),layers:[...document.querySelectorAll('#canvas>g')].filter(el=>getComputedStyle(el).display!=='none').length,opacity:getComputedStyle(document.querySelector('#experience')).opacity,animation:getComputedStyle(document.querySelector('#experience')).animationName};});
        assert(metrics.height<=size.height+1);assert(metrics.width<=size.width+1);assert.equal(metrics.layers,1);assert.equal(metrics.opacity,'1');assert.equal(metrics.animation,'none');
        metrics.buttons.forEach(r=>assert(r.top>=0&&r.bottom<=size.height&&r.left>=0&&r.right<=size.width));await contrast();
        if(shotStops.includes(i))await screenshot(`${size.width}-${i+1}`);
        if(i<37)await next();
      }
    }
    // Exact geometry in the displayed comparison.
    await chapter(3);await next();await next();await next();
    const lengths=await page.evaluate(()=>({rope:document.querySelector('#rope').getTotalLength(),rod:document.querySelector('#rod-1 line').getTotalLength()}));
    assert(Math.abs(lengths.rope/lengths.rod-Math.PI)<.00001);
    await page.locator('#previous').click();assert(await page.locator('#remaining').isHidden());
    await page.keyboard.press('ArrowRight');assert(await page.locator('#remaining').isVisible());
    await chapter(0);await page.locator('#bike').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#story').textContent(),/藏着一个圆/);
    await page.locator('#sources-button').click();assert(await page.locator('#information').isVisible());await page.keyboard.press('Escape');
    await chapter(6);await page.locator('#detail').click();assert(await page.locator('#formula-dialog').isVisible());await page.keyboard.press('Escape');
    // Normal-speed semantic motion, including interruptions and automatic stopping.
    await page.emulateMedia({reducedMotion:'no-preference'});
    async function changes(selector,attribute,action){
      await page.bringToFront();await action();
      const first=await page.locator(selector).getAttribute(attribute);
      // Wait for an actual intermediate frame, not an assumption about OS scheduling.
      await page.waitForFunction(({selector,attribute,first})=>document.querySelector(selector).getAttribute(attribute)!==first&&document.querySelector('#experience').getAttribute('aria-busy')==='true',{selector,attribute,first},{timeout:3000});
      const middle=await page.locator(selector).getAttribute(attribute);
      assert.notEqual(first,middle,`${selector} must really move`);await settle();return {first,middle};
    }
    await changes('#bike','transform',()=>chapter(0));
    await changes('#plate','transform',next);await changes('#moon','opacity',next);
    await chapter(2);await settle();
    await changes('#rope','d',next);await next();await settle();
    const frame=await page.locator('.stage').boundingBox();
    await next();let samples=[];
    for(let i=0;i<6;i++){await page.waitForTimeout(250);samples.push(await page.locator('#rope').evaluate(el=>({length:el.getTotalLength(),box:{y:el.getBBox().y,height:el.getBBox().height}})));}
    samples.forEach(v=>{assert(Math.abs(v.length-Math.PI*216)<.02);assert(v.box.y>=0&&v.box.y+v.box.height<=460);});
    await settle();assert.deepEqual(await page.locator('.stage').boundingBox(),frame);
    await next();await settle();await changes('#rod-1','transform',next);
    const stop=await page.locator('#progress').textContent();await page.waitForTimeout(500);assert.equal(await page.locator('#progress').textContent(),stop);
    await chapter(5);await settle();await next();await settle();await changes('#inner-polygon','points',next);
    await chapter(7);await settle();await next();await settle();await next();await settle();await next();await settle();
    await changes('#rolling-wheel-position','transform',next);assert.match(await page.locator('#rolling-error').textContent(),/15\.927/);
    await next();await settle();assert.match(await page.locator('#rolling-error').textContent(),/0\.073/);
    await chapter(2);await page.waitForTimeout(120);await chapter(0);await settle();await page.waitForTimeout(500);assert.equal(await page.locator('#progress').textContent(),'1 / 38');
    await page.locator('#replay').click();await contrast();await page.emulateMedia({reducedMotion:'reduce'});await settle();assert(await end());
    // Buttons stay readable in interaction states.
    for(const id of ['next','replay','sources-button']){await page.locator(`#${id}`).hover();await contrast();await page.locator(`#${id}`).focus();await contrast();}
    assert.deepEqual(errors,[]);
    console.log('PASS: 38 stops at two desktop sizes, exact ratios, intermediate length-preserving rope, driving, rod placement, polygons, rolling, keyboard, dialogs, replay/cancellation, reduced motion, stable frame, contrast, no console errors.');
    console.log(JSON.stringify({lengths,samples,screenshots:os.tmpdir()}));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});

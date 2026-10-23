const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const { chromium } = require("playwright");
const model = require("../lessons/周长不变形状变/canvas-models.js");

(async () => {
  const root = path.resolve(__dirname, "..");
  const server = process.env.MATH_CANVAS_URL ? null : http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (pathname === "/favicon.ico") { response.writeHead(204); response.end(); return; }
    const file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404); response.end(); return;
    }
    response.setHeader("Content-Type", ({ ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css" })[path.extname(file)] || "application/octet-stream");
    response.end(fs.readFileSync(file));
  });
  if (server) await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const executablePath = process.env.MATH_BROWSER_PATH || [
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe"
  ].find((file) => fs.existsSync(file));
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const base = process.env.MATH_CANVAS_URL || "http://127.0.0.1:" + server.address().port;
    await page.goto(base + "/lessons/" + encodeURIComponent("周长不变形状变") + "/index.html");
    const imageObjects = () => page.locator(".image-object");
    async function screen(point) {
      return page.locator("#canvas").evaluate((svg, p) => {
        const q = svg.createSVGPoint(); q.x = p.x; q.y = p.y;
        const result = q.matrixTransform(svg.getScreenCTM()); return { x: result.x, y: result.y };
      }, point);
    }
    async function click(point) { const p = await screen(point); await page.mouse.click(p.x, p.y); }
    async function drag(start, end) {
      const a = await screen(start), b = await screen(end);
      await page.mouse.move(a.x, a.y); await page.mouse.down();
      await page.mouse.move(b.x, b.y, { steps: 5 }); await page.mouse.up();
    }
    async function key(value) { await page.locator("#canvas").focus(); await page.keyboard.press(value); }
    async function saved() {
      await page.locator("#more-button").click(); await page.locator("#save-canvas").click();
      await page.locator("#name-input").fill("Browser validation"); await page.locator("#confirm-name").click();
      await page.keyboard.press("Escape");
      return page.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).at(-1));
    }
    async function boundsCheck(target = page) {
      const issues = await target.evaluate(() => {
        const result = [];
        if (document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1) result.push("page overflow");
        for (const button of document.querySelectorAll(".tool-strip button, dialog[open], .drop-panel:not([hidden])")) {
          if (!button.getClientRects().length) continue;
          const r = button.getBoundingClientRect();
          if (r.left < 0 || r.top < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) result.push(button.id + " outside viewport");
        }
        return result;
      });
      assert.deepEqual(issues, []);
    }
    async function contrastCheck(target = page) {
      const failures = await target.locator("button:visible").evaluateAll((buttons) => {
        const luminance = (color) => {
          const [r, g, b] = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => {
            const n = v / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
          });
          return r * .2126 + g * .7152 + b * .0722;
        };
        return buttons.filter((button) => button.textContent.trim()).flatMap((button) => {
          const style = getComputedStyle(button);
          let background = style.backgroundColor, parent = button;
          while (background === "rgba(0, 0, 0, 0)" && parent.parentElement) {
            parent = parent.parentElement; background = getComputedStyle(parent).backgroundColor;
          }
          const a = luminance(style.color), b = luminance(background);
          const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          return ratio < 4.5 ? [{ id: button.id, label: button.textContent, ratio }] : [];
        });
      });
      assert.deepEqual(failures, [], "button text contrast");
    }
    const shot = async (name) => {
      const file = path.join(os.tmpdir(), "math-canvas-" + name + ".png");
      await page.screenshot({ path: file }); console.log("Screenshot: " + file);
    };
    await boundsCheck(); await contrastCheck(); await shot("initial");
    // The new insertion entry and its tools retain contrast across button states.
    await page.locator("#insert-button").hover(); await contrastCheck();
    await page.mouse.down(); await contrastCheck(); await page.mouse.up();
    await page.locator("#text-mode").focus(); await contrastCheck();
    assert.equal(await page.locator("#cut-mode").isDisabled(), true);
    await page.keyboard.press("Escape");

    // Literal Unicode, symbols, multiline editing, and input shortcut isolation.
    await key("t"); await click({ x: 100, y: 100 });
    await page.locator("#text-input").fill("面积 = 12 cm²\n<svg> × π");
    await page.locator("#text-input").dispatchEvent("keydown", { key: "n", isComposing: true });
    assert.equal(await page.locator(".stick").count(), 0);
    await page.locator("#confirm-text").click();
    assert.equal(await page.locator(".text-object").count(), 1);
    assert.equal(await page.locator(".text-object svg").count(), 0);
    assert.match(await page.locator(".text-object").textContent(), /<svg>/);
    await page.locator(".text-object").dblclick();
    await page.locator("#text-input").fill("面积 = 12 cm²");
    await page.locator('[data-symbol="≈"]').click();
    await boundsCheck(); await contrastCheck();
    await page.locator("#confirm-text").click();
    assert.match(await page.locator(".text-object").textContent(), /≈/);
    await page.locator("#style-button").click(); await page.locator("#font-size-input").fill("36");
    await page.locator("#font-size-input").dispatchEvent("change"); await page.keyboard.press("Escape");
    assert.equal(await page.locator(".text-object text").getAttribute("font-size"), "36");
    const textBefore = await saved();
    await drag({ x: 120, y: 115 }, { x: 180, y: 145 });
    const textAfter = await saved();
    assert.equal(textAfter.objects[0].text, textBefore.objects[0].text);
    await key("Control+z");
    assert.equal(await page.locator(".text-object").count(), 1);

    // The default 180-degree sector is a closed semicircle with the correct perimeter.
    await page.locator("#shape-button").click(); await page.locator("#shape-type").selectOption("sector");
    assert.equal(await page.locator('[name="sweepAngle"]').inputValue(), "180");
    await page.locator('[name="radius"]').fill("3"); await page.locator("#create-shape").click();
    assert.equal(await page.locator("path.curve").count(), 1);
    assert.match(await page.locator("path.curve").getAttribute("d"), /Z$/);
    assert.match(await page.locator("#formula").textContent(), /180 ÷ 360 × 2 × π × 3 \+ 2 × 3/);
    assert(Math.abs(parseFloat((await page.locator("#perimeter-value").textContent()).replace(/[^\d.]/g, "")) - model.semicirclePerimeter(3)) < 1e-7);
    await page.locator("#style-button").click(); await page.locator('#fill-palette [data-color="#f2c94c"]').click();
    await page.keyboard.press("Escape");
    assert.match(await page.locator("path.curve").getAttribute("style"), /fill:#f2c94c/);

    // Use a colored test image with asymmetry to check texture alignment.
    const png = await page.evaluate(() => {
      const canvas = document.createElement("canvas"); canvas.width = 320; canvas.height = 200;
      const c = canvas.getContext("2d");
      c.fillStyle = "#f2c94c"; c.fillRect(0, 0, 160, 100);
      c.fillStyle = "#2563eb"; c.fillRect(160, 0, 160, 100);
      c.fillStyle = "#229954"; c.fillRect(0, 100, 160, 100);
      c.fillStyle = "#d52a1e"; c.fillRect(160, 100, 160, 100);
      c.fillStyle = "#172033"; c.font = "50px sans-serif"; c.fillText("A  B", 15, 70); c.fillText("C  D", 15, 170);
      return canvas.toDataURL("image/png").split(",")[1];
    });
    await page.locator("#image-input").setInputFiles({ name: "geometry.png", mimeType: "image/png", buffer: Buffer.from(png, "base64") });
    await imageObjects().waitFor();
    let scene = await saved();
    const original = scene.objects.find((object) => object.kind === "image");
    const imageOrigin = await page.locator(".image-object").evaluate((el) => {
      const matrix = el.transform.baseVal.consolidate().matrix; return { x: matrix.e, y: matrix.f };
    });
    const center = { x: imageOrigin.x + original.width / 2, y: imageOrigin.y + original.height / 2 };
    await key("k");
    await drag({ x: center.x, y: center.y - 130 }, { x: center.x, y: center.y + 130 });
    assert.equal(await imageObjects().count(), 2);
    await drag({ x: center.x - 190, y: center.y }, { x: center.x + 190, y: center.y });
    assert.equal(await imageObjects().count(), 4);
    scene = await saved();
    let pieces = scene.objects.filter((object) => object.kind === "image");
    assert(Math.abs(pieces.reduce((sum, piece) => sum + model.polygonArea(piece.points), 0) - original.width * original.height) < 1e-6);
    assert(pieces.every((piece) => piece.src === original.src && piece.angle === 0));
    // The unselected piece interiors still display the matching source pixels.
    for (const piece of pieces) {
      const group = page.locator('.image-object[data-id="' + piece.id + '"]');
      assert.equal(await group.locator("image").getAttribute("href"), original.src);
    }
    await shot("four-pieces");
    await key("Control+z"); assert.equal(await imageObjects().count(), 2);
    await key("Control+z"); assert.equal(await imageObjects().count(), 1);
    assert.doesNotMatch(await imageObjects().getAttribute("transform"), /NaN/, "undo must preserve valid image coordinates");
    await key("k"); // leave cut mode
    // Rotate around a chosen center, then cut in the rotated image's coordinate frame.
    await key("5"); await page.locator("#rotate-pick-pivot").click(); await click({ x: center.x - 220, y: center.y });
    assert.doesNotMatch(await imageObjects().getAttribute("transform"), /NaN/, "setting a pivot must preserve valid image coordinates");
    await page.locator("#rotate-angle").fill("90");
    await page.locator("#rotate-clockwise").click();
    assert.match(await imageObjects().getAttribute("transform"), /rotate\(90/);
    await key("2");
    const beforeRotatedCut = await saved();
    const rotated = beforeRotatedCut.objects.find((object) => object.kind === "image");
    const worldTransform = await imageObjects().getAttribute("transform");
    const position = worldTransform.match(/translate\(([-\d.e+]+) ([-\d.e+]+)\) rotate\(([-\d.e+]+)\)/);
    const worldImage = { ...rotated, x: Number(position[1]), y: Number(position[2]), angle: Number(position[3]) };
    await key("k");
    await drag(model.toWorld({ x: 160, y: -20 }, worldImage), model.toWorld({ x: 160, y: 220 }, worldImage));
    assert.equal(await imageObjects().count(), 2);
    const rotatedScene = await saved();
    pieces = rotatedScene.objects.filter((object) => object.kind === "image");
    assert(Math.abs(pieces.reduce((sum, piece) => sum + model.polygonArea(piece.points), 0) - 64000) < 1e-6);
    assert(pieces.every((piece) => Math.abs(piece.angle - 90) < 1e-7));
    // Move one piece without moving its neighbour; preserve its texture and boundary.
    await key("2"); await page.locator("#zoom-fit").click();
    await click({ x: 700, y: 40 });
    const pieceId = pieces[0].id;
    const selectedPiece = page.locator('.image-object[data-id="' + pieceId + '"]');
    const pose = await selectedPiece.evaluate((element) => {
      const m = element.transform.baseVal.consolidate().matrix;
      return { x: m.e, y: m.f, angle: Math.atan2(m.b, m.a) * 180 / Math.PI };
    });
    const centroid = pieces[0].points.reduce((sum, p) => ({ x: sum.x + p.x / pieces[0].points.length,
      y: sum.y + p.y / pieces[0].points.length }), { x: 0, y: 0 });
    const grab = model.toWorld(centroid, pose);
    const neighbour = await imageObjects().nth(1).getAttribute("transform");
    await drag(grab, { x: grab.x + 50, y: grab.y - 20 });
    const movedPose = await selectedPiece.evaluate((element) => {
      const m = element.transform.baseVal.consolidate().matrix; return { x: m.e, y: m.f };
    });
    assert(Math.abs(movedPose.x - pose.x - 50) < 1e-5 && Math.abs(movedPose.y - pose.y + 20) < 1e-5);
    assert.equal(await imageObjects().nth(1).getAttribute("transform"), neighbour);
    await key("Control+z");
    // A diagonal cut of one piece creates one additional piece. A miss creates no undo step.
    await key("k");
    await drag(model.toWorld({ x: centroid.x - 150, y: centroid.y - 150 }, pose),
      model.toWorld({ x: centroid.x + 150, y: centroid.y + 150 }, pose));
    assert.equal(await imageObjects().count(), 3);
    await drag(model.toWorld({ x: -10, y: -20 }, pose), model.toWorld({ x: -10, y: 220 }, pose));
    assert.equal(await imageObjects().count(), 3);
    assert.match(await page.locator("#hint").textContent(), /穿过|cross/);
    await key("Control+z"); assert.equal(await imageObjects().count(), 2);
    // Rotate mixed objects together, including the semicircle and text.
    await key("2"); await key("Control+a"); await key("5");
    const pivot = { x: 600, y: 30 };
    await page.locator("#rotate-pick-pivot").click(); await click(pivot);
    const theta = .2;
    await page.locator("#rotate-angle").fill(String(theta * 180 / Math.PI));
    await page.locator("#rotate-clockwise").click();
    const mixedScene = await saved();
    assert(Math.abs(mixedScene.curves[0].angle - theta * 180 / Math.PI) < 1e-6);
    assert(Math.abs(mixedScene.objects.find((object) => object.kind === "text").angle - theta * 180 / Math.PI) < 1e-6);
    // Mixed copy/paste includes text, semicircle, and both image pieces.
    await key("2"); await key("Control+a"); await key("Control+c"); await key("Control+v");
    assert.equal(await imageObjects().count(), 4);
    assert.equal(await page.locator(".text-object").count(), 2);
    assert.equal(await page.locator("path.curve").count(), 2);
    await key("Control+z"); assert.equal(await imageObjects().count(), 2);
    const finalScene = await saved();
    const lastIndex = await page.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).length - 1);
    await page.reload(); await page.locator("#library-button").click();
    await page.locator('[data-insert="' + lastIndex + '"]').click();
    assert.equal(await imageObjects().count(), 2);
    assert.equal(await page.locator(".text-object").count(), 1);
    assert.equal(await page.locator("path.curve").count(), 1);
    const restored = await saved();
    assert.deepEqual(restored.objects.map(({ id, x, y, ...rest }) => rest), finalScene.objects.map(({ id, x, y, ...rest }) => rest));
    assert.deepEqual(restored.curves.map(({ cx, cy, ...curve }) => curve), finalScene.curves.map(({ cx, cy, ...curve }) => curve));
    restored.curves.forEach((curve, index) => {
      assert(Math.abs(curve.cx - finalScene.curves[index].cx) < 1e-7);
      assert(Math.abs(curve.cy - finalScene.curves[index].cy) < 1e-7);
    });
    await page.locator("#zoom-fit").click();
    const wholeBounds = await page.locator("#shape-layer").evaluate((group) => {
      const r = group.getBBox(); return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    await drag({ x: wholeBounds.x - 10, y: wholeBounds.y - 10 },
      { x: wholeBounds.x + wholeBounds.width + 10, y: wholeBounds.y + wholeBounds.height + 10 });
    assert.equal(await page.locator(".canvas-object.selected, .curve.selected").count(), 4);
    await key("Delete"); assert.equal(await page.locator(".canvas-object, .curve").count(), 0);
    await key("Control+z"); assert.equal(await page.locator(".canvas-object, .curve").count(), 4);

    for (const size of [{ width: 1366, height: 768 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(size); await page.locator("#zoom-fit").click(); await boundsCheck();
      for (const language of ["en", "zh"]) {
        await page.locator("#more-button").click(); await page.locator("#language-button").click();
        await page.keyboard.press("Escape"); await boundsCheck(); await contrastCheck();
        await page.locator("#insert-button").click(); await boundsCheck(); await contrastCheck(); await page.keyboard.press("Escape");
        await page.locator("#style-button").click(); await boundsCheck(); await contrastCheck(); await page.keyboard.press("Escape");
        await shot(size.width + "-" + language);
      }
    }
    // Sector geometry, angle validation, transforms, persistence, and old semicircles.
    const sectorPage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    sectorPage.on("pageerror", (error) => errors.push(error.message));
    await sectorPage.goto(page.url());
    const sectorKey = async (value) => {
      await sectorPage.locator("#canvas").focus(); await sectorPage.keyboard.press(value);
    };
    async function saveSector() {
      await sectorPage.locator("#save-shape-button").click();
      return sectorPage.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).at(-1).curves[0]);
    }
    for (const sweep of [90, 180, 270, 360, 22.5]) {
      await sectorPage.locator("#shape-button").click();
      await sectorPage.locator("#shape-type").selectOption("sector");
      await sectorPage.locator('[name="sweepAngle"]').fill(String(sweep));
      await sectorPage.locator("#create-shape").click();
      const sector = await saveSector();
      assert.equal(sector.sweepAngle, sweep);
      assert.equal(sector.kind, "sector");
      assert.match(await sectorPage.locator("#shape-name").textContent(), new RegExp(sweep + "°"));
      const expected = sweep === 360 ? 6 * Math.PI : sweep / 180 * 3 * Math.PI + 6;
      assert(Math.abs(parseFloat((await sectorPage.locator("#perimeter-value").textContent()).replace(/[^\d.]/g, "")) - expected) < 1e-7);
      if (sweep === 360) {
        assert.equal(await sectorPage.locator("ellipse.curve").count(), 1);
        assert.equal(await sectorPage.locator("path.curve").count(), 0, "full circles have no radial seam");
        assert.doesNotMatch(await sectorPage.locator("#formula").textContent(), /\+ 2 ×/);
      } else {
        const result = await sectorPage.locator("path.curve").evaluate((element, degrees) => {
          const [cx, cy] = element.getAttribute("d").match(/^M([^ ]+) ([^L]+)/).slice(1).map(Number);
          const atAngle = (angle) => new DOMPoint(cx + 48 * Math.cos(angle * Math.PI / 180), cy + 48 * Math.sin(angle * Math.PI / 180));
          const b = element.getBBox();
          return { inside: element.isPointInFill(atAngle(180 + degrees / 2)),
            outside: element.isPointInFill(atAngle(180 + degrees + (360 - degrees) / 2)),
            bounds: { x: b.x, y: b.y, width: b.width, height: b.height }, path: element.getAttribute("d") };
        }, sweep);
        assert(result.inside && !result.outside, "fill must cover the requested portion of the circle");
        assert.match(result.path, new RegExp("A96 96 0 " + (sweep > 180 ? 1 : 0) + " 1 "));
        if (sweep === 90) {
          assert(Math.abs(result.bounds.width - 96) < 1e-7 && Math.abs(result.bounds.height - 96) < 1e-7);
        }
      }
      if (sweep === 270) {
        const pathBefore = await sectorPage.locator(".curve").getAttribute("d");
        await sectorKey("5"); await sectorPage.locator("#rotate-pick-pivot").click();
        const pivotPoint = await sectorPage.locator("#canvas").evaluate((svg) => {
          const p = new DOMPoint(500, 260).matrixTransform(svg.getScreenCTM()); return { x: p.x, y: p.y };
        });
        await sectorPage.mouse.click(pivotPoint.x, pivotPoint.y);
        await sectorPage.locator("#rotate-angle").fill("37");
        await sectorPage.locator("#rotate-clockwise").click();
        const rotated = await saveSector();
        assert.equal(rotated.sweepAngle, 270); assert.equal(rotated.angle, 37);
        await sectorKey("Control+z");
        assert.equal(await sectorPage.locator(".curve").getAttribute("d"), pathBefore);
        assert.equal((await saveSector()).angle, 0);
        await sectorKey("2");
      }
      await sectorKey("Control+c"); await sectorKey("Control+v");
      assert.equal(await sectorPage.locator(".curve").count(), 2);
      assert.equal((await saveSector()).sweepAngle, sweep);
      await sectorKey("Control+z"); assert.equal(await sectorPage.locator(".curve").count(), 1);
      await sectorPage.reload();
      const entryIndex = await sectorPage.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).length - 1);
      await sectorPage.locator("#library-button").click();
      await sectorPage.locator('[data-insert="' + entryIndex + '"]').click();
      assert.equal((await saveSector()).sweepAngle, sweep);
      await sectorPage.locator("#zoom-fit").click();
      const fits = await sectorPage.locator(".curve").evaluate((element) => {
        const rect = element.getBoundingClientRect(), canvas = document.getElementById("canvas").getBoundingClientRect();
        return rect.left >= canvas.left && rect.right <= canvas.right && rect.top >= canvas.top && rect.bottom <= canvas.bottom;
      });
      assert(fits, "fit must include the entire sector");
      if ([90, 270, 360].includes(sweep)) {
        const file = path.join(os.tmpdir(), "math-canvas-sector-" + sweep + ".png");
        await sectorPage.screenshot({ path: file }); console.log("Screenshot: " + file);
      }
      await sectorKey("Delete");
    }
    await sectorPage.locator("#shape-button").click(); await sectorPage.locator("#shape-type").selectOption("sector");
    for (const value of ["", "0", "-1", "360.01"]) {
      await sectorPage.locator('[name="sweepAngle"]').fill(value); await sectorPage.locator("#create-shape").click();
      assert.equal(await sectorPage.locator(".curve").count(), 0);
      assert.match(await sectorPage.locator("#shape-error").textContent(), /360°/);
      assert(await sectorPage.locator("#shape-dialog").isVisible());
    }
    await sectorPage.locator('[name="sweepAngle"]').fill("90");
    for (const value of ["", "0", "-1"]) {
      await sectorPage.locator('[name="radius"]').fill(value); await sectorPage.locator("#create-shape").click();
      assert.equal(await sectorPage.locator(".curve").count(), 0);
      assert.match(await sectorPage.locator("#shape-error").textContent(), /半径|radius/);
    }
    await sectorPage.locator("#cancel-shape").click(); await sectorKey("Control+z");
    assert.equal(await sectorPage.locator(".curve").count(), 1, "invalid creation must not add undo steps");
    for (const size of [{ width: 1366, height: 768 }, { width: 1440, height: 900 }]) {
      await sectorPage.setViewportSize(size);
      for (const language of ["zh", "en"]) {
        await sectorPage.locator("#shape-button").click(); await sectorPage.locator("#shape-type").selectOption("sector");
        const label = await sectorPage.locator('[name="sweepAngle"]').locator("..").textContent();
        assert.match(label, language === "zh" ? /圆心角（°）/ : /Central angle（°）/);
        await boundsCheck(sectorPage); await contrastCheck(sectorPage);
        const file = path.join(os.tmpdir(), "math-canvas-sector-" + size.width + "-" + language + ".png");
        await sectorPage.screenshot({ path: file }); console.log("Screenshot: " + file);
        await sectorPage.locator("#cancel-shape").click();
        await sectorPage.locator("#more-button").click(); await sectorPage.locator("#language-button").click(); await sectorKey("Escape");
      }
    }
    const legacySector = { name: "Old semicircle", segments: [], curves: [{ kind: "semicircle", cx: 96, cy: 96, rx: 96, ry: 96, angle: 37 }] };
    await sectorPage.evaluate((entry) => localStorage.setItem("geometry-canvas-library", JSON.stringify([entry])), legacySector);
    await sectorPage.reload(); await sectorPage.locator("#library-button").click(); await sectorPage.locator('[data-insert="0"]').click();
    assert.equal(await sectorPage.locator("path.curve").count(), 1);
    assert.match(await sectorPage.locator(".curve").getAttribute("transform"), /rotate\(37 /);
    const oldPerimeter = parseFloat((await sectorPage.locator("#perimeter-value").textContent()).replace(/[^\d.]/g, ""));
    assert(Math.abs(oldPerimeter - (3 * Math.PI + 6)) < 1e-7);
    await sectorPage.close();

    // A mixed scene exercises actual SVG paint order and native pointer hit testing.
    const layerPage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    layerPage.on("pageerror", (error) => errors.push(error.message));
    await layerPage.goto(page.url());
    const squarePoints = [{ x: 0, y: 0 }, { x: 120, y: 0 }, { x: 120, y: 120 }, { x: 0, y: 120 }];
    const fixture = {
      name: "Layer fixture",
      segments: squarePoints.map((a, index) => ({ a, b: squarePoints[(index + 1) % 4], length: 3.75,
        layer: 1, color: "#087f75", fill: "#f2c94c", width: 5, dash: "solid" })),
      curves: [{ kind: "circle", cx: 60, cy: 60, rx: 55, ry: 55, layer: 2, fill: "#2563eb" }],
      objects: [
        { kind: "text", x: 45, y: 45, width: 60, height: 36, fontSize: 28, color: "#172033", text: "π ×", layer: 3 },
        { kind: "image", x: 0, y: 0, width: 120, height: 120, points: squarePoints, src: original.src, layer: 0 }
      ]
    };
    await layerPage.evaluate((entry) => localStorage.setItem("geometry-canvas-library", JSON.stringify([entry])), fixture);
    await layerPage.reload();
    async function layerKey(value) { await layerPage.locator("#canvas").focus(); await layerPage.keyboard.press(value); }
    async function insertLayerEntry(index) {
      await layerPage.locator("#library-button").click();
      await layerPage.locator('[data-insert="' + index + '"]').click();
    }
    async function layerOrder() {
      return layerPage.locator(".scene-layer").evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.layerId)));
    }
    async function layerAction(direction) {
      if (await layerPage.locator("#layer-menu").isHidden()) await layerPage.locator("#layer-button").click();
      await layerPage.locator("#layer-" + direction).click();
    }
    async function saveLayerScene() {
      await layerPage.locator("#more-button").click(); await layerPage.locator("#save-canvas").click();
      await layerPage.locator("#confirm-name").click(); await layerKey("Escape");
      return layerPage.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).at(-1));
    }
    await layerPage.locator("#layer-button").click();
    for (const direction of ["forward", "backward", "front", "back"]) assert(await layerPage.locator("#layer-" + direction).isDisabled());
    await layerKey("Escape");
    await insertLayerEntry(0);
    assert.deepEqual(await layerOrder(), [7, 1, 5, 6]);
    await layerKey("Escape");
    const overlapPoint = () => layerPage.locator(".fill-shape").first().evaluate((polygon) => {
      const b = polygon.getBBox(), p = new DOMPoint(b.x + 60, b.y + 60).matrixTransform(polygon.getScreenCTM());
      return { x: p.x, y: p.y };
    });
    const hit = async () => layerPage.evaluate(({ x, y }) => Number(document.elementFromPoint(x, y).closest(".scene-layer")?.dataset.layerId), await overlapPoint());
    async function clickOverlap() { const p = await overlapPoint(); await layerPage.mouse.click(p.x, p.y); }
    assert.equal(await hit(), 6, "front text must receive overlapping clicks");
    await clickOverlap();
    await layerAction("back"); assert.deepEqual(await layerOrder(), [6, 7, 1, 5]);
    assert.equal(await hit(), 5, "sending text behind must expose the circle");
    assert(await layerPage.locator("#layer-backward").isDisabled());
    assert(await layerPage.locator("#layer-back").isDisabled());
    await layerAction("forward"); assert.deepEqual(await layerOrder(), [7, 6, 1, 5]);
    await layerAction("backward"); assert.deepEqual(await layerOrder(), [6, 7, 1, 5]);
    await layerAction("front"); assert.deepEqual(await layerOrder(), [7, 1, 5, 6]);
    assert.equal(await hit(), 6);
    assert(await layerPage.locator("#layer-forward").isDisabled());
    await layerPage.locator("#layer-front").evaluate((button) => button.click());
    await layerKey("Control+z"); assert.deepEqual(await layerOrder(), [6, 7, 1, 5], "disabled action must not create an undo step");
    await layerKey("Control+z"); assert.deepEqual(await layerOrder(), [7, 6, 1, 5]);
    await layerKey("Control+z"); assert.deepEqual(await layerOrder(), [6, 7, 1, 5]);
    await layerKey("Control+z"); assert.deepEqual(await layerOrder(), [7, 1, 5, 6]);
    await layerKey("Escape"); await layerKey("Escape");
    // Selecting one edge still moves the complete square, including endpoints and labels.
    const edge = layerPage.locator('.hit-stick[data-id="1"]');
    const edgePoint = await edge.evaluate((line) => {
      const p = new DOMPoint(Number(line.getAttribute("x1")) + 30, Number(line.getAttribute("y1")))
        .matrixTransform(line.getScreenCTM()); return { x: p.x, y: p.y };
    });
    await layerPage.mouse.click(edgePoint.x, edgePoint.y);
    await layerAction("front"); assert.deepEqual(await layerOrder(), [7, 5, 6, 1]);
    const square = layerPage.locator('.scene-layer[data-layer-id="1"]');
    assert.equal(await square.locator(".stick").count(), 4);
    assert.equal(await square.locator(".joint").count(), 8);
    assert.equal(await square.locator(".edge-label").count(), 4);
    assert.equal(await square.locator(".fill-shape").count(), 1);
    assert.equal(await hit(), 1, "the square fill must move above text and curve");
    const stacked = await saveLayerScene();
    assert(stacked.segments.every((segment) => segment.layer === stacked.segments[0].layer));
    assert(stacked.segments[0].layer > stacked.objects[0].layer);
    // Non-adjacent multi-selection retains its internal order when lowered and copied.
    await layerKey("Escape");
    assert.equal(await hit(), 1, "square must remain on top before lowering");
    await clickOverlap();
    // The image extends under the square; lower the square first to expose it.
    await layerAction("back"); assert.deepEqual(await layerOrder(), [1, 7, 5, 6]);
    await layerKey("Escape"); await layerKey("Escape");
    assert.equal(await hit(), 6, "lowering square must expose text");
    await clickOverlap(); // text above image, circle, and square
    assert.equal(await layerPage.locator('.text-object.selected[data-id="6"]').count(), 1);
    await layerPage.keyboard.down("Shift");
    const imageCorner = await layerPage.locator(".image-boundary").evaluate((polygon) => {
      const p = new DOMPoint(4, 4).matrixTransform(polygon.getScreenCTM()); return { x: p.x, y: p.y };
    });
    await layerPage.mouse.click(imageCorner.x, imageCorner.y);
    await layerPage.keyboard.up("Shift");
    await layerAction("back"); assert.deepEqual(await layerOrder(), [7, 6, 1, 5]);
    await layerKey("Control+c"); await layerKey("Control+v");
    assert.deepEqual((await layerOrder()).slice(-2), [9, 8], "pasted image stays below pasted text and above the scene");
    await layerKey("Control+z");
    await layerPage.locator("#save-shape-button").click();
    const savedSelection = await layerPage.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).at(-1));
    assert.equal(savedSelection.objects.length, 2);
    assert(savedSelection.objects.find((item) => item.kind === "text").layer > savedSelection.objects.find((item) => item.kind === "image").layer);
    const persistedLayers = await saveLayerScene();
    const libraryIndex = await layerPage.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).length - 1);
    await layerPage.reload(); await insertLayerEntry(libraryIndex);
    assert.deepEqual(await layerOrder(), [7, 6, 1, 5]);
    const restoredLayers = await saveLayerScene();
    assert.deepEqual(restoredLayers.segments.map((item) => item.layer), persistedLayers.segments.map((item) => item.layer));
    assert.deepEqual(restoredLayers.objects.map((item) => item.layer), persistedLayers.objects.map((item) => item.layer));
    // Inserting a second saved scene puts it in front without changing internal order.
    await layerPage.locator("#canvas").dispatchEvent("wheel", { deltaX: 300, deltaY: 0 });
    await insertLayerEntry(libraryIndex);
    assert.deepEqual(await layerOrder(), [7, 6, 1, 5, 14, 13, 8, 12]);
    await layerPage.locator("#add-button").click();
    assert.equal((await layerOrder()).at(-1), 15, "new objects must appear above saved layers");
    await layerKey("Control+z");
    // Old saved entries without a layer field remain insertable.
    await layerPage.evaluate((entry) => {
      for (const item of entry.segments.concat(entry.curves, entry.objects)) delete item.layer;
      const entries = JSON.parse(localStorage.getItem("geometry-canvas-library"));
      entries.push(entry); localStorage.setItem("geometry-canvas-library", JSON.stringify(entries));
    }, fixture);
    await layerPage.reload();
    const legacyIndex = await layerPage.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).length - 1);
    await insertLayerEntry(legacyIndex); assert.equal((await layerOrder()).length, 4);
    await layerKey("Escape");
    const legacyEdgePoint = await layerPage.locator('.hit-stick[data-id="1"]').evaluate((line) => {
      const p = new DOMPoint(Number(line.getAttribute("x1")) + 30, Number(line.getAttribute("y1")))
        .matrixTransform(line.getScreenCTM()); return { x: p.x, y: p.y };
    });
    await layerPage.mouse.click(legacyEdgePoint.x, legacyEdgePoint.y);
    for (const size of [{ width: 1366, height: 768 }, { width: 1440, height: 900 }]) {
      await layerPage.setViewportSize(size);
      for (const language of ["zh", "en"]) {
        if (language === "en") {
          await layerPage.locator("#more-button").click(); await layerPage.locator("#language-button").click(); await layerKey("Escape");
        }
        await layerPage.locator("#layer-button").click(); await boundsCheck(layerPage); await contrastCheck(layerPage);
        const enabledDirection = await layerPage.locator("#layer-backward").isEnabled() ? "backward" : "forward";
        await layerPage.locator("#layer-" + enabledDirection).hover(); await contrastCheck(layerPage);
        await layerPage.mouse.down(); await contrastCheck(layerPage); await layerPage.mouse.up();
        if (await layerPage.locator("#layer-menu").isHidden()) await layerPage.locator("#layer-button").click();
        await layerPage.locator("#layer-front").focus(); await contrastCheck(layerPage);
        const file = path.join(os.tmpdir(), "math-canvas-layers-" + size.width + "-" + language + ".png");
        await layerPage.screenshot({ path: file }); console.log("Screenshot: " + file);
        await layerKey("Escape");
      }
      await layerPage.locator("#more-button").click(); await layerPage.locator("#language-button").click(); await layerKey("Escape");
    }
    await layerPage.close();

    // Save failure must be visible and must not leave a phantom library entry.
    const storageCount = await page.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).length);
    await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException("Quota exceeded", "QuotaExceededError"); }; });
    await key("Control+a"); await page.locator("#save-shape-button").click();
    assert.match(await page.locator("#hint").textContent(), /保存失败|Could not save/);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("geometry-canvas-library")).length), storageCount);
    assert.deepEqual(errors, []);
    console.log("canvas browser tests passed");
  } finally { await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)); }
})().catch((error) => { console.error(error); process.exitCode = 1; });

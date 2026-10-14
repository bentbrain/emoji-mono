import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

for (const [app, title, count] of [["hand-shake", "Hand Shake", 20], ["middle-finger", "Middle Finger", 5]]) {
  test(`${app} builds a complete animated page`, () => {
    const html = readFileSync(`apps/${app}/dist/index.html`, "utf8");
    assert.ok(html.includes(`<title>${title}</title>`));
    assert.ok(existsSync(`apps/${app}/dist/favicon.png`));
    const script = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]).find((value) => value.includes("const emojis ="));
    assert.ok(script);
    const emojis = JSON.parse(/const emojis = (\[[^;]*\]);/.exec(script)[1]);
    assert.equal(emojis.length, count);
    const container = { clientWidth: 800, clientHeight: 600 };
    const element = { textContent: "", style: {}, offsetWidth: 80, offsetHeight: 80 };
    const frames = [];
    let resize;
    let randomIndex = 0;
    const randomValues = [0.1, 0.2, 0.4, 0.6, 0.8];
    runInNewContext(script, {
      document: { querySelector: () => container, getElementById: () => element },
      window: { addEventListener(event, callback) { if (event === "resize") resize = callback; } },
      requestAnimationFrame: (callback) => frames.push(callback),
      performance: { now: () => 0 },
      Math: { ...Math, random: () => randomValues[randomIndex++ % randomValues.length], floor: Math.floor, cos: Math.cos, sin: Math.sin, max: Math.max, min: Math.min, abs: Math.abs, PI: Math.PI },
    });
    assert.ok(emojis.includes(element.textContent));
    frames.shift()(0);
    assert.equal(element.style.transform, "translate3d(360px, 260px, 0)");
    const initialEmoji = element.textContent;
    let changed = false;
    for (let frame = 1; frame < 300; frame += 1) {
      frames.shift()(frame * 50);
      if (element.textContent !== initialEmoji) changed = true;
      const [x, y] = [...element.style.transform.matchAll(/(-?[\d.]+)px/g)].map((match) => Number(match[1]));
      assert.ok(x >= 0 && x <= 720);
      assert.ok(y >= 0 && y <= 520);
    }
    assert.equal(changed, true);
    container.clientWidth = 100;
    container.clientHeight = 100;
    resize();
    const [x, y] = [...element.style.transform.matchAll(/(-?[\d.]+)px/g)].map((match) => Number(match[1]));
    assert.ok(x >= 0 && x <= 20);
    assert.ok(y >= 0 && y <= 20);
  });
}

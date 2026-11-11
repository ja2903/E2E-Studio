// usage: node shoot.mjs <url> <out-prefix> <width> <height> <mobile 0|1> <scrollY,...>
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
const [url, out, w, h, mobile, ys] = process.argv.slice(2);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--hide-scrollbars", "--remote-debugging-port=9333", `--user-data-dir=${out}-profile`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch("http://127.0.0.1:9333/json")).json()).find((t) => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const logs = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) logs.push(m.params.type + ": " + m.params.args.map((a) => a.value ?? a.description).join(" "));
  if (m.method === "Runtime.exceptionThrown") logs.push("exception: " + m.params.exceptionDetails.exception?.description); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Runtime.enable"); await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === "1" });
await send("Page.navigate", { url }); await sleep(3500);
for (const y of ys.split(",")) {
  await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${y} * document.documentElement.scrollHeight)` }); await sleep(+(process.env.SHOOT_WAIT || 700));
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${out}-${y}.png`, Buffer.from(data, "base64"));
}
const { result } = await send("Runtime.evaluate", { expression: "document.documentElement.scrollWidth + 'x' + document.documentElement.scrollHeight + ' viewport ' + innerWidth" });
console.log("page", result.value); console.log(logs.length ? logs.join("\n") : "no console errors");
ws.close(); chrome.kill();

"use strict";

import log from "./logger.js";
import { Reactor } from "../../dist/tmg-player.mjs";
import { Reactor as OldReactor } from "./fossil.js";
window.Reactor ??= Reactor;
window.OldReactor ??= OldReactor;

// ==========================================
// PROFESSIONAL BENCHMARK SUITE
// ==========================================

var TEST_WARMUP_ITERATIONS = 200_000;
var TEST_ITERATIONS = 1_000_000;
var TEST_CYCLES = 5;

const btn = document.querySelector("button");
const breathe = () => new Promise((resolve) => setTimeout(resolve, 50));

window.runBenchmark = async function runBenchmark() {
  btn.disabled = true;
  log(`%c🧪 S.I.A. REACTOR PERFORMANCE EVALUATION`, "font-weight: bold; font-size: 16px; color: #4CAF50; padding-bottom: 4px;");
  log(`Initializing suite: ${TEST_CYCLES} cycles of ${TEST_ITERATIONS.toLocaleString()} operations...\n`);

  const rawObj = { val: 0 };
  const nativeProxy = new Proxy(
    { val: 0 },
    {
      set(t, k, v, r) {
        t[k] = v;
        return true;
      },
    }
  );
  const oldReactor = new OldReactor({ val: 0 });
  const newReactor = new Reactor({ val: 0 });

  log(`🔥 Warming up JIT compiler to stabilize execution environments...`);
  for (let i = 0; i < TEST_WARMUP_ITERATIONS; i++) {
    rawObj.val = i;
    nativeProxy.val = i;
    oldReactor.root.val = i;
    newReactor.core.val = i;
  }

  await breathe();

  log(`⏱️ Executing timed cycles after (${TEST_WARMUP_ITERATIONS.toLocaleString()} ops) warm up...\n`);
  const results = { raw: [], proxy: [], oldR: [], newR: [] };

  for (let cycle = 1; cycle <= TEST_CYCLES; cycle++) {
    let start = performance.now();
    for (let i = 0; i < TEST_ITERATIONS; i++) rawObj.val = i;
    results.raw.push(performance.now() - start);
    await breathe();

    start = performance.now();
    for (let i = 0; i < TEST_ITERATIONS; i++) nativeProxy.val = i;
    results.proxy.push(performance.now() - start);
    await breathe();

    start = performance.now();
    for (let i = 0; i < TEST_ITERATIONS; i++) oldReactor.root.val = i;
    results.oldR.push(performance.now() - start);
    await breathe();

    start = performance.now();
    for (let i = 0; i < TEST_ITERATIONS; i++) newReactor.core.val = i;
    results.newR.push(performance.now() - start);
    await breathe();
  }

  // --- STATISTICAL ANALYSIS ---
  const getStats = (arr) => {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const opsSec = Math.floor(TEST_ITERATIONS / (avg / 1000));
    return { avg, opsSec };
  };

  const rawStats = getStats(results.raw);
  const proxyStats = getStats(results.proxy);
  const oldStats = getStats(results.oldR);
  const newStats = getStats(results.newR);

  // --- DEVICE PROFILING (Based on 1,000,000 raw object mutations) ---
  const rawMs = parseFloat(rawStats.avg);
  let deviceProfile = "";
  let hardwareSpecs = "";

  if (rawMs <= 2.5) {
    deviceProfile = "Tier 1: Enthusiast / Server-Grade Compute";
    hardwareSpecs = "Apple M2/M3 Max, AMD Ryzen 9, Intel Core i9";
  } else if (rawMs <= 5.0) {
    deviceProfile = "Tier 2: High-Performance Desktop / Flagship Silicon";
    hardwareSpecs = "Apple M1/M2, Intel Core i7, AMD Ryzen 7";
  } else if (rawMs <= 9.0) {
    deviceProfile = "Tier 3: Standard Workstation / Premium Mobile";
    hardwareSpecs = "Standard Ultrabooks, iPhone 13+, Snapdragon 8 Gen 2";
  } else if (rawMs <= 16.0) {
    deviceProfile = "Tier 4: Mid-Range Mobile / Thermally Throttled";
    hardwareSpecs = "Standard Android, 5+ year old laptops, Power-Saving modes";
  } else if (rawMs <= 30.0) {
    deviceProfile = "Tier 5: Entry-Level Mobile / Legacy Hardware";
    hardwareSpecs = "Budget smartphones, aggressive background throttling";
  } else {
    deviceProfile = "Tier 6: Severely Constrained Environment";
    hardwareSpecs = "Extreme battery saver, legacy devices, CPU starvation";
  }

  log(`%c=== ENVIRONMENT PROFILE ===`, "color: darkturquoise; font-weight: bold;");
  log(`Performance Class:  ${deviceProfile}`);
  log(`Equivalent Specs:   ${hardwareSpecs}`);
  log(`Base Memory Speed:  ~${rawStats.opsSec.toLocaleString()} ops/sec (Raw Object)\n`);

  log(`%c=== ABSOLUTE PERFORMANCE (Average over ${TEST_CYCLES} million ops) ===`, "color: darkturquoise; font-weight: bold;");
  const logPad = (name, avg, ops) => log(`${name.padEnd(20)} | ${avg.toFixed(2).padStart(8)} ms | ${ops.toLocaleString().padStart(12)} ops/sec`);

  logPad("1. Bare Metal", rawStats.avg, rawStats.opsSec);
  logPad("2. Native Proxy", proxyStats.avg, proxyStats.opsSec);
  logPad("3. V0 Reactor", oldStats.avg, oldStats.opsSec);
  logPad("4. VN Reactor", newStats.avg, newStats.opsSec);

  log(`\n%c=== OVERHEAD ANALYSIS & FRAME BUDGET ===`, "color: darkturquoise; font-weight: bold;");
  const proxyOverhead = (proxyStats.avg / rawStats.avg).toFixed(1);
  const vNOverhead = (newStats.avg / proxyStats.avg).toFixed(1);
  const archShift = (((oldStats.avg - newStats.avg) / oldStats.avg) * 100).toFixed(2);

  // Frame budget math (16.6ms per 60fps frame)
  const opsPerFrame = Math.floor(newStats.opsSec / 60);

  log(`• Native Proxy Penalty: ~${proxyOverhead}x slower than Bare Metal`);
  log(`• Reactor Framework Cost: ~${vNOverhead}x slower than Native Proxy`);
  log(`• Total Reactor Penalty: ~${(newStats.avg / rawStats.avg).toFixed(1)}x slower than Bare Metal`);

  if (oldStats.avg > newStats.avg) {
    log(`• Generation Shift: VN is ${archShift}% FASTER than V0 even with an event system & opt-in reference tracking`);
  } else {
    log(`• Generation Shift: VN sacrificed ${Math.abs(archShift)}% speed vs V0 for an event system & opt-in reference tracking`);
  }

  log(`%c\n🎯 CONCLUSION:`, "color: #FF9800; font-weight: bold;");
  log(`At ~${newStats.opsSec.toLocaleString()} ops/sec, the Reactor can process ${opsPerFrame.toLocaleString()} reactive state changes within a frame.`);
  log(`---------------------------------------------------------------------------\n`);
  btn.disabled = false;
};

window.addEventListener("load", () => setTimeout(runBenchmark, 2000));

// ==========================================
// REACTOR ARCHITECTURE BRIEFING
// ==========================================
log(`%c🧠 WHAT IS THE S.I.A. REACTOR?`, "color: #FF9800; font-size: 16px; font-weight: bold; padding-bottom: 4px;");
log(`The State Intent Architecture (S.I.A.) Reactor is a high-performance reactivity engine.`);
log(`At its core, it is a surgical wrapper around a native JavaScript Proxy, designed to`);
log(`give raw data objects a DOM-like nervous system without destroying the frame budget.\n`);

log(`%c⚙️ CORE PHILOSOPHY`, "color: darkturquoise; font-weight: bold;");
log(`• Progressive: Zero overhead for unused features. Only scales when listeners are attached.`);
log(`• Event Routing: Implements Capture, At-Target, and Bubble phases for deep object trees.`);
log(`• Intent-Based: Mediators can intercept, alter, or completely TERMINATE state changes.\n`);

log(`%c🛠️ THE API SURFACE`, "color: darkturquoise; font-weight: bold;");
log(`%c➤ MEDIATORS (The Gatekeepers)`, "color: #9C27B0; font-weight: bold;");
log(`  .get() / .noget()       : Intercept and alter property reads on the fly.`);
log(`  .set() / .noset()       : Intercept, validate, or reject property writes.`);
log(`  .delete() / .nodelete() : Intercept and govern property deletions.\n`);

log(`%c➤ OBSERVERS (The Reactivity)`, "color: #9C27B0; font-weight: bold;");
log(`  .watch() / .nowatch()   : Listen to precise path mutations (Fast, isolated).`);
log(`  .on() / .off() / .once(): DOM-like event listeners with path propagation and depth limits.\n`);

log(`%c📉 THE BENCHMARK OBJECTIVE`, "color: #E91E63; font-weight: bold;");
log(`Native Proxies are inherently slower than bare-metal objects. By adding an entire event system,`);
log(`opt-in reference tracking with lineage tracing, batched microtask scheduling on top of a Proxy,`);
log(`we introduce overhead. This benchmark proves that the S.I.A Reactor handles this weight`);
log(`gracefully, executing deeply reactive state changes well within the 16.6ms(60fps) frame budget.\n`);
log(`---------------------------------------------------------------------------\n`);

"use strict";
import { Reactor, TERMINATOR } from "../../dist/tmg-player.mjs";
import log from "./logger.js";

// Helper to let the microtask queue flush between tests
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 10));

async function runReactorStressSuite() {
  log(`%c🧪 INITIALIZING S.I.A. REACTOR GRAND MASTER STRESS SUITE`, "color: #E91E63; font-size: 16px; font-weight: bold;");
  log(`Testing deep UI state trees, event routing, batching, and DAG mutations...\n`);

  let passed = 0;
  let failed = 0;

  const assert = (condition, msg) => {
    if (condition) {
      log(`%c  ✅ PASS: ${msg}`, "color: #4CAF50;");
      passed++;
    } else {
      log(`%c  ❌ FAIL: ${msg}`, "color: #F44336; font-weight: bold;");
      failed++;
    }
  };

  const group = (name) => log(`\n%c▶ ${name}`, "color: #2196F3; font-weight: bold; font-size: 14px;");

  // ==========================================
  // TEST 1: DEEP PATHING & BUBBLE ROUTING
  // ==========================================
  group("PHASE 1: Deep Path Bubbling & UI Tree Simulation");
  window.t1 = new Reactor({ player: { video: { currentTime: 0, paused: true } } });

  let rootFired = false;
  let playerFired = false;
  let timeFired = false;

  t1.on("*", () => (rootFired = true));
  t1.on("player", () => (playerFired = true));
  t1.on("player.video.currentTime", () => (timeFired = true));

  t1.core.player.video.currentTime = 10;
  await nextTick(); // Wait for flush

  assert(timeFired, "Target listener fired on exact path");
  assert(playerFired, "Parent listener caught bubbling update");
  assert(rootFired, "Root wildcard '*' listener caught bubbling update");
  assert(t1.core.player.video.currentTime === 10, "Core state accurately mutated");

  // ==========================================
  // TEST 2: THE TERMINATOR & MEDIATORS
  // ==========================================
  group("PHASE 2: The Gatekeepers (Mediators & TERMINATOR)");
  window.t2 = new Reactor({ ui: { volume: 50, theme: "dark" } });

  // 1. Value transformation
  t2.set("ui.volume", (val) => {
    if (val > 100) return 100; // Clamp max volume
    if (val < 0) return 0; // Clamp min volume
    return val;
  });

  // 2. Absolute Rejection
  t2.set("ui.theme", (val) => {
    if (val === "light") return TERMINATOR; // Ban light mode
    log(TERMINATOR);
    return val;
  });

  t2.core.ui.volume = 150;
  t2.core.ui.volume = -20;
  t2.core.ui.theme = "light";

  assert(t2.core.ui.volume === 0, "Mediator successfully clamped bounds (150 -> 100 -> -20 -> 0)");
  assert(t2.core.ui.theme === "dark", "TERMINATOR successfully blocked memory write for 'light' theme");

  // ==========================================
  // TEST 3: EVENT PHASE ROUTING (DOM SIMULATION)
  // ==========================================
  group("PHASE 3: DOM-Style Event Phase Routing");
  window.t3 = new Reactor({ network: { status: "online" } });

  const executionOrder = [];

  // Bubble Phase (Default)
  t3.on("network", () => executionOrder.push("BUBBLE_PARENT"));
  t3.on("network.status", () => executionOrder.push("TARGET_BUBBLE"));

  // Capture Phase
  t3.on("network", () => executionOrder.push("CAPTURE_PARENT"), { capture: true });
  t3.on("network.status", () => executionOrder.push("TARGET_CAPTURE"), { capture: true });

  t3.core.network.status = "offline";
  await nextTick();

  const expectedOrder = "CAPTURE_PARENT,TARGET_CAPTURE,TARGET_BUBBLE,BUBBLE_PARENT";
  assert(executionOrder.join(",") === expectedOrder, "Event wave respected Capture -> Target -> Bubble DOM specifications");

  // ==========================================
  // TEST 4: MICROTASK BATCHING & RENDER BUDGET
  // ==========================================
  group("PHASE 4: Microtask Render Batching (The 60FPS Test)");
  window.t4 = new Reactor({ scrubber: { progress: 0 } });

  let renderCount = 0;
  let finalPayload = null;

  t4.on("scrubber.progress", (e) => {
    renderCount++;
    finalPayload = e.target.value;
  });

  // Simulate a heavy synchronous drag event (1,000 rapid updates)
  for (let i = 1; i <= 1000; i++) {
    t4.core.scrubber.progress = i;
  }

  assert(renderCount === 0, "Listeners successfully stalled during synchronous mutation block");

  await nextTick(); // Let the microtask queue flush

  assert(renderCount === 1, "Engine successfully batched 1,000 mutations into a single UI render tick");
  assert(finalPayload === 1000, "Batched render received the absolutely correct final state");

  // ==========================================
  // TEST 5: DAG ALIASING & MASSIVE CASCADES
  // ==========================================
  group("PHASE 5: Heavy Cascades & Object Lifecycle");
  window.t5 = new Reactor({ player: { metadata: null } });

  let cascadeFired = false;
  t5.on("player.metadata.duration", () => (cascadeFired = true));

  // Simulating a massive API response dropping into state
  const apiResponse = {
    title: "S.I.A Engine Demo",
    duration: 120,
    chapters: Array.from({ length: 50 }, (_, i) => ({ id: i, time: i * 2 })),
  };

  t5.core.player.metadata = apiResponse;
  await nextTick();

  assert(cascadeFired, "Listener correctly fired on a deeply nested path that was created dynamically via an object drop");
  assert(t5.core.player.metadata.chapters[49].time === 98, "Deep object cascade successfully traversed and proxied");

  // ==========================================
  // FINAL REPORT
  // ==========================================
  log(`\n%c🏁 STRESS SUITE COMPLETE`, "color: #9C27B0; font-weight: bold; font-size: 16px;");
  log(`Total Tests: ${passed + failed}`);
  if (failed === 0) {
    log(`%c🏆 PERFECT SCORE. ALL ${passed} ARCHITECTURAL TESTS PASSED.`, "color: #4CAF50; font-weight: bold; background: #E8F5E9; padding: 4px;");
    log(`The S.I.A Reactor is officially production-grade and ready for UI binding.`);
  } else {
    log(`%c💀 FAILED: ${failed} tests did not pass. Check the engine.`, "color: #F44336; font-weight: bold;");
  }
}

// Execute the suite
setTimeout(runReactorStressSuite, 1000);

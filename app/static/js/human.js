/*
  Human
  homepage: <https://github.com/vladmandic/human>
  author: <https://github.com/vladmandic>'
*/

import * as m from "https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.esm.js";
var v = 1920,
  b = {
    debug: false,
    wasmPlatformFetch: !0,
    backend: "webgl",
    modelBasePath: "/static/models",
    filter: {
      enabled: false,
      equalization: true,
      flip: true,
      autoBrightness: true,
    },
    face: {
      enabled: true,
      detector: { enabled: true, rotation: true },
      mesh: { enabled: false },
      attention: { enabled: false },
      iris: { enabled: false },
      description: { enabled: true },
      emotion: { enabled: true, minConfidence: 0 },
      antispoof: { enabled: false },
      liveness: { enabled: false },
    },
    body: { enabled: false },
    hand: { enabled: false },
    object: { enabled: false },
    segmentation: { enabled: false },
    gesture: { enabled: false },
  },
  e = new m.Human(b);
e.env.perfadd = !1;
e.draw.options.drawPoints = false;
e.draw.options.drawBoxes = false;
e.draw.options.drawPolygons = false;
e.draw.options.drawLabels = false;
var a = {
    video: document.getElementById("video"),
    canvas: document.getElementById("canvas"),
    fps: document.getElementById("status"),
    log: document.getElementById("log"),
    start: document.getElementById("btn-start"),
    stop: document.getElementById("btn-stop"),
  },
  n = { detect: 0, draw: 0, tensors: 0, start: 0 },
  s = { detectFPS: 0, drawFPS: 0, frames: 0, averageMs: 0 },
  o = (...t) => {
    (a.log.innerText +=
      t.join(" ") +
      `
`),
      console.log(...t);
  },
  r = (t) => (a.fps.innerText = t);
async function f() {
  if (!a.video.paused) {
    n.start === 0 && (n.start = e.now()), await e.detect(a.video);
    let t = e.tf.memory().numTensors;
    t - n.tensors !== 0 && (n.tensors = t),
      (s.detectFPS = Math.round((1e3 * 1e3) / (e.now() - n.detect)) / 1e3),
      s.frames++,
      (s.averageMs = Math.round((1e3 * (e.now() - n.start)) / s.frames) / 1e3);
  }
  (n.detect = e.now()), requestAnimationFrame(f);
}
async function w() {
  var d, i, c;
  if (!a.video.paused) {
    let l = e.next(e.result),
      p = await e.image(a.video);
    e.draw.canvas(p.canvas, a.canvas);
    await e.draw.all(a.canvas, l);
    const emot = e.result.face[0].emotion.map((value, index) => {
      return {
        x: value.emotion,
        y: value.score,
      };
    });
    chart.updateSeries([
      {
        name: "Emotions",
        data: emot,
      },
    ]);
    console.log(emot);
    /* o('score: ', e.result.face[0].score, '| gender: ', e.result.face[0].gender, '| gender score: ', e.result.face[0].genderScore, '| age:', e.result.face[0].age, "years | emotion: ", e.result.face[0].emotion[0].emotion, '| score: ', e.result.face[0].emotion[0].score); */
  }
  let t = e.now();
  (s.drawFPS = Math.round((1e3 * 1e3) / (t - n.draw)) / 1e3), (n.draw = t);
  r(paused ? "Paused" : `Press start to begin`);
  setTimeout(w, 30);
}
async function y() {
  a.start.onclick = async () => {
    if (first) {
      let d = (await e.webcam.enumerate())[0].deviceId;
      await e.webcam.start({ element: a.video, crop: true, width: 600, height: 600, id: d }),
        (a.canvas.width = e.webcam.width),
        (a.canvas.height = e.webcam.height);
      first = false;
    } else {
      await e.webcam.play();
    }
    a.start.setAttribute("hidden", "hidden");
    a.stop.removeAttribute("hidden");
    paused = false;
    a.fps.setAttribute("hidden", "hidden");
  };
  a.stop.onclick = async () => {
    await e.webcam.pause();
    a.start.removeAttribute("hidden");
    a.stop.setAttribute("hidden", "hidden");
    paused = true;
    r("Paused")
    a.fps.removeAttribute("hidden");
  };
}
async function h() {
  r("Initializing..."),
    await e.load(),
    await e.warmup(),
    a.start.className = "btn btn-success",
    r("Press start to begin"),
    await y(),
    await f(),
    await w();
}
var first = true;
var paused = false;
window.onload = h;

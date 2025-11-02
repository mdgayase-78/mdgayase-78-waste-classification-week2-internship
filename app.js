
let model, maxPredictions;
const URL = "./model.json"; // local model

async function init() {
  try {
    const modelURL = URL;
    model = await tmImage.load(modelURL, "./metadata.json");
    const metadata = await fetch('./metadata.json').then(r=>r.json());
    maxPredictions = metadata.labels.length;
    console.log("Model and metadata loaded", metadata.labels);
  } catch (e) {
    console.error("Model load failed:", e);
    document.getElementById('result').innerText = "Could not load model. Make sure model.json, metadata.json, and weights.bin are present and you are serving the folder via a local server.";
  }
}

async function startWebcam() {
  const video = document.getElementById('webcam');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    video.srcObject = stream;
    await new Promise(r => video.onloadedmetadata = r);
  } else {
    alert("Webcam not supported in this browser.");
  }
}

async function classifyImageFromVideo() {
  const video = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  await classifyCanvas(canvas);
}

async function classifyCanvas(canvas) {
  if (!model) {
    document.getElementById('result').innerText = "Model not loaded.";
    return;
  }
  const prediction = await model.predict(canvas);
  prediction.sort((a,b)=>b.probability - a.probability);
  const top = prediction[0];
  const label = top.className;
  const prob = Math.round(top.probability * 100);
  document.getElementById('result').innerText = `${label} — ${prob}%`;
  addBotMessage(`I see: ${label} (${prob}%). ${ecoTipFor(label)}`);
}

// handle uploaded images
document.getElementById('uploadImage').addEventListener('change', async (ev)=>{
  const file = ev.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = async ()=> {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);
    const ratio = Math.min(canvas.width/img.width, canvas.height/img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;
    ctx.drawImage(img, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
    await classifyCanvas(canvas);
  };
  img.src = URL.createObjectURL(file);
});

// controls
document.getElementById('startWebcam').addEventListener('click', startWebcam);
document.getElementById('snap').addEventListener('click', classifyImageFromVideo);

// Chatbot wiring: send user message to backend /api/chat
const chatForm = document.getElementById('chatForm');
chatForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;
  addUserMessage(text);
  input.value = "";
  addBotMessage("…thinking"); // temporary
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({message: text})
    });
    const data = await res.json();
    // remove the temporary thinking message (last bot)
    const box = document.getElementById('chatbox');
    const items = box.querySelectorAll('.bot');
    if (items.length) items[items.length-1].remove();
    if (data && data.reply) {
      addBotMessage(data.reply);
    } else {
      addBotMessage("Sorry, no reply (backend error). Check server logs.");
    }
  } catch (err) {
    console.error(err);
    addBotMessage("Could not reach backend chat server. Make sure it is running and that OPENAI_API_KEY is configured.");
  }
});

function addUserMessage(txt){ const box = document.getElementById('chatbox'); const el=document.createElement('div'); el.className='user'; el.innerText=txt; box.appendChild(el); box.scrollTop = box.scrollHeight;}
function addBotMessage(txt){ const box = document.getElementById('chatbox'); const el=document.createElement('div'); el.className='bot'; el.innerText=txt; box.appendChild(el); box.scrollTop = box.scrollHeight; }

// eco tips for model labels
function ecoTipFor(label){
  const tips = {
    "Battery":"Batteries contain toxic metals. Take to a hazardous-waste collection or a battery recycling drop-off. Do not throw in trash.",
    "Biological":"Biological waste should be handled carefully. Use sealed bags and follow local biohazard disposal rules.",
    "cardboard":"Flatten and keep dry — cardboard is highly recyclable. Remove tape and recycle with paper/cardboard stream.",
    "clothes":"Donate usable clothes to charity or textile recycling programs. Reuse or upcycle damaged items.",
    "glass":"Rinse and recycle glass bottles and jars. Reuse containers where possible.",
    "metal":"Scrap metal can be recycled. Separate large metal items and take them to a metal recycling facility.",
    "paper":"Keep paper dry and clean. Recycle with paper stream; compost uncoated paper if accepted locally.",
    "shoes":"Donate wearable shoes; recycle or upcycle worn-out shoes via shoe-recycling programs.",
    "plastic":"Check the plastic type. Clean and recycle where accepted, or reduce single-use plastics by switching to reusable items.",
    "trash":"For mixed trash, reduce and separate recyclables. Consider composting organic waste where possible."
  };
  return tips[label] || "Reduce, reuse, recycle — sort waste into recyclables or hazardous streams where applicable.";
}

// initialize model on load
init();

const videoElement = document.getElementById('video');
const highlightElement = document.getElementById('highlight');

async function startWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;
}

async function loadModel() {
  const model = await cocoSsd.load();
  detectPerson(model);
}

async function detectPerson(model) {
  const predictions = await model.detect(videoElement);

  const person = predictions.find(p => p.class === 'person');
  if (person) {
    const [x, y, width, height] = person.bbox;
    highlightElement.style.width = `${width}px`;
    highlightElement.style.height = `${height}px`;
    highlightElement.style.left = `${x}px`;
    highlightElement.style.top = `${y}px`;
    highlightElement.style.display = 'block';
  } else {
    highlightElement.style.display = 'none';
  }

  requestAnimationFrame(() => detectPerson(model));
}

async function init() {
  await startWebcam();
  await loadModel();
}

init();

const videoElement = document.getElementById('video');
const highlightElement = document.getElementById('highlight');
const consoleElement = document.getElementById('console');

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (err) {
    console.error('Error accessing webcam: ', err);
    consoleElement.textContent += 'Error accessing webcam: ' + err.message + '\n';
  }
}

async function loadModel() {
  console.log('Loading COCO-SSD model...');
  consoleElement.textContent += 'Loading COCO-SSD model...\n';
  try {
    const model = await cocoSsd.load();
    console.log('Model loaded!');
    consoleElement.textContent += 'Model loaded!\n';
    detectPerson(model);
  } catch (error) {
    console.error('Error loading model:', error);
    consoleElement.textContent += 'Error loading model: ' + error.message + '\n';
  }
}

async function detectPerson(model) {
  try {
    const predictions = await model.detect(videoElement);
    console.log('Predictions:', predictions);
    consoleElement.textContent += 'Predictions: ' + JSON.stringify(predictions, null, 2) + '\n';

    const person = predictions.find(p => p.class === 'person');
    
  } catch (error) {
    console.error('Error during detection:', error);
    consoleElement.textContent += 'Error during detection: ' + error.message + '\n';
  }

  requestAnimationFrame(() => detectPerson(model));
}

async function init() {
  await startWebcam();
  await loadModel();
}

init();
 
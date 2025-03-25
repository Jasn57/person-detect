const videoElement = document.getElementById('video');
const highlightElement = document.getElementById('highlight');

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (err) {
    console.error('Error accessing webcam: ', err);
  }
}

async function loadModel() {
  console.log('Loading COCO-SSD model...');
  try {
    const model = await cocoSsd.load();
    console.log('Model loaded!');
    detectPerson(model);
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

async function detectPerson(model) {
  try {
    const predictions = await model.detect(videoElement);
    console.log('Predictions:', predictions); 

    const person = predictions.find(p => p.class === 'person');
    if (person) {
      document.body.style.backgroundColor = 'green';  
      highlightElement.style.display = 'block';  
    } else {
      document.body.style.backgroundColor = '';  
      highlightElement.style.display = 'none';  
    }
  } catch (error) {
    console.error('Error during detection:', error);
  }

  requestAnimationFrame(() => detectPerson(model));
}

async function init() {
  await startWebcam();
  await loadModel();
}

init();

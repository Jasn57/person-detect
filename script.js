const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const output = document.getElementById('output');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });
    video.srcObject = stream;
}

function resizeCanvas() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

async function loadModel() {
    const model = await cocoSsd.load();
    detectPerson(model);
}

async function detectPerson(model) {
    const predictions = await model.detect(video);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const personDetected = predictions.some(prediction => prediction.class === 'person');
    
    if (personDetected) {
        output.textContent = 'Person detected!';
    } else {
        output.textContent = 'No person detected';
    }

    predictions.forEach(prediction => {
        if (prediction.class === 'person') {
            const [x, y, width, height] = prediction.bbox;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.stroke();
            ctx.fillText('Person', x + 10, y + 20);
        }
    });

    requestAnimationFrame(() => detectPerson(model));
}

async function start() {
    await setupCamera();
    resizeCanvas();
    await loadModel();
}

start();

window.addEventListener('resize', resizeCanvas);
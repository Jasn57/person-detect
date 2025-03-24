const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;
}

let net;
async function loadModel() {
  net = await bodyPix.load();
  detectPerson();
}

async function detectPerson() {
  const segmentation = await net.segmentPerson(video);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 5;
  ctx.strokeStyle = 'red';
  ctx.setLineDash([10, 5]);

  const outlines = segmentation.allPoses;

  outlines.forEach(pose => {
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });
  });

  requestAnimationFrame(detectPerson);
}

setupCamera().then(() => {
  video.play();
  loadModel();
});

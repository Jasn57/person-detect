document.addEventListener('DOMContentLoaded', async function () {
  const video = document.getElementById('videoElement');
  const background = document.getElementById('background');

  let net;
  try {
    net = await bodyPix.load();
  } catch (err) {
    console.error('Error loading BodyPix model:', err);
    return;
  }

  async function setupCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  setupCamera();

  video.onloadedmetadata = function () {};

  async function detectPerson() {
    if (net && video && video.readyState === 4) { 
      const segmentation = await net.segmentPerson(video);

      const personDetected = segmentation.allPoses.length > 0 && segmentation.allPoses[0].keypoints.length > 0;

      if (personDetected) {
        background.style.backgroundColor = 'red';
      } else {
        background.style.backgroundColor = 'transparent';
      }
    }

    requestAnimationFrame(detectPerson);
  }

  video.onplaying = function () {
    detectPerson();
  };
});

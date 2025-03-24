document.addEventListener('DOMContentLoaded', async function () {
  const video = document.getElementById('videoElement');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      video.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  setupCamera();

  video.onloadedmetadata = function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  };

  async function detectPerson() {
    
    if (net && video && video.readyState === 4) { 
      const segmentation = await net.segmentPerson(video);

     
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    
      const personDetected = segmentation.allPoses.length > 0 && segmentation.allPoses[0].keypoints.length > 0;

      if (personDetected) {
        background.style.backgroundColor = 'red';
      } else {
        background.style.backgroundColor = 'transparent';  
      }

      bodyPix.drawMask(canvas, video, segmentation, 1, 0, false);

      requestAnimationFrame(detectPerson);
    }
  }

  video.onplaying = function () {
    detectPerson();
  };
});

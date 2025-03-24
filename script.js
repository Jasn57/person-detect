document.addEventListener('DOMContentLoaded', async function () {
    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
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
      const segmentation = await net.segmentPerson(video);
 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'red';
      ctx.setLineDash([10, 5]);

      const contours = segmentation.allPoses[0]?.keypoints || [];
      contours.forEach((keypoint) => {
        if (keypoint.score > 0.5) {
          ctx.beginPath();
          ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.stroke();
        }
      });

      requestAnimationFrame(detectPerson);
    }

    video.onplaying = function () {
      detectPerson();
    };
  });
  
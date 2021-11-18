const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);

const shoulderExCounter = 0;

function onResults(results) {
  if (!results.poseLandmarks) {
    grid.updateLandmarks([]);
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(
    canvasCtx, results.poseLandmarks,
    POSE_CONNECTIONS,
    {color: '#00FF00', lineWidth: 4}
  );

  drawLandmarks(
    canvasCtx,
    results.poseLandmarks,
    {color: '#FF0000', lineWidth: 2}
  );

  canvasCtx.restore();

  grid.updateLandmarks(results.poseWorldLandmarks);
  
  checkForm(results);
  
}


function checkForm(results) {
  let mhands = (results.poseLandmarks[15].y - results.poseLandmarks[16].y)/(results.poseLandmarks[15].x - results.poseLandmarks[16].x);
  let melbows = (results.poseLandmarks[13].y - results.poseLandmarks[14].y)/(results.poseLandmarks[13].x - results.poseLandmarks[14].x);
  let mshoulders = (results.poseLandmarks[11].y - results.poseLandmarks[12].y)/(results.poseLandmarks[11].x - results.poseLandmarks[12].x);

  // console.log("mhands: " + mhands);
  // console.log("melbows: " + melbows);
  // console.log("mshoulders: " + mshoulders);

  let linCheckHands = Math.abs(mhands) < 0.2;
  let linCheckElbows = Math.abs(melbows) < 0.2;
  let linCheckShoulders = Math.abs(mshoulders) < 0.2;

  if (linCheckElbows && linCheckHands && linCheckShoulders) {
    console.log("Form is correct");
  } else {
    console.log("Incorrect Form");
  }
  // console.log(i.toString() + " : " + results.poseLandmarks[i].y);

}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();

import { useEffect, useRef, useState } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Toggle, Loading } from 'carbon-components-react';

import { areCoordsValid } from '../../utils/areCoordsValid';
import './MovementTracker.css';

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

let DISPLAY_SETTINGS = {
  width: 500,
  height: 350,
};

// Used to process results from `Pose` and display results
// on the given `canvasElement`.
const onResults = (results, constraints, canvasElement) => {
  if (!results.poseLandmarks) {
    return;
  }

  const canvasCtx = canvasElement.getContext('2d');

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: '#3ddbd9',
    lineWidth: 3,
  });

  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: '#fa4d56',
    lineWidth: 1.5,
  });

  if (!areCoordsValid(results.poseLandmarks, constraints)) {
    canvasCtx.strokeStyle = '#da1e28';
    canvasCtx.lineWidth = 8;
    canvasCtx.strokeRect(0, 0, canvasElement.width, canvasElement.height);
  }

  canvasCtx.restore();
};

export const MovementTracker = ({ constraints }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // This runs when this component initializes.
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        DISPLAY_SETTINGS = stream.getTracks()[0].getSettings();
        canvasRef.current.width = DISPLAY_SETTINGS.width;
        canvasRef.current.height = DISPLAY_SETTINGS.height;
        videoRef.current.srcObject = stream;
        stream.getTracks()[0].stop();
      } catch (err) {
        console.log(err);
      }
    };

    getUserMedia();

    pose.onResults((results) => {
      onResults(results, constraints, canvasRef.current);
    });

    const cam = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: DISPLAY_SETTINGS.width,
      height: DISPLAY_SETTINGS.height,
    });

    setCamera(cam);

    return () => {
      camera?.stop();
      pose?.close();
    };
  }, []);

  useEffect(() => {
    if (!camera) {
      return;
    }

    if (isTracking && !isLoading) {
      setIsLoading(true);
      camera.start().then(() => {
        setIsLoading(false);
      });
    } else {
      setTimeout(() => {
        camera.stop();
        // Reset canvas.
        canvasRef.current
          .getContext('2d')
          .clearRect(0, 0, DISPLAY_SETTINGS.width, DISPLAY_SETTINGS.height);
      }, 1000);
    }
  }, [isTracking]);

  useEffect(() => {
    if (!pose) {
      return;
    }

    pose.reset();
    pose.onResults((results) => {
      onResults(results, constraints, canvasRef.current);
    });
  }, [constraints]);

  return (
    <div className='wrapper'>
      <Toggle
        className='tracking-toggle'
        labelText='Tracking'
        size='md'
        labelA='Off'
        labelB='On'
        id='tracking-toggle'
        onChange={(ev) => {
          setIsTracking(ev.target.checked);
        }}
      />
      <Loading
        withOverlay={false}
        active={isLoading}
        style={{ position: 'absolute' }}
      />
      <video
        style={{
          display: 'none',
          height: DISPLAY_SETTINGS.height,
          width: DISPLAY_SETTINGS.width,
        }}
        ref={videoRef}
      ></video>
      <canvas
        className='output-canvas'
        ref={canvasRef}
        style={{
          height: DISPLAY_SETTINGS.height,
          width: DISPLAY_SETTINGS.width,
        }}
      ></canvas>
    </div>
  );
};

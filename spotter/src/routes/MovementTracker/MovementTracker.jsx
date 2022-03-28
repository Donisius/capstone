import { useEffect, useRef, useState } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import {
  FilterableMultiSelect,
  Tag,
  Toggle,
  Loading,
} from 'carbon-components-react';

import { RecordingButton } from '../../components/RecordingButton';
import { areCoordsValid } from '../../utils/areCoordsValid';
import './MovementTracker.css';
import { downloadFile } from '../../utils/file-utils';

const pose = new Pose({
  locateFile: file => {
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
    color: '#9e1919',
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
  const [recorder, setRecorder] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [activeConstraints, setActiveConstraints] = useState([]);

  // Used for recording purposes.
  let videoChunks = [];

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

    // Capture canvas stream for recording.
    const canvasStream = canvasRef.current.captureStream(30);
    const mediaRecorder = new MediaRecorder(canvasStream);

    mediaRecorder.onstart = () => {
      videoChunks = [];
    };

    mediaRecorder.ondataavailable = e => {
      videoChunks.push(e.data);
    };

    mediaRecorder.onstop = e => {
      const blob = new Blob(videoChunks, { type: 'video/mp4' });
      // Reset.
      videoChunks = [];
      downloadFile(blob, `recording-${new Date().getTime()}`);
    };

    setRecorder(mediaRecorder);

    pose.onResults(results => {
      onResults(results, activeConstraints, canvasRef.current);
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
      recorder?.stop();
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
          .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.beginPath();
      }, 1000);
    }
  }, [isTracking]);

  useEffect(() => {
    if (!recorder) {
      return;
    }

    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }
  }, [isRecording]);

  useEffect(() => {
    if (!pose) {
      return;
    }

    pose.reset();
    pose.onResults(results => {
      onResults(results, activeConstraints, canvasRef.current);
    });
  }, [activeConstraints]);

  return (
    <div className='wrapper'>
      <div className='active-constraint-filters'>
        {activeConstraints.map((constraint, i) => (
          <Tag
            id={`${constraint.exercise}-${i}`}
            type={constraint.type === 'core' ? 'purple' : 'green'}>
            {constraint.exercise}
          </Tag>
        ))}
      </div>
      <div className='constraints-dropdown'>
        <FilterableMultiSelect
          id='constraints'
          titleText='Choose active constraints'
          helperText='These are constraints which will be active while tracking'
          placeholder='Search for a constraint'
          items={constraints.map((constraint, id) => ({ ...constraint, id }))}
          itemToString={item => (item ? item.exercise : '')}
          onChange={ev => setActiveConstraints(ev.selectedItems)}
        />
      </div>
      <Toggle
        className='tracking-toggle'
        labelText='Tracking'
        size='md'
        labelA='Off'
        labelB='On'
        id='tracking-toggle'
        onChange={ev => {
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
        ref={videoRef}></video>
      <canvas
        className='output-canvas'
        ref={canvasRef}
        style={{
          height: DISPLAY_SETTINGS.height,
          width: DISPLAY_SETTINGS.width,
        }}></canvas>
      {isTracking && (
        <div
          style={{
            height: '140px',
            width: DISPLAY_SETTINGS.width,
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setIsRecording(!isRecording)}>
          <RecordingButton isActive={isRecording} />
        </div>
      )}
    </div>
  );
};

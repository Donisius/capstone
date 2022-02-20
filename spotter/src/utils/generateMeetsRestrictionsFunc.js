import { acos, distance, dot, evaluate } from 'mathjs';
import { POSE_LANDMARKS } from '@mediapipe/pose';

// Remove last element from coord since the last field is `visibility`.
const coordToArray = coord => Object.values(coord).slice(0, -1);

export const generateMeetsRestrictionsFunc = restrictions => coords =>
  restrictions.every(
    ({ equality, landmark1, landmark2, operation, result }) => {
      if (operation === 'distance from') {
        // NOTE: This all needs to be in one line for mathjs to parse the expression properly.
        return evaluate(
          `${distance(
            coordToArray(coords[POSE_LANDMARKS[landmark1]]),
            coordToArray(coords[POSE_LANDMARKS[landmark2]])
          )} ${equality} ${result}`
        );
      } else if (operation === 'angle formed with') {
        const coordArray1 = coordToArray(coords[POSE_LANDMARKS[landmark1]]);
        const coordArray2 = coordToArray(coords[POSE_LANDMARKS[landmark2]]);
        const lhs = acos(
          dot(coordArray1, coordArray2) /
            (distance(coordArray1, [0, 0, 0]) *
              distance(coordArray2, [0, 0, 0]))
        );
        // NOTE: This all needs to be in one line for mathjs to parse the expression properly.
        return evaluate(`${lhs} ${equality} ${result}`);
      }
      return true;
    }
  );

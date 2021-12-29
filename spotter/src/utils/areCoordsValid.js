import { POSE_LANDMARKS } from '@mediapipe/pose';
import { distance, acos, dot, evaluate } from 'mathjs';

export const areCoordsValid = (coords, constraints) =>
  constraints.reduce(
    (areConstraintsValid, constraint) =>
      areConstraintsValid &&
      constraint.restrictions.reduce((areRestrictionsValid, restriction) => {
        let lhs = 0;
        const coords1 = Object.values(
          coords[POSE_LANDMARKS[restriction.landmark1]]
        ).splice(0, 3);
        const coords2 = Object.values(
          coords[POSE_LANDMARKS[restriction.landmark2]]
        ).splice(0, 3);

        switch (restriction.operation) {
          case 'distance from':
            lhs = distance(coords1, coords2);
            break;
          case 'angle formed with':
            lhs = acos(
              dot(coords1, coords2) /
                (distance(coords1, [0, 0, 0]) * distance(coords2, [0, 0, 0]))
            );
            break;
          default:
            return true;
        }

        return (
          areRestrictionsValid &&
          evaluate(`${lhs} ${restriction.equality} ${restriction.result}`)
        );
      }, true),
    true
  );

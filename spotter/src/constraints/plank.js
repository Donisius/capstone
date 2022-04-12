function slopeAngle(x1, y1, x2, y2) {
  let angle = Math.atan((y2 - y1) / (x2 - x1));
  angle = angle * (180 / Math.PI); // To Degrees
  return angle;
}

export const plank = {
  type: 'core',
  exercise: 'Plank',
  meetsRestrictions: coords => {
    let facingDirection = null; // 0 = left, 1 = right
    let elbow, leftElbow, rightElbow;
    let shoulder, leftShoulder, rightShoulder;
    let hip, leftHip, rightHip;
    elbow = leftElbow = coords[13];
    rightElbow = coords[14];
    shoulder = leftShoulder = coords[11];
    rightShoulder = coords[12];
    hip = leftHip = coords[23];
    rightHip = coords[24];

    // Pick left or right set of coordinates based on side visible to the camera, default left.
    leftShoulder.x < leftHip.x ? (facingDirection = 0) : (facingDirection = 1);
    if (facingDirection == 1) {
      elbow.x = 1 - rightElbow.x;
      shoulder.x = 1 - rightShoulder.x;
      hip.x = 1 - rightHip.x;
    }

    // Elbow-Shoulders
    let elbowShoulderSlopeAngle = Math.abs(
      slopeAngle(elbow.x, elbow.y, shoulder.x, shoulder.y)
    );
    if (elbowShoulderSlopeAngle > 105 || elbowShoulderSlopeAngle < 75) {
      // Ideally smaller range but this pair of coords are prone to inaccuracies here.
      return false;
    }

    // Shoulder-Hips
    let hipShoulderSlopeAngle = -slopeAngle(
      shoulder.x,
      shoulder.y,
      hip.x,
      hip.y
    );
    if (hipShoulderSlopeAngle > 10 || hipShoulderSlopeAngle < -12) {
      return false;
    }

    return true;
  },
};

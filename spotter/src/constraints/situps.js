export const sitUps = {
  type: 'core',
  exercise: 'Sit Ups',
  meetsRestrictions: coords => {
    // shoulders straight (slope of shoulders on z axis parallel to knees slope on z axis)
    // the feet, hips, and knees coordinates must create an isosceles like triangular shape
    // feet and hips must be on near flat (0) slope
    // problem occurs when situp is being performed (maybe remove shoulder and hands slope flat constraint?)

    let correctForm = true;
    let tol = 25; // 25% tolerance

    let shoulderSlopeZ = slopeBetweenTwoPoints(12, 11, 'zy', coords);
    let kneeSlopeZ = slopeBetweenTwoPoints(26, 25, 'zy', coords);
    let feetSlopeZ = slopeBetweenTwoPoints(31, 32, 'zy', coords);
    let hipsSlopeZ = slopeBetweenTwoPoints(23, 24, 'zy', coords);

    // hips and shoulders similar slope
    let shouldersHipDiff = percentDifference(shoulderSlopeZ, hipsSlopeZ);

    // hips and knees similar slope
    let hipsFeetDiff = percentDifference(feetSlopeZ, hipsSlopeZ);

    // knees feet similar slope
    let kneesFeetDiff = percentDifference(feetSlopeZ, kneeSlopeZ);

    if (shouldersHipDiff >= tol) {
      correctForm = false;
      console.log('shoulders and hips not aligned');
    }

    if (hipsFeetDiff >= tol) {
      correctForm = false;
      console.log('knees and hips not aligned');
    }

    if (kneesFeetDiff >= tol) {
      correctForm = false;
      console.log('knees and feet not aligned');
    }

    return correctForm;
  },
};

// calculate the distance between two points from the coords array
// the coords array holds all the x,y, and z positions for each coordinate
// the index refers to the specific landmarks we want to check
function distanceBetweenTwoPoints(pointOneIndex, pointTwoIndex, coords) {
  let yDiffSquared = Math.pow(
    coords[pointTwoIndex].y - coords[pointOneIndex].y,
    2
  );
  let xDiffSquared = Math.pow(
    coords[pointTwoIndex].x - coords[pointOneIndex].x,
    2
  );

  let distance = Math.sqrt(xDiffSquared + yDiffSquared);

  return distance;
}

// pointOne index is the first landmark
// pointTwo index is the second landmark
// twoDaxis is the condition for which axis of comparison: xy, zy, xz
function slopeBetweenTwoPoints(pointOneIndex, pointTwoIndex, twoDaxis, coords) {
  if (twoDaxis === 'xy') {
    let yDiff = coords[pointTwoIndex].y - coords[pointOneIndex].y;
    let xDiff = coords[pointTwoIndex].x - coords[pointOneIndex].x;
    return yDiff / xDiff;
  } else if (twoDaxis === 'zy') {
    let yDiff = coords[pointTwoIndex].y - coords[pointOneIndex].y;
    let zDiff = coords[pointTwoIndex].z - coords[pointOneIndex].z;
    return yDiff / zDiff;
  } else if (twoDaxis === 'xz') {
    let zDiff = coords[pointTwoIndex].z - coords[pointOneIndex].z;
    let xDiff = coords[pointTwoIndex].x - coords[pointOneIndex].x;
    return zDiff / xDiff;
  } else {
    return -1; //default, should never be invoked as it is a private function with no external use
  }
}

function percentDifference(val1, val2) {
  let percentDiff = 0;

  if (val1 >= val2) {
    percentDiff = ((val1 - val2) / val1) * 100;
  } else {
    percentDiff = ((val2 - val1) / val2) * 100;
  }

  return percentDiff;
}

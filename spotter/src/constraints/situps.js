export const sitUps = {
  type: 'core',
  exercise: 'Sit Ups',
  meetsRestrictions: coords => {
    // shoulders straight (slope of shoulders on z axis parallel to knees slope on z axis)
    // the feet, hips, and knees coordinates must create an isosceles like triangular shape
    // feet and hips must be on near flat (0) slope
    // problem occurs when situp is being performed (maybe remove shoulder and hands slope flat constraint?)

    let correctForm = true;

    //CONSIDER CHANGING SLOPES TO PERCENT DIFF VALUES FOR SAME COORDINATES

    // slope with hip and feet on both right and left feet
    let RfeetHipsSlope = slopeBetweenTwoPoints(30, 24, 'xy', coords);
    let LfeetHipsSlope = slopeBetweenTwoPoints(29, 23, 'xy', coords);
    // 10% discrepancy
    if (
      RfeetHipsSlope > 0.3 ||
      RfeetHipsSlope < -0.3 ||
      LfeetHipsSlope > 0.3 ||
      RfeetHipsSlope < -0.3
    ) {
      correctForm = false;
      console.log('feet and hips not on same line');
    }

    let shoulderSlopeZ = slopeBetweenTwoPoints(12, 11, 'zy', coords);
    // 30% discrepancy
    // tested lower discrepancies however it was too easy/sensitive to trigger false for correct form
    if (shoulderSlopeZ > 0.3 || shoulderSlopeZ < -0.3) {
      correctForm = false;
      console.log('Shoulder not straight');
    }

    let kneeSlopeZ = slopeBetweenTwoPoints(26, 25, 'zy', coords);
    // 30% discrepancy
    if (kneeSlopeZ > 0.3 || kneeSlopeZ < -0.3) {
      correctForm = false;
      console.log('knees not straight');
    }

    // let RlegTriangle = isIsosceles(26, 24, 30, coords);
    // let LlegTriangle = isIsosceles(25, 23, 29, coords);

    // if (!RlegTriangle && !LlegTriangle) {
    //     correctForm = false;
    //     console.log("feet knees and hips doesn't create triangle");
    // }

    // Isosceles triangle seemed to not be working,
    // will try simply having the knees y pos to be greater than hips and feet
    // knees: L25, R26, feet (heels) : L29, R30, hips: L23, R24

    if (coords[25].y <= coords[29].y || coords[25].y <= coords[23].y) {
      correctForm = false;
    }

    if (coords[26].y <= coords[30].y || coords[26].y <= coords[24].y) {
      correctForm = false;
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

// an isosceles triangle has 2 sides of equal length and 1 unequal
// for a situp however exact sizes are unlikely therefore will add a 20% discrepancy
function isIsosceles(knee, baseOne, baseTwo, coords) {
  let distBaseOneToTop = distanceBetweenTwoPoints(baseOne, knee, coords);
  let distBaseTwoToTop = distanceBetweenTwoPoints(baseTwo, knee, coords);
  let distBases = distanceBetweenTwoPoints(baseOne, baseTwo, coords);

  let percentDiff = percentDifference(distBaseOneToTop, distBaseTwoToTop);

  let isIso = false;

  if (
    percentDiff < 20 &&
    distBases !== distBaseOneToTop &&
    distBases !== distBaseTwoToTop
  ) {
    isIso = true;
  }

  return isIso;
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

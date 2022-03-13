export const sitUps = {
    type: 'core',
    exercise: 'Sit Ups',
    meetsRestrictions: coords => isCorrectSitup(),
  };
  

  // calculate the distance between two points from the results array
// the results array holds all the x,y, and z positions for each coordinate
// the index refers to the specific landmarks we want to check 
function distanceBetweenTwoPoints(pointOneIndex, pointTwoIndex, results) {

    let yDiffSquared = Math.pow((results.poseLandmarks[pointTwoIndex].y - results.poseLandmarks[pointOneIndex].y), 2);
    let xDiffSquared = Math.pow((results.poseLandmarks[pointTwoIndex].x - results.poseLandmarks[pointOneIndex].x), 2);
  
    let distance = Math.sqrt(xDiffSquared + yDiffSquared);
  
    return distance;
  
  }
  
  // an isosceles triangle has 2 sides of equal length and 1 unequal
  // for a situp however exact sizes are unlikely therefore will add a 20% discrepancy
  function isIsosceles(kneeOrElbow, baseOne, baseTwo, results) {
  
    distBaseOneToTop = distanceBetweenTwoPoints(baseOne, kneeOrElbow, results);
    distBaseTwoToTop = distanceBetweenTwoPoints(baseTwo, kneeOrElbow, results);
    distBases = distanceBetweenTwoPoints(baseOne, baseTwo, results);
  
    let percentDiff = percentDifference(distBaseOneToTop, distBaseTwoToTop);
  
    let isIso = false;
  
    if (percentDiff < 20 && distBases != distBaseOneToTop && distBases != distBaseTwoToTop) {
      isIso = true;
    }
  
    return isIso;
  }
  
  function slopeBetweenTwoPoints(pointOneIndex, pointTwoIndex, results) {
    let yDiff = results.poseLandmarks[pointTwoIndex].y - results.poseLandmarks[pointOneIndex].y;
    let xDiff = results.poseLandmarks[pointTwoIndex].x - results.poseLandmarks[pointOneIndex].x;
    let slope = (yDiff)/(xDiff);
  
    return slope;
  
  }
  
  function percentDifference(val1, val2) {
  
    let percentDiff = 0;
  
    if (val1 >= distBaseTwoToTop) {
      percentDiff = ((val1 - val2)/val1) * 100;
    } else {
      percentDiff = ((val2 - val1)/val2) * 100;
    }
  
    return percentDiff;
  
  }
  // shoulders straight (slope of shoulders on z axis parallel to knees slope on z axis)
  // the feet, hips, and knees coordinates must create an isosceles like triangular shape
  // shoulders and hands must be on near flat (0) slope
  // feet and hips must be on near flat (0) slope
  // problem occurs when situp is being performed (maybe remove shoulder and hands slope flat constraint?)
  function isCorrectSitup(results) {
  
  }
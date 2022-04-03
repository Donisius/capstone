export const wallSit = {
  type: 'core',
  exercise: 'Wall sit',
  meetsRestrictions: coords => {
    // landmarks
    const rightShoulder = coords[12];
    const rightHip = coords[24];
    const rightKnee = coords[26];
    const rightAnkle = coords[28];
    const leftShoulder = coords[11];
    const leftHip = coords[23];
    const leftKnee = coords[25];
    const leftAnkle = coords[27];

    // vectors
    const rightHipToShoulderVector = {
      x: rightShoulder.x - rightHip.x,
      y: rightShoulder.y - rightHip.y,
      z: rightShoulder.z - rightHip.z,
    };
    const leftHipToShoulderVector = {
      x: leftShoulder.x - leftHip.x,
      y: leftShoulder.y - leftHip.y,
      z: leftShoulder.z - leftHip.z,
    };
    const rightHipToKneeVector = {
      x: rightKnee.x - rightHip.x,
      y: rightKnee.y - rightHip.y,
      z: rightKnee.z - rightHip.z,
    };
    const leftHipToKneeVector = {
      x: leftKnee.x - leftHip.x,
      y: leftKnee.y - leftHip.y,
      z: leftKnee.z - leftHip.z,
    };
    const rightKneeToHipVector = {
      x: rightHip.x - rightKnee.x,
      y: rightHip.y - rightKnee.y,
      z: rightHip.z - rightKnee.z,
    };
    const leftKneeToHipVector = {
      x: leftHip.x - leftKnee.x,
      y: leftHip.y - leftKnee.y,
      z: leftHip.z - leftKnee.z,
    };
    const rightKneeToAnkleVector = {
      x: rightAnkle.x - rightKnee.x,
      y: rightAnkle.y - rightKnee.y,
      z: rightAnkle.z - rightKnee.z,
    };
    const leftKneeToAnkleVector = {
      x: leftAnkle.x - leftKnee.x,
      y: leftAnkle.y - leftKnee.y,
      z: leftAnkle.z - leftKnee.z,
    };

    // helper functions
    const radToDegree = angle => (angle * 180) / Math.PI;
    const dotProduct = (coord1, coord2) =>
      coord1.x * coord2.x + coord1.y * coord2.y + coord1.z * coord2.z;
    const emptyCoord = { x: 0, y: 0, z: 0 };
    const getDistance = (coord1, coord2 = emptyCoord) =>
      Math.sqrt(
        (coord1.x - coord2.x) ** 2 +
          (coord1.y - coord2.y) ** 2 +
          (coord1.z - coord2.z) ** 2
      );

    // angles
    const rightShoulderKneeAngle = radToDegree(
      Math.acos(
        (dotProduct(rightHipToShoulderVector, rightHipToKneeVector) /
          getDistance(rightHipToShoulderVector)) *
          getDistance(rightHipToKneeVector)
      )
    );
    const leftShoulderKneeAngle = radToDegree(
      Math.acos(
        (dotProduct(leftHipToShoulderVector, leftHipToKneeVector) /
          getDistance(leftHipToShoulderVector)) *
          getDistance(leftHipToKneeVector)
      )
    );
    const rightHipAnkleAngle = radToDegree(
      Math.acos(
        (dotProduct(rightKneeToHipVector, rightKneeToAnkleVector) /
          getDistance(rightKneeToHipVector)) *
          getDistance(rightKneeToAnkleVector)
      )
    );
    const leftHipAnkleAngle = radToDegree(
      Math.acos(
        (dotProduct(leftKneeToHipVector, leftKneeToAnkleVector) /
          getDistance(leftKneeToHipVector)) *
          getDistance(leftKneeToAnkleVector)
      )
    );

    // core logic
    return (
      80 < rightShoulderKneeAngle < 100 &&
      80 < leftShoulderKneeAngle < 100 &&
      80 < rightHipAnkleAngle < 100 &&
      80 < leftHipAnkleAngle < 100
    );
  },
};

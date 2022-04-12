export const emptyCoord = { x: 0, y: 0, z: 0 };

export const radToDegree = angle => (angle * 180) / Math.PI;

export const dotProduct = (coord1, coord2) =>
  coord1.x * coord2.x + coord1.y * coord2.y + coord1.z * coord2.z;

export const getDistance = (coord1, coord2 = emptyCoord) =>
  Math.sqrt(
    (coord1.x - coord2.x) ** 2 +
      (coord1.y - coord2.y) ** 2 +
      (coord1.z - coord2.z) ** 2
  );

export const isLeaningForward = coords => {
  const rightShoulder = coords[12];
  const rightHip = coords[24];

  const hipToShoulderVector = {
    x: rightShoulder.x - rightHip.x,
    y: rightShoulder.y - rightHip.y,
    z: rightShoulder.z - rightHip.z,
  };
  const hipWithShoulderY = { ...rightHip, y: rightShoulder.y };

  const angle = Math.acos(
    dotProduct(hipToShoulderVector, hipWithShoulderY) /
      (getDistance(hipToShoulderVector) * getDistance(hipWithShoulderY))
  );
  return radToDegree(angle) <= 115;
};

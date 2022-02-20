export const areCoordsValid = (coords, constraints) =>
  constraints.every(constraint => constraint.meetsRestrictions(coords));

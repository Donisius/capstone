import { isLeaningForward } from './utils';

export const lateralRaise = {
  type: 'core',
  exercise: 'Lateral raises',
  meetsRestrictions: coords => {
    const mhands =
      (coords[15].y - coords[16].y) / (coords[15].x - coords[16].x);
    const melbows =
      (coords[13].y - coords[14].y) / (coords[13].x - coords[14].x);
    const mshoulders =
      (coords[11].y - coords[12].y) / (coords[11].x - coords[12].x);

    const linCheckHands = Math.abs(mhands) < 0.2;
    const linCheckElbows = Math.abs(melbows) < 0.2;
    const linCheckShoulders = Math.abs(mshoulders) < 0.2;

    return (
      linCheckElbows &&
      linCheckHands &&
      linCheckShoulders &&
      !isLeaningForward(coords)
    );
  },
};

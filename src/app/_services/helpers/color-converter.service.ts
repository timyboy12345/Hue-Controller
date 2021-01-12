import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorConverterService {
  private static colorPointsGamutA = [[0.703, 0.296], [0.214, 0.709], [0.139, 0.081]];
  private static colorPointsGamutB = [[0.674, 0.322], [0.408, 0.517], [0.168, 0.041]];
  private static colorPointsGamutC = [[0.692, 0.308], [0.17, 0.7], [0.153, 0.048]];
  private static colorPointsDefault = [[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]];

  private static GAMUT_A_BULBS_LIST = ['LLC001', 'LLC005', 'LLC006', 'LLC007', 'LLC010', 'LLC011', 'LLC012', 'LLC014', 'LLC013', 'LST001'];
  private static GAMUT_B_BULBS_LIST = ['LCT001', 'LCT002', 'LCT003', 'LCT004', 'LLM001', 'LCT005', 'LCT006', 'LCT007'];
  private static GAMUT_C_BULBS_LIST = ['LCT010', 'LCT011', 'LCT012', 'LCT014', 'LCT015', 'LCT016', 'LLC020', 'LST002'];
  private static MULTI_SOURCE_LUMINAIRES = ['HBL001', 'HBL002', 'HBL003', 'HIL001', 'HIL002', 'HEL001', 'HEL002'];

  /**
   * Calculate XY color points for a given RGB value.
   * @param red RGB red value (0-255)
   * @param green RGB green value (0-255)
   * @param blue RGB blue value (0-255)
   * @param model Hue bulb model
   * @returns The XY-value for this RGB
   */
  public static calculateXY(red: number, green: number, blue: number, model: string): number[] {
    red = red / 255;
    green = green / 255;
    blue = blue / 255;
    const r = red > 0.04045 ? Math.pow(((red + 0.055) / 1.055), 2.4000000953674316) : red / 12.92;
    const g = green > 0.04045 ? Math.pow(((green + 0.055) / 1.055), 2.4000000953674316) : green / 12.92;
    const b = blue > 0.04045 ? Math.pow(((blue + 0.055) / 1.055), 2.4000000953674316) : blue / 12.92;
    const x = r * 0.664511 + g * 0.154324 + b * 0.162028;
    const y = r * 0.283881 + g * 0.668433 + b * 0.047685;
    const z = r * 8.8E-5 + g * 0.07231 + b * 0.986039;
    const xy = [x / (x + y + z), y / (x + y + z)];
    if (isNaN(xy[0])) {
      xy[0] = 0.0;
    }

    if (isNaN(xy[1])) {
      xy[1] = 0.0;
    }

    const colorPoints = this.colorPointsForModel(model);
    const inReachOfLamps = this.checkPointInLampsReach(xy, colorPoints);
    if (!inReachOfLamps) {
      const pAB = this.getClosestPointToPoints(colorPoints[0], colorPoints[1], xy);
      const pAC = this.getClosestPointToPoints(colorPoints[2], colorPoints[0], xy);
      const pBC = this.getClosestPointToPoints(colorPoints[1], colorPoints[2], xy);
      const dAB = this.getDistanceBetweenTwoPoints(xy, pAB as number[]);
      const dAC = this.getDistanceBetweenTwoPoints(xy, pAC as number[]);
      const dBC = this.getDistanceBetweenTwoPoints(xy, pBC as number[]);
      let lowest = dAB;
      let closestPoint = pAB;
      if (dAC < dAB) {
        lowest = dAC;
        closestPoint = pAC;
      }

      if (dBC < lowest) {
        closestPoint = pBC;
      }

      if (closestPoint) {
        xy[0] = closestPoint[0];
        xy[1] = closestPoint[1];
      }
    }

    xy[0] = this.precision(xy[0]);
    xy[1] = this.precision(xy[1]);

    return xy;
  }

  private static colorPointsForModel(model: string): number[][] {
    if (model == null) {
      model = ' ';
    }

    if (this.GAMUT_B_BULBS_LIST.indexOf(model) === -1 && this.MULTI_SOURCE_LUMINAIRES.indexOf(model) === -1) {
      if (this.GAMUT_A_BULBS_LIST.indexOf(model) >= 0) {
        return this.colorPointsGamutA;
      } else if (this.GAMUT_C_BULBS_LIST.indexOf(model) >= 0) {
        return this.colorPointsGamutC;
      } else {
        return this.colorPointsDefault;
      }
    } else {
      return this.colorPointsGamutB;
    }
  }

  private static checkPointInLampsReach(point: number[], colorPoints: number[][]): boolean {
    if (point != null && colorPoints != null) {
      const red = colorPoints[0];
      const green = colorPoints[1];
      const blue = colorPoints[2];
      const v1 = [green[0] - red[0], green[1] - red[1]];
      const v2 = [blue[0] - red[0], blue[1] - red[1]];
      const q = [point[0] - red[0], point[1] - red[1]];
      const s = this.crossProduct(q, v2) / this.crossProduct(v1, v2);
      const t = this.crossProduct(v1, q) / this.crossProduct(v1, v2);
      return s >= 0.0 && t >= 0.0 && s + t <= 1.0;
    } else {
      return false;
    }
  }

  private static crossProduct(point1: number[], point2: number[]): number {
    return point1[0] * point2[1] - point1[1] * point2[0];
  }

  private static getClosestPointToPoints(pointA: number[], pointB: number[], pointP: number[]): number[] | null {
    if (pointA != null && pointB != null && pointP != null) {
      const pointAP = [pointP[0] - pointA[0], pointP[1] - pointA[1]];
      const pointAB = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
      const ab2 = pointAB[0] * pointAB[0] + pointAB[1] * pointAB[1];
      const apAb = pointAP[0] * pointAB[0] + pointAP[1] * pointAB[1];
      let t = apAb / ab2;
      if (t < 0.0) {
        t = 0.0;
      } else if (t > 1.0) {
        t = 1.0;
      }

      return [pointA[0] + pointAB[0] * t, pointA[1] + pointAB[1] * t];
    } else {
      return null;
    }
  }

  private static getDistanceBetweenTwoPoints(pointA: number[], pointB: number[]): number {
    const dx = pointA[0] - pointB[0];
    const dy = pointA[1] - pointB[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  private static precision(d: number): number {
    return Math.round(10000.0 * d) / 10000.0;
  }
}

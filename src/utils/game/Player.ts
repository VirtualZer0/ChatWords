export default class Player {

  name: string;
  allPoints: number = 0;
  lastPoints: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  public addPoints(points: number): void {
    this.allPoints += points;
    this.lastPoints += points;
  }

  public resetLastPoints(): void {
    this.lastPoints = 0;
  }
}
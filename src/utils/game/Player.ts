export default class Player {

  name: string;
  allPoints = 0;
  lastPoints = 0;

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
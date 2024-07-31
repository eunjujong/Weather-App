export interface GridPoint {
  gridX: number;
  gridY: number;
}

export interface GridPoints {
  [office: string]: GridPoint;
}

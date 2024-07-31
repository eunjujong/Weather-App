export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface ProbabilityOfPrecipitation {
  unitCode: string;
  value: number | null;
}

export interface Elevation {
  unitCode: string;
  value: number;
}

export interface Period {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
  probabilityOfPrecipitation: ProbabilityOfPrecipitation;
}

export interface Properties {
  units: string;
  forecastGenerator: string;
  generatedAt: string;
  updateTime: string;
  validTimes: string;
  elevation: Elevation;
  periods: Period[];
}

export interface WeatherData {
  '@context': any[];
  type: string;
  geometry: Geometry;
  properties: Properties;
}

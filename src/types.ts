interface Coordinates {
  lat: number;
  lon: number;
}

interface Readings {
  co2: number;
  o3: number;
  no2: number;
  so2: number;
}

interface Node {
  coordinates: Coordinates;
}

interface SensorNode extends Node {
  readings: Readings | undefined;
}

interface ActuatorNode extends Node {
  closest: string | undefined;
}

interface NodeDistance {
  rn: string;
  distance: number;
}

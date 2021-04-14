import {
  ActuatorNode,
  Coordinates,
  NodeDistance,
  SensorNode,
} from "./types.ts";
import { logger } from "./log.ts";

export function distanceBetween(c1: Coordinates, c2: Coordinates) {
  const toRadians = (n: number) => n * (Math.PI) / 180;
  const lat1 = toRadians(c1.lat);
  const lon1 = toRadians(c1.lon);
  const lat2 = toRadians(c2.lat);
  const lon2 = toRadians(c2.lon);
  return (
    Math.acos(
      Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1),
    ) * 6371
  );
}

export function findClosest(
  actuator: ActuatorNode,
  sensorNodes: Map<string, SensorNode>,
) {
  const distances: NodeDistance[] = [];
  sensorNodes.forEach((sensor: SensorNode, rn: string) => {
    const d = distanceBetween(actuator.coordinates, sensor.coordinates);
    distances.push({
      rn: rn,
      distance: d,
    });
  });

  if (distances.length !== 0) {
    return distances.sort((d1, d2) =>
      d1.distance > d2.distance ? 1 : d1.distance < d2.distance ? -1 : 0
    )[0].rn;
  } else {
    return undefined;
  }
}

export function discoverClosest(
  actuatorNodes: Map<string, ActuatorNode>,
  sensorNodes: Map<string, SensorNode>,
) {
  actuatorNodes.forEach((actuator, rn) => {
    actuator.closest = findClosest(actuator, sensorNodes);
    actuatorNodes.set(rn, actuator);
    logger("INF", `Closest to ${rn} -> ${actuator.closest}`);
  });
}

export function onSensorSubscription(
  rn: string,
  sensor: SensorNode,
  actuatorNodes: Map<string, ActuatorNode>,
  sensorNodes: Map<string, SensorNode>,
) {
  logger("SUB", `${rn} has suscribed`);
  sensorNodes.set(rn, sensor);
  discoverClosest(actuatorNodes, sensorNodes);
}

export function onActuatorSubscription(
  rn: string,
  actuator: ActuatorNode,
  actuatorNodes: Map<string, ActuatorNode>,
  sensorNodes: Map<string, SensorNode>,
) {
  logger("SUB", rn, "has suscribed");
  actuator.closest = findClosest(actuator, sensorNodes);
  actuatorNodes.set(rn, actuator);
}

export function getActuatorsCloseToSensor(
  sensorRn: string,
  actuatorNodes: Map<string, ActuatorNode>,
) {
  const closeActuators: string[] = [];
  actuatorNodes.forEach((actuator, rn) => {
    if (actuator.closest === sensorRn) {
      closeActuators.push(rn);
    }
  });
  return closeActuators;
}

export function average(values: number[]) {
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

export function gasAQI(value: number, min: number, max: number) {
  return 11 - Math.max(10 * Math.min(1, (value - min) / (max - min)), 1);
}

export function calculateAQI(reading: Readings) {
  const { co2, o3, no2, so2 } = reading;
  return average([
    gasAQI(co2, 400, 1000),
    gasAQI(o3, 33, 65),
    gasAQI(no2, 25, 50),
    gasAQI(so2, 25, 50),
  ]);
}

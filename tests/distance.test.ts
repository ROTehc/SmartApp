import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Coordinates } from "../src/types.ts";
import { distanceBetween } from "../src/logic.ts";

Deno.test("Distance should be 0 with equal coordinates", () => {
  const c1: Coordinates = {
    lon: 0,
    lat: 0,
  };
  const c2: Coordinates = {
    lon: 0,
    lat: 0,
  };
  const d = distanceBetween(c1, c2);
  assertEquals(d, 0, `Distance: ${d}`);
});

Deno.test("The error of the distance between the poles should less than 10m", () => {
  const c1: Coordinates = {
    lon: 0,
    lat: 90,
  };
  const c2: Coordinates = {
    lon: 0,
    lat: -90,
  };
  const d = distanceBetween(c1, c2);
  const polesDistance = 20015.087;
  const err = Math.abs(d - polesDistance);
  assert(err < 0.01, `Error: ${err}`);
});

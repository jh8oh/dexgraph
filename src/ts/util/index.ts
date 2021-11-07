export function addToMap<T>(map: Map<T, number>, key: T): void {
  const value = map.get(key);
  map.set(key, value != undefined ? value + 1 : 1);
}

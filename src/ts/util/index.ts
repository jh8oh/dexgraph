export function addToMap<T>(map: Map<T, number>, key: T): void {
  const value = map.get(key);
  map.set(key, value != undefined ? value + 1 : 1);
}

export function sortMap<T>(map: Map<T, number>): Map<T, number> {
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

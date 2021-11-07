const COLORS = [
  "#4dc9f699",
  "#f6701999",
  "#f5379499",
  "#537bc499",
  "#acc23699",
  "#166a8f99",
  "#00a95099",
  "#58595b99",
  "#8549ba99",
  "#f4433699",
];

export function colors(size: number): string[] {
  return COLORS.slice(0, size);
}

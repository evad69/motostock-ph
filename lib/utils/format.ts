export function formatInteger(value: number) {
  return new Intl.NumberFormat("en-PH").format(value);
}

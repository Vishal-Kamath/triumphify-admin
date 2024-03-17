export function numberFormater(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (absValue >= 1e3) {
    return (value / 1e3).toFixed(0) + "K";
  } else {
    return value.toString();
  }
}

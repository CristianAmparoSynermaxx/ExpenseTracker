export function TruncatedString(string) {
  return string.length > 20 ? string.slice(0, 20) + "..." : string;
}

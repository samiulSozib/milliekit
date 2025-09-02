/**
 * Converts a numeric seat identifier into a human-readable label.
 * Example: 101 → A1, 235 → I5
 *
 * @param num - Seat number (e.g., 101, 235)
 * @returns Formatted seat label (e.g., "A1", "I5")
 */
export function formatSeatNumber(num: number): string {
  const str = num.toString();
  const rowNumber = parseInt(str.slice(0, -1), 10);
  const seatNumber = parseInt(str.slice(-1), 10);

  // Convert rowNumber to letter(s)
  let rowLabel = "";
  let n = rowNumber;

  while (n > 0) {
    n--; // adjust for 0-based index
    rowLabel = String.fromCharCode(65 + (n % 26)) + rowLabel;
    n = Math.floor(n / 26);
  }

  return `${rowLabel}${seatNumber}`;
}

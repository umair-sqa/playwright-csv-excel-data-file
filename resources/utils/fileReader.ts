import fs from "fs";

export function readUsersFromCsv(filePath: string) {
  const [headerLine, ...rows] = fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!headerLine) return [];

  const headers = headerLine.split(",").map((h) => h.trim());

  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(
      headers.map((h, i) => [h, (values[i] ?? "").trim()])
    );
  });
}

import fs from "fs";
import * as XLSX from "xlsx";
import path from "path";

export function readUsersFromCsv(filePath: string) {
  const [headerLine, ...rows] = fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const headers = headerLine.split(",").map((h) => h.trim());

  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(
      headers.map((h, i) => [h, (values[i] ?? "").trim()])
    );
  });
}

// @ts-ignore
export function readUsersFromExcel(filePath, sheetName = "RegisteredUsers") {
  const workbook = XLSX.readFile(path.resolve(filePath));
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });
}

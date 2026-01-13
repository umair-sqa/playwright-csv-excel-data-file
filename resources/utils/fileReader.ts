import fs from "fs";
import csv from "csv-parser";
import path from "path";

export const readCsv = async <T>(filePath: string): Promise<T[]> =>
  new Promise((resolve, reject) => {
    const rows: T[] = [];

    fs.createReadStream(path.resolve(filePath))
      .pipe(csv())
      .on("data", (data) => rows.push(data as T))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });

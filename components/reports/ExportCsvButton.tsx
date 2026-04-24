"use client";

import { exportCsv } from "@/lib/utils/exportCsv";

type ExportCsvButtonProps<T extends Record<string, unknown>> = {
  filename: string;
  rows: T[];
};

export function ExportCsvButton<T extends Record<string, unknown>>({
  filename,
  rows,
}: ExportCsvButtonProps<T>) {
  return (
    <button
      type="button"
      className="button-secondary"
      onClick={() => exportCsv(filename, rows)}
    >
      Export CSV
    </button>
  );
}

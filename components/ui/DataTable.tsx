import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
};

export function DataTable<T>({ columns, rows }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border-t border-[var(--color-line)]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-line)]">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-4 text-left font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-muted)]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b border-[rgba(17,22,29,0.08)] align-top"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-4 text-sm leading-7">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

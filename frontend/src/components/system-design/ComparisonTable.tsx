import type { ComparisonTableData } from '@/data/systemDesignTypes';

export function ComparisonTable({ table }: { table: ComparisonTableData }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{table.title}</p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              {table.headers.map((header) => (
                <th key={header} className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="border-t border-border transition-colors hover:bg-muted/40">
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className={
                      index === 0
                        ? 'px-3 py-2 align-top font-medium text-foreground'
                        : 'px-3 py-2 align-top text-muted-foreground'
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="text-xs text-muted-foreground">{table.note}</p>}
    </div>
  );
}

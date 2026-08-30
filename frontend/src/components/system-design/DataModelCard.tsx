import type { DataModelColumn, DataModelTable } from '@/data/systemDesignTypes';
import { CopyButton } from './CopyButton';

function normalizeColumn(column: string | DataModelColumn): DataModelColumn {
  return typeof column === 'string' ? { name: column } : column;
}

export function DataModelCard({ table }: { table: DataModelTable }) {
  const columns = table.columns.map(normalizeColumn);
  const hasTypes = columns.some((column) => column.type || column.notes);

  return (
    <div className="group/table overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2">
        <p className="flex items-center gap-1 font-mono text-sm font-semibold text-foreground">
          {table.name}
          <span className="opacity-0 transition-opacity duration-200 group-hover/table:opacity-100 focus-within:opacity-100">
            <CopyButton value={table.name} label="Copy table name" />
          </span>
        </p>
        {table.primaryKey?.length ? (
          <p className="font-mono text-xs text-muted-foreground">PK ({table.primaryKey.join(', ')})</p>
        ) : null}
      </div>

      {hasTypes ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-2 font-medium">Column</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((column) => (
                <tr key={column.name} className="border-t border-border">
                  <td className="px-4 py-2 font-mono text-foreground">{column.name}</td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{column.type ?? '—'}</td>
                  <td className="px-4 py-2 text-muted-foreground">{column.notes ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-4 py-3 text-sm text-muted-foreground">{columns.map((column) => column.name).join(' · ')}</p>
      )}

      {table.indexes?.length ? (
        <div className="border-t border-border px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Indexes</p>
          <ul className="mt-1 space-y-1">
            {table.indexes.map((index) => (
              <li key={index} className="font-mono text-xs text-foreground">
                {index}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {table.notes ? <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">{table.notes}</p> : null}
    </div>
  );
}

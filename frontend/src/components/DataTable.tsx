interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage?: string
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  emptyMessage = 'No se encontraron registros',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#e2e8f0] border-t-clinic-500 rounded-full animate-spin" />
          <p className="text-sm text-[#64748b] font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-clinic-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-clinic-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-[#64748b] font-medium text-sm">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {data.map((item, idx) => (
              <tr
                key={(item.id as string) || idx}
                className="hover:bg-[#f8fafc] transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-[#475569] whitespace-nowrap">
                    {col.render
                      ? col.render(item)
                      : (item[col.key] as React.ReactNode) ?? '—'}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-clinic-500 hover:bg-clinic-50 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

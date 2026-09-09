import React, { useState } from 'react'
import { Download, Printer, Loader2 } from 'lucide-react'
import { api } from '../../lib/api'

interface ExportButtonsProps {
  month: string
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ month }) => {
  const [isExportingCsv, setIsExportingCsv] = useState(false)

  const handleDownloadCsv = async () => {
    setIsExportingCsv(true)
    try {
      const response = await api.get(`/reports/csv?month=${month}`, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `espelho_ponto_${month}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Erro ao exportar arquivo CSV.')
    } finally {
      setIsExportingCsv(false)
    }
  }

  const handlePrintPdf = async () => {
    try {
      const response = await api.get(`/reports/print?month=${month}`)
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(response.data)
        printWindow.document.close()
      }
    } catch {
      alert('Erro ao carregar relatório para impressão.')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownloadCsv}
        disabled={isExportingCsv}
        title="Baixar planilha CSV para Excel"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors cursor-pointer disabled:opacity-70"
      >
        {isExportingCsv ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        ) : (
          <Download className="h-4 w-4 text-slate-500" />
        )}
        <span>Exportar CSV</span>
      </button>

      <button
        onClick={handlePrintPdf}
        title="Visualizar e imprimir espelho de ponto em PDF"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-xs transition-colors cursor-pointer"
      >
        <Printer className="h-4 w-4 text-blue-600" />
        <span>Imprimir / PDF</span>
      </button>
    </div>
  )
}

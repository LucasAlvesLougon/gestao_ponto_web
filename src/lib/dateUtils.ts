/**
 * Utilitários de data e formatação para localização Brasil (pt-BR)
 * Garante que a renderização respeite o fuso horário (padrão America/Sao_Paulo)
 * e evita distorções causadas por conversões em UTC de toISOString().
 */

export const DEFAULT_TIMEZONE = 'America/Sao_Paulo'

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export const MONTH_SHORT_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

/**
 * Retorna a data de hoje no formato YYYY-MM-DD respeitando o fuso horário brasileiro informado.
 */
export function getLocalDateString(date: Date = new Date(), timezone: string = DEFAULT_TIMEZONE): string {
  try {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  } catch {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
}

/**
 * Retorna o mês atual no formato YYYY-MM respeitando o fuso horário brasileiro.
 */
export function getLocalMonthString(date: Date = new Date(), timezone: string = DEFAULT_TIMEZONE): string {
  return getLocalDateString(date, timezone).slice(0, 7)
}

/**
 * Converte YYYY-MM-DD para o padrão brasileiro DD/MM/AAAA.
 */
export function formatDateBR(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

/**
 * Retorna nome por extenso do mês: ex: "Setembro de 2026"
 */
export function formatMonthYearLabel(monthStr: string): string {
  if (!monthStr) return ''
  const [year, monthNum] = monthStr.split('-')
  const idx = parseInt(monthNum, 10) - 1
  const monthName = MONTH_NAMES_PT[idx] || monthNum
  return `${monthName} de ${year}`
}

/**
 * Adiciona ou subtrai dias de uma data YYYY-MM-DD sem risco de drift de timezone UTC.
 */
export function addDays(dateStr: string, amount: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + amount)
  const nextY = date.getFullYear()
  const nextM = String(date.getMonth() + 1).padStart(2, '0')
  const nextD = String(date.getDate()).padStart(2, '0')
  return `${nextY}-${nextM}-${nextD}`
}

/**
 * Adiciona ou subtrai meses de um mês YYYY-MM sem risco de drift de timezone.
 */
export function addMonths(monthStr: string, amount: number): string {
  const [y, m] = monthStr.split('-').map(Number)
  const date = new Date(y, m - 1 + amount, 1)
  const nextY = date.getFullYear()
  const nextM = String(date.getMonth() + 1).padStart(2, '0')
  return `${nextY}-${nextM}`
}

/**
 * Formata um horário para exibição no padrão brasileiro 24 horas (HH:mm:ss).
 */
export function formatTime24h(dateOrIso: string | Date, timezone: string = DEFAULT_TIMEZONE): string {
  if (!dateOrIso) return '--:--'
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    return date.toLocaleTimeString('pt-BR', { hour12: false })
  }
}

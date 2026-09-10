/**
 * Formata o nome do usuário para exibição lapidada no layout:
 * - Começa cada palavra com letra maiúscula (ex: "lucas alves" -> "Lucas Alves").
 * - Mantém preposições usuais em português em minúsculo quando no meio do nome ("da", "de", "do", "das", "dos", "e").
 * - Se for passado e-mail ou identificador com underscores/pontos, higieniza antes de capitalizar (ex: "lucas_ql1rtjv" -> "Lucas Ql1rtjv").
 */
export function formatUserName(name?: string | null): string {
  if (!name || typeof name !== 'string') return ''

  // Se o nome informado for um e-mail, extrai apenas o usuário antes do @
  let clean = name.trim()
  if (clean.includes('@')) {
    clean = clean.split('@')[0]
  }

  // Substitui separadores comuns em usernames (pontos, underscores) por espaços
  clean = clean.replace(/[._]+/g, ' ').trim()

  if (!clean) return ''

  const prepositions = new Set(['de', 'da', 'do', 'das', 'dos', 'e'])

  const words = clean.split(/\s+/)

  return words
    .map((word, wordIndex) => {
      // Suporte a nomes compostos com hífen (ex: "ana-paula" -> "Ana-Paula")
      return word
        .split('-')
        .map((part, partIndex) => {
          const lower = part.toLowerCase()
          // Mantém preposição em minúsculo se não for a primeira palavra
          if ((wordIndex > 0 || partIndex > 0) && prepositions.has(lower)) {
            return lower
          }
          return lower.charAt(0).toUpperCase() + lower.slice(1)
        })
        .join('-')
    })
    .join(' ')
}

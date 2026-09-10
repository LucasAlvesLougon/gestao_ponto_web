import { describe, expect, it } from 'vitest'
import { formatUserName } from './formatters'

describe('formatUserName', () => {
  it('capitalizes simple names', () => {
    expect(formatUserName('lucas')).toBe('Lucas')
    expect(formatUserName('lucas alves')).toBe('Lucas Alves')
    expect(formatUserName('LUCAS ALVES LOUGON')).toBe('Lucas Alves Lougon')
  })

  it('keeps portuguese prepositions lowercase in the middle of a name', () => {
    expect(formatUserName('maria da silva')).toBe('Maria da Silva')
    expect(formatUserName('pedro de alcantara e silva')).toBe('Pedro de Alcantara e Silva')
    expect(formatUserName('ana do carmo')).toBe('Ana do Carmo')
  })

  it('handles username formats with underscores and dots', () => {
    expect(formatUserName('lucas_ql1rtjv')).toBe('Lucas Ql1rtjv')
    expect(formatUserName('carlos.eduardo')).toBe('Carlos Eduardo')
  })

  it('handles emails as usernames', () => {
    expect(formatUserName('lucas@example.com')).toBe('Lucas')
    expect(formatUserName('maria.silva@empresa.com.br')).toBe('Maria Silva')
  })

  it('handles hyphenated names', () => {
    expect(formatUserName('jean-paul')).toBe('Jean-Paul')
  })

  it('handles empty or null inputs', () => {
    expect(formatUserName('')).toBe('')
    expect(formatUserName(null as any)).toBe('')
    expect(formatUserName(undefined as any)).toBe('')
  })
})

import { describe, expect, it } from 'vitest'
import {
  buildInsights,
  calculateStreak,
  countWords,
  seedEntries,
  statsFromEntries,
} from './journalData'

describe('journal data helpers', () => {
  it('counts words reliably', () => {
    expect(countWords('A calm writing session')).toBe(4)
  })

  it('calculates a streak from consecutive entries', () => {
    expect(calculateStreak(seedEntries)).toBe(5)
  })

  it('builds usable fallback insights', () => {
    const insights = buildInsights([])

    expect(insights.favoriteMood).toBe('reflective')
    expect(insights.recentFocus).toMatch(/first entry/i)
  })

  it('summarizes the seeded archive', () => {
    const stats = statsFromEntries(seedEntries)

    expect(stats.entryCount).toBe(5)
    expect(stats.streak).toBe(5)
    expect(stats.totalWords).toBeGreaterThan(0)
  })
})
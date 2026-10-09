import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import ts from 'typescript'

const source = readFileSync(new URL('../src/heroReveal.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
const exports = {}
runInNewContext(outputText, { exports })
const { heroReveal } = exports

test('reveal matches all four approved stops and clamps outside the sequence', () => {
  for (const [p, expected] of [[-1, .04], [0, .04], [.12, .12], [.25, .7], [.36, 1], [1, 1], [2, 1]]) {
    assert.ok(Math.abs(heroReveal(p) - expected) < 1e-12)
  }
})

test('reveal is monotonic, bounded and reversible across scrolling', () => {
  const points = Array.from({ length: 1001 }, (_, i) => i / 1000)
  const values = points.map(heroReveal)
  values.forEach((value, i) => {
    assert.ok(value >= .04 && value <= 1)
    if (i) assert.ok(value >= values[i - 1])
  })
  assert.deepEqual(points.toReversed().map(heroReveal).toReversed(), values)
})

test('stop boundaries are continuous with no visible step', () => {
  for (const p of [.12, .25, .36]) {
    assert.ok(Math.abs(heroReveal(p + 1e-5) - heroReveal(p - 1e-5)) < 1e-6)
  }
})

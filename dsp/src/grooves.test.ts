import {describe, expect, it} from "vitest"
import {Groove, GrooveChain, GroovePattern, GroovePatternFunction} from "./grooves"
import {PPQN, ppqn} from "./ppqn"
import {meCurve} from "std"

const createMEGroove = (duration: ppqn, amount: number) => new GroovePattern({
    duration: (): ppqn => duration,
    fx: x => meCurve(x, amount),
    fy: y => meCurve(y, -amount)
} satisfies GroovePatternFunction)

const createOffsetGroove = (offset: ppqn): Groove => ({
    warp: (position: ppqn): ppqn => position + offset,
    unwarp: (position: ppqn): ppqn => position - offset
})

describe("Grooves", () => {
    it("should be revertible", () => {
        const G = createMEGroove(PPQN.SemiQuaver * 2, 0.5)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver))).toBeCloseTo(PPQN.SemiQuaver, 7)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver * 1.1))).toBeCloseTo(PPQN.SemiQuaver * 1.1, 7)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver * 1.7))).toBeCloseTo(PPQN.SemiQuaver * 1.7, 7)
    })
    it("should be chainable", () => {
        const A = createMEGroove(PPQN.SemiQuaver * 2, 0.50)
        const B = createMEGroove(PPQN.SemiQuaver * 3, 0.75)
        const C = createOffsetGroove(PPQN.SemiQuaver)
        const D = createMEGroove(PPQN.SemiQuaver * 7, 0.66)
        const G = new GrooveChain([A, B, C, D])
        expect(G.unwarp(G.warp(PPQN.SemiQuaver))).toBeCloseTo(PPQN.SemiQuaver, 7)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver * 1.1))).toBeCloseTo(PPQN.SemiQuaver * 1.1, 7)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver * 1.7))).toBeCloseTo(PPQN.SemiQuaver * 1.7, 7)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver * 42.7))).toBeCloseTo(PPQN.SemiQuaver * 42.7, 7)
    })
})
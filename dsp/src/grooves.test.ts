import {describe, expect, it} from "vitest"
import {GrooveChain, GroovePattern, GroovePatternFunction} from "./grooves"
import {PPQN, ppqn} from "./ppqn"
import {meCurve} from "std"

const createGroove = (duration: ppqn, amount: number) => new GroovePattern({
    duration: (): ppqn => duration,
    fx: x => meCurve(x, amount),
    fy: y => meCurve(y, -amount)
} satisfies GroovePatternFunction)

describe("Grooves", () => {
    it("should be revertible", () => {
        const G = createGroove(PPQN.SemiQuaver * 2, 0.5)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver))).toBeCloseTo(PPQN.SemiQuaver, 7)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver * 1.1))).toBeCloseTo(PPQN.SemiQuaver * 1.1, 7)
    })
    it("should be chainable", () => {
        const A = createGroove(PPQN.SemiQuaver * 2, 0.50)
        const B = createGroove(PPQN.SemiQuaver * 3, 0.75)
        const C = createGroove(PPQN.SemiQuaver * 7, 0.66)
        const G = new GrooveChain([A, B, C])
        expect(G.unwarp(G.warp(PPQN.SemiQuaver))).toBeCloseTo(PPQN.SemiQuaver, 7)
        expect(G.unwarp(G.warp(PPQN.SemiQuaver * 1.1))).toBeCloseTo(PPQN.SemiQuaver * 1.1, 7)
    })
})
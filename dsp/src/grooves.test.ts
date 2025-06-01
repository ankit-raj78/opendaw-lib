import {describe, expect, it} from "vitest"
import {Groove, GrooveChain, GroovePattern, GroovePatternFunction, QuantisedGrooveFunction} from "./grooves"
import {PPQN, ppqn} from "./ppqn"
import {meCurve, Random} from "std"

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

describe("QuantisedGrooveFunction", () => {
    it("2 values [0,1]", () => {
        const func = new QuantisedGrooveFunction(new Float32Array([0.0, 1.0]))
        expect(func.fx(0.0)).toBe(0.0)
        expect(func.fy(0.0)).toBe(0.0)
        expect(func.fx(0.3)).toBe(0.3)
        expect(func.fy(0.3)).toBe(0.3)
        expect(func.fx(0.5)).toBe(0.5)
        expect(func.fy(0.5)).toBe(0.5)
        expect(func.fx(0.7)).toBe(0.7)
        expect(func.fy(0.7)).toBe(0.7)
        expect(func.fx(1.0)).toBe(1.0)
        expect(func.fy(1.0)).toBe(1.0)
    })
    it("3 values [0,0.5,1]", () => {
        const func = new QuantisedGrooveFunction(new Float32Array([0.0, 0.5, 1.0]))
        expect(func.fx(0.0)).toBe(0.0)
        expect(func.fx(0.3)).toBe(0.3)
        expect(func.fx(0.7)).toBe(0.7)
        expect(func.fx(0.5)).toBe(0.5)
        expect(func.fx(1.0)).toBe(1.0)
    })
    it("3 values [0,0.6,1]", () => {
        const func = new QuantisedGrooveFunction(new Float64Array([0.0, 0.6, 1.0]))
        expect(func.fx(0.50)).toBe(0.6)
        expect(func.fx(0.25)).toBe(0.3)
        expect(func.fy(0.6)).toBe(0.5)
        expect(func.fy(0.3)).toBe(0.25)
    })
    it("3 values [0,0.77,1]", () => {
        const func = new QuantisedGrooveFunction(new Float64Array([0.0, 0.77, 1.0]))
        expect(func.fx(0.50)).toBe(0.77)
        expect(func.fy(0.77)).toBe(0.50)
        expect(func.fx(func.fy(0.77))).toBe(0.77)
        expect(func.fx(func.fy(0.13))).toBe(0.13)
    })
    it("random values", () => {
        const func = new QuantisedGrooveFunction(Random.monotoneAscending(new Float32Array(9), 128))
        expect(func.fx(func.fy(0.00))).toBe(0.00)
        expect(func.fx(func.fy(0.13))).toBeCloseTo(0.13, 7)
        expect(func.fx(func.fy(0.13))).toBeCloseTo(0.13, 7)
        expect(func.fx(func.fy(0.59))).toBeCloseTo(0.59, 7)
        expect(func.fx(func.fy(1.00))).toBe(1.00)
    })
})
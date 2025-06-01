import {ppqn} from "./ppqn"
import {Bijective, quantizeFloor, unitValue} from "std"

export interface GrooveFunction extends Bijective<unitValue, unitValue> {}

export interface GroovePatternFunction extends GrooveFunction {
    duration(): ppqn
}

export interface Groove {
    warp(position: ppqn): ppqn
    unwarp(position: ppqn): ppqn
}

export class GroovePattern implements Groove {
    readonly #func: GroovePatternFunction

    constructor(func: GroovePatternFunction) {this.#func = func}

    warp(position: ppqn): ppqn {return this.#transform(true, position)}
    unwarp(position: ppqn): ppqn {return this.#transform(false, position)}

    #transform(forward: boolean, position: ppqn): ppqn {
        const duration = this.#func.duration()
        const start = quantizeFloor(position, duration)
        const normalized = (position - start) / duration
        const transformed = forward ? this.#func.fx(normalized) : this.#func.fy(normalized)
        return start + transformed * duration
    }
}

export class GrooveChain implements Groove {
    readonly #grooves: ReadonlyArray<Groove>

    constructor(grooves: ReadonlyArray<Groove>) {this.#grooves = grooves}

    warp(position: ppqn): ppqn {
        for (let i = 0; i < this.#grooves.length; i++) {position = this.#grooves[i].warp(position)}
        return position
    }

    unwarp(position: ppqn): ppqn {
        for (let i = this.#grooves.length - 1; i >= 0; i--) {position = this.#grooves[i].unwarp(position)}
        return position
    }
}
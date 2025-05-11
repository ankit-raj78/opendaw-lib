import { ppqn } from "./ppqn"
import { Bijective, quantizeFloor, unitValue } from "std"

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
		const groove = this.#func
		const duration = groove.duration()
		const start = quantizeFloor(position, duration)
		const normalized = (position - start) / duration
		const transformed = forward ? groove.fx(normalized) : groove.fy(normalized)
		return start + transformed * duration
	}
}
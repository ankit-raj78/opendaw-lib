import {FloatArray, int, panic, unitValue} from "./lang"

export class Random {
    static Default: Random = new Random(0x3456789A)

    static monotoneAscending(target: FloatArray, scale: int = 128, random: () => unitValue = Math.random): FloatArray {
        const count = target.length
        if (count < 2) {return panic("Array must have at least 2 elements")}
        let sum = 0.0
        for (let i = 1; i < count; i++) {
            const value = Math.floor(random() * (1 + scale)) + 1
            target[i] = value
            sum += value
        }
        let acc = 0.0
        target[0] = 0.0
        for (let i = 1; i < count; i++) {
            acc += target[i]
            target[i] = acc / sum
        }
        return target
    }

    #seed: int = 0

    constructor(seed: int) {this.setSeed(seed)}

    setSeed(value: int): void {this.#seed = value & 0xFFFFFFFF}
    nextDouble(min: number, max: number): number {return min + this.uniform() * (max - min)}
    nextInt(min: int, max: int): int {return min + Math.floor(this.uniform() * (max - min))}
    nextElement<T>(array: ArrayLike<T>): T {return array[Math.floor(this.uniform() * array.length)]}
    nextBoolean(): boolean {return this.uniform() < 0.5}

    uniform(): unitValue {
        // Mulberry32
        let t = this.#seed += 0x6D2B79F5
        t = Math.imul(t ^ t >>> 15, t | 1)
        t ^= t + Math.imul(t ^ t >>> 7, t | 61)
        return ((t ^ t >>> 14) >>> 0) / 4294967296.0
    }
}
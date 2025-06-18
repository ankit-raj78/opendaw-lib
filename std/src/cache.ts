import {Nullable, Provider} from "./lang"
import {Terminable} from "./terminable"

export class CacheValue<T> implements Terminable {
    readonly #provider: Provider<T>

    #value: Nullable<T> = null

    constructor(provider: Provider<T>) {this.#provider = provider}

    invalidate(): void {this.#value = null}

    get(): T {
        if (this.#value === null) {this.#value = this.#provider()}
        return this.#value
    }

    terminate(): void {this.invalidate()}
}
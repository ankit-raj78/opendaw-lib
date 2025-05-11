import { Event, EventCollection } from "./events"
import { BinarySearch, Comparator, Curve, int, Iterables, Nullable, panic, unitValue } from "std"
import { ppqn } from "./ppqn"

export enum Interpolation {None, Default}

export interface ValueEvent extends Event {
	readonly type: "value-event"

	get index(): int
	get value(): number
	get interpolation(): Interpolation
	get slope(): number
}

export namespace ValueEvent {
	export const Comparator: Comparator<ValueEvent> = (a: ValueEvent, b: ValueEvent) => {
		const positionDiff = a.position - b.position
		if (positionDiff !== 0) {return positionDiff}
		const indexDiff = a.index - b.index
		if (indexDiff !== 0) {return indexDiff}
		return a === b ? 0 : panic(`${a} and ${b} are identical in terms of comparation`)
	}

	export function* iterateWindow<E extends ValueEvent>(events: EventCollection<E>,
																											 fromPosition: ppqn,
																											 toPosition: ppqn): Generator<E> {
		if (events.isEmpty()) {return Iterables.empty()}
		for (const event of events.iterateFrom(fromPosition)) {
			yield event
			if (event.position >= toPosition) {return}
		}
	}

	export const nextEvent = <E extends ValueEvent>(events: EventCollection<E>, precursor: E): Nullable<E> => {
		const sorted = events.asArray()
		const index = BinarySearch.rightMost(sorted, precursor, ValueEvent.Comparator)
		return index === -1 ? null : sorted[index + 1] ?? null
	}

	/**
	 * Computes a value at a given position
	 */
	export const valueAt = (events: EventCollection<ValueEvent>, position: ppqn, fallback: unitValue): unitValue => {
		if (events.isEmpty()) {return fallback} // no events, nothing to iterate
		const iteratable = events.iterateFrom(position)
		const { done, value: prevEvent } = iteratable.next()
		if (done) {return fallback}
		if (prevEvent.position <= position) {
			const { done, value: nextEvent } = iteratable.next()
			if (done) {
				return prevEvent.value
			} else if (position < nextEvent.position) {
				return interpolate(prevEvent, nextEvent, position)
			} else if (prevEvent.interpolation === Interpolation.None) {
				return prevEvent.value
			}
		}
		return prevEvent.value
	}

	/**
	 * Quanitise a automation in equal segments, but also include min/max values.
	 * This is used for the ValueClipPainter to draw circular automation curves.
	 * It has been tested in AutomationPage.
	 */
	export function* quantise(events: EventCollection<ValueEvent>, position: ppqn, duration: ppqn, numSteps: number): IteratorObject<{
		position: ppqn,
		value: unitValue
	}> {
		if (events.isEmpty()) {return} // no events, nothing to iterate
		const iteratable = events.iterateFrom(position)
		const { done, value } = iteratable.next()
		if (done) {return}
		const step: number = duration / numSteps
		let prevEvent = value
		if (prevEvent.position > position) {
			while (position < prevEvent.position) {
				yield { position, value: prevEvent.value }
				position += step
				if (position > duration) {return}
			}
			if (prevEvent.position <= duration) {yield prevEvent}
		}
		while (position <= duration) {
			const { done, value: nextEvent } = iteratable.next()
			if (done) {break}
			while (position < nextEvent.position) {
				if (position > duration) {return}
				yield { position, value: interpolate(prevEvent, nextEvent, position) }
				position += step
			}
			if (nextEvent.position < duration) {
				if (prevEvent.interpolation === Interpolation.None) {
					yield { position: nextEvent.position, value: prevEvent.value }
				}
				yield nextEvent
			}
			prevEvent = nextEvent
		}
		while (position <= duration) {
			yield { position, value: prevEvent.value }
			position += step
		}
	}

	const interpolate = ({ value, position, slope, interpolation }: ValueEvent, b: ValueEvent, x: number): unitValue => {
		if (interpolation === Interpolation.None) {
			return value
		} else if (interpolation === Interpolation.Default) {
			if (slope === 0.5) {
				return value + (x - position) / (b.position - position) * (b.value - value)
			} else {
				return Curve.valueAt({ slope, steps: b.position - position, y0: value, y1: b.value }, x - position)
			}
		} else {
			return panic("Unknown interpolation")
		}
	}
}
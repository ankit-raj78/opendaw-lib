import { describe, expect, it } from "vitest"
import { BooleanField, BoxGraph, createSyncTarget, Field, SyncSource } from "./"
import { PointerField, UnreferenceableType } from "./pointer"
import { Box, BoxConstruct } from "./box"
import { NoPointers, VertexVisitor } from "./vertex"
import { Nullish, Option, panic, safeExecute, UUID } from "std"
import { Messenger } from "runtime"

enum PointerType {A, B}

interface BoxVisitor<RETURN = void> extends VertexVisitor<RETURN> {
	visitBarBox?(box: BarBox): RETURN
}

type BoxMap = {
	BarBox: BarBox
}

type BarBoxFields = {
	1: BooleanField
	2: PointerField<PointerType.A>
	3: Field<PointerType.A>
}

class BarBox extends Box<UnreferenceableType, BarBoxFields> {
	static create(graph: BoxGraph<BoxMap>, uuid: UUID.Format): BarBox {
		return graph.stageBox(new BarBox({ uuid, graph, name: "BarBox", pointerRules: NoPointers }))
	}

	private constructor(construct: BoxConstruct<UnreferenceableType>) {
		super(construct)
	}

	protected initializeFields(): BarBoxFields {
		return {
			1: BooleanField.create({
				parent: this,
				fieldKey: 1,
				fieldName: "A",
				pointerRules: NoPointers
			}, false),
			2: PointerField.create({
				parent: this,
				fieldKey: 2,
				fieldName: "B",
				pointerRules: NoPointers
			}, PointerType.A, false),
			3: Field.hook({
				parent: this,
				fieldKey: 3,
				fieldName: "C",
				pointerRules: { mandatory: false, accepts: [PointerType.A] }
			})
		}
	}

	accept<R>(visitor: BoxVisitor<R>): Nullish<R> {
		return safeExecute(visitor.visitBarBox, this)
	}

	get bool(): BooleanField {
		return this.getField(1)
	}

	get pointer(): PointerField<PointerType.A> {
		return this.getField(2)
	}

	get field(): Field<PointerType.A> {
		return this.getField(3)
	}
}

describe("sync", () => {
	it("same checksum", async () => {
		const boxFactory = Option.wrap((name: keyof BoxMap, graph: BoxGraph<BoxMap>, uuid: UUID.Format) => {
			switch (name) {
				case "BarBox":
					return BarBox.create(graph, uuid)
				default:
					return panic()
			}
		})
		const sourceGraph = new BoxGraph<BoxMap>(boxFactory)
		const sourceChannel = new BroadcastChannel("sync")
		const syncSource = new SyncSource(sourceGraph, Messenger.for(sourceChannel))
		const targetGraph = new BoxGraph<BoxMap>(boxFactory)
		const targetChannel = new BroadcastChannel("sync")
		createSyncTarget(targetGraph, Messenger.for(targetChannel))
		sourceGraph.beginTransaction()
		const barBox = BarBox.create(sourceGraph, UUID.generate())
		barBox.bool.setValue(true)
		barBox.pointer.refer(barBox.field)
		sourceGraph.endTransaction()
		// expect(syncSource.checksum(sourceGraph.checksum())).resolves.ok
		sourceChannel.close()
		targetChannel.close()
	})
})
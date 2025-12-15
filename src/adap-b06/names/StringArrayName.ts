import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected readonly components: readonly string[];

    constructor(source: string[], delimiter?: string) {

        // precondition
        IllegalArgumentException.assert(
            Array.isArray(source),
            "source must be an array"
        );

        super(delimiter);

        // defensive copy (immutability!)
        this.components = [...source];

        // postcondition
        MethodFailedException.assert(
            this.components.length >= 0,
            "constructor failed"
        );

        // class invariant
        this.checkInvariant();
    }

    public clone(): Name {
        // class invariant
        this.checkInvariant();

        const clone = new StringArrayName([...this.components], this.delimiter);

        // postconditions
        MethodFailedException.assert(
            clone !== this,
            "clone must create new object"
        );

        MethodFailedException.assert(
            clone.getNoComponents() === this.getNoComponents(),
            "clone must copy all components"
        );

        return clone;
    }

    public getNoComponents(): number {
        // class invariant
        this.checkInvariant();

        const result = this.components.length;

        MethodFailedException.assert(
            result >= 0,
            "getNoComponents() failed"
        );

        return result;
    }

    public getComponent(i: number): string {
        // class invariant
        this.checkInvariant();

        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const result = this.components[i];

        MethodFailedException.assert(
            typeof result === "string",
            "getComponent() failed"
        );

        return result;
    }

    public setComponent(i: number, c: string): Name {
        // class invariant
        this.checkInvariant();

        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        const next = [...this.components];
        next[i] = c;

        const result = new StringArrayName(next, this.delimiter);

        // postcondition
        MethodFailedException.assert(
            result.getComponent(i) === c,
            "setComponent() failed"
        );

        return result;
    }

    public insert(i: number, c: string): Name {
        // class invariant
        this.checkInvariant();

        IllegalArgumentException.assert(
            i >= 0 && i <= this.components.length,
            "index out of bounds"
        );

        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        const next = [...this.components];
        next.splice(i, 0, c);

        const result = new StringArrayName(next, this.delimiter);

        // postcondition
        MethodFailedException.assert(
            result.getNoComponents() === this.getNoComponents() + 1,
            "insert() failed"
        );

        return result;
    }

    public append(c: string): Name {
        // class invariant
        this.checkInvariant();

        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        const result = new StringArrayName(
            [...this.components, c],
            this.delimiter
        );

        // postcondition
        MethodFailedException.assert(
            result.getNoComponents() === this.getNoComponents() + 1,
            "append() failed"
        );

        return result;
    }

    public remove(i: number): Name {
        // class invariant
        this.checkInvariant();

        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const next = [...this.components];
        next.splice(i, 1);

        const result = new StringArrayName(next, this.delimiter);

        // postcondition
        MethodFailedException.assert(
            result.getNoComponents() === this.getNoComponents() - 1,
            "remove() failed"
        );

        return result;
    }

    protected checkInvariant(): void {

        InvalidStateException.assert(
            this.components.every(c => typeof c === "string"),
            "all components must be strings"
        );

        InvalidStateException.assert(
            this.components.length >= 0,
            "invalid component count"
        );

        super.checkInvariant();
    }

}
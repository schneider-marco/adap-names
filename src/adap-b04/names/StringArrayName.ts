import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {

        // precondition
        IllegalArgumentException.assert(
            Array.isArray(source),
            "source must be an array"
        );

        super(delimiter);

        this.components = source;

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
        const clone = new StringArrayName(Array.from(this.components), this.delimiter);

        // postcondition
        MethodFailedException.assert(
            clone !== this,
            "clone must create new object"
        );

        // postcondition
        MethodFailedException.assert(
            clone.getNoComponents() === this.getNoComponents(),
            "clone must copy all components"
        );

        // class invariant
        this.checkInvariant();

        return clone;
    }

    public getNoComponents(): number {
        // class invariant
        this.checkInvariant();
        const result = this.components.length;

        // postcondition
        MethodFailedException.assert(
            result >= 0,
            "getNoComponents() failed"
        );

        // class invariant
        this.checkInvariant();

        return result;
    }

    public getComponent(i: number): string {
        // class invariant
        this.checkInvariant();
        // precondition
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const result = this.components[i];

        // postcondition
        MethodFailedException.assert(
            typeof result === "string",
            "getComponent() failed"
        );

        // class invariant
        this.checkInvariant();

        return result;
    }

    public setComponent(i: number, c: string) {
        // class invariant
        this.checkInvariant();
        // precondition
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        // precondition
        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        this.components[i] = c;

        // postcondition
        MethodFailedException.assert(
            this.components[i] === c,
            "setComponent() failed"
        );

        // class invariant
        this.checkInvariant();
    }

    public insert(i: number, c: string) {
        // class invariant
        this.checkInvariant();
        // precondition
        IllegalArgumentException.assert(
            i >= 0 && i <= this.components.length,
            "index out of bounds"
        );

        // precondition
        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        const before = this.components.length;
        this.components.splice(i, 0, c);

        // postcondition
        MethodFailedException.assert(
            this.components.length === before + 1,
            "insert() failed"
        );

        // class invariant
        this.checkInvariant();
    }

    public append(c: string) {
        // class invariant
        this.checkInvariant();
        // precondition
        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        const before = this.components.length;
        this.components.push(c);

        // postcondition
        MethodFailedException.assert(
            this.components.length === before + 1,
            "append() failed"
        );

        // class invariant
        this.checkInvariant();
    }

    public remove(i: number) {
        // class invariant
        this.checkInvariant();
        // precondition
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const before = this.components.length;
        this.components.splice(i, 1);

        // postcondition
        MethodFailedException.assert(
            this.components.length === before - 1,
            "remove() failed"
        );

        // class invariant
        this.checkInvariant();
    }

    protected checkInvariant(): void {

        // class invariant
        InvalidStateException.assert(
            this.components.every(c => typeof c === "string"),
            "all components must be strings"
        );

        // class invariant
        InvalidStateException.assert(
            typeof this.components.length === "number" && this.components.length >= 0,
            "invalid component count"
        );

        super.checkInvariant();
    }

}
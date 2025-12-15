import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected readonly name: string;
    protected readonly noComponents: number;

    constructor(source: string, delimiter?: string) {

        // precondition
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source must not be null"
        );

        super(delimiter);

        this.name = source;

        if (this.name === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = this.name.split(this.delimiter).length;
        }

        // postcondition
        MethodFailedException.assert(
            this.noComponents >= 0,
            "constructor failed"
        );

        // class invariant
        this.checkInvariant();
    }

    public clone(): Name {
        // class invariant
        this.checkInvariant();

        const clone = new StringName(this.name, this.delimiter);

        MethodFailedException.assert(
            clone !== this,
            "clone must return a new object"
        );

        MethodFailedException.assert(
            clone.asString() === this.asString(),
            "clone must be equal in content"
        );

        return clone;
    }

    public getNoComponents(): number {
        // class invariant
        this.checkInvariant();

        return this.noComponents;
    }


    public getComponent(i: number): string {
        // class invariant
        this.checkInvariant();

        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        const names = this.name.split(this.delimiter);
        const result = names[i];

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
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        const parts = this.name.split(this.delimiter);
        parts[i] = c;

        const result = new StringName(parts.join(this.delimiter), this.delimiter);

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
            i >= 0 && i <= this.noComponents,
            "index out of range"
        );

        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        const parts = this.name === ""
            ? []
            : this.name.split(this.delimiter);

        parts.splice(i, 0, c);

        const result = new StringName(parts.join(this.delimiter), this.delimiter);

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

        const resultName =
            this.name === ""
                ? c
                : this.name + this.delimiter + c;

        const result = new StringName(resultName, this.delimiter);

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
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        const parts = this.name.split(this.delimiter);
        parts.splice(i, 1);

        const result = new StringName(parts.join(this.delimiter), this.delimiter);

        MethodFailedException.assert(
            result.getNoComponents() === this.getNoComponents() - 1,
            "remove() failed"
        );

        return result;
    }

    protected checkInvariant(): void {

        InvalidStateException.assert(
            typeof this.name === "string",
            "name must be a string"
        );

        InvalidStateException.assert(
            this.noComponents ===
            (this.name === "" ? 0 : this.name.split(this.delimiter).length),
            "noComponents does not match split(name)"
        );

        super.checkInvariant();
    }

}
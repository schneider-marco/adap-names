import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

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

        // postcondition
        MethodFailedException.assert(
            clone !== this,
            "clone must return a new object"
        );

        // postcondition
        MethodFailedException.assert(
            clone.asString() === this.asString(),
            "clone must be equal in content"
        );

        // class invariant
        this.checkInvariant();

        return clone;
    }

    public getNoComponents(): number {
        // class invariant
        this.checkInvariant();
        const result = this.noComponents;

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
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        let names = this.name.split(this.delimiter);
        const result = names[i];

        // postcondition
        MethodFailedException.assert(
            result !== null && result !== undefined,
            "getComponent() returned invalid value"
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
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        // precondition
        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        let nameArray = this.name.split(this.delimiter);
        nameArray[i] = c;
        this.name = nameArray.join(this.delimiter);

        // postcondition
        MethodFailedException.assert(
            this.getComponent(i) === c,
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
            i >= 0 && i <= this.noComponents,
            "index out of range"
        );

        // precondition
        IllegalArgumentException.assert(
            typeof c === "string",
            "component must be a string"
        );

        let nameArray = this.name.split(this.delimiter);

        nameArray.splice(i, 0, c);
        this.name = nameArray.join(this.delimiter);
        this.noComponents++;

        // postcondition
        MethodFailedException.assert(
            this.getComponent(i) === c,
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

        const before = this.noComponents;

        if (this.name === "") {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }

        this.noComponents++;

        // postcondition
        MethodFailedException.assert(
            this.noComponents === before + 1,
            "append() did not update component count"
        );

        // class invariant
        this.checkInvariant();
    }

    public remove(i: number) {
        // class invariant
        this.checkInvariant();
        // precondition
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        const before = this.noComponents;

        const nameArray = this.name.split(this.delimiter);
        nameArray.splice(i, 1);
        this.name = nameArray.join(this.delimiter);

        this.noComponents--;

        // postcondition
        MethodFailedException.assert(
            this.noComponents === before - 1,
            "remove() did not decrement component count"
        );

        // class invariant
        this.checkInvariant();
    }

    protected checkInvariant(): void {

        // class invariant
        InvalidStateException.assert(
            typeof this.name === "string",
            "name must be a string"
        );

        // class invariant
        InvalidStateException.assert(
            this.noComponents === (this.name === "" ? 0 : this.name.split(this.delimiter).length),
            "noComponents does not match split(name)"
        );

        super.checkInvariant();
    }

}
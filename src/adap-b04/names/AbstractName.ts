import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Preconditions
        IllegalArgumentException.assert(
            typeof delimiter === "string" && delimiter.length === 1,
            "Delimiter must be a single character."
        );


        this.delimiter = delimiter;

        // Postconditions
        MethodFailedException.assert(this.delimiter === delimiter, "Failed to set the delimiter character.");
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        // class invariant
        this.checkInvariant();
        // Preconditions
        IllegalArgumentException.assert(
            delimiter.length === 1,
            "Delimiter must be a single character."
        );

        let asString = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const components = this.getComponent(i).replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
            if (i === 0) {
                asString += components;
            } else {
                asString += delimiter + components;
            }
        }

        // Postcondition
        MethodFailedException.assert(
            typeof asString === "string",
            "asString() must return a valid string."
        );

        // class invariants
        this.checkInvariant();
        return asString;
    }

    public toString(): string {
        // class invariant
        this.checkInvariant();
        const str = this.asDataString();

        // Postcondition
        MethodFailedException.assert(str !== null, "toString() failed");

        // class invariants
        this.checkInvariant();
        return str;
    }

    public asDataString(): string {
        // class invariant
        this.checkInvariant();
        let result: string = "";

        for (let i = 0; i < this.getNoComponents(); i++) {
            let component = this.getComponent(i);
            component = component.replace(/\\/g, ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            component = component.replace(new RegExp("\\" + this.delimiter, "g"), ESCAPE_CHARACTER + this.delimiter);
            result += component;

            if (i < this.getNoComponents() - 1) {
                result += DEFAULT_DELIMITER;
            }
        }
        // Postcondition
        MethodFailedException.assert(
            typeof result === "string",
            "asDataString() failed"
        );
        // class invariants
        this.checkInvariant();
        return result;
    }

    public isEqual(other: Name): boolean {
        // class invariant
        this.checkInvariant();
        // Precondition
        IllegalArgumentException.assert(other !== null, "other must not be null");

        const result = this.getHashCode() === other.getHashCode();

        // class invariants
        this.checkInvariant();
        return result;
    }

    public getHashCode(): number {
        // class invariants
        this.checkInvariant();
        const hash = (() => {
            const input = this.asDataString() + this.delimiter;

            let hash = 5381;
            for (let i = 0; i < input.length; i++) {
                hash = (hash * 33) ^ input.charCodeAt(i);
            }

            return hash >>> 0;
        })();

        MethodFailedException.assert(
            typeof hash === "number",
            "getHashCode() failed"
        );
        // class invariant
        this.checkInvariant();
        return hash;
    }


    public isEmpty(): boolean {
        // class invariant
        this.checkInvariant();
        const empty = this.getNoComponents() === 0;
        // postcondition
        MethodFailedException.assert(
            typeof empty === "boolean",
            "isEmpty() must return boolean"
        );
        // class invariant
        this.checkInvariant();
        return empty;
    }

    public getDelimiterCharacter(): string {
        // class invariant
        this.checkInvariant();
        // precondition
        MethodFailedException.assert(
            typeof this.delimiter === "string" && this.delimiter.length === 1,
            "Delimiter is invalid."
        );
        // class invariant
        this.checkInvariant();
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // class invariant
        this.checkInvariant();

        // precondition
        IllegalArgumentException.assert(
            other !== null,
            "concat(): other name must not be null"
        );

        const before = this.getNoComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        // postcondition
        MethodFailedException.assert(
            this.getNoComponents() === before + other.getNoComponents(),
            "concat() failed to append all components"
        );
        // class invariant
        this.checkInvariant();
    }

    protected checkInvariant(): void {
        InvalidStateException.assert(
            typeof this.delimiter === "string" && this.delimiter.length === 1,
            "Delimiter must be a single character."
        );
    }


}
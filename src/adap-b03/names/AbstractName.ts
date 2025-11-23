import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        let asString = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const components = this.getComponent(i).replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
            if (i === 0) {
                asString += components;
            } else {
                asString += delimiter + components;
            }
        }
        return asString;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
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

        return result;
    }

    public isEqual(other: Name): boolean {
        return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        function generateHash(dataString: string, delimiter2: string): number {
            const input = dataString + delimiter2;

            let hash = 5381;
            for (let i = 0; i < input.length; i++) {
                hash = (hash * 33) ^ input.charCodeAt(i);
            }

            return hash >>> 0;
        }

        return generateHash(this.asDataString(), this.delimiter);
    }


    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }


}
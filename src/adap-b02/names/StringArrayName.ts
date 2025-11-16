import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
        this.components = source;    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        let name: string = "";
        let idx: number = 0;
        this.components.forEach((element: string) => {
            idx += 1;
            // escape backslash
            element = element.replace(/\\/g, ESCAPE_CHARACTER+ESCAPE_CHARACTER);
            // escape dot
            element = element.replace(/\./g, ESCAPE_CHARACTER+DEFAULT_DELIMITER);
            //console.log(element);
            name += element;
            if (idx !== this.components.length) {
                name += DEFAULT_DELIMITER
            }
        })
        return name;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c)
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }



}
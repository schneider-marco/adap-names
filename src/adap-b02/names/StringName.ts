import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {Name} from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
        this.name = source;
        if (this.name === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = this.name.split(this.delimiter).length;
        }

    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name;
    }

    public asDataString(): string {
        let result: string = "";
        let idx: number = 0;

        let components: string[] = this.name.split(this.delimiter);

        components.forEach((component: string) => {
            idx += 1;

            component = component.replace(/\\/g, ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            component = component.replace(/\./g, ESCAPE_CHARACTER + ".");
            result += component;

            if (idx !== components.length) {
                result += DEFAULT_DELIMITER;
            }
        });

        return result;
    }


    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        let names: string[] = this.name.split(this.delimiter);
        if (x < 0 || x >= names.length) {
            throw new Error("index out of range");
        }
        return names[x];
    }

    public setComponent(n: number, c: string): void {
        let nameArray: string[] = this.name.split(this.delimiter);
        let newNameArray: string[] = [];
        for (let i = 0; i < nameArray.length; i++) {
            if (i === n){
                newNameArray.push(c);
            } else{
                newNameArray.push(nameArray[i]);

            }
        }
        this.name = newNameArray.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        let nameArray: string[] = this.name.split(this.delimiter);
        let newNameArray: string[] = [];
        for (let i = 0; i < nameArray.length; i++) {
            if (i === n){
                newNameArray.push(c)
            }
            newNameArray.push(nameArray[i]);

        }
        this.name = newNameArray.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string): void {
        if (this.name === "") {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(n: number): void {
        const nameArray = this.name.split(this.delimiter);
        nameArray.splice(n, 1);
        this.name = nameArray.join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}
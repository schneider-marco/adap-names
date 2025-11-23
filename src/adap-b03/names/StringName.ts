import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        if (this.name === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = this.name.split(this.delimiter).length;
        }
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        let names: string[] = this.name.split(this.delimiter);
        if (i < 0 || i >= names.length) {
            throw new Error("index out of range");
        }
        return names[i];
    }

    public setComponent(i: number, c: string) {
        let nameArray: string[] = this.name.split(this.delimiter);
        let newNameArray: string[] = [];
        for (let n = 0; n < nameArray.length; n++) {
            if (n === i){
                newNameArray.push(c);
            } else{
                newNameArray.push(nameArray[n]);

            }
        }
        this.name = newNameArray.join(this.delimiter);
    }

    public insert(i: number, c: string) {
        let nameArray: string[] = this.name.split(this.delimiter);
        let newNameArray: string[] = [];
        for (let n = 0; n < nameArray.length; n++) {
            if (n === i){
                newNameArray.push(c)
            }
            newNameArray.push(nameArray[n]);

        }
        this.name = newNameArray.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string) {
        if (this.name === "") {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(i: number) {
        const nameArray = this.name.split(this.delimiter);
        nameArray.splice(i, 1);
        this.name = nameArray.join(this.delimiter);
        this.noComponents--;
    }
}
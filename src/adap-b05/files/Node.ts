import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";
import {Exception} from "../common/Exception";
import {ServiceFailureException} from "../common/ServiceFailureException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        const result = new Set<Node>();

        try {
            this.collectNodes(bn, result);
            return result;

        } catch (e) {
            let ex = e instanceof Exception
                ? e
                : new InvalidStateException("Unknown internal error");

            throw new ServiceFailureException("findNodes failed", ex);
        }
    }

    protected validateNode(): void {
        if (this.getBaseName() === "") {
            throw new InvalidStateException("Invalid node state: empty basename");
        }
    }

    protected collectNodes(bn: string, result: Set<Node>): void {
        this.validateNode();

        if (this.getBaseName() === bn) {
            result.add(this);
        }
    }

}

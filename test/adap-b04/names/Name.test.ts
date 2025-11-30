
import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b04/common/MethodFailedException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";


describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});


// custom tests

describe("Escape function test", () => {
    it("escape dots inside a component", () => {
        const n = new StringArrayName(["Oh..."], ".");
        expect(n.asDataString()).toBe("Oh\\.\\.\\.");
    });

    it("escape backslashes and dots inside a component", () => {
        const n = new StringArrayName(["a\\b.c"]);
        expect(n.asDataString()).toBe("a\\\\b\\.c");
    });
});

describe("Concat interoperability tests", () => {
    it("Concat tests", () => {
        const a: Name = new StringName("a.b");
        const b: Name = new StringArrayName(["c", "d"]);
        a.concat(b);
        expect(a.asString()).toBe("a.b.c.d");
    });

    it("Concat tests2", () => {
        const a: Name = new StringArrayName(["x", "y"]);
        const b: Name = new StringName("z.q");
        a.concat(b);
        expect(a.asString()).toBe("x.y.z.q");
    });

    it("Concat tests3", () => {
        const a: Name = new StringArrayName(["start"]);
        const b: Name = new StringArrayName([]);
        a.concat(b);
        expect(a.asString()).toBe("start");

        const c: Name = new StringName("");
        b.concat(c);
        expect(b.asString()).toBe("");
    });
});

describe("getComponent / setComponent / insert edge tests", () => {
    it("getComponent throws on out of bounds", () => {
        const n: Name = new StringArrayName(["a", "b"]);
        expect(() => n.getComponent(2)).toThrow();
    });

    it("setComponent updates correctly", () => {
        const n: Name = new StringName("a.b.c");
        n.setComponent(1, "x");
        expect(n.asString()).toBe("a.x.c");
    });

    it("insert at beginning and end", () => {
        const n: Name = new StringArrayName(["mid"]);
        n.insert(0, "start");
        n.insert(2, "end");
        expect(n.asString()).toBe("start.mid.end");
    });
});

describe("isEmpty / getNoComponents tests", () => {
    it("empty StringName reports correctly", () => {
        const n: Name = new StringName("");
        expect(n.isEmpty()).toBe(true);
        expect(n.getNoComponents()).toBe(0);
    });

    it("empty StringArrayName reports correctly", () => {
        const n: Name = new StringArrayName([]);
        expect(n.isEmpty()).toBe(true);
        expect(n.getNoComponents()).toBe(0);
    });
});


describe("Clone behavior", () => {
    it("should clone StringName correctly", () => {
        const original = new StringName("a.b.c");
        const clone = original.clone();

        expect(clone.getHashCode()).toBe(original.getHashCode());

        // Clone ändern → Original unverändert
        clone.append("newPart");
        expect(clone.asString()).toBe("a.b.c.newPart");
        expect(original.asString()).toBe("a.b.c");
    });


    it("should clone StringArrayName correctly", () => {
        const original = new StringArrayName(["x", "y", "z"]);
        const clone = original.clone();

        expect(clone.getHashCode()).toBe(original.getHashCode());

        clone.append("more");
        expect(clone.asString()).toBe("x.y.z.more");
        expect(original.asString()).toBe("x.y.z");
    });
});

describe("Precondition tests (IllegalArgumentException)", () => {

    it("StringName constructor rejects multi-character delimiter", () => {
        expect(() => new StringName("a.b", "--")).toThrow(IllegalArgumentException);
    });

    it("StringArrayName constructor rejects non-array source", () => {
        // @ts-ignore
        expect(() => new StringArrayName("not-an-array")).toThrow(IllegalArgumentException);
    });

    it("getComponent should throw for invalid index", () => {
        const n = new StringArrayName(["x", "y"]);
        expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
        expect(() => n.getComponent(5)).toThrow(IllegalArgumentException);
    });

    it("setComponent should throw for invalid index", () => {
        const n = new StringName("a.b.c");
        expect(() => n.setComponent(5, "x")).toThrow(IllegalArgumentException);
    });

    it("insert should throw for invalid index", () => {
        const n = new StringArrayName(["a"]);
        expect(() => n.insert(-1, "x")).toThrow(IllegalArgumentException);
        expect(() => n.insert(5, "x")).toThrow(IllegalArgumentException);
    });

    it("append should throw for non-string component", () => {
        // @ts-ignore
        expect(() => new StringArrayName(["a"]).append(42)).toThrow(IllegalArgumentException);
    });

    it("remove should throw for invalid index", () => {
        const n = new StringName("a.b");
        expect(() => n.remove(9)).toThrow(IllegalArgumentException);
    });

    it("concat should throw when argument is null", () => {
        const n = new StringName("a.b");
        // @ts-ignore
        expect(() => n.concat(null)).toThrow(IllegalArgumentException);
    });

});


describe("Postcondition tests (MethodFailedException)", () => {

    it("clone must return an independent object", () => {
        const n = new StringName("a.b");
        const clone = n.clone();

        clone.append("c");

        expect(n.asString()).toBe("a.b");
        expect(clone.asString()).toBe("a.b.c");
    });

    it("concat must increase component count correctly", () => {
        const a = new StringArrayName(["x"]);
        const b = new StringArrayName(["y", "z"]);

        a.concat(b);

        expect(a.asString()).toBe("x.y.z");
        expect(a.getNoComponents()).toBe(3);
    });

});

describe("Class invariant tests (InvalidStateException)", () => {

    it("StringName detects inconsistent noComponents", () => {
        const n = new StringName("a.b.c");

        // @ts-ignore
        n.noComponents = 999;

        expect(() => n.asString()).toThrow(InvalidStateException);
    });

    it("StringArrayName detects non-string components", () => {
        const n = new StringArrayName(["x", "y"]);

        // @ts-ignore
        n.components[0] = 123;

        expect(() => n.asDataString()).toThrow(InvalidStateException);
    });

    it("Delimiter invariant violation throws", () => {
        const n = new StringName("a.b.c");

        // @ts-ignore
        n.delimiter = "###"; // ungültig

        expect(() => n.asString()).toThrow(InvalidStateException);
    });

});
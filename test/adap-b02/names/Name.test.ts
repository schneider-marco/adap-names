import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";

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

    it("escape dots even if instance delimiter is different", () => {
        const n = new StringArrayName(["oss.cs", "fau.de"], "#");
        expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
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

describe("asDataString reversible behavior test", () => {
    it("data string escapes and rebuilds components", () => {
        const original = new StringArrayName(["a.b", "c\\d"]);
        const dataStr = original.asDataString();

        // Simuliere, dass wir diesen maschinenlesbaren String mit DEFAULT_DELIMITER zurückparsen
        const parsed = new StringName(dataStr);
        expect(parsed.getComponent(0)).toBe("a\\.b");  // Da StringName nicht automatisch unescaped!
        expect(parsed.asDataString()).toBe("a\\.b.c\\\\d"); // Kompatibel maschinenlesbar
    });
});

import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});


/**
* "///" is a name with four empty components and the delimiter character '/'.
*/
describe("special initialization tests ///", () => {
    it("test construction 2", () => {
        let n: Name = new Name(["", "", "", ""], "/");
        expect(n.asString()).toBe("///");
    });
});

/**
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
describe("special initialization tests Oh\.\.\.", () => {
    it("test construction 3", () => {
        let n: Name = new Name(["Oh\.\.\."], ".");
        expect(n.asString()).toBe("Oh...");
    });
});

describe("special initialization tests abc\.def", () => {
    it("test construction 3", () => {
        let n: Name = new Name(["abc\.def"], ".");
        expect(n.asString()).toBe("abc.def");
    });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});


describe("Basic function tests", () => {
    it("test basic function", () => {
        let n: Name = new Name(["oss", "cs", "fau", "de"]);
        expect(n.asDataString()).toBe("oss.cs.fau.de");
    });

    it("test default control characters", () => {
        let n: Name = new Name(["", "", "", ""], "/");
        expect(n.asDataString()).toBe("...");
    });
});



describe("Escape function test", () => {
    it("escape dots inside a component", () => {
        const n = new Name(["Oh..."], ".");
        expect(n.asDataString()).toBe("Oh\\.\\.\\.");
    });

    it("escape backslashes and dots inside a component", () => {
        const n = new Name(["a\\b.c"]);
        expect(n.asDataString()).toBe("a\\\\b\\.c");
    });

    it("escape dots even if instance delimiter is different", () => {
        const n = new Name(["oss.cs", "fau.de"], "#");
        expect(n.asDataString()).toBe("oss\\.cs.fau\\.de");
    });
});


describe("Basic remove tests", () => {
    it("test remove", () => {
        let n: Name = new Name(["oss", "cs", "fau", "de"]);
        n.remove(1)
        expect(n.asDataString()).toBe("oss.fau.de");
    });

});

describe("Basic append tests", () => {
    it("test append", () => {
        let n: Name = new Name(["oss", "cs", "fau"]);
        n.append("de")
        expect(n.asDataString()).toBe("oss.cs.fau.de");
    });

});

describe("Basic NoComponents tests", () => {
    it("test NoComponents", () => {
        let n: Name = new Name(["oss", "cs", "fau"]);
        expect(n.getNoComponents()).toBe(3);
    });

});

describe("Basic setComponent tests", () => {
    it("test setComponent", () => {
        let n: Name = new Name(["oss", "cs", "fau"]);
        n.setComponent(3, "de")
        expect(n.asString()).toBe("oss.cs.fau.de");
    });

});

describe("Basic GetComponent tests", () => {
    it("test GetComponent", () => {
        let n: Name = new Name(["oss", "cs", "fau"]);
        expect(n.getComponent(2)).toBe("fau");
    });

});
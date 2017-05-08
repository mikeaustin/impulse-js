console.log("\ntypes.js\n");

test(' Number.isTypeOf(1) === true ');
test(' Int.isTypeOf(1) === true ');
test(' Int.isTypeOf(1.5) === false ');
test(' String.isTypeOf("foo") === true ');
test(' Boolean.isTypeOf(true) === true ')

console.log("\ntypes.js\n");

test(' [].isTypeOf([]) ');
test(' [Number].isTypeOf([1, 2, 3]) === true ')
test(' [String].isTypeOf(["foo", "bar"]) === true ')
test(' [Number].isTypeOf([1, 2, "x"]) === false ')
test(' [Object].isTypeOf([1, "foo"]) === true');

console.log("");

test(' (1).isEqual(1) === true ');
test(' (true).isEqual(true) === true ');
test(' ("foo").isEqual("foo") === true ');
test(' [1, "foo"].isEqual([1, "foo"]) === true ');

console.log("");

test(' Number.from("1.5") === 1.5 ');
test(' Int.from("FF", 16) === 255 ');
test(' Number.from("foo") === "TypeError" ', { }, function (e) { return e instanceof TypeError; } );
test(' Int.from("1.5") === "TypeError" ', { }, function (e) { return e instanceof TypeError; } );
test(' String.from(["a", "b"]) === "ab" ');
test(' String.from(["a", "b"], ", ") === "a, b" ');
test(' Boolean.from("false") === false ');

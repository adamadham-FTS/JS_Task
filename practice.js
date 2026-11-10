/*
console.log(a);
console.log(b);
console.log(c);

var a = 10;
let b = 20;
const c = 30;

Output:
undiefined
error
error
*/

//=================

/*
var a = 33;

let e = 4;
function test() {
  var a = 5;

  console.log(a);
  console.log(e);
}
test();
console.log(a);

Output:
5
4
33
but if var a = 33 is not there then output will be:
5
4
undefined
*/

//=================

/*
const promise = Promise.resolve({
  name: "Alex",
  age: 15,
});

promise
  .then((value) => {
    return value.name; // here if we remove the return the next .then will get undefined
  })
  .then((name) => {
    console.log(name);
    return name.length;
  })
  .then((length) => {
    console.log(length);
  })
  .catch((error) => {
    console.log(error);
  });


Output:
Alex
4
*/

//=================

/*
function test() {
  setTimeout(() => {
    console.log("set time out");
  }, 200);

  const res = Promise.resolve("gg").then((value) => {
    for (let a of [1, 2, 3, 4, 5, 6]) {
      console.log(a);
    }

    console.log(value);
    return "a";
  });

  console.log(res);
  console.log("fine");
}

test();

setTimeout(() => console.log("asd"), 500);

Output:
pendding
fine
1-6
gg
a
set time out
asd
*/

//=================

/*
async function test() {
  setTimeout(() => {
    console.log("set time out");
  }, 200);

  const res2 = Promise.resolve("promise1").then(console.log);
  console.log(res2);

  const res = await Promise.resolve("gg").then((value) => {
    for (let a of [1, 2, 3, 4, 5, 6]) {
      console.log(a);
    }

    console.log(value);
    return "a";
  });

  console.log(res);
  console.log("fine");
}

test();

setTimeout(() => console.log("asd"), 0);

Output:
pendding // the log(res2)
promise1 // since the relove now called the .then 
1-6
gg
a
fine
asd
set time out
*/

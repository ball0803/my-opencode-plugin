// Test file for ast-grep
function testFunction() {
  console.log("Hello World");
}

class TestClass {
  value: number;
  constructor() {
    this.value = 42;
  }
}

const useState = () => {
  return [null, () => {}];
};

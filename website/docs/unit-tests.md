---
id: unit-tests
title: Unit Tests
---

Code testing tools always matter. It improves your code coverage and reduces your debugging. Silvie integrated with
[Jest](https://jestjs.io) to let your create and run your test as easy as possible.

## Create Tests
You can find your test files in the `tests` directory of your project root. If you don't have that directory, or you 
want to create a new test, you can use the [make command in Silvie CLI](cli.md#make).

```bash
silvie make test hello
```

This command will create a file named `hello.test.js` in the `tests` directory of your project root, with the following 
contents which is a test suite with an empty test:

```typescript
describe('Hello Suite', () => {
        test('Hello Test', () => {
                // Write your test here
        });
});
```

Keep in mind that jest has been configured to look for files ending with `.test.js` or `.test.ts` in the whole project. 
That `tests` directory meant to keep test files in one place. So you can have your test files anywhere, and they will be 
executed no matter where they are. 
 

## Running Tests
There is a simple command in Silvie CLI to run all tests in the project, called [test](cli.md#test) command. This 
command will run the jest on your project and shows the testing result on the screen. 

```bash
silvie test
```

To learn more about writing tests, please read the docs on [official jest website](https://jestjs.io/docs/en/getting-started).

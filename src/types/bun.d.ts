declare module 'bun:test' {
  export interface TestContext {
    page: any;
    context: any;
    browser: any;
  }

  export interface TestOptions {
    only?: boolean;
    skip?: boolean;
    timeout?: number;
  }

  export interface TestFn {
    (
      name: string,
      fn: (context: TestContext) => Promise<void> | void,
      options?: TestOptions,
    ): void;
    (name: string, fn: (context: TestContext) => Promise<void> | void): void;
    only: (
      name: string,
      fn: (context: TestContext) => Promise<void> | void,
      options?: TestOptions,
    ) => void;
    skip: (
      name: string,
      fn: (context: TestContext) => Promise<void> | void,
      options?: TestOptions,
    ) => void;
  }

  export interface DescribeOptions {
    only?: boolean;
    skip?: boolean;
  }

  export interface DescribeFn {
    (name: string, fn: () => void, options?: DescribeOptions): void;
    only: (name: string, fn: () => void, options?: DescribeOptions) => void;
    skip: (name: string, fn: () => void, options?: DescribeOptions) => void;
  }

  export interface BeforeAllOptions {
    timeout?: number;
  }

  export interface AfterAllOptions {
    timeout?: number;
  }

  export interface BeforeEachOptions {
    timeout?: number;
  }

  export interface AfterEachOptions {
    timeout?: number;
  }

  export const test: TestFn;
  export const describe: DescribeOptions;
  export const beforeAll: (
    fn: () => Promise<void> | void,
    options?: BeforeAllOptions,
  ) => void;
  export const afterAll: (
    fn: () => Promise<void> | void,
    options?: AfterAllOptions,
  ) => void;
  export const beforeEach: (
    fn: () => Promise<void> | void,
    options?: BeforeEachOptions,
  ) => void;
  export const afterEach: (
    fn: () => Promise<void> | void,
    options?: AfterEachOptions,
  ) => void;
  export const expect: any;
  export const mock: any;
  export const spyOn: any;
  export const vi: any;
  export const onTestHook: any;
  export const onExit: any;
}

declare module 'bun:test/{matchers}' {
  export * from 'bun:test';
}

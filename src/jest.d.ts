declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefinedGuard(): R;
    }
  }
}

export {};

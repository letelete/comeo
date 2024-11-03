type KeyGenerator = Generator<string, string, string>;

function* createKeyGenerator(): KeyGenerator {
  while (true) {
    yield crypto.randomUUID() as string;
  }
}

export type { KeyGenerator };
export { createKeyGenerator };

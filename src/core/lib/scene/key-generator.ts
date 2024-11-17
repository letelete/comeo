const randomUUID = () => {
  if (typeof crypto.randomUUID !== 'function') {
    return require('crypto').randomUUID() as string;
  }
  return crypto.randomUUID() as string;
};

type KeyGenerator = Generator<string, string, string>;

function* createKeyGenerator(): KeyGenerator {
  while (true) {
    yield randomUUID();
  }
}

export type { KeyGenerator };
export { createKeyGenerator };

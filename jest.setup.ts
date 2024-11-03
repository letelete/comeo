import '@testing-library/jest-dom';

global.structuredClone = (v) => JSON.parse(JSON.stringify(v));

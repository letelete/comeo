import type { Action, Frame, FrameBlockToken, Scene, Sequence } from './types';

const getUniqueKey = () => {
  return crypto.randomUUID() as string;
};

const getKeyForToken = (token: string, actionKey: string) => {
  let tokenName = token;
  if (token.trim() === '') {
    tokenName = 'whitespace';
  }

  return `${actionKey}:${tokenName}`;
};

const tokenizeBlock = (block: string, actionKey: string): FrameBlockToken[] => {
  const re = new RegExp(/\w+|[^\w]/g);
  const parts = block.match(re);

  if (!parts) {
    throw new Error(`Block \`${block}\` has no parts.`);
  }

  return parts.map((part) => ({
    key: getKeyForToken(part, actionKey),
    value: part,
  }));
};

const buildActionFrameBlocks = (action: Action, actionKey: string) => {
  return action.blocks.map((block) => {
    let tokens = [];
    let transition = action.transition;
    if (typeof block === 'string') {
      tokens = tokenizeBlock(block, actionKey);
    } else {
      tokens = tokenizeBlock(block.content, actionKey);
      if (block.transition) {
        transition = block.transition;
      }
    }

    return { key: getUniqueKey(), order: 0, tokens, transition };
  });
};

const buildFramesFromScene = (scene: Scene): Frame[] => {
  const keys = new Array(scene.length).fill(null).map(() => getUniqueKey());
  const sceneKey = getUniqueKey();

  return scene.map((action, index) => {
    const key = keys[index];
    if (!key) {
      throw new Error(`Invalid state. Key is missing at index \`${index}\`.`);
    }
    const prev = keys[index - 1] ?? null;
    const next = keys[index + 1] ?? null;

    return {
      key,
      line: action.line,
      blocks: buildActionFrameBlocks(action, sceneKey),
      prev,
      next,
    } satisfies Frame;
  });
};

const buildSequenceFromScene = (scene: Scene): Sequence => {
  const key = getUniqueKey();
  const frames = buildFramesFromScene(scene);

  return {
    key,
    frames,
  };
};

export { buildSequenceFromScene };

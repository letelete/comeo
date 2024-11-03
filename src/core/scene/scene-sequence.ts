import { Change, diffWords, diffWordsWithSpace } from 'diff';

import { createKeyGenerator, KeyGenerator } from '~/core/scene/key-generator';
import type { Action, Scene } from '~/core/script/types';

import type { Diff, Frame, IdentifiableChange, Transition } from './types';

class SceneSequence {
  private scene: Scene;
  private keyGenerator: KeyGenerator;
  private keys: string[];
  private diffs: Diff[];
  private transitions: Transition[];

  key: string;
  frames: Frame[];

  constructor(scene: Scene, keyGenerator = createKeyGenerator()) {
    this.scene = scene;
    this.keyGenerator = keyGenerator;
    this.keys = this.getUniqueKeys();
    this.diffs = this.getDiffs();
    this.transitions = this.getTransitions();

    this.key = this.keyGenerator.next().value;
    this.frames = this.buildSequence();
  }

  private getUniqueKeys() {
    return new Array(this.scene.length)
      .fill(null)
      .map(() => this.keyGenerator.next().value);
  }

  private getDiffs() {
    return this.scene.map((currentAction, currentActionIndex, arr) => {
      const prevAction = arr[currentActionIndex - 1] ?? null;

      const changes = this.getChangesForActions(prevAction, currentAction);

      const diffChanges: IdentifiableChange[] = changes.map(
        (change) =>
          ({
            ...change,
            unchanged: this.isUnchanged(change),
            key: this.keyGenerator.next().value,
          }) satisfies IdentifiableChange
      );

      return {
        value: this.getActionValue(currentAction),
        changes: diffChanges,
      };
    });
  }

  private getChangesForActions(
    prevAction: Action | null,
    currentAction: Action
  ): Change[] {
    const currentActionValue = this.getActionValue(currentAction);
    const prevActionValue = prevAction && this.getActionValue(prevAction);

    if (prevActionValue === null) {
      return [
        {
          added: true,
          count: currentActionValue.length,
          removed: false,
          value: currentActionValue,
        },
      ];
    }

    return diffWords(prevActionValue, currentActionValue).filter(
      (e) => !e.removed
    );
  }

  private getActionValue(action: Action) {
    return action.blocks.join('\n');
  }

  private isUnchanged(change: Change) {
    return !change.added && !change.removed;
  }

  private getTransitions() {
    return this.diffs.map<Transition>((diff) => {
      const unChangedParts = diff.changes.filter(
        (change) => !change.added && !change.removed
      );

      const initial = {
        value: unChangedParts.map((e) => e.value).join(''),
        changes: unChangedParts,
      } satisfies Diff;

      const animate = structuredClone(diff);
      return { initial, animate };
    });
  }

  private buildSequence() {
    return this.scene.map<Frame>((action, index) => {
      const key = this.keys[index];
      if (!key) {
        throw new Error(`Invalid state. Key is missing at index \`${index}\`.`);
      }

      const transition = this.transitions[index];
      if (!transition) {
        throw new Error(`Invalid state. Key is missing at index \`${index}\`.`);
      }

      const prev = this.keys[index - 1] ?? null;
      const next = this.keys[index + 1] ?? null;

      const line = action.line;

      return { key, index, line, prev, next, transition };
    });
  }
}

export { SceneSequence };

import { z } from '~/lib/validators';

export const MotionTypeEnum = z.enum(['instant', 'typewriter']);
export type MotionType = z.infer<typeof MotionTypeEnum>;

export const MotionSchema = z.object({
  in: MotionTypeEnum.optional(),
  out: MotionTypeEnum.optional(),
});
export interface Motion {
  in?: MotionType;
  out?: MotionType;
}

export const ActionBlockSchema = z.union([
  z.string(),
  z.object({ content: z.string(), motion: MotionTypeEnum.optional() }),
]);
export type ActionBlock = z.infer<typeof ActionBlockSchema>;

export const ActionSchema = z.object({
  line: z.string(),
  motion: MotionTypeEnum.optional(),
  blocks: z.array(ActionBlockSchema),
});
export type Action = z.infer<typeof ActionSchema>;

export const SceneSchema = z.array(ActionSchema);
export type Scene = Action[];

export const ScriptSchema = z.array(SceneSchema);
export type Script = Scene[];

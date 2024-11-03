import { ScriptSchema } from '~/core/script/types';
import { validateSchema } from '~/lib/validators';

export const parseScript = (scriptDefinition: string) => {
  return validateSchema({
    schema: ScriptSchema,
    dto: scriptDefinition,
    schemaName: 'ScriptSchema',
  });
};

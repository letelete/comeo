import * as z from 'zod';

import { DEBUG_MODE } from '~/lib/constants';

interface ValidateConfig<TSchema> {
  dto: unknown;
  schema: TSchema;
  schemaName: string;
}

const validateSchema = <T extends z.ZodType<z.infer<T>>>(
  config: ValidateConfig<T>
) => {
  const validationResult = config.schema.safeParse(config.dto);

  if (!validationResult.success) {
    captureError(`Validation Error: ${config.schemaName}`, {
      dto: config.dto,
      error: validationResult.error.message,
      issues: validationResult.error.issues,
    });

    throw new Error('Received unexpected data shape that cannot be processed');
  }

  return validationResult.data;
};

function captureError<TExtra>(message: string, extra: TExtra) {
  if (DEBUG_MODE) {
    console.error(message, extra);
  } else {
    // TODO: connect with external Logging tool.
  }
}

export { z, validateSchema };

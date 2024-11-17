import { ComponentPropsWithoutRef } from 'react';

import { cn } from '~/lib/utils';

const Editor = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<'textarea'>) => {
  return (
    <textarea
      className={cn('w-full', className)}
      placeholder='type here'
      {...rest}
    ></textarea>
  );
};
Editor.displayName = 'Editor';

export { Editor };

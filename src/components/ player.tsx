import { CSSProperties, PropsWithChildren, useMemo } from 'react';

import { cn } from '~/lib/utils';

type Resolution = 'hd' | 'fhd' | 'qhd' | '4k-uhd';

type Size = { width: number; height: number };

type Orientation = 'landscape' | 'portrait';

const resolutionToSize = {
  hd: { width: 1280, height: 720 },
  fhd: { width: 1920, height: 1080 },
  qhd: { width: 2560, height: 1440 },
  '4k-uhd': { width: 3840, height: 2160 },
} satisfies Record<Resolution, Size>;

type PlayerPropsWithResolution = {
  res: Resolution;
} & { [key in keyof Size]?: never };

type PlayerPropsWithSize = {
  res?: never;
} & Size;

type PlayerProps = {
  orientation?: Orientation;
  responsive?: boolean;
  className?: string;
} & (PlayerPropsWithResolution | PlayerPropsWithSize);

const withOrientation = (size: Size, orientation: Orientation) => {
  if (orientation === 'landscape') {
    return size;
  }

  return { width: size.height, height: size.width } satisfies Size;
};

const Player = ({
  orientation = 'landscape',
  responsive,
  res,
  width,
  height,
  className,
  children,
}: PropsWithChildren<PlayerProps>) => {
  const playerSize = useMemo(() => {
    const size = res ? resolutionToSize[res] : { width, height };

    return withOrientation(size, orientation);
  }, [height, orientation, res, width]);

  const aspectRatio = playerSize.width / playerSize.height;

  return (
    <div
      style={
        responsive
          ? ({ '--player-aspect-ratio': aspectRatio } as CSSProperties)
          : { ...playerSize }
      }
      className={cn(
        'bg-player text-player-foreground outline-dashed outline-player-border',
        responsive && 'aspect-[--player-aspect-ratio] h-min w-full',
        className
      )}
    >
      {children}
    </div>
  );
};
Player.displayName = 'Player';

export { Player };

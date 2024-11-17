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

type SourceMonitorPropsWithResolution = {
  res: Resolution;
} & { [key in keyof Size]?: never };

type SourceMonitorPropsWithSize = {
  res?: never;
} & Size;

type SourceMonitorProps = {
  orientation?: Orientation;
  responsive?: boolean;
  className?: string;
} & (SourceMonitorPropsWithResolution | SourceMonitorPropsWithSize);

const withOrientation = (size: Size, orientation: Orientation) => {
  if (orientation === 'landscape') {
    return size;
  }

  return { width: size.height, height: size.width } satisfies Size;
};

const SourceMonitor = ({
  orientation = 'landscape',
  responsive,
  res,
  width,
  height,
  className,
  children,
}: PropsWithChildren<SourceMonitorProps>) => {
  const SourceMonitorSize = useMemo(() => {
    const size = res ? resolutionToSize[res] : { width, height };

    return withOrientation(size, orientation);
  }, [height, orientation, res, width]);

  const aspectRatio = SourceMonitorSize.width / SourceMonitorSize.height;

  return (
    <div
      style={
        responsive
          ? ({ '--player-aspect-ratio': aspectRatio } as CSSProperties)
          : { ...SourceMonitorSize }
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
SourceMonitor.displayName = 'SourceMonitor';

export { SourceMonitor };

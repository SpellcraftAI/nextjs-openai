/* eslint-disable no-console */
import { FC, useEffect, useMemo, useRef, memo, forwardRef, Ref } from "react";
import { useTextBuffer } from "../../hooks";

export type StreamingTextProps = {
  buffer: string[];
  as?: keyof JSX.IntrinsicElements;
  fade?: number;
};

/**
 * A component that streams in a buffer of text, animating in each chunk as it's
 * added.
 */
export const StreamingText: FC<StreamingTextProps> = memo(forwardRef(({
  buffer,
  as: ElementType = "p",
  fade = 600,
}, ref: Ref<HTMLElement>) => {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const textElement = textRef.current;

    if (textElement) {
      const spanElements = textElement.getElementsByTagName("span");
      const lastSpan = spanElements[spanElements.length - 1];

      if (lastSpan) {
        const keyframes = [
          { opacity: 0 },
          { opacity: 1 }
        ];

        const config = {
          duration: fade,
          // easeInExpo
          easing: "cubic-bezier(0.7, 0, 0.84, 0)",
        };

        const animation =  requestAnimationFrame(
          () => lastSpan.animate(keyframes, config)
        );

        return () => cancelAnimationFrame(animation);
      }
    }

    return;
  }, [buffer, fade]);

  const fadedChunks = useMemo(() => buffer.map(
    (chunk, i) => {
      const isFirst = i === 0;
      const isBlank = !chunk.trim();

      if (isFirst && isBlank) {
        return <>&shy;</>;
      }

      return (
        <span key={i}>
          {chunk}
        </span>
      );
    }
  ), [buffer]);

  return (
    // @ts-ignore - Ref can be any
    <ElementType ref={ref ?? textRef}>
      {!fadedChunks.length ? <>&shy;</> : fadedChunks}
    </ElementType>
  );
}));

export interface StreamingTextURLProps extends Omit<StreamingTextProps, "buffer"> {
  url: string;
  throttle?: number;
}

export const StreamingTextURL: FC<StreamingTextURLProps> = ({
  url,
  throttle = 100,
  ...props
}) => {
  const { buffer } = useTextBuffer(url, throttle);
  return <StreamingText buffer={buffer} {...props}  />;
};

// StreamingText.URL = StreamingTextURL;

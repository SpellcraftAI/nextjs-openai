/* eslint-disable no-console */
import { FC, useEffect, useMemo, useRef } from "react";
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
export const StreamingText: FC<StreamingTextProps> = ({
  buffer,
  as: ElementType = "p",
  fade = 600,
}) => {
  const textRef = useRef<HTMLElement>(null);

  const fadedChunks = useMemo(() => buffer.map(
    (chunk, i) => {
      const isFirst = i === 0;
      const isBlank = !chunk.trim();

      if (isFirst && isBlank) {
        return <span key={i}>&shy;</span>;
      }

      return (
        // Important to set the opacity to 0.01 so that there is no chance of
        // the text being painted before the animation starts.
        <span style={{ opacity: 0 }} key={i}>
          {chunk}
        </span>
      );
    }
  ), [buffer]);

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

        const animation = requestAnimationFrame(
          () => {
            lastSpan.animate(keyframes, config);
            lastSpan.style.opacity = "1.0";
          }
        );

        // return () => cancelAnimationFrame(animation);
      }
    }
    return;
  }, [buffer, fade]);

  return (
    // @ts-ignore - Ref can be any
    <ElementType ref={textRef}>
      {!fadedChunks.length ? <>&shy;</> : fadedChunks}
    </ElementType>
  );
};

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

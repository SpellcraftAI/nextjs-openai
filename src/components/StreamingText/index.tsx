import { FC, useEffect, useMemo, useRef } from "react";
import { useTextBuffer } from "../../hooks";

export type StreamingTextProps = {
  buffer: string[];
  as?: keyof JSX.IntrinsicElements;
  fade?: number;
};

export const StreamingText: FC<StreamingTextProps> = ({
  buffer,
  as: ElementType = "p",
  fade = 600,
}) => {
  const textRef = useRef<HTMLElement | null>(null);
  const lastSpanRef = useRef<HTMLElement | null>(null);
  const lastAnimatedIndexRef = useRef(-1);

  const fadedChunks = useMemo(
    () =>
      buffer.map((chunk, i) => {
        const opacity = 0;
        return <span style={{ opacity }} key={i}>{chunk}</span>;
      }),
    [buffer]
  );

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const spanElements = textElement.getElementsByTagName("span");
    const lastSpan = spanElements[spanElements.length - 1];

    if (!lastSpan || lastSpan === lastSpanRef.current) return;

    const keyframes = [{ opacity: 0 }, { opacity: 1 }];
    const config = {
      duration: fade,
      easing: "cubic-bezier(0.7, 0, 0.84, 0)",
    };

    const animation = lastSpan.animate(keyframes, config);
    animation.onfinish = () => {
      lastSpan.style.opacity = "1";
      lastAnimatedIndexRef.current += 1;
    };

    lastSpanRef.current = lastSpan;
  }, [buffer, fade, lastSpanRef]);

  return (
    // @ts-ignore - ref any
    <ElementType ref={textRef}>
      {fadedChunks.length === 0 ? <>&shy;</> : fadedChunks}
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
  return <StreamingText buffer={buffer} {...props} />;
};

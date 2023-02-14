/**
 * @fileoverview
 *
 * This is meant to be the simplest component that can read text from a stream
 * and render it using a fade-in animation.
 *
 * I was both depressed and inspired by how uncooperative React is with such a
 * simple use case, especially for Safari. We did the best we could.
 */

import { FC, useEffect, useRef, useState } from "react";
import { useTextBuffer } from "../../hooks";

export type StreamingTextProps = {
  buffer: string[];
  as?: keyof JSX.IntrinsicElements;
  fade?: number;
};

/**
 * StreamingText renders the chunks of an updating buffer of text with a fade-in
 * animation.
 */
export const StreamingText: FC<StreamingTextProps> = ({
  buffer,
  as: ElementType = "p",
  fade = 600,
}) => {
  const text = buffer.join("");
  const empty = buffer.length === 0 || text.trim() === "";
  const [index, setIndex] = useState(0);
  const textRef = useRef<HTMLElement>(null);
  const fadedChunks = buffer.map((chunk, i) => (
    <span style={{ opacity: i < index ? 1 : 0 }} key={i}>
      {chunk}
    </span>
  ));

  /**
   * Handle resets and buffer size changes.
   */
  useEffect(
    () => {
      if (index >= buffer.length) {
        setIndex(buffer.length);
      }
    },
    [buffer.length, index]
  );

  /**
   * Schedule a fade-in animation for the last span element and increment the
   * index.
   */
  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const spanElements = textElement.getElementsByTagName("span");
    if (spanElements.length <= index) return;

    const lastSpan = spanElements[index];
    if (!lastSpan) return;

    const animation = lastSpan.animate(
      [
        { opacity: 0 },
        { opacity: 1 }
      ],
      {
        duration: fade,
        easing: "cubic-bezier(0.7, 0, 0.84, 0)",
      }
    );

    animation.onfinish = () => {
      lastSpan.style.opacity = "1";
    };

    setIndex(index + 1);
  }, [buffer, fade, index]);

  return (
    // @ts-ignore - ref any
    <ElementType ref={textRef}>
      {empty ? <>&shy;</> : fadedChunks}
    </ElementType>
  );
};

export interface StreamingTextURLProps extends Omit<StreamingTextProps, "buffer"> {
  url: string;
  throttle?: number;
}

/**
 * Wrapper around `<StreamingText>` that fetches the text stream from a URL.
 */
export const StreamingTextURL: FC<StreamingTextURLProps> = ({
  url,
  throttle = 100,
  ...props
}) => {
  const { buffer } = useTextBuffer(url, throttle);
  return <StreamingText buffer={buffer} {...props} />;
};

/* eslint-disable no-console */
import { FC, useEffect, useRef } from "react";
import { useTextBuffer } from "../../hooks";

export type StreamingTextProps = {
  buffer: string[];
  as?: keyof JSX.IntrinsicElements;
  fade?: number;
  // throttle?: number;
};

export interface StreamingTextURLProps extends Omit<StreamingTextProps, "buffer"> {
  url: string;
  throttle?: number;
}

export type StreamingTextComponent = FC<StreamingTextProps> & {
  URL: FC<StreamingTextURLProps>;
};

export const StreamingText: StreamingTextComponent = ({
  buffer,
  as: ElementType = "p",
  fade = 600,
}) => {
  const textRef = useRef<HTMLElement>(null);

  useEffect(
    () => {
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
            easing: "cubic-bezier(0.83, 0, 0.17, 1)",
          };

          lastSpan.animate(keyframes, config);
        }
      }
    },
    [buffer, fade]
  );


  const faded = buffer.map((chunk, i) => (<span key={i}>{chunk}</span>));
  return (
    // @ts-ignore - Ref can be any
    <ElementType ref={textRef}>
      {faded.length ? faded : <>&shy;</>}
    </ElementType>
  );
};

const StreamingTextURL: FC<StreamingTextURLProps> = ({
  url,
  throttle = 100,
  ...props
}) => {
  const { buffer } = useTextBuffer(url, throttle);
  return <StreamingText buffer={buffer} {...props}  />;
};

StreamingText.URL = StreamingTextURL;
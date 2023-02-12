import { FC } from "react";
import { useTextBuffer } from "../../hooks";
import { TextBufferView } from "../TextBufferView";

export interface TextStreamViewProps extends JSX.IntrinsicAttributes {
  url: string;
  as?: keyof JSX.IntrinsicElements;
  fade?: number;
  throttle?: number;
}

/**
 * Stream the given `url` and display the text as a `TextBufferView`.
 */
export const TextStreamView: FC<TextStreamViewProps> = ({
  as,
  url,
  fade = 1000,
  throttle = fade / 4,
  ...props
}) => {
  const { buffer } = useTextBuffer(url, throttle);
  return (
    <TextBufferView as={as} fade={fade} buffer={buffer} {...props} />
  );
};
import { FC } from "react";
import { useTextStream } from "../../hooks";
import { TextBufferView } from "../TextBufferView";

export interface TextStreamViewProps extends JSX.IntrinsicAttributes {
  url: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
}

/**
 * Stream the given `url` and display the text as a `TextBufferView`.
 */
export const TextStreamView: FC<TextStreamViewProps> = ({
  as,
  url,
  delay = 300,
  ...props
}) => {
  const { buffer } = useTextStream(url, delay);
  return (
    <TextBufferView as={as} delay={delay} buffer={buffer} {...props} />
  );
};
import { FC } from "react";

const FADE_IN_CSS =
`@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.fadeIn {
  animation: fadeIn 250ms cubic-bezier(0.55, 0.79, 0, 1.07);
}`;

export interface TextBufferView extends JSX.IntrinsicAttributes {
  buffer: string[];
  as?: keyof JSX.IntrinsicElements;
}

export const TextBufferView: FC<TextBufferView> = ({
  buffer,
  as: ElementType = "p",
  ...props
}) => {
  const lastToken = buffer[buffer.length - 1] || "";
  const leadingTokens = buffer.slice(0, buffer.length - 1).join("") || "&shy;";

  /**
   * Over five different approaches with useEffect() were tried, but none of
   * them worked reliably. We must RETVRN to native APIs.
   *
   * The soft hyphen &shy; is used to ensure there is text to fill the
   * container, but it cannot be &nbsp; or it will cause clipping when the first
   * character is written.
   */
  return (
    <>
      <style>{FADE_IN_CSS}</style>
      <ElementType
        dangerouslySetInnerHTML={{
          __html: `${leadingTokens}<span class="fadeIn">${lastToken}</span>`
        }}
        {...props}
      />
    </>
  );
};
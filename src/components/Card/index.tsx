import { FC, PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  href: string;
}

export const Card: FC<CardProps> = ({ href, children }) => {
  return (
    <a href={href} className="card">
      {children}
    </a>
  );
};
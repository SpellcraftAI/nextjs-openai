import Image from "next/image";

export const Footer = () => {
  return (
    <footer>
      <a
        className="flex-center"
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
          Powered by{" "}
        <span className="h-4 ml-2 flex-center">
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </a>
    </footer>
  );
};
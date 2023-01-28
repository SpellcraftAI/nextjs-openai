import Head from "next/head";
import { useTokenStream } from "../hooks";

export default function Home() {
  const [text, refresh] = useTokenStream("/api/test");

  return (
    <>
      <Head>
        <title>OpenAI Completion Stream</title>
      </Head>

      <main>
        <div className="w-full max-w-md p-4 rounded-lg border-solid border-2 border-gray-400">
          <p>{text}</p>
        </div>
        <button onClick={refresh}>Refresh</button>
      </main>

    </>
  );
}

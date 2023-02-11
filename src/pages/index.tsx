import Head from "next/head";
import { TextBufferView } from "../components";
import { TextStreamView } from "../components/TextStreamView";
import { useTextStream } from "../hooks";

export default function Home() {
  const { buffer, refresh, cancel } = useTextStream("/api/demo");

  return (
    <>
      <Head>
        <title>OpenAI Completion Stream</title>
      </Head>

      <main>
        <div className="w-full max-w-md p-4 rounded-lg border-solid border-2 border-gray-400">
          <TextBufferView buffer={buffer} />
        </div>
        <div>
          <button className="w-full" onClick={refresh}>Refresh</button>
          <button className="w-full" onClick={cancel}>Cancel</button>
        </div>
        <div className="w-full max-w-md p-4 rounded-lg border-solid border-2 border-gray-400">
          <TextStreamView url="/api/demo" />
          {/* <TestStreamTest url="/api/demo" /> */}
          {/* <TestStreamTest url="/api/demo" /> */}
        </div>
      </main>
    </>
  );
}

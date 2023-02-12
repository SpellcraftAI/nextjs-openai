import Head from "next/head";
import { StreamingText } from "../components/StreamingText";
import { useTextBuffer } from "../hooks";

export default function Home() {
  const { buffer, refresh, cancel } = useTextBuffer("/api/demo", 200);
  return (
    <>
      <Head>
        <title>OpenAI Completion Stream</title>
      </Head>

      <main>
        <div className="w-full max-w-md p-4 rounded-lg border-solid border-2 border-gray-400">
          <StreamingText fade={600} buffer={buffer} />
        </div>
        <div className="flex flex-row">
          <button className="w-full" onClick={refresh}>Refresh</button>
          <button className="w-full" onClick={cancel}>Cancel</button>
        </div>
        <div className="w-full max-w-md p-4 rounded-lg border-solid border-2 border-gray-400">
          <StreamingText.URL url="/api/demo" fade={600} throttle={100} />
        </div>
      </main>
    </>
  );
}

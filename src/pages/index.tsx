/* eslint-disable max-len */
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { StreamingText } from "../components/StreamingText";
import { useTextBuffer } from "../hooks";

export default function Home() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({ name: "John" });
  const { buffer, refresh, cancel } = useTextBuffer({
    url: "/api/demo",
    throttle: 100,
    method: "POST",
    data,
  });

  useEffect(
    () => {
      const name = nameRef.current?.value;
      if (name) setData((data) => ({ ...data, name }));
    },
    []
  );

  const setName = () => {
    const name = nameRef?.current?.value;
    if (name) {
      setData((data) => ({ ...data, name }));
      refresh();
    }
  };

  return (
    <>
      <Head>
        <title>OpenAI Completion Stream</title>
      </Head>

      <main>
        <div>
          <label>Name</label>
          <input
            ref={nameRef}
            defaultValue={data.name}
            placeholder="Type a name here..."
          />
        </div>

        <div className="w-full max-w-md p-4 rounded-lg border-solid border-2 border-gray-400">
          {/* <StreamingTextURL url="/api/demo" fade={600} throttle={100} data={data} /> */}
          <StreamingText buffer={buffer} />
        </div>

        <div className="flex flex-row">
          <button className="w-full" onClick={setName}>
            Refresh
          </button>
          <button className="w-full" onClick={cancel}>Cancel</button>
        </div>
      </main>
    </>
  );
}

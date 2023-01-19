import { Card } from "../Card";

export const CardGrid = () => {
  return (
    <div className="px-4 grid md:grid-cols-2 gap-8">
      <Card href="https://nextjs.org/learn">
        <h4>Documentation &rarr;</h4>
        <p>Find in-depth information about Next.js features and API.</p>
      </Card>

      <Card href="https://nextjs.org/learn">
        <h4>Learn &rarr;</h4>
        <p>Learn about Next.js in an interactive course with quizzes!</p>
      </Card>

      <Card href="https://github.com/vercel/next.js/tree/master/examples">
        <h4>Examples &rarr;</h4>
        <p>Discover and deploy boilerplate example Next.js projects.</p>
      </Card>

      <Card href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
        <h4>Deploy &rarr;</h4>
        <p>
          Instantly deploy your Next.js site to a public URL with Vercel.
        </p>
      </Card>
    </div>
  );
};
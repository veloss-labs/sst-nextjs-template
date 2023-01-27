import Layout from "~/components/Layout";

export default function Page() {
  return (
    <Layout>
      <article>
        <h1>Image using html image tag</h1>
        <hr />
        <img src="/images/patrick.1200x1200.png" width={100} height={100} alt="test"/>
        <p>
          <b>Test 1:</b>
          Original image dimension: 1200 x 1200. Check the dimension of the displayed image is also 1200 x 1200.
        </p>
      </article>
    </Layout>
  );
}
import React from 'react';
import Layout from '~/components/Layout';
import type { InferGetServerSidePropsType } from 'next';

export async function getServerSideProps() {
  return {
    props: {
      time: Date.now(),
    },
  };
}

export default function Page({
  time,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <article>
        <h1>Server Side Rendering (SSR)</h1>
        <hr />
        <p>
          <b>Test 1:</b>
          This timestamp 👉 {time} should change every time the page is
          refreshed, because the page is rendered on the server on every
          request.
        </p>
      </article>
    </Layout>
  );
}

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Ensures that drag-n-drop context does not persist over server renders
    // https://github.com/atlassian/react-beautiful-dnd#resetservercontext
    resetServerContext();

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Cormorant+Garamond:300|Noto+Sans:400,400i,700"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/css/swiper.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/filepond@4.2.0/dist/filepond.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

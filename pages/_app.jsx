import App, {Container} from 'next/app'
import React from 'react'

import Theme from '../components/Theme';

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render () {
    const {Component, pageProps} = this.props
    return (
      <Theme>
        <Container>
          <Component {...pageProps} />
        </Container>
      </Theme>
    )
  }
}

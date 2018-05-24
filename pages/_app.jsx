import App, {Container} from 'next/app'
import React from 'react'

import { NextAuth } from 'next-auth/client'
import Theme from '../components/Theme';

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx, req }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {
      pageProps,
      session: await NextAuth.init({req})
    }
  }

  render () {
    const {Component, pageProps, session} = this.props
    console.log("session", session)
    return (
      <Theme>
        <Container>
          <Component {...pageProps} />
        </Container>
      </Theme>
    )
  }
}

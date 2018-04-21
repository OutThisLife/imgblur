import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyCustomDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()

    return { ...page, styleTags }
  }

  render() {
    return (
      <html>
        <Head>
          <title>ImgBlur</title>

          <style>{`
            body, html {
              margin: 0;
              padding: 0;
            }

            * {
              box-sizing: border-box;
            }

            img, figure, video, iframe, svg {
              max-width: 100%;
              margin: auto;
            }
          `}</style>

          {this.props.styleTags}
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

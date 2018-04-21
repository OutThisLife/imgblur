// @flow
import { pure } from 'recompose'
import styled from 'styled-components'

import ImgBlur from '../src'

const Main = styled.main`
  --border: 10px;

  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
  padding: calc(var(--border) * 2);

  &:before {
    z-index: 2;
    pointer-events: none;
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: var(--border) solid #000;
  }

  span + span {
    margin-top: 3.5vw;
  }

  hr {
    max-width: 30%;
    margin: 3vw auto;
  }

  h1 {
    font-size: 4.35vmax;
    margin: 0 0 1vw;
  }
`

export default pure(() => (
  <Main>
    <h1>ImgBlur</h1>
    <code>&lt;ImgBlur src='/static/sample.jpg' /&gt;</code>

    <hr />

    {['sample.jpg', 'tms.jpg', 'wp2233419.jpg'].map(f => <ImgBlur key={f} src={`/static/${f}`} />)}
  </Main>
))

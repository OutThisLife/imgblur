// @flow
import { pure } from 'recompose'
import styled from 'styled-components'

import ImgBlur from '../src'

const Main = styled.main`
  text-align: center;

  span + span {
    margin-top: 3.5vw;
  }
`

export default pure(() => (
  <Main>{['sample.jpg', 'tms.jpg', 'wp2233419.jpg'].map(f => <ImgBlur key={f} src={`/static/${f}`} />)}</Main>
))

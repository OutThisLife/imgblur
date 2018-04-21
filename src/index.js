// @flow
import { compose, withProps, withState, withHandlers, type HOC } from 'recompose'
import styled from 'styled-components'

type Props = {
  src: string,
  alt?: string
}

const Container = styled(({ bg, ...props }) => <span {...props} />).attrs({
  style: ({ bg }) => ({
    background: `url(${bg}) center / cover no-repeat`
  })
})`
  display: inline-block;

  img {
    max-width: 100%;
    height: auto;
    vertical-align: top;
    transition: opacity 0.4s ease-in-out;

    &[src*='tiny'] {
      opacity: 0;
    }
  }
`

export default (compose(
  withProps(({ src }) => ({
    bg: `${src.substr(0, src.lastIndexOf('.'))}-tiny${src.substr(src.lastIndexOf('.'), src.length)}`
  })),
  withState('src', 'setSrc', ''),
  withHandlers(() => ({
    onRef: ({ bg, setSrc }) => (ref: ?HTMLImageElement) => {
      if (!ref) {
        return
      }

      const handleScroll = () => {
        if (ref instanceof HTMLImageElement) {
          const { innerHeight } = window
          const { top, height }: ClientRect = ref.getBoundingClientRect()

          if (top <= innerHeight / 1.15 && top + height > 0) {
            const $img = new window.Image()

            $img.src = bg.replace('-tiny', '')
            $img.onload = () => setSrc(() => $img.src)

            window.removeEventListener('scroll', handleScroll)
          }
        }
      }

      window.requestAnimationFrame(handleScroll)
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
  }))
): HOC<*, Props>)(({ onRef, bg, src, alt = '' }) => (
  <Container bg={bg}>
    <img ref={onRef} src={src || bg} alt={alt} />
  </Container>
))

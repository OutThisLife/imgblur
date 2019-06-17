import { useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.span`
  display: inline-block;
  background: center / cover no-repeat;

  img {
    max-width: 100%;
    height: auto;
    vertical-align: top;
    transition: opacity 0.4s ease-in-out;

    &[src*='tblur'] {
      opacity: 0;
    }
  }
`

export default ({ src: initialSrc, alt = '' }) => {
  const $img = useRef()
  const [src, setSrc] = useState()
  const bg = getBg(initialSrc)

  useLayoutEffect(
    () => {
      if (!($img.current instanceof HTMLImageElement)) {
        return
      }

      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            o.unobserve($img.current)

            const im = new Image()
            im.src = bg.replace('-tblur', '')
            im.onload = () => setSrc(im.src)
          }
        },
        {
          threshold: 0.5
        }
      )

      o.observe($img.current)
      return () => o.unobserve($img.current)
    },
    [$img]
  )

  return (
    <Container
      style={{
        backgroundImage: `url(${bg})`
      }}>
      <img ref={$img} src={src || bg} {...{ alt }} />
    </Container>
  )
}

const getBg = (src = '') =>
  src.includes('.') && `${src.substr(0, src.lastIndexOf('.'))}-tblur${src.substr(src.lastIndexOf('.'), src.length)}`

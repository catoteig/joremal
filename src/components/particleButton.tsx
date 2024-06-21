import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { ISourceOptions, MoveDirection, OutMode } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import { IconButton } from '@mui/material'
import { GiftCardIcon } from 'hugeicons-react'

const ParticleButton = () => {
  const [show, setShow] = useState(false)
  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#ea37ff',
        },
        links: {
          color: '#dc8bf3',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  )
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {})
  }, [])

  return (
    <>
      <IconButton onClick={() => setShow(!show)}>
        <GiftCardIcon />
        {show && <Particles style={{ marginLeft: 0 }} options={options} />}
      </IconButton>
    </>
  )
}
export default ParticleButton

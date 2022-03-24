import { useTexture } from '@react-three/drei'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Color, Vector3 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { lerp } from 'three/src/math/MathUtils'
import { getRandomInt } from '../../shared/util'
import './spriteShaderMaterial'
import { ZoomShader } from './zoomShader'

extend({ UnrealBloomPass, RenderPass, ShaderPass, EffectComposer })

/* Used to avoid jankiness when showZoom changes */
export const showZoom = {val: false}

/* Global parameters */
const fov = 50
const cameraDistance = 0.1
const starfieldSpawnZ = -150 // Has to be -150 because of the shader (not sure why)
const starfieldZLength = 300 // Also has to be 300 because of the shader

// Maximum number of points to render
const POINTS_COUNT = Math.floor(300_000 * Math.min(window.innerWidth / 1280, 1))

const COLORS = [
    0xa70267,
    0xf10c49,
    0xfb6b41,
    0xf6d86b,
    0x339194
]
const MAX_TIME_FACTOR = 100
const TIME_FACTOR_CHANGE = 0.02
const ZOOM_RATIO = 0.004 // Factor by which zoom is multiplied by the time factor - 1
// const fieldY = 2 * totalDistance * tanDegrees(fov / 2)
// const fieldX = fieldY * width / height
/* 200 looks better, somehow */
const fieldY = 200
const fieldX = 200 * window.innerWidth / window.innerHeight

const FullscreenDiv = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
`

const Main = () => {

    const texture = useTexture('star.png')
    const points = useRef()
    const shaderMaterial = useRef()
    const [cameraVec] = useState(() => new Vector3())
    const composer = useRef()
    const { scene, gl, size: {height, width}, camera } = useThree()
    const zoomShader = useRef()
    const timeFactor = useRef(1)

    const { positions, sizes, colors } = useMemo(() => {
        const positionArray = new Float32Array(POINTS_COUNT * 3)
        const sizesArray = new Float32Array(POINTS_COUNT)
        const colorsArray = new Float32Array(POINTS_COUNT * 3)

        for (let i = 0; i < POINTS_COUNT; i++) {
            //Positions
            let pointPosition = new Float32Array([
                Math.random() * fieldX - fieldX / 2,
                Math.random() * fieldY - fieldY / 2,
                Math.random() * -starfieldZLength
            ])

            positionArray.set(pointPosition, i * 3)

            //Sizes
            sizesArray[i] = getRandomInt(5, 20)

            //Colors
            let color = new Color()
            color.set(COLORS[getRandomInt(0, COLORS.length)])
            color.toArray(colorsArray, i * 3)
        }

        return {
            positions: positionArray,
            sizes: sizesArray,
            colors: colorsArray
        } 
    }, [])

    useEffect(() => void composer.current.setSize(width, height), [height, width])

    useFrame(({ camera, mouse }, delta) => {
        composer.current.render()
        camera.position.lerp(cameraVec.set(-mouse.x * 4, -mouse.y * 4, 0), 0.03)

        /* This is the factor by which zoom strength and particle velocity are multiplied by
        Using lerp repeatedly results in decreasing change near endpoints, a desirable effect*/
        timeFactor.current = lerp(timeFactor.current, showZoom.val ? MAX_TIME_FACTOR : 1, TIME_FACTOR_CHANGE)

        shaderMaterial.current.uTime += delta * 4 * timeFactor.current
        zoomShader.current.uniforms.strength.value = (timeFactor.current - 1) * ZOOM_RATIO
    }, 1)


    return <>
        <color attach={'background'} args={['black']} />
        <points ref={points} position={[0, 0, starfieldSpawnZ]}>
            <bufferGeometry>
                <bufferAttribute attachObject={['attributes', 'position']} array={positions} itemSize={3} count={POINTS_COUNT} />
                <bufferAttribute attachObject={['attributes', 'size']} array={sizes} itemSize={1} count={POINTS_COUNT} />
                <bufferAttribute attachObject={['attributes', 'color']} array={colors} itemSize={3} count={POINTS_COUNT} />
            </bufferGeometry>
            <spriteShaderMaterial
                ref={shaderMaterial}
                uTime={0}
                uTexture={texture}
                blending={2} //Additive blending
                depthTest={false} //No sprite occlusion
            />
        </points>
        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray="passes" scene={scene} camera={camera} />
            {/* resolution, strength, radius, threshold */}
            <unrealBloomPass attachArray="passes" args={[undefined, 2, 0, 0]} />
            <shaderPass attachArray="passes" args={[ZoomShader]} ref={zoomShader} />
        </effectComposer>
    </>
}

export const Starfield = () => <FullscreenDiv>
    <Canvas camera={{ position: [0, 0, cameraDistance], fov }}>
        <Main/>
    </Canvas>
</FullscreenDiv>
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const SpriteShaderMaterial = shaderMaterial(
  { uTime: { value: 0 }, uTexture: null },
  //Vertex shader
  `
  uniform float uTime;
  attribute vec3 color;
  attribute float size;
  attribute float velocity;
  varying vec4 vColor;
  void main(){
    vColor = vec4(color, 1.0);
    vec3 p = vec3(position);
    p.z = -150. + mod(position.z + uTime, 300.);
    vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    gl_PointSize = size * (-50.0 / mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`,
  //Fragment shader
  `
  uniform sampler2D uTexture;
  varying vec4 vColor;
  void main() {
    gl_FragColor = vColor * texture2D(uTexture, gl_PointCoord);
  }
`
);

extend({ SpriteShaderMaterial });

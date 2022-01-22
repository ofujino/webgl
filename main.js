import './style.css'
import { createShaderProgram, radians, createLoop } from './utils'
import { mat4 } from 'gl-matrix'
//import 'webgl-lint'
import vs from './shader.vs?raw'
import fs from './shader.fs?raw'

window.onload = () => {
  const canvas = document.getElementById('screen')

  canvas.width = 640
  canvas.height = 480

  const gl = canvas.getContext('webgl2')

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  //gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)
  gl.clearColor(0, 0, 0, 1)

  const mProjection = mat4.create()
  const mView = mat4.create()
  const mModel = mat4.create()

  mat4.perspective(mProjection, radians(45), canvas.width/canvas.height, 0.001, 100)
  mat4.lookAt(mView, [0,0,5], [0,0,0], [0,1,0])

  const program = createShaderProgram(gl, vs.trim(), fs.trim())

  const location = {}
  location.mProjection = gl.getUniformLocation(program, 'mProjection')
  location.mView = gl.getUniformLocation(program, 'mView')
  location.mModel = gl.getUniformLocation(program, 'mModel')

  const render = () => {
    mat4.rotateY(mModel, mModel, radians(0.5))

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.useProgram(program)
    gl.uniformMatrix4fv(location.mProjection, false, mProjection)
    gl.uniformMatrix4fv(location.mView, false, mView)
    gl.uniformMatrix4fv(location.mModel, false, mModel)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.useProgram(null)
  }

  const loop = createLoop(() => render())

  window.onblur = () => loop.stop()
  window.onfocus = () => loop.start()

  loop.start()
}


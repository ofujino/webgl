export const radians = degrees => Math.PI/180*degrees

export const degrees = radians => 180/Math.PI*radians

export const createShaderProgram = (gl, vertexShaderSource, fragmentShaderSource) => {
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
  return createProgram(gl, vertexShader, fragmentShader)
}

export const compileShader = (gl, shaderSource, shaderType) => {
  var shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    console.error(gl.getShaderInfoLog(shader))
    throw ('could not compile shader')
  }
  return shader
}

export const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
      console.error(gl.getProgramInfoLog(program))
      throw ('program failed to link')
  }
  return program
}

export const createLoop = (callback) => {
  const loop = {}
  loop.animation = null
  loop.tick = function () {
    this.animation = requestAnimationFrame((arg) => this.tick(arg))
    try {
      callback()
    } catch (err) {
      this.stop()
      console.error(err)
    }
  }
  loop.start = function () {
    if (!this.animation) {
      this.tick()
    }
  }
  loop.stop = function () {
    cancelAnimationFrame(this.animation)
    this.animation = null
  }
  return loop
}

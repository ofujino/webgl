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

export const createArrayBuffer = (gl) => {
  const buffer = {}
  const type = gl.ARRAY_BUFFER
  buffer.bufferObject = gl.createBuffer()
  buffer.begin = function () {
    gl.bindBuffer(type, this.bufferObject)
    return this
  }
  buffer.end = function () {
    gl.bindBuffer(type, null)
    return this
  }
  buffer.setSize = function (size, usage) {
    gl.bufferData(type, size, usage)
    return this
  }
  buffer.setData = function (data, usage) {
    gl.bufferData(type, data, usage)
    return this
  }
  buffer.updateData = function (offset, data) {
    gl.bufferSubData(type, offset, data)
    return this
  }
  return buffer
}

export const createShader = (gl, vs, fs) => {
  const shader = {}
  shader.program = createShaderProgram(gl, vs.trim(), fs.trim())
  shader.location = getLocations(gl, shader.program)
  shader.begin = function () {
    gl.useProgram(this.program)
    return this
  }
  shader.end = function () {
    gl.useProgram(null)
    return this
  }
  shader.setMatrix4 = function (name, value) {
    gl.uniformMatrix4fv(this.location[name], false, value)
    return this
  }
  shader.enableAttribute = function (name) {
    gl.enableVertexAttribArray(this.location[name])
    return this
  }
  shader.disableAttribute = function (name) {
    gl.disableVertexAttribArray(this.location[name])
    return this
  }
  shader.setAttributeArray = function (name, size, type, normalized, stride, offset) {
    gl.vertexAttribPointer(this.location[name], size, type, false, stride, offset)
    return this
  }
  shader.setAttribute3fv = function (name, value) {
    gl.vertexAttrib3fv(this.location[name], value)
    return this
  }
  return shader
}

const getLocations = (gl, program) => {
  const locations = {}
  const attributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  for (let i = 0; i < attributes; i++) {
    const info = gl.getActiveAttrib(program, i)
    locations[info.name] = gl.getAttribLocation(program, info.name)
  }
  const uniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < uniforms; i++) {
    const info = gl.getActiveUniform(program, i)
    locations[info.name] = gl.getUniformLocation(program, info.name)
  }
  return locations
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

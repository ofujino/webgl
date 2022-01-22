import './style.css'

window.onload = () => {
  const canvas = document.getElementById('screen')
  canvas.width = 640
  canvas.height = 480
  const gl = canvas.getContext('webgl2')
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}


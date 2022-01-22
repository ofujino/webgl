#version 300 es
const vec3 positions[] = vec3[4](
  vec3(-1,  1, 0),
  vec3(-1, -1, 0),
  vec3( 1,  1, 0),
  vec3( 1, -1, 0)
);
const vec3 colors[] = vec3[4](
  vec3(1, 0, 0),
  vec3(0, 1, 0),
  vec3(0, 0, 1),
  vec3(1, 1, 0)
);
uniform mat4 mProjection;
uniform mat4 mView;
uniform mat4 mModel;
out vec3 vColor;
void main() {
  gl_Position = mProjection * mView * mModel * vec4(positions[gl_VertexID % 4], 1);
  vColor = colors[gl_VertexID % 4];
}


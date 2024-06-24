// temos o painel dp canvas junto ao contexto
var panel = document.getElementById("panel");
var ctx = panel.getContext("webgl");              // o contexti WebGL

ctx.clearColor(0,0,0,1);
ctx.clear(ctx.COLOR_BUFFER_BIT);

// vertex shader
var vs_text = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main(void){
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;

// fragment shader
var fs_text = `
  varying lowp vec4 vColor;

  void main(){
    gl_FragColor = vColor;
  }
`;

var program = makeShader(ctx, vs_text, fs_text);

var info = {
  program : program,
  attribLocations : {
    vertexPosition : ctx.getAttribLocation(program, "aVertexPosition"),
    vertexColor : ctx.getAttribLocation(program, "aVertexColor"),
  },
  uniformLocations : {
    projectionMatrix : ctx.getUniformLocation(program, "uProjectionMatrix"),
    modelViewMatrix : ctx.getUniformLocation(program, "uModelViewMatrix"),
  }
};

// funcão que retorna um programa shader
function makeShader(ctx, vs_text, fs_text){
  var vs_shader = load(ctx, ctx.VERTEX_SHADER, vs_text);
  var fs_shader = load(ctx, ctx.FRAGMENT_SHADER, fs_text);

  // criamos um shader
  var program = ctx.createProgram();
  ctx.attachShader(program, vs_shader);
  ctx.attachShader(program, fs_shader);
  ctx.linkProgram(program);

  return program;
}

// dado um texto, retorna aquele shader
function load(ctx, shader_type, source){
  var shader = ctx.createShader(shader_type);
  // enviamos o código para o webgl context
  ctx.shaderSource(shader, source);
  // enviamos o código para o webgl context
  ctx.compileShader(shader);

  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + ctx.getShaderInfoLog(shader));
    ctx.deleteShader(shader);
    return null;
  }

  return shader;
}

// função que inicializará o buffer
function init(){
  var positionBuff = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuff);

  var positions = [
    -1,  1,
     1,  1,
    -1, -1,
     1, -1,
  ];

  ctx.bufferData(
    ctx.ARRAY_BUFFER,
    new Float32Array(positions),
    ctx.STATIC_DRAW
  );

  /////////////////////////////////////////////

  var colors = [
    1,1,1,1,
    1,1,0,1,
    1,0,1,1,
    0,1,1,1,
  ];
  var colorBuff = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, colorBuff);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(colors), ctx.STATIC_DRAW);

  return {
    position : positionBuff,
    color : colorBuff,
  };
}

////////////////////////////////////////////////////////////////////////////////

function draw(ctx, info, buffers, ){
  ctx.clearColor(0,0,0,1);
  ctx.clearDepth(1);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);

  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  var view = Math.PI / 4;                 // angulo de 60º de visao
  var asp = panel.clientWidth / panel.clientHeight;   // razão wid/hei
  var dNear = 1;                          // distancia minima visivel da camera
  var dFar = 100;                         // distancia maxima no voluma de visao
  var projectionMatrix = mat4.create();

  mat4.perspective(
    projectionMatrix,
    view,
    asp,
    dNear,
    dFar
  );

  var modelViewMatrix = mat4.create();
  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    [0,0,-8]
  );
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    rot,
    [1,1,1]
  );

  {
    var components = 2;
    var type = ctx.FLOAT;
    var normalize = false;
    var stride = 0;

    var offset = 0;
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.position);
    ctx.vertexAttribPointer(
      info.attribLocations.vertexPosition,
      components,
      type,
      normalize,
      stride,
      offset
    );
    ctx.enableVertexAttribArray(
      info.attribLocations.vertexPosition
    );
  }

  {
    var components = 4;
    var type = ctx.FLOAT;
    var normalize = false;
    var stride = false
    var offset = 0;

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.color);
    ctx.vertexAttribPointer(
      info.attribLocations.vertexColor,
      components,
      type,
      normalize,
      stride,
      offset,
    );
    ctx.enableVertexAttribArray(
      info.attribLocations.vertexColor
    );
  }

  ctx.useProgram(info.program);

  ctx.uniformMatrix4fv(
    info.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  ctx.uniformMatrix4fv(
    info.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    var offset = 0;
    var vertexCount = 4;
    ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount);
  }

}

////////////////////////////////////////////////////////////////////////////////

var rot = 0;
function render(){
  draw(ctx, info, buffers, rot);

  rot+=0.01;
}

function main(){
  buffers = init(ctx);

  setInterval(render, 10);
}

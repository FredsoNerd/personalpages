// temos o painel dp canvas junto ao contexto
var panel = document.getElementById("panel");
var ctx = panel.getContext("webgl");              // o contexti WebGL

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

  return shader;
}

// função que inicializará o buffer
function init(){
  var positionBuff = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuff);

  var positions = [
     1, 1, 1,  1, 1,-1, -1, 1,-1, -1, 1, 1, // frente y = 1
     1,-1, 1,  1,-1,-1, -1,-1,-1, -1,-1, 1, // traz   y =-1

     1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1, // cima   z = 1
     1, 1,-1, -1, 1,-1, -1,-1,-1,  1,-1,-1, // baixo  z =-1

     1, 1, 1,  1,-1, 1,  1,-1,-1,  1, 1,-1, // lado   x = 1
    -1, 1, 1, -1,-1, 1, -1,-1,-1, -1, 1,-1 // lado   x =-1
  ];
  ctx.bufferData(
    ctx.ARRAY_BUFFER,
    new Float32Array(positions),
    ctx.STATIC_DRAW
  );

  var all_color = [
    [1,1,1,1],      // frente  ok
    [1,0,1,1],      // magenta ok
    [1,1,0,1],      // yellow
    [1,0,0,1],      // red
    [0,1,1,1],      // cyan    ok
    [0,0,1,1]       // blue    ok
  ];

  var colors = [];
  for(let i in all_color){
    var c = all_color[i];
    colors = colors.concat(c,c,c,c);
  }
  /*
  for(let i in all_color){
    colors = colors.concat(
      all_color[Math.floor(Math.random() * all_color.length)],
      all_color[Math.floor(Math.random() * all_color.length)],
      all_color[Math.floor(Math.random() * all_color.length)],
      all_color[Math.floor(Math.random() * all_color.length)]
    );
  }*/

  var colorBuff = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, colorBuff);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(colors), ctx.STATIC_DRAW);

  //////////////////////////////////////////////////////////////////////////////
  var indBuff = ctx.createBuffer();
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indBuff);

  var index = [
     0, 1, 2,  0, 2, 3, // frente
     4, 5, 6,  4, 6, 7, // traz
     8, 9,10,  8,10,11, // cima
    12,13,14, 12,14,15, // baixo
    16,17,18, 16,18,19, // lado
    20,21,22, 20,22,23  // outro
  ]

  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), ctx.STATIC_DRAW);

  return {
    position : positionBuff,
    color : colorBuff,
    indices : indBuff,
  };
}
////////////////////////////////////////////////////////////////////////////////

function draw(ctx, info, buffers, rot){
  //ctx.clearColor(0.9,0.9,0.9,1);
  ctx.clearColor(0,0,0,1);
  ctx.clearDepth(1);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);

  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  var view = Math.PI / 4;                 // angulo de 60º de visao
  var asp = panel.clientWidth / panel.clientHeight;   // razão wid/hei
  var dNear = 0.1;                          // distancia minima visivel da camera
  var dFar = 100;                         // distancia maxima no voluma de visao
  var projectionMatrix = mat4.create();
  //mat4.perspective(FoV , gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
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
    [0,0,-d]
  );
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    rot,
    [vx,vy,vz]
  );
  {
    var components = 3;
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
    var stride = 0;
    var offset = 0;

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.color);
    ctx.vertexAttribPointer(
      info.attribLocations.vertexColor,
      components,
      type,
      normalize,
      stride,
      offset
    );
    ctx.enableVertexAttribArray(
      info.attribLocations.vertexColor
    );
  }

  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffers.indices);

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
    var count = 36;
    var type = ctx.UNSIGNED_SHORT;
    var offset = 0;
    ctx.drawElements(ctx.TRIANGLES, count, type, offset);
  }
}


var rot = 0;
var vx = 1;
var vy = 1;
var vz = 1;
var d = 8;
var speed = 0.01;
function render(){
  draw(ctx, info, buffers, rot);

  rot+=parseFloat(speed);
}
function rotate(element){ speed = element.value;}
function distance(element) { d = element.value;}
function xspeed(element){ vx = element.value;}
function yspeed(element){ vy = element.value;}
function zspeed(element){ vz = element.value;}

function main(){
  buffers = init(ctx);

  setInterval(render, 10);
}

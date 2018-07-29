// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine,
    options:{
        // background: 'transparent',
        background: '#222',
        showVelocity: true,
        wireframes: false
    }
});

var ground = Bodies.rectangle(400, 600, 810, 40, { isStatic: true });
var ceiling = Bodies.rectangle(400, 0, 810, 40, { isStatic: true });
var leftWall = Bodies.rectangle(0, 120, 40, 1000, { isStatic: true });
var rightWall = Bodies.rectangle(800, 120, 40, 1000, { isStatic: true });

function generateCircles(){
    var numCircles = Math.floor(Math.random() * 5) + 1;
    var circles = [];

    for (i = 0; i < numCircles; i++){
        var x_coord = Math.floor(Math.random() * 700);
        var y_coord = Math.floor(Math.random() * 500);

        var fillColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        var strokeColor = '#'+Math.floor(Math.random()*16777215).toString(16);

        var ball = Bodies.circle(x_coord, y_coord, 30, {
          density: 0.04,
          friction: 0.00,
          frictionAir: 0.0000,
          restitution: 1.0,
          inertia: Infinity,
          render: {
            fillStyle: fillColor,
            strokeStyle: strokeColor,
            lineWidth: 2
          }
        });

        x_sign = [-1, 1][Math.floor(Math.random() * 2)];
        y_sign = [-1, 1][Math.floor(Math.random() * 2)];

        x_velocity = Math.floor(Math.random() * 16) * x_sign;
        y_velocity = Math.floor(Math.random() * 16) * y_sign;

        Body.setVelocity(ball, { x: x_velocity, y: y_velocity })
        circles.push(ball)
    }

    World.add(engine.world, circles);
}

generateCircles();

// add all of the bodies to the world
World.add(engine.world, [ground, ceiling, leftWall, rightWall]);
engine.world.gravity.y = 0;

Engine.run(engine);
Render.run(render);

// RECORD CANVAS
let mediaRecorder;
let recordedBlobs;

const canvas = document.querySelector('canvas');

const stream = canvas.captureStream();
console.log('Started stream capture from canvas element: ', stream);

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  let options = { mimeType: 'video/webm' };
  recordedBlobs = [];

  mediaRecorder = new MediaRecorder(stream, options);

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(100); // collect 100ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
}

function download() {
    const blob = new Blob(recordedBlobs, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test_' + localStorage.getItem("sampleCount") + '.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

function stopAndDownload() {
    if (!localStorage.getItem("sampleCount")){
        localStorage.setItem("sampleCount", 0);
        console.log(localStorage.getItem("sampleCount"));
    } else {
        previous_count = parseInt(localStorage.getItem("sampleCount"));
        localStorage.setItem("sampleCount", previous_count + 1);
        console.log(localStorage.getItem("sampleCount"));
    }

    stopRecording();
    download();
    setTimeout(refreshPage, 3000);
}

function refreshPage() {
    window.location.reload();
}

startRecording();
setTimeout(stopAndDownload, 6000);

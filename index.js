// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options:{
        showVelocity: true
    }
});

// create two boxes and a ground
var ground = Bodies.rectangle(400, 600, 810, 40, { isStatic: true });
var ceiling = Bodies.rectangle(400, 0, 810, 40, { isStatic: true });
var leftWall = Bodies.rectangle(0, 120, 40, 1000, { isStatic: true });
var rightWall = Bodies.rectangle(800, 120, 40, 1000, { isStatic: true });

function generateCircles(){
    var numCircles = Math.floor(Math.random() * 5) + 1;
    var circles = [];

    for (i = 0; i < numCircles; i++){
        x_coord = Math.floor(Math.random() * 700);
        y_coord = Math.floor(Math.random() * 500);

        var ball = Bodies.circle(x_coord, y_coord, 30, {
          density: 0.04,
          friction: 0.00,
          frictionAir: 0.0000,
          restitution: 1.0,
          inertia: Infinity,
          render: {
            fillStyle: '#F35e66',
            strokeStyle: 'green',
            lineWidth: 1
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

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

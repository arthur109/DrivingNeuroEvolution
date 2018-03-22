var bob;
var tileSize;
var offset;
var genSize = 100;
var orgs = []
var fittest = []
var organismCounter = genSize
var genCount = 1;
var timerTime = 700;
var timerCounter = 0;
var CIRCLE = Math.PI * 2;
var mutationProb = 0.03
world = [
  [0, 0, 21, 22, 23, 24, 25, 26, 0],
  [0, 0, 20, 0, 0, 0, 0, 27, 0],
  [0, 0, 19, 18, 17, 16, 0, 28, 0],
  [0, 0, 0, 0, 0, 15, 0, 29, 0],
  [9, 10, 11, 12, 14, 14, 0, 30, 0],
  [8, 0, 0, 0, 0, 0, 0, 31, 0],
  [7, 6, 5, 4, 3, 0, 0, 32, 0],
  [0, 0, 0, 0, 2, 0, 0, 33, 0],
  [0, 0, 0, 0, 1, 0, 0, 34, 0]
]
var startPos = {
  x: 4.5,
  y: 8.5
}

function displayMap(scale) {
  stroke(35)
  strokeWeight(scale / 15)
  for (var y = 0; y < world.length; y++) {
    for (var x = 0; x < world[y].length; x++) {
      if (world[y][x] == 0) {
        fill(25)
      } else {
        fill(245, 240, 237)
      }
      rect(offset.x + x * scale, offset.y + y * scale, scale, scale)
    }
  }
}

function calcTileSize(xlength, ylength) {
  if (xlength >= ylength) {
    return ((ylength / world.length))
  } else {
    return ((xlength / world.length))
  }
}

function calcOffest(xlength, ylength, worldLength, tileSize) {
  return {
    x: (xlength - (worldLength * tileSize)) / 2,
    y: (ylength - (worldLength * tileSize)) / 2
  }
}

function TileToPixelX(arrayPos) {
  return offset.x + (arrayPos * tileSize)
}

function TileToPixelY(arrayPos) {
  return offset.y + (arrayPos * tileSize)
}

function TileToPixel(arrayPos) {
  return (arrayPos * tileSize)
}

function createGeneration(generationSize) {
  for (var i = 0; i < generationSize; i++) {
    orgs.push({
      score: 0,
      animal: new Org(startPos.x, startPos.y, i)
    })
  }
}

function killAll() {
  for (var i = 0; i < orgs.length; i++) {
    orgs[i].animal.die();
  }
}

function runGeneration() {
  for (var i = 0; i < orgs.length; i++) {
    orgs[i].animal.run();
  }
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function look(x, y) {
  if (y > world.length - 1 || x < 0 || y < 0) {
    return 0;
  } else if (x > world[y].length - 1) {
    return 0;
  }
  return world[y][x];
}

function createNewGeneration(generationSize) {
  genCount++;
  orgs.length = 0
  for (var i = 0; i < generationSize; i++) {
    this.rand = fittest[Math.floor(Math.random() * fittest.length)].copy();
    //console.log(this.rand)
    this.rand.mutate(mutationProb)
    //console.log(this.rand)
    this.temp = new Org(startPos.x, startPos.y, i)
    this.temp.brain = this.rand
    orgs.push({
      score: 0,
      animal: temp
    })
  }
}

function ray(xpos, ypos, xspeed, yspeed, limit) {
  this.tempX = xpos
  this.tempY = ypos
  for (var i = 0; i < limit; i++) {
    this.value = look(Math.floor(tempX), Math.floor(tempY))
    //print("ran ray")
    //print(this.value)
    // stroke(0)
    // strokeWeight(TileToPixel(0.02))

    // line(TileToPixelX(xpos), TileToPixelY(ypos), TileToPixelX(xpos + xspeed * 2.5), TileToPixelY(ypos + yspeed * 2.5))
    if (this.value == 0) {
      //print("drew line");
      //ellipse(TileToPixelX(this.tempX), TileToPixelY(this.tempY), 5, 5)
      return (dist(xpos, ypos, this.tempX, this.tempY))
    }
    this.tempX = this.tempX + xspeed
    this.tempY = this.tempY + yspeed
  }
  return ("none")
}

function findFittest(generation) {
  organismCounter = genSize
  fittest.length = 0
  this.maxFit = 0
  for (var i = 0; i < generation.length; i++) {
    if (generation[i].score > maxFit) {
      this.maxFit = generation[i].score
    }
  }
  for (var i = 0; i < generation.length; i++) {
    if (generation[i].score >= this.maxFit) {
      this.specimen = generation[i].animal.brain.copy()
      fittest.push(this.specimen)
    }
  }
}

function setup() {
  noSmooth()
  noStroke();
  //frameRate(1)
  createCanvas(windowWidth, windowHeight);
  createGeneration(genSize)
}

function draw() {
  tileSize = calcTileSize(windowWidth, windowHeight)
  offset = calcOffest(windowWidth, windowHeight, world.length, tileSize)
  background(255)
  displayMap(tileSize)
  fill(255)
  text("generation: " + genCount, TileToPixelX(0.5), TileToPixelY(0.5))
  text("timer: " + timerCounter, TileToPixelX(0.5), TileToPixelY(0.8))
  runGeneration();
  timerCounter = timerCounter + 1;
  if (organismCounter == 0 || timerCounter >= timerTime) {
    killAll();
    findFittest(orgs);
    createNewGeneration(genSize)
    timerCounter = 0;
  }
}

class Org {
  constructor(x, y, id) {
    this.existenceIndex = id
    this.radius = 0.1;
    this.direction = createVector(0, 0);
    this.speed = 0;
    this.position = createVector(x, y);
    this.uniqueColor = color(random(0, 255), random(0, 255), random(0, 255), 200)
    this.alive = true
    this.input = {
      left: 0,
      midleft: 0,
      forward: 0,
      midright: 0,
      right: 0
    }
    this.basicRotation = 22;
    this.radians = ((this.basicRotation / 5) + CIRCLE) % (CIRCLE);
    this.direction.set(cos(this.radians), sin(this.radians))
    this.brain = new NeuralNetwork(5, 4, 2)
    //console.log(this.brain)
    this.futureMove = []
  }
  move() {
    this.basicRotation = this.basicRotation + this.futureMove[0]
    //console.log(this.futureMove[0], this.futureMove[1])
    this.speed = this.speed + this.futureMove[1]
    this.speed = clamp(this.speed, -0.05, 0.05)
    this.radians = ((this.basicRotation / 5) + CIRCLE) % (CIRCLE);
    this.direction.set(cos(this.radians), sin(this.radians))
    this.position.add(p5.Vector.mult(this.direction, this.speed));
  }
  deathCheck() {
    if (look(Math.floor(this.position.x), Math.floor(this.position.y)) == 0) {
      this.die();
    }
  }
  die() {
    if (this.alive == true) {
      this.position.sub(p5.Vector.mult(this.direction, this.speed))
      this.score = look(Math.floor(this.position.x), Math.floor(this.position.y))
      orgs[this.existenceIndex].score = this.score
      //console.log(this.score)
      organismCounter--;
      this.alive = false
    }
  }
  see(accuracy) {
    this.midDir = createVector(cos(this.radians - (CIRCLE / 2) / 4), sin(this.radians - (CIRCLE / 2) / 4))
    //print("saw")
    this.input.left = ray(this.position.x, this.position.y, this.direction.y * accuracy, this.direction.x * -accuracy, 200)
    this.input.midleft = ray(this.position.x, this.position.y, this.midDir.x * accuracy, this.midDir.y * accuracy, 200)
    this.input.forward = ray(this.position.x, this.position.y, this.direction.x * accuracy, this.direction.y * accuracy, 200)
    this.input.midright = ray(this.position.x, this.position.y, this.midDir.y * -accuracy, this.midDir.x * accuracy, 200)
    this.input.right = ray(this.position.x, this.position.y, this.direction.y * -accuracy, this.direction.x * accuracy, 200)
    this.futureMove = this.brain.predict([this.input.left, this.input.midleft, this.input.forward, this.input.midright, this.input.right])
    //console.log(this.input)
    //console.log(this.futureMove)
  }
  render() {
    stroke("#fcbf49")
    fill(this.uniqueColor)
    line(TileToPixelX(this.position.x - this.direction.x * 0.1), TileToPixelY(this.position.y - this.direction.y * 0.1), TileToPixelX(this.position.x + this.direction.x * 0.1), TileToPixelY(this.position.y + this.direction.y * 0.1))
    noStroke();
    //ellipse(TileToPixelX(this.position.x), TileToPixelY(this.position.y), TileToPixel(this.radius * 2), TileToPixel(this.radius * 2))
  }
  run() {
    if (this.alive) {
      this.see(0.05)
      this.move();
      this.deathCheck();
      this.render();
    }
  }
}
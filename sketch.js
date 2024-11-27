let grid = [];
let cols, rows;
let size = 10;

let words = ["thIs", "iS", "soOOo", "iNtErActiVe"];
let font;
let wordPoints = [];
let currentWordIndex = 0; // Index of the current word to fill
let timer = 0; // Timer for switching words

let noiseOffsetX = 0; // Offset for Perlin noise animation on X
let noiseOffsetY = 100; // Offset for Perlin noise animation on Y
let noiseOffsetZ = 200; // Offset for Perlin noise animation on Z

class Cell {
  constructor(i, j, size) {
    this.i = i;
    this.j = j;
    this.size = size;
    this.x = i * size;
    this.y = j * size;
  }

  show(color, noiseValue) {
    stroke(color);
    noFill();

    // Add Perlin noise to position using X, Y, and Z axes
    let offsetX = map(
      noise(noiseValue, this.i * 0.1, frameCount * 0.01),
      0,
      1,
      -size / 2,
      size / 2
    );
    let offsetY = map(
      noise(noiseValue + noiseOffsetY, this.j * 0.1, frameCount * 0.01),
      0,
      1,
      -size / 2,
      size / 2
    );
    let offsetZ = map(
      noise(noiseValue + noiseOffsetZ, this.i * 0.1, this.j * 0.1),
      0,
      1,
      -size / 3,
      size / 3
    );

    circle(this.x + offsetX, this.y + offsetY + offsetZ, this.size, this.size);
  }

  fill(color, noiseValue) {
    noStroke();
    fill(color);


    // Add Perlin noise to position using X, Y, and Z axes
    let offsetX = map(
      noise(noiseValue, this.i * 0.1, frameCount * 0.01),
      0,
      1,
      -size / 2,
      size / 2
    );

    // Map offset to mouse X position
    offsetX = map(mouseX, 0, width, -size / 2, size / 2);

    let offsetY = map(
      noise(noiseValue + noiseOffsetY, this.j * 0.1, frameCount * 0.01),
      0,
      1,
      -size / 2,
      size / 2
    );

    // Map offset to mouse Y position
    offsetY = map(mouseY, 0, height, -size / 2, size / 2);

    let offsetZ = map(
      noise(noiseValue + noiseOffsetZ, this.i * 0.1, this.j * 0.1),
      0,
      1,
      -size / 3,
      size / 3
    );

    circle(this.x + offsetX, this.y + offsetY + offsetZ, this.size, this.size);
  }
}

function preload() {
  font = loadFont('Maax Mono - Bold-205TF.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  cols = floor(width / size);
  rows = floor(height / size);

  // Create grid
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, size);
    }
  }

  convertWordsToPoints();
}

function draw() {
  background(0);

  // Display grid with Perlin noise
  displayGridWithNoise();

  // Display light gray text with Perlin noise
  displayLightGrayTextWithNoise();

  // Highlight current word points with white fill
  let currentWordPoints = wordPoints[currentWordIndex];
  for (let pt of currentWordPoints) {
    let i = floor(pt.x / size);
    let j = floor(pt.y / size);

    grid[i][j].fill(255, noiseOffsetX);
  }

  // Increment the timer and switch words every second
  timer++;
  if (timer > frameRate()) {
    timer = 0;
    currentWordIndex = (currentWordIndex + 1) % wordPoints.length;
  }

  // Increment noise offsets for animation
  noiseOffsetX += 0.01;
  noiseOffsetY += 0.01;
  noiseOffsetZ += 0.01;
}

function displayGridWithNoise() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(50, noiseOffsetX); // Light gray with Perlin noise
    }
  }
}

function displayLightGrayTextWithNoise() {
  for (let wp of wordPoints) {
    for (let pt of wp) {
      let i = floor(pt.x / size);
      let j = floor(pt.y / size);

      if (i >= 0 && i < cols && j >= 0 && j < rows) {
        grid[i][j].show(150, noiseOffsetX); // Slightly brighter gray for text
      }
    }
  }
}

function convertWordsToPoints() {
  let y = 200;

  for (let i = 0; i < words.length; i++) {
    let wp = font.textToPoints(words[i], 100, y, 200, { sampleFactor: 0.5 });
    wordPoints.push(wp);

    y += height / words.length - 20;
  }
}

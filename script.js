const htmlElement = document.querySelector("html");
const areaElement = document.querySelector(".area");

const areaSize = 720;
const boxSize = 36;

htmlElement.style.setProperty("--areaSize", `${areaSize}px`);
htmlElement.style.setProperty("--boxSize", `${boxSize}px`);

const getRandomInteger = (max) => Math.floor(Math.random() * max);
const convertDegreesToRadians = (degrees) => degrees * (Math.PI / 180);
const convertRadiansToDegrees = (radians) => radians * (180 / Math.PI);

const createBox = (index) => {
  const contents = ["rock", "paper", "scissors"];
  return {
    id: `box-${index}`,
    content: contents[index % contents.length],
    position: {
      x: getRandomInteger(areaSize - boxSize),
      y: getRandomInteger(areaSize - boxSize),
    },
    angle: getRandomInteger(360),
  };
};

const createBoxElement = (box) => {
  const boxElement = document.createElement("div");
  boxElement.id = box.id;
  boxElement.className = `box content-${box.content}`;
  areaElement.appendChild(boxElement);
  return boxElement;
};

const checkIfBoxExceeded = (box) => ({
  // left - right
  negativeX: box.position.x <= 0,
  positiveX: box.position.x >= areaSize - boxSize,
  // top - bottom
  positiveY: box.position.y <= 0,
  negativeY: box.position.y >= areaSize - boxSize,
});

const checkIfBoxesCollided = (boxA, boxB) => ({
  axisX:
    boxA.position.x <= boxB.position.x + boxSize &&
    boxA.position.x + boxSize >= boxB.position.x,
  axisY:
    boxA.position.y <= boxB.position.y + boxSize &&
    boxA.position.y + boxSize >= boxB.position.y,
});

const moveBoxes = () => {
  const delay = 1000 / 60;
  const boxes = [];
  for (let i = 0; i < 24; i++) boxes.push(createBox(i));

  setInterval(() => {
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const boxElement = document.querySelector(`#${box.id}`) || createBoxElement(box);

      box.position.x += Math.cos(convertDegreesToRadians(box.angle)) * 1.5;
      box.position.y += Math.sin(convertDegreesToRadians(box.angle)) * 1.5;

      const { negativeX, positiveX, positiveY, negativeY } = checkIfBoxExceeded(box);

      if (negativeX || positiveX) {
        box.angle = (180 - box.angle) % 360;
        box.position.x = negativeX ? 0 : areaSize - boxSize;
      }

      if (positiveY || negativeY) {
        box.angle = (360 - box.angle) % 360;
        box.position.y = positiveY ? 0 : areaSize - boxSize;
      }

      for (let j = 0; j < boxes.length; j++) {
        const boxA = box, boxAElement = boxElement;
        const boxB = boxes[j];
        const { axisX, axisY } = checkIfBoxesCollided(boxA, boxB);

        if (i !== j && axisX && axisY) {
          if (
            (boxA.content === "rock" && boxB.content === "paper") ||
            (boxA.content === "paper" && boxB.content === "scissors") ||
            (boxA.content === "scissors" && boxB.content === "rock")
          ) {
            boxA.content = boxB.content;
            boxAElement.className = `box content-${boxB.content}`;
          }

          setTimeout(() => {
            boxA.angle = convertRadiansToDegrees(
              Math.atan2(
                boxB.position.y - boxA.position.y,
                boxB.position.x - boxA.position.x
              )
            ) + 180;
          }, delay);
        }
      }

      boxElement.style.transform = `translate(${box.position.x}px, ${box.position.y}px)`;
    }
  }, delay);
};

moveBoxes();

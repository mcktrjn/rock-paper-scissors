const htmlElement = document.querySelector("html");
const areaElement = document.querySelector(".area");

const areaSize = 480;
const boxSize = 24;

htmlElement.style.setProperty("--areaSize", `${areaSize}px`);
htmlElement.style.setProperty("--boxSize", `${boxSize}px`);

const boxes = [];
const contents = ["rock", "paper", "scissors"];

const getRandomInteger = (max) => Math.floor(Math.random() * max);

for (let i = 0; i < 36; i++) {
  boxes.push({
    id: `box-${i}`,
    content: contents[i % contents.length],
    position: {
      x: getRandomInteger(areaSize - boxSize),
      y: getRandomInteger(areaSize - boxSize),
    },
    angle: getRandomInteger(360),
  });
}

const createBox = (box) => {
  const boxElement = document.createElement("div");
  boxElement.id = box.id;
  boxElement.className = "box";
  boxElement.style.backgroundImage = `url(./${box.content}.png)`;
  areaElement.appendChild(boxElement);
  return boxElement;
};

const checkIfBoxHitArea = (box) => ({
  // left - right
  negativeX: box.position.x <= 0,
  positiveX: box.position.x >= areaSize - boxSize,
  // top - bottom
  positiveY: box.position.y <= 0,
  negativeY: box.position.y >= areaSize - boxSize,
});

const checkIfBoxHitBox = (boxA, boxB) => ({
  axisX:
    boxA.position.x <= boxB.position.x + boxSize &&
    boxA.position.x + boxSize >= boxB.position.x,
  axisY:
    boxA.position.y <= boxB.position.y + boxSize &&
    boxA.position.y + boxSize >= boxB.position.y,
});

const reflectBoxAngle = (angle, axis) => {
  const degrees = axis === "x" ? 180 : 360;
  return (degrees - angle) % 360;
};

const moveBoxes = () => {
  boxes.forEach((box, index) => {
    const boxElement = createBox(box);
    let { position, angle } = box;

    setInterval(() => {
      position.x += Math.cos(angle * (Math.PI / 180)) * 2;
      position.y += Math.sin(angle * (Math.PI / 180)) * 2;

      const { negativeX, positiveX, positiveY, negativeY } = checkIfBoxHitArea(box);

      if (negativeX || positiveX) {
        angle = reflectBoxAngle(angle, "x");
        position.x = negativeX ? 0 : areaSize - boxSize;
      }

      if (positiveY || negativeY) {
        angle = reflectBoxAngle(angle, "y");
        position.y = positiveY ? 0 : areaSize - boxSize;
      }

      for (let i = 0; i < boxes.length; i++) {
        const boxA = box;
        const boxB = boxes[i];
        const { axisX, axisY } = checkIfBoxHitBox(boxA, boxB);

        if (index !== i && axisX && axisY) {
          if (
            (boxA.content === "rock" && boxB.content === "scissors") ||
            (boxA.content === "paper" && boxB.content === "rock") ||
            (boxA.content === "scissors" && boxB.content === "paper")
          ) {
            const boxBElement = document.querySelector(`#box-${i}`);
            boxB.content = boxA.content;
            boxBElement.style.backgroundImage = `url(./${boxA.content}.png)`;
          }
        }
      }

      boxElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }, 1000 / 60);
  });
};

moveBoxes();

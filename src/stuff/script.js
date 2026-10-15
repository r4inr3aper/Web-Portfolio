const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const collisonsMap = [];

const offset = { x: -740, y: -650 };

for (let i = 0; i < collisons.length; i += 70) {
  collisonsMap.push(collisons.slice(i, 70 + i));
}

const boundaries = [];

collisonsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const image = new Image();
image.src = "./img/Pellet Town.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundImage.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 8,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: { max: 4 },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
});

const bg = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
});

const forebg = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: foregroundImage,
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

// Ensure images are loaded before animation starts
image.onload = () => {
  playerDownImage.onload = () => {
    animate();
  };
};

const moveables = [bg, ...boundaries, forebg];

function rectCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  );
}
  
  function animate() {
    window.requestAnimationFrame(animate);

    bg.draw();
    boundaries.forEach((boundary) => {
      boundary.draw();
    });
    player.draw();
    forebg.draw()
  
    let moving = true;
    player.moving = false
  
    // Collision detection for moving up
    if (keys.w.pressed && lastKey === "w") {
        player.moving = true
        player.image = player.sprites.up
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectCollision({
            rect1: player,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y + 4, // Offset for upward movement
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) {
        moveables.forEach((moveable) => {
          moveable.position.y += 4;
        });
      }
    }
  
    // Collision detection for moving down
    if (keys.s.pressed && lastKey === "s") {
        player.moving = true
        player.image = player.sprites.down
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectCollision({
            rect1: player,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y - 4, // Offset for downward movement
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) {
        moveables.forEach((moveable) => {
          moveable.position.y -= 4;
        });
      }
    }
  
    // Collision detection for moving left
    if (keys.a.pressed && lastKey === "a") {
        player.moving = true
        player.image = player.sprites.left
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectCollision({
            rect1: player,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x + 4, // Offset for leftward movement
                y: boundary.position.y,
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) {
        moveables.forEach((moveable) => {
          moveable.position.x += 4;
        });
      }
    }
  
    // Collision detection for moving right
    if (keys.d.pressed && lastKey === "d") {
        player.moving = true
        player.image = player.sprites.right
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          rectCollision({
            rect1: player,
            rect2: {
              ...boundary,
              position: {
                x: boundary.position.x - 4, // Offset for rightward movement
                y: boundary.position.y,
              },
            },
          })
        ) {
          moving = false;
          break;
        }
      }
      if (moving) {
        moveables.forEach((moveable) => {
          moveable.position.x -= 4;
        });
      }
    }
  }
  
let lastKey = "";

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

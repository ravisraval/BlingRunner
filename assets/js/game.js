function init() {
  game = new Game();
  game.setup();
}

class Game {
  constructor() {
    this.handleTick = this.handleTick.bind(this);
    this.flashReset = this.flashReset.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.handleBlingCollect = this.handleBlingCollect.bind(this);
    this.handleLevelOver = this.handleLevelOver.bind(this);
    this.handleGameOver = this.handleGameOver.bind(this);
    this.setup = this.setup.bind(this);
    this.accel = 2;
    this.maxSpeed = 10;
    this.scrollSpeed = 5;
    // this.hlines = [];
    this.blings = {};
    this.blingCountdownStart = 200;
    this.blingCountdown = this.blingCountdownStart;
    this.blingCount = 0;
    this.userScore = 0;
    this.hitBling = false;
    this.levelBlingCount = 10;
    this.levelMusic = "assets/audio/background.mp3"
    this.level = 1;
    this.levelScoreMin = 20;
  }

  handleBlingCollect(bling) {
    this.userScore += 1;
    this.stage.removeChild(bling);
  }

  handleTick(event) {
    this.blingCountdown -= 10;
    if (this.blingCountdown === 0) {
      createjs.Sound.play("background");
      this.blingCountdown = this.blingCountdownStart;
      this.spot = Math.floor(Math.random(5) * 5);
      let x = 100 * this.spot + 18;
      let color = "";
      switch (this.spot) {
        case 0:
          color = "#f20d09";
          break;
        case 1:
          color = "#ffa514";
          break;
        case 2:
          color = "#fce516";
          break;
        case 3:
          color = "#71ed12";
          break;
        case 4:
          color = "#1990ea";
          break;
      }
      let graphics = new createjs.Graphics().beginFill(color).drawRect(0, 0, 64, 64);
      this.blings[this.blingCount] = new createjs.Shape(graphics);
      this.blings[this.blingCount].crossOrigin = "Anonymous";
      this.blings[this.blingCount].x = 100 * this.spot + 18;
      this.stage.addChild(this.blings[this.blingCount]);
      this.blingCount += 1;
      createjs.Sound.play("blingCreate");
    }
    if (this.blingCount > 0) {
      let fn = this;
      for(let i = 0; i < this.blingCount; i++) {
        fn.hitBling = false;
        fn.blings[i].y += fn.scrollSpeed;
        if (ndgmr.checkRectCollision(fn.blings[i], fn.userCar)) {
          fn.stage.removeChild(fn.blings[i]);
          fn.userScore += 1;
          fn.hitBling = true;
          console.log(fn.userScore);
        }
      }
    }
    //FUTURE: modify so user can catch last blings
    if (this.blingCount === this.levelBlingCount) { this.handleLevelOver() };
    //set top speed
    if (this.yMomentum >= this.maxSpeed) {
      this.yMomentum = this.maxSpeed;
    }
    if (this.xMomentum >= this.maxSpeed) {
      this.xMomentum = this.maxSpeed;
    }
    //bounce off top & bottom walls
    if (this.userCar.y > 485) { this.yMomentum = this.yMomentum * -.4; this.userCar.y = 485 };
    if (this.userCar.y < -12) { this.yMomentum = this.yMomentum * -.4; this.userCar.y = -12};

    this.userCar.skewX = this.xMomentum / 3;
    this.userCar.x += this.xMomentum;
    this.userCar.y += this.yMomentum;
    //slowing friction
    if (this.yMomentum > 0) { this.yMomentum -= 1};
    if (this.yMomentum < 0) { this.yMomentum += 1};
    if (this.xMomentum > 0) { this.xMomentum -= 1};
    if (this.xMomentum < 0) { this.xMomentum += 1};
    //warp left & right
    if (this.userCar.x > this.stage.canvas.width - 30) { this.userCar.x = -80};
    if (this.userCar.x < -80) { this.userCar.x = this.stage.canvas.width - 30};

    this.stage.update();
  }

  setup() {
    let queue = new createjs.LoadQueue(false);
    queue.loadFile({id: "blingCreate", src: "assets/audio/blingSpawn.mp3"})
    createjs.Sound.registerSound("assets/audio/blingSpawn.mp3", "blingCreate");
    createjs.Sound.registerSound(this.levelMusic, "background", 1);
    this.xMomentum = 0;
    this.yMomentum = 0;
    this.canvas = document.getElementById("canvas");
    this.stage = new createjs.Stage(this.canvas);
    this.drawVertLines();
    this.userCar = new createjs.Bitmap("assets/images/Topdown_vehicle_sprites_pack/Black_viper.png");
    this.userCar.crossOrigin = "Anonymous";
    this.userCar.setTransform(190,480,.5,.5);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    this.stage.addChild(this.userCar, this.pauseText);
    this.stage.update();
    this.paused = false;
    this.handleKeyPress();
    // this.drawHorizLines();
  }

  drawHorizLines() {
    this.hline1 = new createjs.Shape();
    this.hline1.crossOrigin = "Anonymous";
    this.stage.addChild(this.hline1);
    this.hline1.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline1.graphics.moveTo(0,0);
    this.hline1.graphics.lineTo(500,0);
    this.hline1.graphics.endStroke();

    this.hline2 = new createjs.Shape();
    this.hline2.crossOrigin = "Anonymous";
    this.stage.addChild(this.hline2);
    this.hline2.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline2.graphics.moveTo(0,100);
    this.hline2.graphics.lineTo(500,100);
    this.hline2.graphics.endStroke();

    this.hline3 = new createjs.Shape();
    this.hline3.crossOrigin = "Anonymous";
    this.stage.addChild(this.hline3);
    this.hline3.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline3.graphics.moveTo(0,200);
    this.hline3.graphics.lineTo(500,200);
    this.hline3.graphics.endStroke();

    this.hline4 = new createjs.Shape();
    this.hline4.crossOrigin = "Anonymous";
    this.stage.addChild(this.hline4);
    this.hline4.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline4.graphics.moveTo(0,300);
    this.hline4.graphics.lineTo(500,300);
    this.hline4.graphics.endStroke();

    this.hline5 = new createjs.Shape();
    this.hline5.crossOrigin = "Anonymous";
    this.stage.addChild(this.hline5);
    this.hline5.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline5.graphics.moveTo(0,400);
    this.hline5.graphics.lineTo(500,400);
    this.hline5.graphics.endStroke();

    this.hlines = [this.hline1, this.hline2, this.hline3, this.hline4, this.hline5];
  }

  drawVertLines() {
    this.vline1 = new createjs.Shape();
    this.vline1.crossOrigin = "Anonymous";
    this.stage.addChild(this.vline1);
    this.vline1.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline1.graphics.moveTo(100,0);
    this.vline1.graphics.lineTo(100,600);
    this.vline1.graphics.endStroke();

    this.vline2 = new createjs.Shape();
    this.vline2.crossOrigin = "Anonymous";
    this.stage.addChild(this.vline2);
    this.vline2.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline2.graphics.moveTo(200,0);
    this.vline2.graphics.lineTo(200,600);
    this.vline2.graphics.endStroke();

    this.vline3 = new createjs.Shape();
    this.vline3.crossOrigin = "Anonymous";
    this.stage.addChild(this.vline3);
    this.vline3.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline3.graphics.moveTo(300,0);
    this.vline3.graphics.lineTo(300,600);
    this.vline3.graphics.endStroke();

    this.vline4 = new createjs.Shape();
    this.vline4.crossOrigin = "Anonymous";
    this.stage.addChild(this.vline4);
    this.vline4.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline4.graphics.moveTo(400,0);
    this.vline4.graphics.lineTo(400,600);
    this.vline4.graphics.endStroke();
  }

  keyHandler(event) {
    if (event.key === "ArrowRight") {
      this.xMomentum += this.accel;
    }
    if (event.key === "ArrowLeft") {
      this.xMomentum -= this.accel;
    }
    if (event.key === "ArrowUp") {
      this.yMomentum -= this.accel;
    }
    if (event.key === "ArrowDown") {
      this.yMomentum += this.accel;
    }
    if (event.key === " " || event.key === "Escape") {
      if (this.paused) {
        createjs.Ticker.addEventListener("tick", this.handleTick);
        this.paused = false;
        this.stage.removeChild(this.pauseText);
      } else {
        createjs.Ticker.removeEventListener("tick", this.handleTick);
        this.paused = true;
        this.pauseText = new createjs.Text("Game Paused", "34px Arial", "#000000");
        this.pauseText.x = 100;
        this.pauseText.textBaseline = "alphabetic";
        this.stage.addChild(this.pauseText);
      }
    }
  }

  handleKeyPress() {

    window.addEventListener("keydown", this.keyHandler)
  }

  handleLevelOver() {
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    this.paused = true;
    this.stage.clear();
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    window.removeEventListener("keydown", this.keyHandler);
    if ( this.userScore < this.levelScoreMin ) {
      this.handleGameOver();
    } else {
      let text = new createjs.Text(`Level ${this.level} Complete! \n You have ${this.userScore} points.`, "50px Arial", "#000000");
      text.x = 40;
      text.y = 300;
      text.textBaseline = "alphabetic";
      this.stage.addChild(text);
      this.level += 1;
      this.levelBlingCount += 7;
      this.scrollSpeed = Math.floor(this.scrollSpeed * 1.2);
    }
    // document.write(`you have ${this.userScore} points`);
  }

  handleGameOver() {
    let text = new createjs.Text("You didn't grab enough bling!", "30px Arial", "#000000");
    text.x = 50;
    text.y = 200;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    let overText = new createjs.Text("GAME OVER", "80px Arial", "#000000");
    overText.x = 10;
    overText.y = 260;
    text.textBaseline = "alphabetic";
    this.stage.addChild(overText);

    let resetText = new createjs.Text("Press any key to play again.", "20px Arial", "#000000");
    resetText.x = 120;
    resetText.y = 450;
    text.textBaseline = "alphabetic";
    this.stage.addChild(resetText);
      createjs.Ticker.addEventListener("tick", this.flashReset);
    window.addEventListener("keydown", event => {
      if (event.key) {
        this.stage.removeAllChildren();
        this.stage.update();
        init();
        window.removeEventListener("keydown", arguments.callee);
      }
    })
  }

  flashReset() {

  };
}

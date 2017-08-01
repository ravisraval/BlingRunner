function init() {
  game = new Game();
  game.setup();
}

class Game {
  constructor() {
    this.handleTick = this.handleTick.bind(this);
    this.setup = this.setup.bind(this);
    this.accel = 2;
    this.maxSpeed = 50;
    this.scrollSpeed = 7;
    // this.hlines = [];
    this.blings = {};
    this.blingCountdownStart = 300;
    this.blingCountdown = this.blingCountdownStart;
    this.blingCount = 0;
  }

  handleTick(event) {
    // this.hlines.forEach(line => {
    //   if (line.y === 300) {
    //     line.y = -100;
    //   } else {
    //     line.y += this.scrollSpeed;
    //   }
    // });
    this.blingCountdown -= 10;
    if (this.blingCountdown === 0) {
      this.blingCountdown = this.blingCountdownStart;
      this.blings[this.blingCount] = new createjs.Bitmap("assets/images/star-icon.png");
      this.spot = Math.floor(Math.random(5) * 6);
      this.blings[this.blingCount].x = 110 * this.spot;
      this.stage.addChild(this.blings[this.blingCount]);
      this.blingCount += 1;
    }
    if (this.blingCount > 0) {
      let fn = this;
      for(let i = 0; i < this.blingCount; i ++) {
        fn.blings[i].y += fn.scrollSpeed;
      }
    }
    if (this.yMomentum >= this.maxSpeed) {
      this.yMomentum = this.maxSpeed;
    }
    if (this.xMomentum >= this.maxSpeed) {
      this.xMomentum = this.maxSpeed;
    }
    if (this.userCar.y > 370) { this.yMomentum = this.yMomentum * -.4; this.userCar.y = 370 };
    if (this.userCar.y < -17) { this.yMomentum = this.yMomentum * -.4; this.userCar.y = -17};
    this.userCar.skewX = this.xMomentum / 3;
    this.userCar.x += this.xMomentum;
    this.userCar.y += this.yMomentum;
    if (this.yMomentum > 0) { this.yMomentum -= 1};
    if (this.yMomentum < 0) { this.yMomentum += 1};
    if (this.xMomentum > 0) { this.xMomentum -= 1};
    if (this.xMomentum < 0) { this.xMomentum += 1};
    if (this.userCar.x > this.stage.canvas.width - 70) { this.userCar.x = -160};
    if (this.userCar.x < -160) { this.userCar.x = this.stage.canvas.width - 70};
    this.stage.update();
  }

  setup() {
    this.xMomentum = 0;
    this.yMomentum = 0;
    this.canvas = document.getElementById("canvasel");
    this.stage = new createjs.Stage(this.canvas);
    this.userCar = new createjs.Bitmap("assets/images/Topdown_vehicle_sprites_pack/Black_viper.png");
    createjs.Ticker.addEventListener("tick", this.handleTick);
    this.stage.addChild(this.userCar, this.pauseText);
    this.stage.update();
    this.paused = false;
    this.handleKeyPress();
    this.drawVertLines();
    // this.drawHorizLines();
  }

  drawHorizLines() {
    this.hline1 = new createjs.Shape();
    this.stage.addChild(this.hline1);
    this.hline1.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline1.graphics.moveTo(0,0);
    this.hline1.graphics.lineTo(500,0);
    this.hline1.graphics.endStroke();

    this.hline2 = new createjs.Shape();
    this.stage.addChild(this.hline2);
    this.hline2.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline2.graphics.moveTo(0,100);
    this.hline2.graphics.lineTo(500,100);
    this.hline2.graphics.endStroke();

    this.hline3 = new createjs.Shape();
    this.stage.addChild(this.hline3);
    this.hline3.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline3.graphics.moveTo(0,200);
    this.hline3.graphics.lineTo(500,200);
    this.hline3.graphics.endStroke();

    this.hline4 = new createjs.Shape();
    this.stage.addChild(this.hline4);
    this.hline4.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline4.graphics.moveTo(0,300);
    this.hline4.graphics.lineTo(500,300);
    this.hline4.graphics.endStroke();

    this.hline5 = new createjs.Shape();
    this.stage.addChild(this.hline5);
    this.hline5.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.hline5.graphics.moveTo(0,400);
    this.hline5.graphics.lineTo(500,400);
    this.hline5.graphics.endStroke();

    this.hlines = [this.hline1, this.hline2, this.hline3, this.hline4, this.hline5];
  }

  drawVertLines() {
    this.vline1 = new createjs.Shape();
    this.stage.addChild(this.vline1);
    this.vline1.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline1.graphics.moveTo(100,0);
    this.vline1.graphics.lineTo(100,600);
    this.vline1.graphics.endStroke();

    this.vline2 = new createjs.Shape();
    this.stage.addChild(this.vline2);
    this.vline2.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline2.graphics.moveTo(200,0);
    this.vline2.graphics.lineTo(200,600);
    this.vline2.graphics.endStroke();

    this.vline3 = new createjs.Shape();
    this.stage.addChild(this.vline3);
    this.vline3.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline3.graphics.moveTo(300,0);
    this.vline3.graphics.lineTo(300,600);
    this.vline3.graphics.endStroke();

    this.vline4 = new createjs.Shape();
    this.stage.addChild(this.vline4);
    this.vline4.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,.8)");
    this.vline4.graphics.moveTo(400,0);
    this.vline4.graphics.lineTo(400,600);
    this.vline4.graphics.endStroke();
  }

  handleKeyPress() {
    window.addEventListener("keydown", event => {
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
          this.pauseText.alpha = 0;
        } else {
          createjs.Ticker.removeEventListener("tick", this.handleTick);
          this.paused = true;
          this.pauseText = new createjs.Text("Game Paused", "34px Arial", "#ff7700");
          this.pauseText.x = 250;
          this.pauseText.y = 400;
          this.pauseText.visible = true;
          this.pauseText.alpha = 1;
        }
      }
    });
  }
}

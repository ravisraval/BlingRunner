function init() {

  game = new Game();
  game.setup();
}

class Game {
  constructor() {
    this.blingCaptureSound = this.blingCaptureSound.bind(this);
    this.handleTick = this.handleTick.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.waitForSpacebar = this.waitForSpacebar.bind(this);
    this.handleBlingCollect = this.handleBlingCollect.bind(this);
    this.handleLevelOver = this.handleLevelOver.bind(this);
    this.handleGameOver = this.handleGameOver.bind(this);
    this.waitForEnter = this.waitForEnter.bind(this);
    this.waitForStart = this.waitForStart.bind(this);
    // this.renderMenu = this.renderMenu.bind(this);
    this.setup = this.setup.bind(this);
    this.setup2 = this.setup2.bind(this);
    this.gameInit = this.gameInit.bind(this);
    this.accel = 1;
    this.accelLevel = 1;
    this.maxSpeed = 20;
    this.bombChance = 10; //higher is less likely
    this.bomb = false;
    this.scrollSpeed = 4;
    // this.hlines = [];
    this.blings = {};
    this.blingCountdownStart = 250;
    this.blingCountdown = this.blingCountdownStart;
    this.blingCount = 0;
    this.userScore = 0;
    this.userScoreCurrentLevel = 0;
    this.hitBling = false;
    this.levelBlingCount = 10;
    this.levelMusic = "assets/audio/background.mp3"
    this.level = 1;
    this.friction = .5;
    this.levelScoreMin = 35;
    //mute
    window.addEventListener("keydown", event => {
      if (event.key === "m") {this.toggleSound();}
    });
  }

  toggleSound() {
    createjs.Sound.muted = !createjs.Sound.muted;
  }

  setup() {
    //load audio
    let queue = new createjs.LoadQueue(false);
    queue.loadFile({id: "blingCreate", src: "assets/audio/blingSpawn.mp3"})
    createjs.Sound.registerSound("assets/audio/blingSpawn.mp3", "blingCreate");
    createjs.Sound.registerSound(this.levelMusic, "background", 1);
    createjs.Sound.registerSound("assets/audio/bling1.mp3", "bling1", 1);
    createjs.Sound.registerSound("assets/audio/bling2.mp3", "bling2", 1);
    createjs.Sound.registerSound("assets/audio/bling3.mp3", "bling3", 1);
    createjs.Sound.registerSound("assets/audio/bling4.mp3", "bling4", 1);
    createjs.Sound.registerSound("assets/audio/bling5.mp3", "bling5", 1);
    //create stage
    this.canvas = document.getElementById("canvas");
    this.stage = new createjs.Stage(this.canvas);
    //titles
    let overText = new createjs.Text("BLING RUNNER", "62px Arial", "#000000");
    overText.x = 15;
    overText.y = 260;
    overText.textBaseline = "alphabetic";
    this.stage.addChild(overText);
    let text = new createjs.Text("Press enter to continue!", "30px Arial", "#000000");
    text.x = 100;
    text.y = 420;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    this.stage.update();
    window.addEventListener("keydown", this.waitForEnter);
  }

  setup2(){
    let blingText = new createjs.Text("Catch Some Bling!", "56px Arial", "#000000");
    blingText.x = 15;
    blingText.y = 260;
    blingText.textBaseline = "alphabetic";
    this.stage.addChild(blingText);
    let arrowText = new createjs.Text("Use The Arrow Keys To Move.\n\n\n   Press Enter Again To Start", "30px Arial", "#000000");
    arrowText.x = 55;
    arrowText.y = 420;
    arrowText.textBaseline = "alphabetic";
    this.stage.addChild(arrowText);
    this.stage.update();
    window.addEventListener("keydown", this.waitForStart);
  }

  waitForEnter(event) {
    if (event.key === "Enter") {
      this.stage.removeAllChildren();
      this.stage.clear();
      this.stage.update();
      this.setup2();
      window.removeEventListener("keydown", this.waitForEnter);
    }
  }
  waitForStart(event) {
    if (event.key === "Enter") {
      this.stage.removeAllChildren();
      this.stage.clear();
      this.stage.update();
      this.gameInit();
      window.removeEventListener("keydown", this.waitForStart);
    }
  }

  gameInit() {
    this.xMomentum = 0;
    this.yMomentum = 0;
    this.drawVertLines();
    this.userCar = new createjs.Bitmap("assets/images/Topdown_vehicle_sprites_pack/Black_viper.png");
    this.userCar.crossOrigin = "Anonymous";
    this.userCar.setTransform(190,480,.5,.5);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    this.stage.addChild(this.userCar);
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

  handleBlingCollect(bling) {
    this.userScore += 1;
    this.stage.removeChild(bling);
  }

  handleTick(event) {
    this.blingCountdown -= 10;
    if (this.blingCountdown === 0) {
      createjs.Sound.play("background", {volume:.7});
      this.blingCountdown = this.blingCountdownStart;
      this.spot = Math.floor(Math.random(5) * 5);
      if (Math.floor(Math.random(this.bombChance) * this.bombChance) === 1) {this.bomb = true};

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
      if (this.bomb) {
        color = "#000000";
        console.log("bomb inc");
      }
      this.bomb = false;
      console.log(color);
      let graphics = new createjs.Graphics().beginFill(color).drawRect(0, 0, 64, 64);
      this.blings[this.blingCount] = new createjs.Shape(graphics);
      this.blings[this.blingCount].crossOrigin = "Anonymous";
      this.blings[this.blingCount].x = 100 * this.spot + 18;
      this.stage.addChild(this.blings[this.blingCount]);
      this.blingCount += 1;
      createjs.Sound.play("blingCreate", {volume:.25});
    }
    if (this.blingCount > 0) {
      let fn = this;
      for(let i = 0; i < this.blingCount; i++) {
        fn.hitBling = false;
        fn.blings[i].y += fn.scrollSpeed;
        if (ndgmr.checkRectCollision(fn.blings[i], fn.userCar)) {
          fn.blingCaptureSound(fn.blings[i].graphics._fill.style); //pass in color
          fn.stage.removeChild(fn.blings[i]);
          fn.userScore += 1;
          fn.userScoreCurrentLevel += 1;
          fn.accel += .01;
          fn.hitBling = true;
        }
      }
    }
    document.getElementById('level').innerHTML = `Level: ${this.level}`;
    document.getElementById('levelBlingsLeft').innerHTML = `Blings Left This Level: : ${this.levelBlingCount - this.blingCount}`;
    document.getElementById('accel').innerHTML = `Car Acceleration: ${this.accel.toFixed(2)}`;
    document.getElementById('fallspeed').innerHTML = `Bling Fall Speed: ${this.scrollSpeed}`;
    document.getElementById('blingAppearRate').innerHTML = `Bling Pop Countdown: ${this.blingCountdown/100}`;
    document.getElementById('friction').innerHTML = `Friction: ${(this.friction / .5) * 100}%`;
    //FUTURE: modify so user can catch last blings
    if (this.blingCount === this.levelBlingCount) { this.handleLevelOver() };
    //set top speed
    if (this.yMomentum >= this.maxSpeed) {
      this.yMomentum = this.maxSpeed;
    }
    if (this.xMomentum >= this.maxSpeed) {
      this.xMomentum = this.maxSpeed;
    }
    // set negative top speed
    if (this.yMomentum <= this.maxSpeed * -1) {
      this.yMomentum = this.maxSpeed * -1;
    }
    if (this.xMomentum <= this.maxSpeed * -1) {
      this.xMomentum = this.maxSpeed * -1;
    }
    //bounce off top & bottom walls
    if (this.userCar.y > 485) { this.yMomentum = this.yMomentum * -.4; this.userCar.y = 485 };
    if (this.userCar.y < -12) { this.yMomentum = this.yMomentum * -.4; this.userCar.y = -12};

    this.userCar.skewX = this.xMomentum / 3;
    this.userCar.x += this.xMomentum;
    this.userCar.y += this.yMomentum;
    //slowing friction
    if (this.yMomentum > 0) { this.yMomentum -= this.friction};
    if (this.yMomentum < 0) { this.yMomentum += this.friction};
    if (this.xMomentum > 0) { this.xMomentum -= this.friction};
    if (this.xMomentum < 0) { this.xMomentum += this.friction};
    //warp left & right
    if (this.userCar.x > this.stage.canvas.width - 30) { this.userCar.x = -80};
    if (this.userCar.x < -80) { this.userCar.x = this.stage.canvas.width - 30};

    this.stage.update();
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
        this.toggleSound();
        this.paused = false;
        this.stage.removeChild(this.pauseText);
        this.stage.update();
      } else {
        createjs.Ticker.removeEventListener("tick", this.handleTick);
        this.pauseText = new createjs.Text("Game Paused", "70px Arial", "#F55555");
        this.toggleSound();
        this.pauseText.x = 25;
        this.pauseText.y = 300;
        this.pauseText.textBaseline = "alphabetic";
        this.stage.addChild(this.pauseText);
        this.stage.update();
        this.paused = true;
      }
    }
  }

  handleKeyPress() {
    window.addEventListener("keydown", this.keyHandler)
  }

  blingCaptureSound(color) {
    switch(color) {
      case "#f20d09":
        createjs.Sound.play("bling1", {volume:1});
        break;
      case "#ffa514":
        createjs.Sound.play("bling2", {volume:1});
        break;
      case "#fce516":
        createjs.Sound.play("bling3", {volume:1});
        break;
      case "#71ed12":
        createjs.Sound.play("bling4", {volume:1});
        break;
      case "#1990ea":
        createjs.Sound.play("bling5", {volume:1});
        break;
      case "#000000":
        this.handleDeadlyBomb();
        // createjs.Sound.play("bling5", {volume:1}); get a blow up noise
        break;
    }
  }

  handleLevelOver() {
    window.removeEventListener("keydown", this.keyHandler);
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    this.paused = true;
    this.stage.clear();
    if ( this.userScoreCurrentLevel < this.levelScoreMin ) {
      this.handleGameOver();
    } else {
      let text = new createjs.Text(`Level ${this.level} Complete! \n You have ${this.userScore} points.`, "50px Arial", "#000000");
      text.x = 30;
      text.y = 300;
      text.textBaseline = "alphabetic";
      this.stage.addChild(text);
      //level up
      this.level += 1;
      this.levelBlingCount += 1;
      this.blingCountdown += 40;
      this.blingCount = 0;
      this.userScoreCurrentLevel = 0;
      this.scrollSpeed = Math.floor(this.scrollSpeed * 1.35);

      let continueText = new createjs.Text("Press space to continue.", "20px Arial", "#000000");
      continueText.x = 150;
      continueText.y = 450;
      text.textBaseline = "alphabetic";
      this.stage.addChild(continueText);

      window.addEventListener("keydown", this.waitForSpacebar)
    }
  }

  waitForSpacebar(event) {
    if (event.key === " ") {
      this.stage.removeAllChildren();
      this.stage.clear();
      this.stage.update();
      this.gameInit();
      window.removeEventListener("keydown", this.waitForSpacebar);
    }
  }

  handleGameOver() {
    let text = new createjs.Text("You didn't grab enough blings!", "30px Arial", "#000000");
    text.x = 50;
    text.y = 200;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    let overText = new createjs.Text("GAME OVER", "80px Arial", "#000000");
    overText.x = 10;
    overText.y = 260;
    text.textBaseline = "alphabetic";
    this.stage.addChild(overText);

    let resetText = new createjs.Text("Press space to play again.", "20px Arial", "#000000");
    resetText.x = 120;
    resetText.y = 450;
    text.textBaseline = "alphabetic";
    this.stage.addChild(resetText);
    this.accel = 1;
    this.accelLevel = 1;
    this.maxSpeed = 20;
    this.scrollSpeed = 4;
    this.blings = {};
    this.blingCountdownStart = 250;
    this.blingCountdown = this.blingCountdownStart;
    this.blingCount = 0;
    this.userScore = 0;
    this.userScoreCurrentLevel = 0;
    this.hitBling = false;
    this.levelBlingCount = 10;
    this.levelMusic = "assets/audio/background.mp3"
    this.level = 1;
    this.friction = .5;
    this.levelScoreMin = 20;
    window.addEventListener("keydown", this.waitForSpacebar);
  }

  handleDeadlyBomb() {
    window.removeEventListener("keydown", this.keyHandler);
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    this.paused = true;
    this.stage.clear();
    let text = new createjs.Text("You grabbed a bomb!", "30px Arial", "#000000");
    text.x = 107;
    text.y = 200;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    let overText = new createjs.Text("GAME OVER", "80px Arial", "#000000");
    overText.x = 10;
    overText.y = 260;
    text.textBaseline = "alphabetic";
    this.stage.addChild(overText);

    let resetText = new createjs.Text("Press space to play again.", "20px Arial", "#000000");
    resetText.x = 120;
    resetText.y = 450;
    text.textBaseline = "alphabetic";
    this.stage.addChild(resetText);
    this.accel = 1;
    this.accelLevel = 1;
    this.maxSpeed = 20;
    this.scrollSpeed = 4;
    this.blings = {};
    this.blingCountdownStart = 250;
    this.blingCountdown = this.blingCountdownStart;
    this.blingCount = 0;
    this.userScore = 0;
    this.userScoreCurrentLevel = 0;
    this.hitBling = false;
    this.levelBlingCount = 10;
    this.levelMusic = "assets/audio/background.mp3"
    this.level = 1;
    this.friction = .5;
    this.levelScoreMin = 20;
    window.addEventListener("keydown", this.waitForSpacebar);
  }

  // renderMenu() {
  //   let startB = new Image();
  //   // startB.crossOrigin="Anonymous";
  //   startB.src = "assets/images/UIpack/PNG/green_button00.png";
  //   let startButton = new createjs.Bitmap(startB);
  //   startButton.addEventListener("click", event => {
  //     startButton.removeEventListener("click", arguments.callee);
  //     this.stage.removeAllChildren();
  //     this.stage.update();
  //     this.gameInit();
  //   });
  //   let optionsButton;
  //   let creditsButton;
  // }
    // handleUpgradeAccel() {
    //   if (this.userScoreCurrentLevel > 30 * this.level * 1.2) {
    //     this.accel += .3;
    //     this.accelLevel += 1;
    //     console.log("accel upgraded yo");
    //   } else {
    //     console.log("not enough creds, sory");
    //   }
    // }

    // upgradeStore() {
    //   this.stage.enableMouseOver();
    //   let data = {
    //       images: ["assets/images/UIpack/Spritesheet/blueSheet.png"],
    //       frames: { width: 100, height: 250},
    //       animations: { normal: [0], hover: [1], clicked: [2] }
    //   };
    //   let spriteSheet = new createjs.SpriteSheet(data);
    //   let button = new createjs.Sprite(spriteSheet);
    //   let helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked");
    //
    //   // the code block in this helper.addEventListener (It works with button.addEventListener)
    //   button.onPress = this.handleUpgradeAccel();
    //   button.x = 400;
    //   button.y = 400;
    //   button.gotoAndStop("normal");
    //   this.stage.update();
    // }


      // let layoutWidth = 0.8 * this.stage.canvas.width;
      // let layoutHeight = 0.6 * this.stage.canvas.height;
      // let layoutRect = new createjs.Shape();
      // let buttonWidth = layoutWidth/2;
      // let buttonHeight = 0.10 * layoutHeight;
      //                     layoutRect.graphics.beginStroke("black").drawRect((this.stage.canvas.width - layoutWidth) / 2, (this.stage.canvas.height - layoutHeight) / 2, layoutWidth, layoutHeight);
      //
      // let text = new createjs.Text();
      // text.set({
      //   text: `Car Acceleration : ${this.accelLevel}/5`,
      //   textAlign: "center",
      //   textBaseline: "middle",
      //   x: buttonWidth / 2,
      //   y: buttonHeight / 2
      // });
      //
      // let button1 = new createjs.Container();
      // let bg1 = new createjs.Shape();
      // bg1.graphics.beginStroke("black").drawRect(0, 0, buttonWidth, buttonHeight);
      // button1.set({
      // 	x: (this.stage.canvas.width - layoutWidth) / 2,
      //   y: (this.stage.canvas.height - layoutHeight) / 2 + 0.90 * layoutHeight
      // })
      // button1.addChild(bg1, text);
      // bg1.addEventListener("click", console.log("butt"));
      //
      // let button2 = new createjs.Shape(); button2.graphics.beginStroke("black").drawRect(0,0, buttonWidth, buttonHeight);
      // button2.set({
      // 	x: (this.stage.canvas.width - layoutWidth) / 2 + buttonWidth,
      //   y: (this.stage.canvas.height - layoutHeight) / 2 + 0.90 * layoutHeight
      // });
      //
      //
      // this.stage.addChild(layoutRect, button1, button2);
      // this.stage.update();

      // inputText.onkeyup = function() {
      //   text.set({
      //     text: inputText.value
      //   })
      //   this.stage.update()
      // }

}

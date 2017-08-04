function init() {
  game = new Game();
  game.setup();
}

class Game {
  constructor() {
    this.blingCaptureSound = this.blingCaptureSound.bind(this);
    this.handleTick = this.handleTick.bind(this);
    this.handleFreezeBomb = this.handleFreezeBomb.bind(this);
    this.handleBuff = this.handleBuff.bind(this);
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
    this.buffChance = 3; //higher is less likely
    // this.perfectBrakes = true;
    this.buff = false;
    this.deadlyBombChance = 8; //higher is less likely
    this.deadlyBomb = false;
    this.freezeBombChance = 8; //higher is less likely
    this.freezeBomb = false;
    this.freezeBombDuration = 3; //seconds
    this.buffDuration = 3; //seconds
    this.scrollSpeed = 4;
    this.scrollCounter = 0;
    // this.es = [];ugh what was this
    this.vlines = { 0: {}, 1: {}, 2: {}, 3: {} }; //option 1: pop and push line to array, where y is always -100
    this.blings = {};
    this.iceMode = true;
    this.blingCountdownStart = 250;
    this.blingCountdown = this.blingCountdownStart;
    this.blingCount = 0;
    this.userScore = 0;
    this.userScoreCurrentLevel   = 0;
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
    window.addEventListener("keydown", event => {
      if (event.key === "i") {this.iceMode = !this.iceMode}
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
    let overText = new createjs.Text("BLING RUNNER", "62px Poppins", "#000000");
    overText.x = 39;
    overText.y = 260;
    overText.textBaseline = "alphabetic";
    this.stage.addChild(overText);
    let text = new createjs.Text("Press enter to continue!", "30px Poppins", "#000000");
    text.x = 73;
    text.y = 420;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    this.stage.update();
    window.addEventListener("keydown", this.waitForEnter);
  }

  setup2(){
    let blingText = new createjs.Text("Catch Some Bling!", "52px Poppins", "#000000");
    blingText.x = 11;
    blingText.y = 260;
    blingText.textBaseline = "alphabetic";
    this.stage.addChild(blingText);
    let arrowText = new createjs.Text("Use The Arrow Keys To Move.\n\n\n  Press Enter Again To Start", "30px Poppins", "#000000");
    arrowText.x = 36;
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
    let roadGphx = new createjs.Graphics().beginFill("#282B2A").drawRect(0,0,500,600);
    let road = new createjs.Shape(roadGphx);
    this.userCar = new createjs.Bitmap("assets/images/Topdown_vehicle_sprites_pack/Black_viper.png");
    this.userCar.crossOrigin = "Anonymous";
    this.userCar.setTransform(190,480,.5,.5);
    this.stage.addChild(road);
    this.drawVertLines();
    this.stage.addChild(this.userCar);
    this.stage.update();
    createjs.Ticker.addEventListener("tick", this.handleTick);
    this.paused = false;
    this.handleKeyPress();
  }

  drawVertLines() {
    let fn = this;
    for (let i = 0; i < 4; i++) {
      this.vlines[i][0] = new createjs.Shape();
      this.vlines[i][0].crossOrigin = "Anonymous";
      this.stage.addChild(this.vlines[i][0]);
      this.vlines[i][0].graphics.setStrokeStyle(2).beginStroke("#fad201");
      this.vlines[i][0].graphics.moveTo(100 + 100 * i, 0);
      this.vlines[i][0].graphics.lineTo(100 + 100 * i, 100);
      this.vlines[i][0].graphics.endStroke();

      this.vlines[i][1] = new createjs.Shape();
      this.vlines[i][1].crossOrigin = "Anonymous";
      this.stage.addChild(this.vlines[i][1]);
      this.vlines[i][1].graphics.setStrokeStyle(2).beginStroke("#fad201");
      this.vlines[i][1].graphics.moveTo(100 + 100 * i, 150);
      this.vlines[i][1].graphics.lineTo(100 + 100 * i, 250);
      this.vlines[i][1].graphics.endStroke();

      this.vlines[i][2] = new createjs.Shape();
      this.vlines[i][2].crossOrigin = "Anonymous";
      this.stage.addChild(this.vlines[i][2]);
      this.vlines[i][2].graphics.setStrokeStyle(2).beginStroke("#fad201");
      this.vlines[i][2].graphics.moveTo(100 + 100 * i, 300);
      this.vlines[i][2].graphics.lineTo(100 + 100 * i, 400);
      this.vlines[i][2].graphics.endStroke();

      this.vlines[i][3] = new createjs.Shape();
      this.vlines[i][3].crossOrigin = "Anonymous";
      this.stage.addChild(this.vlines[i][3]);
      this.vlines[i][3].graphics.setStrokeStyle(2).beginStroke("#fad201");
      this.vlines[i][3].graphics.moveTo(100 + 100 * i, 450);
      this.vlines[i][3].graphics.lineTo(100 + 100 * i, 550);
      this.vlines[i][3].graphics.endStroke();
    }
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
      //bombs & bufffs
      if (Math.floor(Math.random(this.deadlyBombChance) * this.deadlyBombChance) === 1) {this.deadlyBomb = true};
      if (Math.floor(Math.random(this.freezeBombChance) * this.freezeBombChance) === 1) {this.freezeBomb = true};
      if (Math.floor(Math.random(this.buffChance) * this.buffChance) === 1) {this.buff = true};

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
      //order matters here if multiple bomb states are true
      if (this.deadlyBomb) {
        color = "#000000";
      }
      if (this.freezeBomb) {
        color = "#565351";
      }
      //reset bomb state after assigning color
      this.freezeBomb = false;
      this.deadlyBomb = false;
      let graphics = new createjs.Graphics().beginFill(color).drawRect(0, 0, 64, 64);
      if (this.buff) {
        graphics = new createjs.Graphics()
                .beginLinearGradientFill(["#000000","#b431af"], [0, 1], 0, 0, 64, 64)
                .drawRect(0,0,64,64);
        this.buff = false;
      }
      this.blings[this.blingCount] = new createjs.Shape(graphics);
      this.blings[this.blingCount].crossOrigin = "Anonymous";
      this.blings[this.blingCount].x = 100 * this.spot + 18;
      this.stage.addChild(this.blings[this.blingCount]);
      this.blingCount += 1;
      createjs.Sound.play("blingCreate", {volume:.25});
    }
    //pop/push road line if needed
    this.scrollCounter += this.scrollSpeed;

    if (this.scrollCounter >= 200) {
      // this.stage.removeChild(this.vlines1.pop);
      let fn = this;
      for (let i = 0; i < 4; i++) {
        fn.stage.removeChild(fn.vlines[i][3]);
        fn.vlines[i][3] = fn.vlines[i][2];
        fn.vlines[i][2] = fn.vlines[i][1];
        fn.vlines[i][1] = fn.vlines[i][0];
        fn.vlines[i][0] = new createjs.Shape();
        fn.vlines[i][0].crossOrigin = "Anonymous";
        fn.stage.addChild(fn.vlines[i][0]);
        fn.vlines[i][0].graphics.setStrokeStyle(2).beginStroke("#fad201");
        fn.vlines[i][0].graphics.moveTo(100 + 100 * i,-100);
        fn.vlines[i][0].graphics.lineTo(100 + 100 * i,0);
        fn.vlines[i][0].graphics.endStroke();
      }
      this.scrollCounter -= 200;
    }
    //move road
    let fn = this;
    for(let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        fn.vlines[i][j].y += fn.scrollSpeed;
      }
    }
    //move blings
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
    document.getElementById('levelBlingsLeft').innerHTML = `Blings Left: ${this.levelBlingCount - this.blingCount}`;
    document.getElementById('accel').innerHTML = `Car Acceleration: ${this.accel.toFixed(2)}`;
    document.getElementById('fallspeed').innerHTML = `Bling Fall Speed: ${this.scrollSpeed}`;
    document.getElementById('blingAppearRate').innerHTML = `Next Bling: ${this.blingCountdown/10}`;
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
    //rotate car with lateral movement
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
      // if (this.perfectBrakes) {
      //   if (this.xMomentum < 0) {this.xMomentum = this.accel}
      // }
      this.xMomentum += this.accel;
    }
    if (event.key === "ArrowLeft") {
      // if (this.perfectBrakes) {
      //   if (this.xMomentum > 0) {this.xMomentum = -this.accel}
      // }
      this.xMomentum -= this.accel;
    }
    if (event.key === "ArrowUp") {
      // if (this.perfectBrakes) {
      //   if (this.yMomentum > 0) {this.yMomentum = -this.accel}
      // }
      this.yMomentum -= this.accel;
    }
    if (event.key === "ArrowDown") {
      // if (this.perfectBrakes) {
      //   if (this.yMomentum < 0) {this.yMomentum = this.accel}
      // }
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
        this.pauseText = new createjs.Text("Game Paused", "70px Poppins", "#F55555");
        this.toggleSound();
        this.pauseText.x = 5;
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
      case "#565351":
        this.handleFreezeBomb();
        // createjs.Sound.play("bling5", {volume:1}); get a blow up noise
        break;
        //if you want to add more buffs with gradients, make a parent switch
        //function that switches on typeof color. If it's a string (regular
        // fill), send to a string switch, otherwise, send to an object switch.
      default:
        this.handleBuff();
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
      let text = new createjs.Text(`  Level ${this.level} Complete! \n\n\nYou have ${this.userScore} points.`, "46px Poppins", "#FFFFFF");
      text.x = 30;
      text.y = 200;
      text.textBaseline = "alphabetic";
      this.stage.addChild(text);
      //level up
      this.level += 1;
      this.levelBlingCount += 1;
      this.blingCountdown += 40;
      this.blingCount = 0;
      this.userScoreCurrentLevel = 0;
      this.scrollSpeed = Math.floor(this.scrollSpeed * 1.35);

      let continueText = new createjs.Text("Press space to continue.", "20px Poppins", "#FFFFFF");
      continueText.x = 150;
      continueText.y = 470;
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
    let text = new createjs.Text("You didn't grab enough blings!", "30px Poppins", "#FFFFFF");
    text.x = 24;
    text.y = 200;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    let overText = new createjs.Text("GAME OVER", "80px Poppins", "#FFFFFF");
    overText.x = 10;
    overText.y = 260;
    text.textBaseline = "alphabetic";
    this.stage.addChild(overText);

    let resetText = new createjs.Text("Press space to play again.", "20px Poppins", "#FFFFFF");
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

  handleFreezeBomb() {
    window.removeEventListener("keydown", this.keyHandler);
    let text = new createjs.Text(`SLEEPING GAS!`, "62px Poppins", "#FFFFFF");
    let text2 = new createjs.Text(`You fall asleep at the wheel for ${this.freezeBombDuration} seconds!`, "23px Poppins", "#FFFFFF");
    text.x = 29;
    text.y = 70;
    text2.x = 10;
    text2.y = 150;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text, text2);
    setTimeout(() => {
       this.stage.removeChild(text, text2);
       this.stage.update();
       window.addEventListener("keydown", this.keyHandler);
     }, this.freezeBombDuration * 1000);
  }

  handleBuff() {
    this.accel += .3;
    setTimeout(() => { this.accel -= .3 }, this.buffDuration * 1000);
  }

  handleDeadlyBomb() {
    window.removeEventListener("keydown", this.keyHandler);
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    this.paused = true;
    this.stage.clear();
    let text = new createjs.Text("You grabbed a bomb!", "30px Poppins", "#FFFFFF");
    text.x = 87;
    text.y = 200;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    let overText = new createjs.Text("GAME OVER", "80px Poppins", "#FFFFFF");
    overText.x = 13;
    overText.y = 260;
    text.textBaseline = "alphabetic";
    this.stage.addChild(overText);

    let resetText = new createjs.Text("Press space to play again.", "20px Poppins", "#FFFFFF");
    resetText.x = 118;
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
}

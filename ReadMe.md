# BlingRunner

## Background


[BlingRunner](https://github.com/ravisraval/BlingRunner) is a javascript browser game. Players control a car and must move the car over successive "blings": randomly generated objects on a scrolling board.

## Key Features, MVP
***
#### Infinitely Scrolling Board
  The game features a board that will continually scroll until a round is over. The round will end when a user successfully completes the round or misses too many blings, therefore losing.
  Blings are randomly generated parts of the board. The user must direct the car over these blings. When successful, the game will produce a corresponding sound. When unsuccessful, the game will play an error sound.
####


## Wireframes
![Game Mockup](docs/BlingRunner.png)

## Technologies Utilized
To display, animate, and add sound to BlingRunner, I will use the CreateJS suite. Specifically, this contains EaselJS for displaying content on the canvas, TweenJS for animation, and SoundJS for audio. In concert with TweenJs, I will use AnimeJs for its smooth object animationAs object display, animation, and sound are crucial to BlingRunner, this library suite is a perfect fit.


##Implementation Timeline

*  Day 1: Complete basic project setup, pause function, and car physics.
*  Day 2: Complete board scrolling, bling generation, and item collision.
*  Day 3: Complete point system, sounds, start styling and upgrades.
*  Day 4: Complete styling and upgrades.

## Potential Bonus Features

BlingRunner's core functionality could be improved upon with the following features:
*  Upgrades available via store after every level
*  Unlimited mode vs levels
*  start button
*  friction modifier
*  fix collision????????????????????
*  end level when all blings are out of canvas

export class Player {
  heightDelta = 0
  isRespawning = false
  isMoving = false
  hasJumpedOnce = false
  coyoteLapse = 0.2
  coins = 0
  constructor(
    posX,
    posY,
    speed,
    jumpForce,
    nbLives,
    currentLevelScene,
    isInFinalLevel
  ) {
    this.isInFinalLevel = isInFinalLevel
    this.currentLevelScene = currentLevelScene
    this.initialX = posX
    this.initialY = posY
    this.makePlayer()
    this.setPlayerControls()
    this.speed = speed
    this.jumpForce = jumpForce
    this.lives = nbLives
    this.previousHeight = this.gameObj.pos.y
  }

  makePlayer(x, y) {

    this.gameObj = add([
      sprite("player"),
      area({ shape: new Rect(vec2(0, 3), 300, 300) }),
      anchor("center"),
      pos(this.initialX, this.initialY),
      scale(0.2),
      body(),
      "player",
    ])
  }
  enablePassThrough() {
    this.gameObj.onBeforePhysicsResolve((collison) => {
      if (collison.target.is("passthrough") && this.gameObj.isJumping()) {
        collison.preventResolution()
      }
      if (collison.target.is("passthrough") && (isKeyDown("down") || isKeyDown("s"))) {
        collison.preventResolution();
      }
    })
  }
  enableCoinPickUp() {
    this.gameObj.onCollide("coin", (coin) => {
      this.coins++
      destroy(coin)
      play("coin")
    })
  }
  enableHeartPickUp() {
    this.gameObj.onCollide("heart-icon", (heart) => {
      this.lives++
      destroy(heart)
      play("coin")
    })
  }

  setPlayerControls() {
    onKeyDown("r", () => {
      go("controls")
    })
    onKeyDown("left", () => {
      if (this.gameObj.curAnim() !== "run")
        this.gameObj.flipX = true
      if (!this.isRespawning) this.gameObj.move(-this.speed, 0)
      this.isMoving = true
    })
    onKeyDown("a", () => {
      if (this.gameObj.curAnim() !== "run")
        this.gameObj.flipX = true
      if (!this.isRespawning) this.gameObj.move(-this.speed, 0)
      this.isMoving = true
    })
    onKeyDown("right", () => {
      if (this.gameObj.curAnim() !== "run")
        this.gameObj.flipX = false
      if (!this.isRespawning) this.gameObj.move(+this.speed, 0)
      this.isMoving = true
    })
    onKeyDown("d", () => {
      if (this.gameObj.curAnim() !== "run")
        this.gameObj.flipX = false
      if (!this.isRespawning) this.gameObj.move(+this.speed, 0)
      this.isMoving = true
    })

    //Fly mode
    let canJump = false;
    let flyingMessage;
    
    onKeyPress("t", () => {
        canJump = !canJump;
    
        if (canJump) {
            flyingMessage = add([
                text("Flying Skibidi : On!", { size: 24 }),
                anchor("center"),
                fixed(),
                pos(width() / 2, height() / 2),
            ]);
        } else {
            if (flyingMessage) {
                destroy(flyingMessage);
                flyingMessage = null;
            }
        }
        console.log("Jumping toggled:", canJump ? "ON" : "OFF");
    });
    


    onKeyDown("space", () => {
      if (canJump && (!this.isRespawning)) {
        this.gameObj.jump(this.jumpForce);
      }
    })
    onKeyDown("space", () => {
      if (this.gameObj.paused) return
      if (this.gameObj.isGrounded() && !this.isRespawning) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        play("jump")
      }

      //coyote time
      if (
        !this.gameObj.isGrounded() &&
        time() - this.timeSinceLastGrounded < this.coyoteLapse &&
        !this.hasJumpedOnce
      ) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        play("jump")
      }
    })
    onKeyDown("w", () => {
      if (this.gameObj.paused) return
      if (this.gameObj.isGrounded() && !this.isRespawning) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        play("jump")
      }

      //coyote time
      if (
        !this.gameObj.isGrounded() &&
        time() - this.timeSinceLastGrounded < this.coyoteLapse &&
        !this.hasJumpedOnce
      ) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        play("jump")
      }
    })
    onKeyDown("up", () => {
      if (this.gameObj.paused) return
      if (this.gameObj.isGrounded() && !this.isRespawning) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        play("jump")
      }

      //coyote time
      if (
        !this.gameObj.isGrounded() &&
        time() - this.timeSinceLastGrounded < this.coyoteLapse &&
        !this.hasJumpedOnce
      ) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        play("jump")
      }
    })
    onKeyRelease(() => {
      if (isKeyReleased("right") || isKeyReleased("left") || isKeyReleased("d") || isKeyReleased("a"))
        this.isMoving = false
    })
  }
  respawnPlayer() {
    if (this.lives > 0) {
      this.lives--
      this.gameObj.pos = vec2(this.initialX, this.initialY)
      this.isRespawning = true
      setTimeout(() => this.isRespawning = false, 800)
      return
    }
    go("gameover")
  }
  enableMobVunerability() {
    function hitAndRespawn(context) {
      play("hit", { speed: 1.5 })
      context.respawnPlayer()
    }
    this.gameObj.onCollide("fish", () => hitAndRespawn(this))
    this.gameObj.onCollide("winner", () => window.location.href = "roll.html")
    this.gameObj.onCollide("spiders", () => hitAndRespawn(this))
    this.gameObj.onCollide("axes", () => hitAndRespawn(this))
    this.gameObj.onCollide("saws", () => hitAndRespawn(this))
    this.gameObj.onCollide("birds", () => hitAndRespawn(this))
  }
  update() {
    onUpdate(() => {
      if (this.gameObj.isGrounded()) {
        this.hasJumpedOnce = false
        this.timeSinceLastGrounded = time()
      }
      

      this.heightDelta = this.previousHeight - this.gameObj.pos.y
      this.previousHeight = this.gameObj.pos.y
      if (this.gameObj.pos.y > 1000) {
        play("hit", { speed: 1.3 })
        this.respawnPlayer()
      }



      if (
        !this.gameObj.isGrounded() &&
        this.heightDelta > 0 &&
        this.gameObj.curAnim() !== "jump-up"
      ) {
      }

      if (
        !this.gameObj.isGrounded() &&
        this.heightDelta < 0 &&
        this.gameObj.curAnim() !== "jump-down"
      ) {
      }
    })
  }
  updateLives(livesCountUI) {
    onUpdate(() => {
      livesCountUI.text = `${this.lives}`
    })
  }

  updateCoinCount(coinCountUI) {
    onUpdate(() => {
      coinCountUI.text = `${this.coins} / ${coinCountUI.fullCoinCount}`
      if (this.coins === coinCountUI.fullCoinCount) {
        go(this.isInFinalLevel ? "end" : this.currentLevelScene + 1)
      }
    })
  }
}
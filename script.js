'use-strict'

window.onload = function () {
  class Game {
    constructor () {
      this.canvas = document.createElement('canvas')
      this.context = this.canvas.getContext('2d')
      this.canvas.height = window.innerHeight
      this.canvas.width = window.innerHeight / 18 * 10
      this.blockWidth = window.innerHeight / 18
      document.body.appendChild(this.canvas)

      this.highestTetroIndex = 0
      this.tetrominoSpawnPos = {x: 3, y: 0}
    }
    setup () {
      this.blocks = []
      this.tetroTypes = [
        {type: 'I', x: [0, 1, 2, 3], y: [0, 0, 0, 0]},
        {type: 'J', x: [0, 1, 2, 2], y: [0, 0, 0, 1]},
        {type: 'L', x: [0, 1, 2, 0], y: [0, 0, 0, 1]},
        {type: 'O', x: [1, 2, 1, 2], y: [0, 0, 1, 1]},
        {type: 'S', x: [1, 2, 0, 1], y: [0, 0, 1, 1]},
        {type: 'T', x: [0, 1, 2, 1], y: [0, 0, 0, 1]},
        {type: 'Z', x: [0, 1, 1, 2], y: [0, 0, 1, 1]}
      ]
      this.newTetromino()
    }
    newTetromino () {
      this.activeTetromino = new Tetromino()
    }
    tick () {
      // Animate movement
    }
    move () {
      // Decide where blocks are going to go
    }
    paint () {
      this.blocks.forEach(block => {
        let {x, y} = block.realPos
        let b = this.blockWidth
        this.context.shadowBlur = 10
        this.context.shadowOffsetX = this.blockWidth / 6
        this.context.shadowOffsetY = this.blockWidth / 6
        this.context.shadowColor = '#000'
        switch (block.tetroType) {
          case 'I':
            this.context.fillStyle = '#888'
            break
          case 'J':
            this.context.fillStyle = '#999'
            break
          case 'L':
            this.context.fillStyle = '#AAA'
            break
          case 'O':
            this.context.fillStyle = '#BBB'
            break
          case 'S':
            this.context.fillStyle = '#CCC'
            break
          case 'T':
            this.context.fillStyle = '#DDD'
            break
          case 'Z':
            this.context.fillStyle = '#EEE'
        }
        this.context.fillRect(x * b, y * b, b, b)
        this.context.stroke()
        // console.log(block)
        console.log('type' + block.tetroType)
      })
    }
    get getRandomTetroType () {
      return this.tetroTypes[Math.floor(Math.random() * 7)]
    }
    canFall ({x, y, tetroIndex}) { // TODO
      console.log(x, y, tetroIndex)
      true
    }
  }
  class Tetromino {
    constructor () {
      let tetroIndex = game.highestTetroIndex++
      let x = 3
      let y = 0
      let tetroType = game.getRandomTetroType
      this.blocks = []

      for (let i = 0; i < 4; i++) {
        let block = new Block({
          x: x + tetroType.x[i],
          y: y + tetroType.y[i],
          idx: tetroIndex,
          type: tetroType.type
        })
        game.blocks.push(block)
        this.blocks.push(block)
      }
    }
    rotateLeft () {

    }

  }

  class Block {
    constructor ({x, y, idx, type}) {
      this.prevPos = {x, y}
      this.nextPos = {x, y}
      this.realPos = {x, y}
      this.tetroIndex = idx
      this.tetroType = type
    }
  }
  // Initialize
  let game = new Game()
  game.setup()
  game.paint()
}

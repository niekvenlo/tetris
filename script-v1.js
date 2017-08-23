'use-strict'

window.onload = function () {
  class Game {
    setup () {
      // Initialize parameters
      this.board = {
        width: 10,
        height: 16
      }
      this.blocks = []
      this.highestTetroIndex = 0
      this.tetroSpawnPos = {x: 3, y: 0}
      this.tetroTypes = [
        //     Name     X and Y position of four blocks      Color
        {type: 'I', x: [1, 0, 2, 3], y: [0, 0, 0, 0], color: '#888'},
        {type: 'J', x: [1, 0, 2, 2], y: [0, 0, 0, 1], color: '#999'},
        {type: 'L', x: [1, 0, 2, 0], y: [0, 0, 0, 1], color: '#AAA'},
        {type: 'O', x: [1, 2, 1, 2], y: [0, 0, 1, 1], color: '#BBB'},
        {type: 'S', x: [1, 2, 0, 1], y: [0, 0, 1, 1], color: '#CCC'},
        {type: 'T', x: [1, 0, 2, 1], y: [0, 0, 0, 1], color: '#DDD'},
        {type: 'Z', x: [1, 0, 1, 2], y: [0, 0, 1, 1], color: '#EEE'}
      ]
      this.createCanvas()
      this.newTetro()
      setInterval(this.tick.bind(this), 100)
    }
    createCanvas () {
      this.canvas = document.createElement('canvas')
      this.context = this.canvas.getContext('2d')
      this.canvas.height = window.innerHeight
      this.canvas.width = window.innerHeight / this.board.height * this.board.width
      this.blockWidth = window.innerHeight / this.board.height
      document.body.appendChild(this.canvas)
    }
    newTetro () {
      this.activeTetro = new Tetro()
    }
    tick () {
      // Animate movement
      this.blocks.forEach(block => {
        if (this.canFall(block)) {
          block.realPos.y += 0.3
        } else {
          block.realPos.y = Math.round(block.realPos.y)
        }
      })
      this.paint()
    }
    move () {
      // Decide where blocks are going to go
    }
    paint () {
      this.blocks.sort((a, b) => {
        // Sorting prevents overlapping shadows after drawing
        return (10 * a.realPos.x + a.realPos.y) - (10 * b.realPos.x + b.realPos.y)
      })
      // Clear display
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      // Draw each block
      this.blocks.forEach(block => {
        let {x, y} = block.realPos
        let b = this.blockWidth
        this.context.shadowBlur = 10
        this.context.shadowOffsetX = this.blockWidth / 6
        this.context.shadowOffsetY = this.blockWidth / 6
        this.context.shadowColor = '#000'
        this.context.strokeStyle = '#333'
        let tetroType = this.tetroTypes.find((x) => x.type === block.tetroType)
        this.context.fillStyle = tetroType.color
        this.context.strokeRect(x * b, y * b, b, b)
        this.context.fillRect(x * b, y * b, b, b)
      })
    }
    get getRandomTetroType () {
      return this.tetroTypes[Math.floor(Math.random() * 7)]
    }
    canFall (block) { // TODO
      return block.realPos.y < (this.board.height - 1)
    }
  }
  class Tetro {
    constructor () {
      let tetroIndex = game.highestTetroIndex++
      let {x, y} = game.tetroSpawnPos
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
    rotateRight () {
      let pivot = this.blocks[0].realPos
      let offsets = (a, b) => { return {offsetX: b - a, offsetY: a - b} }
      this.blocks.forEach((block, idx) => {
        let relX = block.realPos.x - pivot.x
        let relY = block.realPos.y - pivot.y
        let {offsetX, offsetY} = offsets(relX, relY)
        block.realPos.x += offsetX
        block.realPos.y += offsetY
      })
    }
    rotateLeft () {
      this.rotateRight()
      this.rotateRight()
      this.rotateRight()
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
  // game.activeTetro.rotateRight()
  // game.activeTetro.rotateLeft()
  // game.paint()
}

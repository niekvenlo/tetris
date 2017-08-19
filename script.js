'use-strict'

window.onload = function () {
  class Game {
    setup () {
      // Initialize params
      this.board = {
        width: 10,
        height: 16
      }
      this.blocks = []
      this.tetroIndex = 0

      this.createCanvas()
      this.newTetro()
      this.paint()
      // this.timer = setInterval(this.tick.bind(this), 10)
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
      // Create four blocks
      let pivot = {x: 4, y: 2}
      let tetroIndex = this.tetroIndex++

      let pos = {x: 4, y: 1}
      let block = new Block(pos, pivot, 'type', tetroIndex)
      this.blocks.push(block)
      block.rotateRight()
    }
    paint () {
      this.blocks.sort((a, b) => {
        // Sorting prevents overlapping shadows after drawing
        return (100 * a.pos.x + a.pos.y) - (100 * b.pos.x + b.pos.y)
      })
      // Clear display
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      // Draw each block
      this.blocks.forEach(block => {
        let {x, y} = block.pos
        let bWidth = this.blockWidth
        this.context.shadowBlur = 10
        this.context.shadowOffsetX = bWidth / 6
        this.context.shadowOffsetY = bWidth / 6
        this.context.shadowColor = '#000'
        this.context.strokeStyle = '#333'
        this.context.fillStyle = '#EEE'
        this.context.strokeRect(x * bWidth, y * bWidth, bWidth, bWidth)
        this.context.fillRect(x * bWidth, y * bWidth, bWidth, bWidth)
      })
    }
  }

  class Block {
    constructor (pos, pivot, type, index) {
      this.pos = pos
      this.pivot = pivot
      this.type = type
      this.index = index
    }
    rotateLeft () {
      let rel = {
        x: this.pos.x - this.pivot.x,
        y: this.pos.y - this.pivot.y
      }
      let offset = {
        x: rel.x + rel.y, // Rotate left
        y: rel.y - rel.x
        // x: rel.x - rel.y, // Rotate right
        // y: rel.x + rel.y
      }
      this.pos.x -= offset.x
      this.pos.y -= offset.y
    }
    rotateRight () {
      this.rotateLeft()
      this.rotateLeft()
      this.rotateLeft()
    }
  }

  // Start game
  let tetris = new Game()
  tetris.setup()
}

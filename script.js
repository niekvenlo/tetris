'use-strict'

window.onload = function () {
  class Game {
    setup () {
      // Initialize params
      this.board = {
        width: 10,
        height: 16,
        spawnPos: {x: 4, y: 3}
      }
      this.allBlocks = []
      this.tetroIndex = 0
      this.tetroTypes = {
        'I': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 3], y: [0, 0, 0, 0], color: '#888'},
        'J': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 2], y: [0, 0, 0, 1], color: '#999'},
        'L': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 0], y: [0, 0, 0, 1], color: '#AAA'},
        'O': {pivot: {x: 1.5, y: 0.5}, x: [1, 2, 1, 2], y: [0, 0, 1, 1], color: '#BBB'},
        'S': {pivot: {x: 1, y: 0}, x: [1, 2, 0, 1], y: [0, 0, 1, 1], color: '#CCC'},
        'T': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 1], y: [0, 0, 0, 1], color: '#DDD'},
        'Z': {pivot: {x: 1, y: 0}, x: [1, 0, 1, 2], y: [0, 0, 1, 1], color: '#EEE'}
      }

      this.createCanvas()
      this.newTetro()
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
      let type = this.getRandomTetroType
      let index = ++this.tetroIndex
      let s = this.board.spawnPos
      for (let i = 0; i < 4; i++) {
        let pos = {x: s.x + type.x[i], y: s.y + type.y[i]}
        let pivot = {x: s.x + type.pivot.x, y: s.y + type.pivot.y}
        let block = new Block({pos, pivot, type, index})
        this.allBlocks.push(block)
      }
    }
    rotateLeft () {
      this.allBlocks
        .filter(block => block.index === this.tetroIndex)
        .forEach(block => block.rotateLeft())
    }
    rotateRight () {
      this.allBlocks
        .filter(block => block.index === this.tetroIndex)
        .forEach(block => block.rotateRight())
    }
    paint () {
      this.allBlocks.sort((a, b) => {
        // Sorting prevents overlapping shadows after drawing
        return (100 * a.pos.x + a.pos.y) - (100 * b.pos.x + b.pos.y)
      })
      // Clear display
      this.context.globalAlpha = 0.3
      this.context.fillStyle = '#FFF'
      this.context.fillRect(-20, -20, this.canvas.width + 20, this.canvas.height + 20)
      this.context.globalAlpha = 1
      // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      // Draw each block
      this.allBlocks.forEach(block => {
        let {x, y} = block.pos
        let bWidth = this.blockWidth
        this.context.shadowBlur = 10
        this.context.shadowOffsetX = bWidth / 6
        this.context.shadowOffsetY = bWidth / 6
        this.context.shadowColor = '#000'
        this.context.strokeStyle = '#333'
        this.context.fillStyle = block.type.color
        this.context.strokeRect(x * bWidth, y * bWidth, bWidth, bWidth)
        this.context.fillRect(x * bWidth, y * bWidth, bWidth, bWidth)
      })
    }
    canMove (block, offset = {x: 0, y: 1}) {
      let tetroIndex = block.index
      return !this.allBlocks
        .filter(block => block.index === tetroIndex) // Find connected blocks
        .some(block => {
          let blockingBlock = this.findBlock({ // Find blocking blocks
            pos: block.pos,
            excludeIndex: tetroIndex,
            offset
          })
          let atBottom = block.pos.y >= this.board.height - 1 // Check for bottom
          let atLeftSide = block.pos.x + offset.x < 0
          let atRightSide = block.pos.x + offset.x > this.board.width - 1
          return blockingBlock || atBottom || atLeftSide || atRightSide
        })
    }
    findBlock ({pos, excludeIndex = null, offset = {x: 0, y: 0}}) {
      return this.allBlocks.find(block => {
        return (
          (block.pos.x === pos.x + offset.x) &&
          (block.pos.y === pos.y + offset.y) &&
          (block.index !== excludeIndex))
      })
    }
    get getRandomTetroType () {
      let types = Object.keys(this.tetroTypes)
      let randKey = types[Math.floor(Math.random() * types.length)]
      return this.tetroTypes[randKey]
    }
  }

  class Block {
    constructor ({pos, pivot, type, index}) {
      this.pos = pos
      console.log(pos)
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
  // tetris.paint()
  // tetris.rotateLeft()
  tetris.paint()
  // tetris.rotateLeft()
  // tetris.paint()
  // tetris.rotateLeft()
  // tetris.paint()
}

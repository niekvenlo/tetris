'use-strict'

window.onload = function () {
  class Game {
    setup () {
      // Initialize params
      this.board = {
        width: 10,
        height: 16,
        spawnPos: {x: 4, y: -1}
      }
      this.allBlocks = []
      this.tetroIndex = 0
      this.tetroTypes = {
        'I': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 3], y: [0, 0, 0, 0], color: '#42c2f4'},
        'J': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 2], y: [0, 0, 0, 1], color: '#415cf4'},
        'L': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 0], y: [0, 0, 0, 1], color: '#f4b841'},
        'O': {pivot: {x: 1.5, y: 0.5}, x: [1, 2, 1, 2], y: [0, 0, 1, 1], color: '#f4e241'},
        'S': {pivot: {x: 1, y: 0}, x: [1, 2, 0, 1], y: [0, 0, 1, 1], color: '#bbf441'},
        'T': {pivot: {x: 1, y: 0}, x: [1, 0, 2, 1], y: [0, 0, 0, 1], color: '#7c41f4'},
        'Z': {pivot: {x: 1, y: 0}, x: [1, 0, 1, 2], y: [0, 0, 1, 1], color: '#e25c4d'}
      }

      this.createCanvas()
      document.addEventListener('keydown', this.keyHandler.bind(this), false)
      this.timer = setInterval(this.tick.bind(this), 500)
    }
    tick () {
      // Create a new Tetro when no blocks can move
      if (this.allBlocks.every(block => !this.canMove(block))) {
        this.newTetro()
      }
      // Move the current Tetro down
      this.tetroMove({x: 0, y: 1})
      // Paint the game
      this.paint()
    }
    newTetro () {
      // Create a Tetro, consisting of four blocks
      let type = this.getRandomTetroType
      let index = ++this.tetroIndex
      let s = this.board.spawnPos
      let tetro = []
      for (let i = 0; i < 4; i++) {
        let pos = {x: s.x + type.x[i], y: s.y + type.y[i]}
        let pivot = {x: s.x + type.pivot.x, y: s.y + type.pivot.y}
        let block = new Block({pos, pivot, type, index})
        tetro.push(block)
      }
      // If these blocks overlap with existing blocks, Game over
      if (tetro.some(block => this.findBlock({pos: block.pos}))) {
        this.gameOver()
      } else {
        // If not, add the blocks to the Array
        this.allBlocks.push(...tetro)
      }
    }
    gameOver () {
      // Stop the clock
      clearInterval(this.timer)
      // When timer is null, paint will show 'Game over'
      this.timer = null
    }
    keyHandler (e) {
      switch (e.code) {
        // rotateRight is currently unused
        case 'ArrowUp':
          this.rotateLeft()
          break
        case 'ArrowLeft':
          this.tetroMove({x: -1, y: 0})
          break
        case 'ArrowRight':
          this.tetroMove({x: 1, y: 0})
          break
        default:
      }
    }
    createCanvas () {
      // Create canvas element to paint to
      this.canvas = document.createElement('canvas')
      this.context = this.canvas.getContext('2d')
      this.canvas.height = window.innerHeight
      this.canvas.width = window.innerHeight / this.board.height * this.board.width
      this.blockWidth = window.innerHeight / this.board.height
      document.body.appendChild(this.canvas)
    }
    paint () {
      this.allBlocks.sort((a, b) => {
        // Sorting prevents overlapping shadows after drawing
        return (100 * a.pos.x + a.pos.y) - (100 * b.pos.x + b.pos.y)
      })
      // Clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
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
        // console.log('block', block.index, block.pos)
      })
      // If timer is unset, the game is over
      if (!this.timer) {
        let bWidth = this.blockWidth
        this.context.font = 1.8 * bWidth + 'px Arial'
        this.context.textAlign = 'center'
        this.context.shadowOffsetX = bWidth / 16
        this.context.shadowOffsetY = bWidth / 16
        this.context.fillText(
          'Game over',
          this.canvas.width / 2,
          this.canvas.height / 1.5
        )
      }
    }
    rotateLeft () {
      // TODO: This method should check whether rotation is legal,
      // and either prevent rotation, or reverse rotation
      this.allBlocks
        .filter(block => block.index === this.tetroIndex)
        .forEach(block => block.rotateLeft())
    }
    rotateRight () {
      // TODO: This method should be merged with rotateLeft
      this.allBlocks
        .filter(block => block.index === this.tetroIndex)
        .forEach(block => block.rotateRight())
    }
    tetroMove (offset) {
      // Move all blocks in Tetro if they can move in the given direction
      let blocks = this.allBlocks.filter(block => block.index === this.tetroIndex)
      if (blocks.every(block => this.canMove(block, offset))) {
        blocks.forEach(block => {
          block.pos.x += offset.x
          block.pivot.x += offset.x
          block.pos.y += offset.y
          block.pivot.y += offset.y
        })
      }
    }
    canMove (block, offset = {x: 0, y: 1}) {
      // Return true is block can move (down, by default)
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
          let atLeftSide = block.pos.x + offset.x < 0 // Check for sides
          let atRightSide = block.pos.x + offset.x > this.board.width - 1
          return blockingBlock || atBottom || atLeftSide || atRightSide
        })
    }
    canRotate (block, direction) {
      // TODO: Build. Check whether a block can rotate in the given direction
    }
    findBlock ({pos, offset = {x: 0, y: 0}, excludeIndex = null}) {
      console.assert(typeof pos.x === 'number')
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

'use-strict'

window.onload = function () {
  class Game {
    constructor () {
      // Create canvas
      this.canvas = document.createElement('canvas')
      this.context = this.canvas.getContext('2d')
      this.canvas.height = window.innerHeight
      this.canvas.width = window.innerHeight / 18 * 10
      this.blockWidth = window.innerHeight / 18
      document.body.appendChild(this.canvas)
    }
    setup () {
      // Initialize parameters
      this.blocks = []
      this.highestTetroIndex = 0
      this.tetroSpawnPos = {x: 3, y: 4}
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
      this.newTetro()
    }
    newTetro () {
      this.activeTetro = new Tetro()
    }
    tick () {
      // Animate movement
    }
    move () {
      // Decide where blocks are going to go
    }
    paint () {
      this.blocks.sort((a, b) => {
        // Sorting prevents overlapping shadows after drawing
        return (10 * a.realPos.x + a.realPos.y) - (10 * b.realPos.x + b.realPos.y)
      })
      this.blocks.forEach(block => {
        // Draw each block
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
    canFall ({x, y, tetroIndex}) { // TODO
      true
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
    rotateLeft () {
      let pivot = this.blocks[0].realPos
      let offsets = (a, b) => { return {offsetX: b - a, offsetY: -a - b} }
      this.blocks.forEach((block, idx) => {
        let relX = block.realPos.x - pivot.x
        let relY = block.realPos.y - pivot.y
        let {offsetX, offsetY} = offsets(relX, relY)
        block.realPos.x += offsetX
        block.realPos.y += offsetY
      })
    }
    rotateRight () {
      this.rotateLeft()
      this.rotateLeft()
      this.rotateLeft()
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
  game.activeTetro.rotateRight()
  game.paint()
}

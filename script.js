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
      this.blocks = []
      this.highestTetroIndex = 0
      this.tetrominoSpawnPos = {x: 3, y: 0}
      this.tetroTypes = [
        {type: 'I', x: [1, 0, 2, 3], y: [0, 0, 0, 0]},
        {type: 'J', x: [1, 0, 2, 2], y: [0, 0, 0, 1]},
        {type: 'L', x: [1, 0, 2, 0], y: [0, 0, 0, 1]},
        {type: 'O', x: [1, 2, 1, 2], y: [0, 0, 1, 1]},
        {type: 'S', x: [1, 2, 0, 1], y: [0, 0, 1, 1]},
        {type: 'T', x: [1, 0, 2, 1], y: [0, 0, 0, 1]},
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
      this.blocks.sort((a, b) => {
        // Sorts the blocks, so that top-left most blocks are painted first
        // Prevents overlapping shadows
        return (10 * a.realPos.x + a.realPos.y) - (10 * b.realPos.x + b.realPos.y)
      })
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
      let pivotX = this.blocks[0].realPos.x
      let pivotY = this.blocks[0].realPos.y
      let offsets = {
        '-3,0': {x: 3, y: 3},
        '-2,-1': {x: 1, y: 3},
        '-2,0': {x: 2, y: 2},
        '-2,1': {x: 1, y: 3},
        '-1,-1': {x: 0, y: 2},
        '-1,0': {x: 1, y: 1},
        '-1,1': {x: 2, y: 0},
        '0,-1': {x: -1, y: 1},
        '0,-2': {x: -2, y: 2},
        '0,-3': {x: -3, y: 3},
        '0,0': {x: 0, y: 0},
        '0,1': {x: 1, y: -1},
        '1,-1': {x: -2, y: 0},
        '1,-2': {x: -3, y: 1},
        '1,0': {x: -1, y: -1},
        '1,1': {x: 0, y: -2},
        '1,2': {x: -1, y: -3},
        '2,0': {x: -2, y: -2},
        '2,1': {x: -1, y: -3},
        '3,0': {x: -3, y: -3}
      }
      console.log('pivot', pivotX, pivotY)
      this.blocks.forEach((block, idx) => {
        let relativeX = block.realPos.x - pivotX
        let relativeY = block.realPos.y - pivotY
        let rel = [relativeX, relativeY].join(',')
        block.realPos.x += offsets[rel].x
        block.realPos.y += offsets[rel].y
      })
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

if (localStorage.difficulty) difficulty.value = localStorage.difficulty
if (localStorage.boardWidth) boardWidth.value = localStorage.boardWidth
let side = Math.floor(canvas.width / boardWidth.value)
const ctx = canvas.getContext('2d')
const tick = 200
let score = 0
let record = 0
if (localStorage.getItem('record') !== null) {
    recordSpan.innerText = localStorage.getItem('record')
} else {
    localStorage.setItem('record', 0)
}

let interval

const history = []

let snake = [
    [2, 2], [3, 2], [4, 2], [5, 2]
]

const directions = ['E', 'W', 'S', 'N']
let direction, moved, nextMove, dash
let apple = []

difficulty.onchange = () => {
    difficulty.blur()
    clearInterval(interval)
    interval = 0
    localStorage.difficulty = difficulty.value
}

boardWidth.onchange = () => {
    if (boardWidth.value > 40) difficulty.value = 80
    if (boardWidth.value < 10) boardWidth.value = 10
    if (boardWidth.value > 100) boardWidth.value = 100
    boardWidth.blur()
    side = Math.floor(500 / boardWidth.value)
    localStorage.boardWidth = boardWidth.value
    canvas.height = canvas.width = side * boardWidth.value
    drawChessBoard()
    generateSnake()
    drawSnake()
    generateApple()
    drawApple()
}

document.body.onkeydown = function (event) {
    if (moved) {
        nextMove = event
        return
    }
    if (event.key == 'ArrowUp' && (direction != "S" || !direction)) direction = "N"
    else if (event.key == "ArrowDown" && direction != "N") direction = 'S'
    else if (event.key == "ArrowRight" && direction != "W") direction = "E"
    else if (event.key == "ArrowLeft" && direction != "E") direction = "W"
    else if ("1234567".includes(event.key)) dash = event.key
    else if (event.key == " ") dash = 200
    else return
    moved = true
    if (!interval) interval =  setInterval(() => {
        history.push({snake: snake.slice(), apple: apple.slice()})
        moveSnake()
        drawChessBoard()
        drawSnake()
        drawApple()
        moved = false
        if (nextMove) document.body.onkeydown(nextMove)
        nextMove = null
    }, +difficulty.value)
}

function drawChessBoard() {
    ctx.clearRect(0, 0, boardWidth.value, boardWidth.value)
    let color = "#AAD751"
    
    for (let i = 0; i < boardWidth.value; i++) {
        ctx.fillStyle = color = color == "#a2d149" ? "#AAD751" : "#a2d149"
        for (let j = 0; j < boardWidth.value; j++) {
            ctx.fillStyle = ctx.fillStyle == "#a2d149" ? "#AAD751" : "#a2d149"
            ctx.fillRect(i * side, j * side, side, side)
        }
    }
}

function drawSnake() {
    ctx.fillStyle = "green"
    for (let i = 0; i < snake.length - 1; i++) {
        ctx.fillRect(snake[i][0] * side, snake[i][1] * side, side, side)
    }
    ctx.fillStyle = "#2c612f"
    ctx.fillRect(snake[snake.length - 1][0] * side, snake[snake.length - 1][1] * side, side, side)
}

function moveSnake() {
    const head = snake[snake.length - 1]
    let newHead
    if (direction == "E") newHead = [head[0] + 1, head[1]]
    else if (direction == "S") newHead = [head[0], head[1] + 1]
    else if (direction == "W") newHead = [head[0] - 1, head[1]]
    else newHead = [head[0], head[1] - 1]
    const check = checkCollision(newHead)
    if (check == 'empty') {
        snake.shift()
        snake.push(newHead)
    } else if (check == 'end') {
        dash = 0
    } else if (check == 'border' || check == 'tail') {
        clearInterval(interval)
        interval = 0
        setTimeout(() => {
            replay()
        }, 300)
        return
    } else {
        snake.push(newHead)
        generateApple()
        scoreSpan.innerText = ++score
        checkScore()
    }

    if (dash) {
        dash--
        moveSnake()
    }
}

function replay() {
    document.body.onkeydown = null
    let interval = setInterval(() => {
        const state = history.shift()
        if (!state) {
            clearInterval(interval)
            location.reload()
            return
        }
        // ({snake, apple} = state)
        snake = state.snake
        apple = state.apple
        drawChessBoard()
        drawSnake()
        drawApple()
    }, difficulty.value / 5)
}

function generateApple() {
    do {
        apple[0] = rnd(boardWidth.value)
        apple[1] = rnd(boardWidth.value)
    } while (snake.find(coords => coords.join() == apple.join()))
}

function drawApple() {
    ctx.fillStyle = "red"
    ctx.fillRect(apple[0] * side + 1, apple[1] * side + 1, side - 2, side - 2)
}

function checkCollision(head) {
    if (snake.find(coords => coords.join() == head.join())) return 'tail'
    if (head[0] < 0 || head[0] >= boardWidth.value || head[1] < 0 || head[1] >= boardWidth.value) {
        return dash ? 'end' : 'border'
    }
    if (head.join() == apple.join()) return 'apple'
    return 'empty'
}

function checkScore() {
    if (localStorage.getItem('record') < score) {
        localStorage.setItem('record', score)
        recordSpan.innerText = localStorage.getItem('record')
    }
}

function generateSnake() {
    snake[0][0] = rnd(boardWidth.value - 6) + 3
    snake[0][1] = rnd(boardWidth.value - 6) + 3
    let nextVar = [
        [snake[0][0], snake[0][1] + 1],
        [snake[0][0], snake[0][1] - 1],
        [snake[0][0] + 1, snake[0][1]],
        [snake[0][0] - 1, snake[0][1]]
    ]
    snake[1] = nextVar[rnd(4)]
    nextVar = [
        [snake[1][0], snake[1][1] + 1],
        [snake[1][0], snake[1][1] - 1],
        [snake[1][0] + 1, snake[1][1]],
        [snake[1][0] - 1, snake[1][1]]
    ].filter(coords => !snake.some(part => part[0] == coords[0] && part[1] == coords[1]))
    snake[2] = nextVar[rnd(3)]
    nextVar = [
        [snake[2][0], snake[2][1] + 1],
        [snake[2][0], snake[2][1] - 1],
        [snake[2][0] + 1, snake[2][1]],
        [snake[2][0] - 1, snake[2][1]]
    ].filter(coords => !snake.some(part => part[0] == coords[0] && part[1] == coords[1]))
    snake[3] = nextVar[rnd(3)]
}

function rnd(max) {
    return Math.floor(Math.random() * max)
}

drawChessBoard()
generateSnake()
drawSnake()
generateApple()
drawApple()
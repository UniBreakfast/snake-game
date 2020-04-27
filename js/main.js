const rowSize = 20
const side = canvas.width / rowSize
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

let snake = [
    [2, 2], [3, 2], [4, 2], [5, 2]
]

const directions = ['E', 'W', 'S', 'N']

let direction = 'E'

let apple = []

difficulty.onchange = () => {
    difficulty.blur()
    clearInterval(interval)
    interval = 0
}

document.body.onkeydown = function (event) {
    if (!interval) interval =  setInterval(() => {
        moveSnake()
        drawChessBoard()
        drawSnake()
        drawApple()
    }, +difficulty.value)
    if (event.key == 'ArrowUp' && direction != "S") direction = "N"
    else if (event.key == "ArrowDown" && direction != "N") direction = 'S'
    else if (event.key == "ArrowRight" && direction != "W") direction = "E"
    else if (event.key == "ArrowLeft" && direction != "E") direction = "W"
    else return
}

function drawChessBoard() {
    ctx.clearRect(0, 0, 500, 500)
    let color = "#AAD751"
    
    for (let i = 0; i < rowSize; i++) {
        ctx.fillStyle = color = color == "#a2d149" ? "#AAD751" : "#a2d149"
        for (let j = 0; j < rowSize; j++) {
            ctx.fillStyle = ctx.fillStyle == "#a2d149" ? "#AAD751" : "#a2d149"
            ctx.fillRect(i * side, j * side, side, side)
        }
    }
    
    ctx.beginPath()
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
    } else if (check == 'border' || check == 'tail') {
        canvas.style.borderColor = 'red'
        clearInterval(interval)
        interval = 0
        setTimeout(() => {
            alert('Вы проиграли!')
            location.reload()
        }, 500)
    } else {
        snake.push(newHead)
        generateApple()
        scoreSpan.innerText = ++score
        checkScore()
    }
}

function generateApple() {
    do {
        apple[0] = rnd(rowSize)
        apple[1] = rnd(rowSize)
    } while (snake.find(coords => coords.join() == apple.join()))
}

function drawApple() {
    ctx.fillStyle = "red"
    ctx.fillRect(apple[0] * side + 3, apple[1] * side + 3, side - 6, side - 6)
}

function checkCollision(head) {
    if (snake.find(coords => coords.join() == head.join())) return 'tail'
    if (head[0] < 0 || head[0] == rowSize || head[1] < 0 || head[1] == rowSize) return 'border'
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
    snake[0][0] = rnd(rowSize - 6) + 3
    snake[0][1] = rnd(rowSize - 6) + 3
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

    direction = directions[rnd(4)]
}

function rnd(max) {
    return Math.floor(Math.random() * max)
}

drawChessBoard()
generateSnake()
drawSnake()
generateApple()
drawApple()
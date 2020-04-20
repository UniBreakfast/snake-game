const rowSize = 20
const side = canvas.width / rowSize
const ctx = canvas.getContext('2d')

let snake = [
    [2, 2], [3, 2], [4, 2], [5, 2]
]

let direction = 'E'

document.body.onkeydown = function (event) {
    if (event.key == 'ArrowUp' && direction != "S") direction = "N"
    else if (event.key == "ArrowDown" && direction != "N") direction = 'S'
    else if (event.key == "ArrowRight" && direction != "W") direction = "E"
    else if (event.key == "ArrowLeft" && direction != "E") direction = "W"
    else return
    moveSnake()
    drawChessBoard()
    drawSnake()
}

function drawChessBoard() {
    ctx.clearRect(0, 0, 500, 500)
    let color = "#ffffff"

    for (let i = 0; i < rowSize; i++) {
        ctx.fillStyle = color = color == "#e1e1e1" ? "#ffffff" : "#e1e1e1"
        for (let j = 0; j < rowSize; j++) {
            ctx.fillStyle = ctx.fillStyle == "#e1e1e1" ? "#ffffff" : "#e1e1e1"
            ctx.fillRect(i * side, j * side, side, side)
        }
    }

    ctx.beginPath()
}

function drawSnake() {
    ctx.fillStyle = "green"
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i][0] * side, snake[i][1] * side, side, side)
    }
}

function moveSnake() {
    snake.shift()
    const head = snake[snake.length - 1]
    if (direction == "E") snake.push([head[0] + 1, head[1]])
    else if (direction == "S") snake.push([head[0], head[1] + 1])
    else if (direction == "W") snake.push([head[0] - 1, head[1]])
    else snake.push([head[0], head[1] - 1])
}

drawChessBoard()
drawSnake()
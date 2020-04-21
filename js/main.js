const rowSize = 20
const side = canvas.width / rowSize
const ctx = canvas.getContext('2d')
const tick = 200
let score = 0

let interval

let snake = [
    [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]
]

let direction = 'E'

let apple = []
generateApple()

document.body.onkeydown = function (event) {
    if (!interval) interval =  setInterval(() => {
        moveSnake()
        drawChessBoard()
        drawSnake()
        drawApple()
    }, tick)
    if (event.key == 'ArrowUp' && direction != "S") direction = "N"
    else if (event.key == "ArrowDown" && direction != "N") direction = 'S'
    else if (event.key == "ArrowRight" && direction != "W") direction = "E"
    else if (event.key == "ArrowLeft" && direction != "E") direction = "W"
    else return
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
    }
}

function generateApple() {
    do {
        apple[0] = Math.floor(Math.random() * rowSize)
        apple[1] = Math.floor(Math.random() * rowSize)
    } while (snake.find(coords => coords.join() == apple.join()))
}

function drawApple() {
    ctx.fillStyle = "red"
    ctx.fillRect(apple[0] * side, apple[1] * side, side, side)
}

function checkCollision(head) {
    if (snake.find(coords => coords.join() == head.join())) return 'tail'
    if (head[0] < 0 || head[0] == rowSize || head[1] < 0 || head[1] == rowSize) return 'border'
    if (head.join() == apple.join()) return 'apple'
    return 'empty'
}

drawChessBoard()
drawSnake()
drawApple()
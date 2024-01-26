const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() method會回傳一個canvas的 drawing context 繪畫環境
//drawing context 可以用來在canvas內畫圖
const unit = 20;  // 蛇一單位是多少，蛇的身體
const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

let snake = []; // array中的每個元素，都是一個物件。物件的工作是儲存身體的x, y座標
snake[0] = {
    x: 80, y: 0
};
snake[1] = {
    x: 60, y: 0
};
snake[2] = {
    x: 40, y: 0
};
snake[3] = {
    x: 20, y: 0
};

// 製作果實
class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }
    drawFruit() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }
    pickALocation() {
        let overlapping = false;  // 重疊
        let new_x;
        let new_y;

        function checkOverlap(new_x, new_y){
            for(let i = 0; i < snake.length; i++){
                if(new_x == snake[i].x && new_y == snake[i].y){
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                }
            }
        }
        do{
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x, new_y);
        } while(overlapping);
        this.x = new_x;
        this.y = new_y;
    }
}
let myFruit = new Fruit();

// 移動蛇方向
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
    console.log(e);
    if(e.key == "ArrowLeft" && d != "Right") {
        d = "Left";
    } else if(e.key == "ArrowDown" && d != "Up") {
        d = "Down";
    } else if (e.key == "ArrowUp" && d != "Down") {
        d = "Up";
    } else if (e.key == "ArrowRight" && d != "Left") {
        d = "Right";
    }

    //每次按下上下左右鍵之後，在下一幀被畫出來之前，不接受任何keydown事件，防止連續按鍵讓蛇自殺
    window.removeEventListener("keydown", changeDirection);
}

//製作分數
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
let highestScore;
loadHighestScore();
document.getElementById("myHighScore").innerHTML = "最高分數：" + highestScore;

function draw () {
    // 每次畫圖之前，確認蛇有沒有咬到自己
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            clearInterval(myGame);
            alert("遊戲結束！");
            return;
        }
    }

    // 背景全設定為黑色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 畫果實
    myFruit.drawFruit();

    // 畫出蛇
    for(let i = 0; i < snake.length; i++){
        if(i == 0) {
            ctx.fillStyle = "lightgreen";  // 頭的顏色
        } else {
            ctx.fillStyle = "lightblue";  // 身體顏色
        }
        ctx.strokeStyle = "white"; // 蛇的白框
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        // ctx.fillRect( x, y, width, height )
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    //以目前以目前的d變數方向，變數方向，來決定蛇的下一幀要放在哪個座標
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if(d == "Left"){
        snakeX -= unit;
        if(snakeX < 0){
            snakeX = canvas.width - unit;
        }
    } else if(d == "Up") {
        snakeY -= unit;
        if(snakeY < 0){
            snakeY = canvas.height - unit;
        }
    } else if(d == "Down") {
        snakeY += unit;
        if(snakeY >= canvas.height){
            snakeY = 0;
        }
    } else if(d == "Right") {
        snakeX += unit;
        if(snakeX >= canvas.width){
            snakeX = 0;
        }
    }

    let newHead = {
        x: snakeX, y: snakeY
    }

    //確認snake是否有吃到果實
    if(snake[0].x == myFruit.x && snake[0].y == myFruit.y){
        // 1.重新選定一個新的果實隨機位置。 2.更新分數
        myFruit.pickALocation();
        score++;
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
        document.getElementById("myHighScore").innerHTML = "最高分數：" + highestScore;
    } else {
        snake.pop();
    }
    snake.unshift(newHead);

    window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

//初始設定最高分數
function loadHighestScore() {
    if(localStorage.getItem("highestScore") == null){
        highestScore = 0;
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}
//檢查、更新最高分數
function setHighestScore(score){
    if(score > highestScore){
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}
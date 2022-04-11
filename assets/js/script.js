const player = document.querySelector('.player');
const background = document.querySelector('.background');
const msgEnd = document.querySelector('.msg-end-game');
const msgPlay = document.querySelector('.msg-play-game');
const scoreEl = document.querySelector('.score span');

let isPlaying = false;
let isGameOver = false;
let isJumping = false;
let position = 0;
let score = 0;
let scoreInterval = null;
//------------------------------

function removeAllCactus(){
    let list = document.querySelectorAll('.cactus');
    list.forEach(c => {
        c.remove();
    });
}

function startGame(){
    removeAllCactus();
    background.classList.add('bg-animate');
    msgPlay.classList.add('d-none');
    msgEnd.classList.add('d-none');
    isPlaying = true;
    isGameOver = false;
    score = 0;
    scoreEl.innerText = score;

    createCactus();

    scoreInterval = setInterval(()=> {
        score += 1;
        scoreEl.innerText = score;
    }, 100);
}

function gameOver(){
    isPlaying=false;
    isGameOver = true;
    background.classList.remove('bg-animate');
    msgEnd.classList.remove('d-none');
    clearInterval(scoreInterval);
    
}

function jump(){
    isJumping  = true;
    let speed = 20;

    let upInterval = setInterval(() => {
        if(position >= 180){
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if(position <= 5){
                    clearInterval(downInterval);
                    isJumping = false;
                    player.style.bottom = 5+'px';
                }else{
                    position -= speed-10;
                    player.style.bottom = position+'px';
                } 
            }, speed);

        }else{
            position += speed-5;
            player.style.bottom = position+'px';
        }
    }, speed);

}

function moveCatus(cactus){
    let positionRight = -80;
    let speed = 2;

    let moveInterval = setInterval(()=>{
        cactusPosition = cactus.getBoundingClientRect();
        playerPosition = player.getBoundingClientRect();
        
        if(cactusPosition.x < -60){
            clearInterval(moveInterval);
            cactus.remove();
        }else if(isGameOver){
            clearInterval(moveInterval);
        }else if(cactusPosition.x >= 20 && cactusPosition.x <= 95 && playerPosition.y + 60 > cactusPosition.y){
            clearInterval(moveInterval);
            gameOver();
        }else{
            positionRight += speed;
            cactus.style.right = positionRight + 'px';
        }
    })
}

function createCactus(){
    if(isGameOver) return;

    let randomTime = Math.random() * 3000;

    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    cactus.style.right = -80 + 'px';
    background.appendChild(cactus);

    moveCatus(cactus);

    setTimeout(() => {
        createCactus();
    }, randomTime);
}

function handleKeyUp(event) {
    if (event.keyCode === 32) {
        if (isPlaying && !isJumping && !isGameOver) {
            jump();
        }        

        if(!isPlaying){
            startGame();
        }   
    }
}

document.addEventListener('keyup', handleKeyUp);
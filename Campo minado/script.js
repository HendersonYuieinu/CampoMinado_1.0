const canvas = document.getElementById("game-canva");
const ctx = canvas.getContext("2d");
const bombimage = document.getElementById("bomb-image");
const flagimage = document.getElementById("flag-image")
const flagcount = document.getElementById("flagcount")
const score = document.getElementById("score")
const resetbutton = document.getElementById("reset")
const relogio = document.getElementById("clock");
const turnbutton = document.getElementById("turn");

const blocksize = 40;
const grade = 15;

var bombnumber = (grade * grade) / 5;
var flagcontagem = bombnumber;
var pontuacao = 0;
var lose = false; //vai definir se o jogador perdeu
var vitoria = false;
var segundos = 0;
var intervalo;
var turnflag = false;
var touchmode = false;

canvas.width = grade * blocksize;
canvas.height = grade * blocksize;

flagcount.textContent = flagcontagem;

score.textContent = String(pontuacao).padStart(8, '0');

const cores = {
    "cor1": "rgba(44, 53, 179, 1)",
    "cor2": "rgba(171, 175, 189, 1)",
    "cor3": "rgba(0, 0, 0, 1)",
    
    "cor4": "rgba(44, 53, 179, 1)",
    "cor5": "rgba(54, 63, 189, 1)"
};

numbercolors = ["darkGreen", "darkBlue"]
lonacolors = [cores["cor4"], cores["cor5"]]

var mouse = {  //vai pegar a posicao do mouse
    x : undefined,
    y : undefined
}
let table = [];
let lona = [];
let flaglayer = [];
const colormap = []; //define o mapeamento das cores dos numeros

const validarvitoria = () => {
    console.log("chamado");
    let cont = 0;
    for(let i=0; i<grade; i++){
        for(let j=0; j<grade; j++){
            if(flaglayer[i][j] === 1 && table[i][j] === 1){
                cont ++;
            }
        }
    }
    if(cont === bombnumber && !vitoria){
        vitoria = true;
        alert("Voce ganhou, Parabens!");
    }
}

const contagem = () => {
    segundos++;

    if(lose || vitoria){
        clearInterval(intervalo)
        return;
    }

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600)/60);
    const segundos_ = segundos % 60;

    const horasminutosesegundos = String(horas).padStart(2, '0') + ':' +
    String(minutos).padStart(2, '0') + ':' +
    String(segundos_).padStart(2, '0');

    relogio.textContent = horasminutosesegundos;
}

const drawBomb = (x, y) => {
    let xonflaglayer = x * blocksize - 1;
    let yonflaglayer = y * blocksize - 2;
    ctx.drawImage(bombimage, xonflaglayer, yonflaglayer, 40, 40);
}

const drawFlag = (x, y) => {
    let xontable = x * blocksize + 2;
    let yontable = y * blocksize + 2;
    ctx.drawImage(flagimage, xontable, yontable, 35, 35);
}

const definebombs = (bombnumber) => { //define as bombas na tabela
    let number = bombnumber;
    while(number > 0){
        let x = getrandomnumber(grade);
        let y = getrandomnumber(grade);
        
        if(table[y][x] === 0){
            table[y][x] = 1;
            number--;
        }
    }
}

const drawblock = () => {
    for(let i = 0; i < grade; i++){
        for(let j = 0; j < grade; j++){
            createblock(i * blocksize, j * blocksize, blocksize, blocksize, cores["cor3"]);
            createblock(i * blocksize + 1, j * blocksize + 1, blocksize - 2, blocksize - 2, cores["cor2"]);
            if(table[i][j] === 1){
                drawBomb(i, j);
            }
        }
    }
}

const drawlona = () => {
    let co = 0
    for(let i = 0; i < grade; i++){
        for(let j = 0; j < grade; j++){
            if(lona[i][j] === 1){
                createblock(i * blocksize + 1, j * blocksize + 1, blocksize - 2, blocksize -2, lonacolors[co]);
            }
            co===0? co=1: co=0;
        }
    }
}

const drawflaglayer = () => {
    for(let i = 0; i < grade; i++){
        for(let j = 0; j < grade; j++){
            if(flaglayer[i][j] === 1){
                drawFlag(i, j);
            }
        }
    }
}

const enumerate = () => {
    for(let i = 0; i < grade; i++){
        for(let j = 0; j < grade; j++){
            let color = colormap[i][j];
            const value = counterbombs(i, j)
            ctx.fillStyle = color;
            ctx.font = "20px Arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(value > 0? value: "", i * blocksize + 20, j * blocksize + 20)
        }
    }
}

let bombtimeouts = [];

const revealALLbombs = () => {
    let delay = 0;
    for(let i=0; i<grade; i++){
        for(let j=0; j<grade; j++){
            if(table[j][i] === 1 && flaglayer[j][i] === 0){
                const timeout = setTimeout(function(){
                    lona[j][i] = 0;
                    update();
                }, delay);
                bombtimeouts.push(timeout)
                delay += 60;
            }
        }
    }
}

const creategame = () => {    
    for(let i=0; i<grade; i++){
        table.push(Array(grade).fill(0));
    }
    for(let i=0; i<grade; i++){
        lona.push(Array(grade).fill(1));
    }
    for(let i=0; i<grade; i++){
        flaglayer.push(Array(grade).fill(0));
    }
    for(let i = 0; i < grade; i++){
        colormap.push(Array(grade).fill(0))
    }
    for(let i = 0; i < grade; i++){
        for(let j = 0; j < grade; j++){
            colormap[i][j] = numbercolors[getrandomnumber(numbercolors.length)];
        }
    }
}

const update = () =>{
    drawblock();
    enumerate();
    drawlona();
    drawflaglayer();
    validarvitoria();
}
function getrandomnumber(max){ //funcao auxiliar para gerar numero aleatorio de 0 a max
    return Math.floor(Math.random() * (max - 0) + 0);
};

function createblock(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

//<Funcoes para teste>
function TotalBombs(){
    let contador = 0;
    for(let i=0;i<grade;i++){
        for(let j=0;j<grade;j++){
            if(table[i][j] === 1){
                contador++;
            }
        }
    }
    return contador;
}
function revealAll(){
    for(let i=0;i<grade;i++){
        for(let j=0;j<grade;j++){
            if(lona[i][j] === 1){
                lona[i][j] = 0;
            }else{
                lona[i][j] = 1;
            }
        }
    }
    update();
    return;
}
//</Funcoes para teste>

function revealFreeSpaces(x, y){ //revela os espacos livres em cadeia
    const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];
    for(let [dx, dy] of directions){
        let nexty = y + dy;
        let nextx = x + dx;
        if(nexty < 0 || nexty >= grade || nextx < 0 || nextx >= grade){ //pula caso esteja fora dos limites da tabela
            continue;
        }
        if(lona[nextx][nexty] === 1 && flaglayer[nextx][nexty] === 0){
            lona[nextx][nexty] = 0;
            if(counterbombs(nextx, nexty) === 0){
                revealFreeSpaces(nextx, nexty) //recursividade
            }
        }
    }
}

function counterbombs(y, x){ //contar as bombas ao redor, diferente da funcao de totalBombs que conta todas as bombas no jogo.
    let count = 0;
    if(table[y][x] === 1){
        return "B"; //somente para ignorar caso seja uma bomba
    }
    else{
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                let nexty = y + i;
                let nextx = x + j;
                if(i === 0 && j === 0){
                    continue; //ignora o elemento [y - 0][x - 0] já que é o proprio elemento [y][x]
                }
                if(nexty < 0 || nexty >= grade || nextx < 0 || nextx >= grade){
                    continue; //
                }
                
                if(table[nexty][nextx] === 1){
                    count++
                }
            }
        }
    }
    return count;
}

function reveal(x, y){ //revela ao clicar
    lona[x][y] = 0;
    if(table[x][y] === 1){
        alert("LOSE!")
        lose = true;
        revealALLbombs();
        return;
    }else if(table[x][y] === 0){
        if(counterbombs(x, y) >= 6){
            pontuacao += 300;
        }
        else if(counterbombs(x, y) >= 3){
            pontuacao += 150;
        }
        else if(counterbombs(x, y) > 0){
            pontuacao += 50;
        }
        else if(counterbombs(x, y) === 0){
            pontuacao += 600;
            revealFreeSpaces(x, y);
        }
        score.textContent = String(pontuacao).padStart(8, '0');
        return;
    }
}

function turnclick(){
    turnflag? turnflag = false: turnflag = true;

    if(turnflag){
        turnbutton.className = "stateonpressed";
        console.log("modo de colocar bandeira ativado")
        turnbutton.innerHTML = `<img class="buttonflagimage" src="assets/flag.png" alt="flag">`
    }   
    else{
        turnbutton.className = "statenopressed";
        console.log("modo de revelar ativado");
        turnbutton.innerHTML = `<img class="buttoneyeimage" src="assets/eye.png" alt="reveal">`
    }
}

function resetclick(){
    
    resetbutton.addEventListener("mousedown", () =>{
        resetbutton.className = "onpressed";
    });
    resetbutton.addEventListener("touchstart", () =>{
        resetbutton.className = "onpressed";
    });

    resetbutton.addEventListener("mouseup", () =>{
        resetbutton.className = "nopressed";
    });
    resetbutton.addEventListener("touchend", () =>{
        resetbutton.className = "nopressed";
    });

    clearInterval(intervalo);
    relogio.textContent = '00:00:00';
    lose = false;
    vitoria = false;
    segundos = 0;
    intervalo = setInterval(contagem, 1000);
    bombtimeouts.forEach(id => clearTimeout(id));
    bombtimeouts = []
    console.log("resetado");
    pontuacao = 0;
    score.textContent = String(pontuacao).padStart(8, '0');
    flagcontagem = bombnumber;
    flagcount.textContent = flagcontagem;
    table = [];
    lona = [];
    flaglayer = [];
    
    creategame();
    definebombs(bombnumber);
    update();
}




canvas.addEventListener("touchstart", (event) => {
    touchmode = true;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const mousex = touch.clientX - rect.left;
    const mousey = touch.clientY - rect.top;
    
    const x = Math.floor(mousex / blocksize);
    const y = Math.floor(mousey / blocksize);
    
    console.log(`[${y}][${x}]`);
    
    if(!turnflag){
        if(!lose && flaglayer[x][y] === 0 && lona[x][y] === 1){
            reveal(x, y);
        }
    }
    else{
        if(event.touches.length === 1 && !lose && lona[x][y] === 1){
            if(flaglayer[x][y] === 0 && flagcontagem > 0){
                flaglayer[x][y] = 1;
                flagcontagem--;
            }else if(flaglayer[x][y] === 1){
                flaglayer[x][y] = 0;
                flagcontagem++;
            } 
            flagcount.textContent = flagcontagem;
        }
    }
    
    update();
});

canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mousex = event.clientX - rect.left;
    const mousey = event.clientY - rect.top;
    
    const x = Math.floor(mousex / blocksize);
    const y = Math.floor(mousey / blocksize);
    
    console.log(`[${y}][${x}]`);
    
    if(!touchmode){
        if(event.button === 0 && !lose && flaglayer[x][y] === 0 && lona[x][y] === 1){
            reveal(x, y);
        }
        
        if(event.button === 2 && !lose && lona[x][y] === 1){
            if(flaglayer[x][y] === 0 && flagcontagem > 0){
                flaglayer[x][y] = 1;
                flagcontagem--;
            }else if(flaglayer[x][y] === 1){
                flaglayer[x][y] = 0;
                flagcontagem++;
            } 
            flagcount.textContent = flagcontagem;
        }
        
    }
    
    update();
});

canvas.addEventListener("contextmenu", (event) => { //ignora o contexto de menu ao clicar com o botao direito do mouse
    event.preventDefault();
});

creategame();
definebombs(bombnumber);
intervalo = setInterval(contagem, 1000);
update();

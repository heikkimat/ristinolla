const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
const grid = () => Array.from(document.getElementsByClassName('q'));
//helper functions
const qNumId = (qEl) => Number.parseInt(qEl.id.replace('q', ''));
const emptyQs = () => grid().filter(_qEl => _qEl.innerText ==='');
const isAllSame = (arr) => arr.every(_qEl => _qEl.innerText === arr[0].innerText && _qEl.innerText !== '');
const takeTurn = (index, letter) => grid()[index].innerText = letter;
const endGame = (winningSequence) => {
    winningSequence.forEach(_qEl => _qEl.classList.add('winner'));
    disableListeners();
}

const isTwoSame = (mark, arr) => {
    if (arr[0].innerText === mark && arr[1].innerText === mark && arr[2].innerText === '')
        return qNumId(arr[2]);
    if (arr[0].innerText === mark && arr[1].innerText === '' && arr[2].innerText === mark)
        return qNumId(arr[1]);
    if (arr[0].innerText === '' && arr[1].innerText === mark && arr[2].innerText === mark)
        return qNumId(arr[0]);
    return null;
}

const checkForTwo = (mark) => {
    let success = false;
    let qNum = null;
    winningCombos.forEach(_c =>{
        const _grid = grid();
        const sequence = [_grid[_c[0]], _grid[_c[1]], _grid[_c[2]]];
        const qN = isTwoSame(mark, sequence);
        if(qN !== null) {
            success = true;
            qNum = qN;
        }
    });
    return {
        succ: success,
        qNum: qNum,
        succ2: success,
        qNum2: qNum
    };
}

const opponentChoice = () => {
    //logic to make choice
    //0. 10% random part to "mistakes"
    if(Math.random() < 0.1){
        console.log('random');
        return qNumId(emptyQs()[Math.floor(Math.random()*emptyQs().length)]);
    }
    //1. can I win?
    const {succ, qNum} = checkForTwo('o');
    if(succ)
        return qNum;
    //2. can you win?
    const {succ2, qNum2} = checkForTwo('x');
    if(succ2)
        return qNum2;
    //3. is center free
    if(typeof emptyQs().find(element => qNumId(element) === 4) !== 'undefined')
        return 4;
    //4. take corner
    const notCorners = [1,3,5,7]
    const corners = () => emptyQs().filter(element => {
        return notCorners.every(el => el !== qNumId(element))
    });
    if(corners().length > 0)
        return qNumId(corners()[Math.floor(Math.random()*corners().length)]);
    //5. random
    return qNumId(emptyQs()[Math.floor(Math.random()*emptyQs().length)]);
}

const checkForVictory = () => {
    let victory = false;
    winningCombos.forEach(_c =>{
        const _grid = grid();
        const sequence = [_grid[_c[0]], _grid[_c[1]], _grid[_c[2]]];
        if(isAllSame(sequence)) {
            victory = true;
            endGame(sequence);
        }
    });
    return victory;
}
const opponentTurn = () => {
    disableListeners();
    setTimeout(() => {
        takeTurn(opponentChoice(), 'o');
        if(!checkForVictory())
            enableListeners();
    }, 1000);
};

const clickFn = ($event) => {
    takeTurn(qNumId($event.target), 'x');
    if(!checkForVictory())
        opponentTurn();
};

//listeners
const enableListeners = () => emptyQs().forEach(_qEl => _qEl.addEventListener('click', clickFn));
const disableListeners = () => grid().forEach(_qEl => _qEl.removeEventListener('click', clickFn));
enableListeners();
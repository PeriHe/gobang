var gt = document.getElementById("gt");
var roundLabel = document.getElementById("round-label");
var allpieces = []; //存放所有棋子的二维数组
var currentRound = true;  //记录当前该那个颜色下子,true黑色
var pieceStack = []; //本局游戏的棋子回合记录
var isOver; //记录游戏是否结束

//创建棋盘td
for(var i = 0; i < 19; i++) {
    var tr = gt.insertRow();
    var tempArr = [];
    for(var j = 0; j < 19; j++) {
        var td = tr.insertCell();
        td.onclick = tdClick;
        var d = document.createElement("div");
        td.appendChild(d);
        tempArr.push(d);
    }
    allpieces.push(tempArr);
}

//初始化游戏
function initGame() {
    isOver = false;
    //初始化所有td
    allpieces.forEach(tr => {
        tr.forEach(p => {
            p.setAttribute("state", "normal");
        });
    })
    if(pieceStack.length > 0) {
        var po = pieceStack[pieceStack.length-1];
        allpieces[po.y][po.x].classList.remove("current");
    }
    
    pieceStack = [];// 清空栈记录

    // currentRound = true;
    // roundLabel.textContent = "黑方落子ing...";

}

//td点击事件函数
function tdClick(e) {
    if(isOver) {
        return;
    }
    var state = e.target.getAttribute("state");
    if(state === "normal") {
        if(currentRound) {
            e.target.setAttribute("state", "black");
        }else {
            e.target.setAttribute("state", "white");
        }

        //标记当前刚下的子为红边框
        if(pieceStack.length > 0) {
            var po = pieceStack[pieceStack.length - 1];
            allpieces[po.y][po.x].classList.remove("current");
        }

        var pos = piecePosition(e.target); //记录本棋子
        pieceStack.push(pos);
        //判断是否赢了
        if(isWin(pos)) {
            isOver = true;
            var color = currentRound ? "黑" : "白";
            alert(color + "方胜利");
        }
        //切换回合
        currentRound = !currentRound;
        roundLabel.textContent = (currentRound ? "黑" : "白") + "方落子ing..." ;
    }
}

//获得棋子的坐标
function piecePosition(p) {
    for(var i = 0; i< 19; i++) {
        var col = allpieces[i].indexOf(p);
        if(col >= 0) {
            return {x: col, y: i};
        }
    }
}

//悔棋按钮事件函数
function retractClick() {
    if(isOver) {
        return;
    }
    if(pieceStack.length <= 0) {
        return;
    }
    var pos = pieceStack.pop();
    allpieces[pos.y][pos.x].classList.remove("current");    
    allpieces[pos.y][pos.x].setAttribute("state", "normal");
    if(pieceStack.length > 0) {
        var po = pieceStack[pieceStack.length-1];
        allpieces[po.y][po.x].classList.add("current");
    }
    

    currentRound = !currentRound;
    roundLabel.textContent = (currentRound ? "黑" : "白") + "方落子ing..." ;
}


//检查是否胜利
function isWin(pos) {
    //检查左右
    if(dirWin("lr", pos)) {
        return true;
    }
    //检查上下
    if(dirWin("ud", pos)) {
        return true;
    }
    //检查左上到右下
    if(dirWin("lurd", pos)) {
        return true;
    }
    //检查右上到左下
    if(dirWin("ruld", pos)) {
        return true;
    }
    return false;

}

//判断某个方向是否胜利
function dirWin(dir, pos){
    var color = currentRound ? "black" : "white";
    var pNum = 1;
    var currentPosition = {x: pos.x, y: pos.y};
    while(true) {
        if(dir === "lr") {
            currentPosition.x--;
        }else if(dir === "ud") {
            currentPosition.y--;
        }else if(dir === "lurd") {
            currentPosition.x--;
            currentPosition.y--;
        }else if(dir === "ruld") {
            currentPosition.x++;
            currentPosition.y--;
        }

        if(!isInboard(currentPosition)) {
            break;
        }
        if(allpieces[currentPosition.y][currentPosition.x].getAttribute("state") === color) {
            pNum++;
            if(pNum >= 5) {
                return true;
            }
        }else {
            break;
        }
    }
    var currentPosition = { x: pos.x, y: pos.y };
    while(true) {
        if(dir === "lr") {
            currentPosition.x++;
        }else if(dir === "ud") {
            currentPosition.y++;
        }else if(dir === "lurd") {
            currentPosition.x++;
            currentPosition.y++;
        }else if(dir === "ruld") {
            currentPosition.x--;
            currentPosition.y++;
        }

        if(!isInboard(currentPosition)) {
            break;
        }
        if(allpieces[currentPosition.y][currentPosition.x].getAttribute("state") === color) {
            pNum++;
            if(pNum >= 5) {
                return true;
            }
        }else {
            break;
        }
    }
    return false;
}



//判断一个坐标是否在棋盘内
function isInboard(point) {
    return point.x >= 0 && point.y < 19 && point.y >= 0 && point.x < 19;
} 


initGame();
// This script is meant to represent a sample function that the online interface could replicate

// holds the representation of the tic tac toe grid
var grid = new Array();

// 0 is empty, 1 is player 1, 2 is player 2(AI)
for (i=0;i<9;i++){
    grid[i] = 0;
}

var EMPTY = 0;
var HUMAN = 1;
var AI = 2;

check = function(player, atLeast, gridRep){
    count = 0;
    for(i=0;i<9;i++){
        if(gridRep[i] == 1)
            if(grid[i] == player)
                count++;
    }
    return count >= atLeast;
}

play = function(player, gridRep){
    played = false;
    for(i=0;i<9;i++){
        if(gridRep[i] == 1){
            if(grid[i] == EMPTY){
                grid[i] = player;
                played = true;
                break;
            }
        }
    }
    return played;
}

try0 = function(player, gridRep){
    return play(player, gridRep);
}

runAI = function(){
    //AI player is player 2
    player = AI;
    
    //win heuristic
    if (check(AI, 2, [1,1,1,0,0,0,0,0,0]))
        if(play(AI, [1,1,1,0,0,0,0,0,0]))
            return;
    else if (check(AI, 2, [0,0,0,1,1,1,0,0,0]))
        if (play(AI, [0,0,0,1,1,1,0,0,0]))
            return;
    else if (check(AI, 2, [0,0,0,0,0,0,1,1,1]))
        if (play(AI, [0,0,0,0,0,0,1,1,1]))
            return;
    else if (check(AI, 2, [1,0,0,1,0,0,1,0,0]))
        if (play(AI, [1,0,0,1,0,0,1,0,0]))
            return;
    else if (check(AI, 2, [0,1,0,0,1,0,0,1,0]))
        if (play(AI, [0,1,0,0,1,0,0,1,0]))
            return;
    else if (check(AI, 2, [0,0,1,0,0,1,0,0,1]))
        if (play(AI, [0,0,1,0,0,1,0,0,1]))
            return;
    else if (check(AI, 2, [1,0,0,0,1,0,0,0,1]))
        if (play(AI, [1,0,0,0,1,0,0,0,1]))
            return;
    else if (check(AI, 2, [0,0,1,0,1,0,1,0,0]))
        if (play(AI, [0,0,1,0,1,0,1,0,0]))
            return;
        
    //block win heuristic
    if (check(HUMAN, 2, [1,1,1,0,0,0,0,0,0]))
        if (play(AI, [1,1,1,0,0,0,0,0,0]))
            return;
    else if (check(HUMAN, 2, [0,0,0,1,1,1,0,0,0]))
        if (play(AI, [0,0,0,1,1,1,0,0,0]))
            return;
    else if (check(HUMAN, 2, [0,0,0,0,0,0,1,1,1]))
        if (play(AI, [0,0,0,0,0,0,1,1,1]))
            return;
    else if (check(HUMAN, 2, [1,0,0,1,0,0,1,0,0]))
        if (play(AI, [1,0,0,1,0,0,1,0,0]))
            return;
    else if (check(HUMAN, 2, [0,1,0,0,1,0,0,1,0]))
        if (play(AI, [0,1,0,0,1,0,0,1,0]))
            return;
    else if (check(HUMAN, 2, [0,0,1,0,0,1,0,0,1]))
        if (play(AI, [0,0,1,0,0,1,0,0,1]))
            return;
    else if (check(HUMAN, 2, [1,0,0,0,1,0,0,0,1]))
        if (play(AI, [1,0,0,0,1,0,0,0,1]))
            return;
    else if (check(HUMAN, 2, [0,0,1,0,1,0,1,0,0]))
        if (play(AI, [0,0,1,0,1,0,1,0,0]))
            return;
    
    //take center heuristic
    if (try0 (AI, [0,0,0,0,1,0,0,0,0]))
        return;
    
    //block L-win
    if (check(HUMAN, 2, [0,1,0,1,0,0,0,0,0]))
        if (play(AI, [1,0,0,0,0,0,0,0,0]))
            return;
    else if (check(HUMAN, 2, [0,1,0,0,0,1,0,0,0]))
        if (play(AI, [0,0,1,0,0,0,0,0,0]))
            return;
    else if (check(HUMAN, 2, [0,0,0,1,0,0,0,1,0]))
        if (play(AI, [0,0,0,0,0,0,1,0,0]))
            return;
    else if (check(HUMAN, 2, [0,0,0,0,0,1,0,1,0]))
        if (play(AI, [0,0,1,0,0,0,0,0,1]))
            return;
        
    //take adj. side square
    if (check(HUMAN, 1, [1,0,0,0,0,0,0,0,0]))
        if (play(AI, [0,1,0,1,0,0,0,0,0]))
            return;
    else if (check(HUMAN, 1, [0,0,1,0,0,0,0,0,0]))
        if (play(AI, [0,1,0,0,0,1,0,0,0]))
            return;
    else if (check(HUMAN, 1, [0,0,0,0,0,0,1,0,0]))
        if (play(AI, [0,0,0,1,0,0,0,1,0]))
            return;
    else if (check(HUMAN, 1, [0,0,0,0,0,0,0,0,1]))
        if (play(AI, [0,0,0,0,0,1,0,1,0]))
            return;
        
    //take corner opposite captured corner
    if (check(HUMAN, 1, [1,0,0,0,0,0,0,0,0]))
        if (play(AI, [0,0,0,0,0,0,0,0,1]))
            return;
    else if (check(HUMAN, 1, [0,0,1,0,0,0,0,0,0]))
        if (play(AI, [0,0,0,0,0,0,1,0,0]))
            return;
    else if (check(HUMAN, 1, [0,0,0,0,0,0,1,0,0]))
        if (play(AI, [0,0,1,0,0,0,0,0,0]))
            return;
    else if (check(HUMAN, 1, [0,0,0,0,0,0,0,0,1]))
        if (play(AI, [1,0,0,0,0,0,0,0,0]))
            return;
        
    //take corner heuristic
    if (try0 (AI, [1,0,1,0,0,0,1,0,1]))
        return;
    
    //fall-through
    try0 (AI, [1,1,1,1,1,1,1,1,1]);
}
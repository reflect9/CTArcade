

function get(name) { return localStorage.getItem(name); }


/*
	Game object
*/
function TicTacToe() {
	this.p1 = 'X'; 			// mark for each player   
	this.p2 = 'O';			
	this.width=3; 
	this.height=3;  // initial dimension of board
	var turn;  		// whose turn it is now --> this.p1 or this.p2 
	var started; 	// true when playing game is on
	var conversationState; 	// 
	this.history = [];	// pop in/out current board state
	this.strategySet = [
						{'name':"Win",'code':"takeWin",'enabled':true},
						{'name':"Block Win",'code':"takeBlockWin",'enabled':true},
						{'name':"Take Center",'code':"takeCenter",'enabled':true},
						{'name':"Take Any Corner",'code':"takeAnyCorner",'enabled':true},
						{'name':"Take Adjacent Square",'code':"takeAdjacentSquare",'enabled':true},
						{'name':"Random Move",'code':"takeRandom",'enabled':true},
						{'name':"Take OppositeCorner",'code':"takeOppositeCorner",'enabled':true}
					];
	
	// var script = {
		// greeting : "Hello! I'm Robin, here to help you create own TicTacToe AI. Do you know how to play TicTacToe? <span class='console_clickable'>No, tell me what it is.</span> Let's start by playing a few rounds. ",
		// startQueue : "Click the center cell when ready to start.",
		// yourTurn : "Your turn. Which cell do you want to take?",
		// requestExplain : "Good move! Could you explain why you took it?",
		// guess : "Let me guess why you took the cell.",
		// lost : "You lost! Do you want to go back and try again? Or start another game?",
		// win : "Amazing! I cannot beat you. One more round?"
	// };

    this.turn = this.p1;
    this.started = false;    
    this.board = setupBoard(this.width, this.height);

	/* INIT */

    function setupBoard(col, row) {
        var b = new Array();
        for (var i = 0; i < row; i++) {
            b.push(new Array(col));
        }
        return b;
    }

	/* BASIC FUNCTIONS */

    this.getTurn = function () {   	return this.turn			};
    this.historyPush = function(b,loc,t) {
    	this.history.push({'board':this.cloneBoard(b), 'loc':loc, 'turn':this.turn});
    }
	this.getBoard = function () {     return this.board;	  }
	this.cloneBoard = function(b) {
		var nb = setupBoard(this.width,this.height);
		for(var i=0;i<this.width;i++) {
			for (var j=0;j<this.height;j++) {
				nb[i][j] = b[i][j];
			}
		}
		return nb;
	}
    this.move = function(i, j, t) {
        if (this.turn != t) {
        	console.log("player turn doesn't match!" + t + "!=" + this.turn);	
        	return;
        } 
        if (this.board[i][j] != null) {
        	console.log("cannot move on occupied cell [" + i+","+j+"]");	
        	return;    	
        }
       	if (!started)   started = true;
    	this.historyPush(this.board,[i,j],t); // store current board and turn in history array
        this.board[i][j] = this.turn;            
        this.turn = (this.turn == this.p1) ? this.p2 : this.p1;
        return this.board[i][j];
    }

    
    this.isFull = function() {
        for (var i = 0; i < 3; i++)
			for (var j =0; j<3;j++)
			    if (this.board[i][j] == null)
			        return false;
        return true;
    }
    
	this.checkCol =function(x) {
        if (this.board[x][0] == this.board[x][1] && (this.board[x][0] == this.board[x][2]) && (this.board[x][0] != null)) 
        	return this.board[x][0];
        else return false;
    }
    
    this.checkRow = function(y) {
        if (this.board[0][y] == this.board[1][y] && (this.board[0][y] == this.board[2][y]) && (this.board[0][y] != null))
        	return this.board[0][y];
        else return false;
    }
    
    this.checkDiag1 = function()  {
        if (this.board[0][0] != null && this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2]) 
        	return this.board[0][0];
        else return false;
        
    }
    
    this.checkDiag2 = function() {
        if (this.board[2][0] != null && this.board[1][1] == this.board[2][0] && this.board[0][2] == this.board[2][0]) 
        	return this.board[2][0];
        else return false;
    }
    
    this.checkForWinner = function() {
        /* Check the top row */
        var result = false;
        for (var i=0; i < 3; i++) {
            result = this.checkRow(i);
            if (result != false)
                return result;
            result = this.checkCol(i);
            if (result != false)
                return result;
        }
        result = this.checkDiag1();
        if (result != false)
            return result;
        result = this.checkDiag2();
        if (result != false)
            return result;
        return false;
    }
    
	this.analyzeMove = function(brd,player,userMoveLoc) {
		// check which strategies are matching with given brd,turn,loc
		matchingStrategy = [];
		for (key in this.strategyList) {
			st = strategy[key];
			console.log(st);
			//console("ana" + brd,player);
			result = this[st.code](brd,player);
			if (result.success) {
				// if the strategy finds possible moves(locList), then check if 
				// user's move(loc) is in the moves 
				
				if(result.loc.has(userMoveLoc)) {
					matchingStrategy.push({'name':st.name,'code':st.code, 'locList':result.loc});
				}
				
			}
		}
		console.log(matchingStrategy);
		return matchingStrategy;
	}
    this.restart = function() {
        this.turn = this.p1;
        this.board = setupBoard(this.width, this.height);
        this.history = [];
        this.started=false;
    }
    
    this.getStatus = function() {
        if (!this.started)
            return "New Game, X to move";
        else if (this.turn == this.p1)
            return "X to move";
        else
            return "Y to move";
        
    }
    
    
    this.findBestStrategy = function(brd,player,strategy) {
    	if (this.isFull()) {
    		return {'message':"Tie Game",'locList':undefined};
    	}
    	for (key in strategy) {
    		st = strategy[key];
    		result = this[st.code](brd,player);
    		if (result.success)  {
    			bestStrategy = {'message':st.name,'locList':result.loc};
    			return bestStrategy;
    		}
    	}
		bestStrategy = {'message':'no strategy found','locList':undefined};
		return bestStrategy;
    }
    
    
    /* CONVERSATION */
   
   
    
    
    
    
	/* STRATEGIES */
    this.takeWin = function(brd,player) {
		var result = new Object();		
		result['success']=false;
		result['loc'] = [];		// one strategy can generate multiple locations
        // Check diagonals for win
        var combos = [
            [[0,0],[1,1],[2,2]],
            [[0,2],[1,1], [2,0]], 
            
            [[0,0], [0,1], [0,2]], 
            [[1,0], [1,1], [1,2]], 
            [[2,0], [2,1], [2,2]], 
            
            [[0,0], [1,0], [2,0]], 
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],         
        ];
        
        for (var  i in combos) {
            var positions = combos[i];
            var open = null;
            var count = 0;
            for (var pos in positions) {
                var move = positions[pos];
                var x = move[0];
                var y = move[1];
                //console.log(brd, player);
                if (brd[x][y] == player)
                    count++;
                else if (!brd[x][y]) 
                    open = move;
            }
            
            if (count == 2 && open) {
				result['success']=true;
				result['loc'].push(open);	
				// alert(result['loc']);
				//return result;
            }
        }
        
		return result;
        
    }
    this.takeBlockWin = function(brd,player) {
		var result = new Object();
		result['success']=false;
		result['loc'] = [];		
        var origTurn = player
        // Flip turn
        player = (player == this.p1) ? this.p2 : this.p1;
        var willWin = this.takeWin(brd,player);
        // Restore original turn
        player = origTurn;
        // if (!result)
            // return this.stopL();
			
		if (willWin['success']) {
			return willWin;
			// loc = willWin['loc']
			// if(!this.board[loc[0]][loc[1]]) {
				// // I can and must block there
				// result['success']=true;
				// result['loc'].push(loc);	
				// //return result;
			// } else {
				// // opponent's winning spot is already occupied
				// //result['success']=false;
				// return result;
			// }		
		} else {
			// no winning condition for opponent
			result['success']=false;
			return result;
			//asdfasdfasdfasf
		}		
			
        //return (result && !board[result[0]][result[1]]) ? result : false;
    }
    this.takeCenter = function(brd,player) {
    	// alert("take Center");
		var result = new Object();
		result['success']=false;  
		result['loc'] = [];	
		// console.log('check takecenter' + brd[1][1]);
        if (!brd[1][1]) {
			result['success']=true;
			result['loc'].push([1,1]);	
			// alert(result['loc']);
			return result;
        } else {
        	// alert('center occupied');
			result['success']=false;	
			return result;
		}
    }
	this.takeAnyCorner = function(brd,player) {
		var result = new Object();	
		result['success']=false;
		result['loc'] = [];	
		var moves = [[0,0], [2,2], [2,0], [0, 2]];
		for (var i=0;i<moves.length; i++) {
           var move=moves[i];
           var x = move[0];
           var y = move[1];
           
           if (!brd[x][y]) {
               // this.move(x,y);
				result['success']=true;
				result['loc'].push([x, y]);	
				//return result;
           }
		}
		// result['success']=false;
		return result;
    }
    this.takeAdjacentSquare = function(brd,player) {
        var result = new Object();
        result['success']=false;
		result['loc'] = [];	
        var moves = [[0,1], [1,0], [1,2], [2,1]];
        for (var i=0; i<moves.length;i++) {
            var pt = moves[i];
            if (!brd[pt[0]][pt[1]] && player == brd[1][1]) {
                result['success']=true;
				result['loc'].push([pt[0],pt[1]]);	
				// return result;
            }
        }
        //result['success']=false;
        return result;
    }
    this.takeRandom = function(brd,player) {	
		var result = new Object();	
		result['success']=false;
		result['loc'] = [];
		for(var i=0;i<this.width;i++) {
			for (var j=0;j<this.height;j++) {
				if(!brd[i][j]) {
					result['success']=true;
					result['loc'].push([i,j]);
				}
			}
		}	
        // var cnt = 0;
        // while (cnt < 10000) {
            // var ranX = Math.floor(Math.random()*3);
            // var ranY = Math.floor(Math.random()*3);
            // if (!this.board[ranX][ranY]){
				// result['success']=true;
				// result['loc'].push([ranX, ranY]);	
				// return result;
			// }
            // cnt++;
        // }
		// result['success']=false;
		return result;
    }
	this.stopL = function (brd,player) {
	    // block corner trap strategy : two adj. sides are occupied by opponent, 
	    //								and in-between corner is empty.
	    // 								if I don't take the corner, opp. will take it. 
    	var result = new Object();	
   		result['success']=false;
		result['loc'] = [];	
        var oppTurn =  (player == p1) ? p2 : p1;
        if (!brd[0][0] && brd[0][1] == oppTurn && brd[1][0] == oppTurn)
			result['success']=true;
			result['loc'].push([0,0]);	
			// return result;		
        if (!brd[0][2] && brd[0][1] == oppTurn && brd[1][2] == oppTurn)
			result['success']=true;
			result['loc'].push([0,2]);	
			// return result;	
        if (!brd[2][0] && brd[1][0] == oppTurn && brd[2][1] == oppTurn)
			result['success']=true;
			result['loc'].push([2,0]);	
			// return result;
        if (!brd[2][2] && (brd[1][2] == oppTurn) && (brd[2][1] == oppTurn))
			result['success']=true;
			result['loc'].push([2,2]);	
			// return result;
        return result;
    }
    this.takeOppositeCorner = function(brd,player) {
		var result = new Object();	
   		result['success']=false;
		result['loc'] = [];	
        var pairs = [ [[0,0], [2,2]], [[0,2], [2,0]] ];  // for each pair of opposing corners
        for (var i=0;i<pairs.length; i++) {		
              var pair=pairs[i];	
              var pt1 = pair[0];	// x
              var pt2 = pair[1];	// y
              var ptOccupied1 = brd[pt1[0]][pt1[1]]; 
              var ptOccupied2 = brd[pt2[0]][pt2[1]];
              
              // if one corner is occupied, take another one. 
              if (ptOccupied1 && !ptOccupied2) { 
				result['success']=true;
				result['loc'].push(pt2);	
				// return result;
              }
              else if (ptOccupied2 && !ptOccupied1) {
				result['success']=true;
				result['loc'].push(pt1);	
				// return result;
              }
                
		}
		// result['success']=false;
		return result;
    }
    
    

    
    /* CONNECT FOUR STUFF */ 
    
    /*
    this.cfMove = function(x) {
        // find first open slot
        for (var z = 0; z < 6 ; z++) {
            var cond1 = (!board[x][z] && z == 5) ;
            var cond2 =  (!board[x][z] && board[x][z+1]);
               if (cond1 || cond2) {
                   this.move(x,z);
                   return [x, z];
               }
       }
       return false;
    }
    this.cfTakeCenter = function () {
        for (var i = 6; i >= 0; i--) {
            if (this.cfPlayable([3, i]))
                return [3, i];
        }
        return false;
    }
    
    this.cfTakeWin = function () {
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                var win = this.coreChecker(i, j, 0, [], 3, 'HORIZ'); // this.horizWin(i, j, 0, []);
                if (win)
                    return win;
                win = this.coreChecker(i, j, 0, [], 3, 'VERT');
                if (win)
                    return win;
                win = this.coreChecker(i, j, 0, [], 3, 'DIAG1');
                if (win)
                    return win;
                win = this.coreChecker(i, j, 0, [], 3, 'DIAG2');
                if (win)
                    return win;
                
            
            }
        }
        return false;
    }
    
    this.cfBlockWin = function () {
        this.turn = (this.turn == X) ? Y : X;
        var result = this.cfTakeWin()
        this.turn = (this.turn == X) ? Y : X;        
        return result;
    }
    
    this.cfDetectWin = function() {
        var streak = 0;
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
               var result = this.checkForWin(i, j, 0);
               if (result) {
                alert(i+":"+j);
                return result;
            }
            }
        }
        return false;
    }
    
    
    this.coreChecker = function(i, j, count, holes, countCheck, direction, holesAllowed) {
         holesAllowed = holesAllowed || 1;
         var oppTurn = (this.turn == X) ? Y : X;
         if (i >= 7 || j >= 6 || j < 0 || i < 0)
             return false;
         else if (holes.length > holesAllowed || board[i][j] == oppTurn)
             return false;
         else if (count == countCheck) // 3 to check for move, 4 to validate 
             return holes.length ? holes[0] : [i, j]; 
         else {
             if (!board[i][j])
                 holes.push([i,j]);
             if (direction == 'HORIZ')
                 i++;
             else if (direction == 'VERT')
                 j++;
             else if (direction == 'DIAG1') {
                 i++;
                 j++;
             } else if (direction == 'DIAG2') {
                 i--;
                 j++;
             }
             return this.coreChecker(i, j, count + 1, holes, countCheck, direction);
         }
     }
     
    this.cfBuildDiagonalLine = function() {
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                var move = [i,j];
                var line = this.coreChecker(i, j, 0, [], 2, 'DIAG1', 1);
                if (line && this.cfPlayable(move))
                    return move;
                line = this.coreChecker(i, j, 0, [], 2, 'DIAG2', 1);
                if (line && this.cfPlayable(move))
                    return move;
            }
        }
        return false;
    }
    
    this.cfBuildVerticalLine = function() {
       for (var i = 0; i < x; i++) {
           var streak = 0;
           for (var j = y-1; j >= 0; j--) {
               if (board[i][j] == this.turn)
                 streak++;
               else if (streak >= 2 && this.cfPlayable([i,j])) {
                   streak = 0;
                   return [i,j];
               } else 
                    streak =0;
           }
       }
       return false;
   }

   this.cfBlockVerticalLine = function() {
       var origTurn = this.turn;
       var oppTurn = (this.turn == X) ? Y : X;
       this.turn = oppTurn;
       var move = this.cfBuildVerticalLine();
       this.turn = origTurn;
       return (move && this.cfPlayable(move)) ? move : false;
   }


  this.cfBlockHorizontalLine = function() {
      var origTurn = this.turn;
      var oppTurn = (this.turn == X) ? Y : X;
      this.turn = oppTurn;
      var move = this.cfBuildHorizontalLine();
      this.turn = origTurn;
      return move;
  }
    
    this.cfBuildHorizontalLine = function() {
       // Associative List for best streak
       for (var j = 0; j < y; j++) {
           var streak = 0;
           for (var i = 0; i < x; i++) {
               var pt = [i, j];
               if (board[i][j] == this.turn)
                 streak++;
               else if (streak >= 2 && this.cfPlayable(pt)) {
                   streak = 0;
                   return pt;
               } else 
                    streak = 0;
           }
       }
       return false;
   }
   
    this.cfPlayable = function(pt) {
        var x = pt[0];
        var y = pt[1];
        return (!board[x][y] && y == 5) || (!board[x][y] && board[x][y+1]);
    }
    
    // this.generateTable = function() {
    //     var data = ("<table>");
    //     for (var j = 0; j < y; j++) {
    //         data += ('<tr class="row">');
    //         for (var i = 0 ; i < x; i++) {
    //             data += ('<td id="t' + x + '' + y + '" class="tile"></td>');
    //         }
    //         data +=('</tr>');
    //     }
    //     data +='</table>';
    //     return data;
    // }
    //    
    this.checkForWin = function(i, j, count) {     
         return false;
     }
  
  this.cfRandom = function() {
      return [2,4];
  }
	*/
}

//
var TTT_WIN = "Win";
var TTT_CENTER = "Take Center";
var TTT_CORNER = "Take any corner";
var TTT_OPP_CORNER = "Take opposite corner";
var TTT_BLOCK_WIN = "Block Win";
var TTT_TAKE_ADJ = "Take a side square";
var TTT_RANDOM = "Random Move";
var TTT_BLOCK_CORNER_TRAP = "Block Corner Trap";






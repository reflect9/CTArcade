var X = 'X';
var Y = 'O';

function get(name) { return localStorage.getItem(name); }

function Game(x, y) {

    function setupBoard(x, y) {
        var board = new Array();
        for (var i = 0; i < x; i++) {
            board.push(new Array(y));
        }
        return board;
    }

    this.turn = X;
    var started = false;    
    var board = setupBoard(x, y);


    this.getTurn = function () {
        return this.turn
    };
    
    this.move = function(i, j) {
        // if (x < 0 || x > 2 || y < 0 || y > 2) {
            // return 'Illegal Move';
        // }
        if (!started) 
            started = true;
        if (board[i][j] == null) {
            board[i][j] = this.turn;
            this.turn = (this.turn == X) ? Y : X;
        }
        
        return board[i][j];
    }
    
    
    
    this.isFull = function() {
        for (var i = 0; i < 3; i++)
			for (var j =0; j<3;j++)
			    if (board[i][j] == null)
			        return false;
        return true;
    }
    
    function checkCol(x) {
        return board[x][0] == board[x][1] && (board[x][0] == board[x][2]) && (board[x][0] != null)
    }
    
    function checkRow(y) {
        return board[0][y] == board[1][y] && (board[0][y] == board[2][y]) && (board[0][y] != null)
    }
    
    function checkDiag1() {
        return board[0][0] != null && board[0][0] == board[1][1] && board[0][0] == board[2][2];
    }
    
    function checkDiag2() {
        return board[2][0] != null && board[1][1] == board[2][0] && board[0][2] == board[2][0];
    }
    
    this.checkForWinner = function() {
        /* Check the top row */
        var result = false;
        for (var i=0; i < 3; i++) {
            result = checkRow(i);
            if (result)
                return true;
            result = checkCol(i);
            if (result)
                return true;
        }
        result = checkDiag1();
        if (result)
            return true;
        else if (checkDiag2())
            return true;
        return false;
    }
    
    this.restart = function() {
        this.turn = X;
        board = setupBoard(x, y);
        started=false;
    }
    
    this.getStatus = function() {
        if (!started)
            return "New Game, X to move";
        else if (this.turn == X)
            return "X to move";
        else
            return "Y to move";
        
    }
    
    
    this.takeAdjacentSquare = function() {
        var moves = [[0,1], [1,0], [1,2], [2,1]];
        for (var i=0; i<moves.length;i++) {
            var pt = moves[i];
            if (!board[pt[0]][pt[1]] && this.turn == board[1][1]) {
                return pt;
            }
        }
    }
    
    /* STRATEGIES */
    this.takeCenter = function() {
        if (!board[1][1]) {
            return [1,1];
        } else
            return null;
    }
    
    this.takeRandom = function() {
        var cnt = 0;
        while (cnt < 10000) {
            var x = Math.floor(Math.random()*3);
            var y = Math.floor(Math.random()*3);
            if (!board[x][y])
                return [x, y];
            cnt++;
        }
        return false;
    }
    
    this.takeAnyCorner = function() {
    
       var moves = [[0,0], [2,2], [2,0], [0, 2]];
       for (var i=0;i<moves.length; i++) {
           var move=moves[i];
           var x = move[0];
           var y = move[1];
           
           if (!board[x][y]) {
               // this.move(x,y);
               return [x,y];
           }
       }
     
       return null;
    }
    
    this.takeBlockWin = function() {
        var origTurn = this.turn
        // Flip turn
        this.turn = (this.turn == X) ? Y : X;
        var result = this.takeWin();
        // Restore original turn
        this.turn = origTurn;
        // if (!result)
            // return this.stopL();
        return (result && !board[result[0]][result[1]]) ? result : false;
    }
    
    this.stopL = function () {
        var oppTurn =  (this.turn == X) ? Y : X;
        if (!board[0][0] && board[0][1] == oppTurn && board[1][0] == oppTurn)
            return [0,0];
        if (!board[0][2] && board[0][1] == oppTurn && board[1][2] == oppTurn)
            return [0,2];
        if (!board[2][0] && board[1][0] == oppTurn && board[2][1] == oppTurn)
            return [2,0];
        if (!board[2][2] && (board[1][2] == oppTurn) && (board[2][1] == oppTurn))
            return [2,2];
        return false
    }
    
    this.takeWin = function() {
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
                if (board[x][y] == this.turn)
                    count++;
                else if (!board[x][y]) 
                    open = move;
            }
            
            if (count == 2 && open) {
                return open;
            }
        }
        
        
        return false;
        
    }
    
    
   
    
    this.takeOppositeCorner = function() {
        var pairs = [ [[0,0], [2,2]], [[0,2], [2,0]] ];
        for (var i=0;i<pairs.length; i++) {
              var pair=pairs[i];
              var pt1 = pair[0];
              var pt2 = pair[1];
              var ptOccupied1 = board[pt1[0]][pt1[1]];
              var ptOccupied2 = board[pt2[0]][pt2[1]];
              
              if (ptOccupied1 && !ptOccupied2) {
                  return pt2;
              }
              else if (ptOccupied2 && !ptOccupied1) {
                  return pt1;  
              }
                
          }

          return false;
       }
    
    
    this.getBoard = function () {
        return board;
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
    */
    
    this.coreChecker = function(i, j, count, holes, countCheck, direction, holesAllowed) {
         holesAllowed = holesAllowed || 1;
         var oppTurn = (this.turn == X) ? Y : X;
         if (i >= 7 || j >= 6 || j < 0 || i < 0)
             return false;
         else if (holes.length > holesAllowed || board[i][j] == oppTurn)
             return false;
         else if (count == countCheck) /* 3 to check for move, 4 to validate */
             return holes.length ? holes[0] : [i, j]; /* N.B. "0 ? 1 : 2" returns 2 */
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
}

//
var TTT_WIN = "Win";
var TTT_CENTER = "Take Center";
var TTT_CORNER = "Take any corner";
var TTT_OPP_CORNER = "Take opposite corner";
var TTT_BLOCK_WIN = "Block Win";
var TTT_TAKE_ADJ = "Take adjacent side square";
var TTT_RANDOM = "Random Move";
var TTT_BLOCK_CORNER_TRAP = "Block Corner Trap";
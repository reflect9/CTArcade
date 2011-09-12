function ConnectFour() {
    var X_PLAYER = "X";
    var Y_PLAYER = "Y";
    var board = null;
    this.turn = false;
    this.reset = false;
    
    this.setup = function() {
        this.turn = "X";
        this.reset=false;
        board = new Array();
        for (var i = 0; i < 7; i++) {
            board.push(new Array(6));
        }
    }
    
    this.validMove = function(pt) {
        var x = pt[0];
        var y = pt[1];
        return (!board[x][y] && y == 5) || (!board[x][y] && (y+1 < 6) && board[x][y+1]);
    }
    
    this.fourInARow = function(i, j, count) {
        if (count == 4)
            return true;
        else if (i >= 7 || j >= 6 || j< 0 || i<0)
            return false;
        else if (board[i][j] == this.turn)
            return this.fourInARow(i + 1, j, count + 1);
        else
            return false;
    }
    
    this.fourInACol = function(i, j, count) {
        if (count == 4)
            return true;
        else if (i >= 7 || j >= 6 || j< 0 || i<0)
            return false;
        else if (board[i][j] == this.turn)
            return this.fourInACol(i, j + 1, count + 1);
        else
            return false;
    }
    
    this.fourInADiag1 = function(i, j, count) {
        if (count == 4)
            return true;
        else if (i >= 7 || j >= 6 || j< 0 || i<0)
            return false;
        else if (board[i][j] == this.turn)
            return this.fourInADiag1(i + 1, j + 1, count + 1);
        else
            return false;
    }
    
    this.fourInADiag2 = function(i, j, count) {
           if (count == 4)
               return true;
           else if (i >= 7 || j >= 6 || j< 0 || i<0)
               return false;
           else if (board[i][j] == this.turn)
               return this.fourInADiag2(i - 1, j + 1, count + 1);
           else
               return false;
       }
    
    this.toggleTurn = function() {
       this.turn = (this.turn == X_PLAYER) ? Y_PLAYER : X_PLAYER;
    }
    
    this.getBoard = function () { return board; }
    
    /* Public */
    this.move = function(x) {
        // find first open slot
       for (var z = 0; z < 6 ; z++) {
           if (this.validMove([x, z])) {
               board[x][z] = this.turn;
               
               if (this.detectWin()) {
                    alert(this.turn + ' wins!');
                    this.reset = true;
                }
               this.toggleTurn();
               return [x, z];
           }
       }
       return false;
    }
    
    this.getStatus = function() {
          if (this.turn == X_PLAYER)
               return "X to move";
           else
               return "Y to move";

    }
    
    this.detectWin = function() {
        this.reset = true;
        for (var i=0; i<7;i++) {
            for (var j=0; j<6; j++) {
                if (this.fourInARow(i, j, 0))
                    return true;
                if (this.fourInACol(i, j, 0))
                    return true;
                if (this.fourInADiag1(i, j, 0))
                    return true;
                if (this.fourInADiag2(i, j, 0))
                    return true;
            }
        }
        this.reset = false;
        return false;
    }
    
    this.getTurn = function() { return this.turn };
    this.restart = function() { this.setup(); }
    
    
    // **** Strategies ****
    
   this.tryToWin = function() {
       for (var i=0; i<7; i++) {
           for (var j =0; j<7; j++) {
               var move = [i,j];
               if (!board[i][j] && this.validMove(move)) {
                   // play this move, check for win
                   board[i][j] = this.turn;
                   if (this.detectWin()) {
                       board[i][j] = null; // clear
                       return [i,j];
                   }
                   board[i][j] = null; // clear
                   
               }
           }

        }
        return false;
   }
   
   this.tryToBlock = function() {
       this.toggleTurn()
       var move = this.tryToWin();
       this.toggleTurn();
       return move;
   }
   
   this.expandVerticalLine = function(getStreak) {
       getStreak = getStreak || false;
       var bestMove = false;
       var bestStreak = 0;
       
       for (var i = 0; i < 7; i++) {
           var streak = 0;
           for (var j = 5; j >= 0; j--) {
               if (board[i][j] == this.turn)
                  streak++;
               else if (!board[i][j]) {
                   if (streak > bestStreak) {
                       bestMove = [i,j];
                       bestStreak = streak;
                   }
                   streak = 0;
               } else
                streak = 0;
           }
           
       }
       if (getStreak)
        return [bestStreak, bestMove];
       return bestMove;
   }
   
   this.expandHorizLine = function(getStreak) {
       getStreak = getStreak || false;
        var bestMove = false;
        var bestStreak = 0;
         
        for (var j = 0; j < 6; j++) {
            var streak = 0;
            for (var i = 0; i < 7; i++) {
                 if (board[i][j] == this.turn) 
                    streak++;
                 else if (!board[i][j] && streak >= 1) {
                     if (streak > bestStreak && this.validMove([i,j])) {
                         bestStreak = streak;
                         bestMove = [i,j];
                     }
                    streak =0 ;
                 } else if (!board[i][j] && i < 6 && board[i+1][j] == this.turn && streak == 0) {
                     if (bestStreak == 0)
                        bestMove = [i,j];
                 } else {
                     if (streak > bestStreak && this.validMove([i,j])) {
                         bestStreak = streak;
                         bestMove = [i,j];
                     }
                     streak = 0;
                 }
            }
      }
      var x = bestMove[0];
      if (x >= 5 && bestStreak < 2)
        return false;
      
      if (getStreak)
        return [bestStreak, bestMove];
      return bestMove;
  }
    
  this.expandDiagonalLine = function() { // TODO: expand diag lines of length 1 -> length 2
      for (var i = 0; i < 7; i++) {
          for (var j = 0; j < 6; j++) {
              var move = [i,j];
              var line = this.coreChecker(i, j, 0, [], 2, 'DIAG1', 1);
              if (line && this.validMove(move))
                  return move;
              line = this.coreChecker(i, j, 0, [], 2, 'DIAG2', 1);
              if (line && this.validMove(move))
                  return move;
          }
      }
      return false;
  }    
    
  this.coreChecker = function(i, j, count, holes, countCheck, direction) {
       var oppTurn = (this.turn == X_PLAYER) ? Y_PLAYER : X_PLAYER;
       if (i >= 7 || j >= 6 || j < 0 || i < 0)
           return false;
       else if (holes.length > 1 || board[i][j] == oppTurn)
           return false;
       else if (count == countCheck) /* 3 to check for move, 4 to validate */
           return holes.length ? holes[0] : [i, j]; /* N.B. "0 ? 1 : 2" returns 2 */
       else {
           if (!board[i][j])
               holes.push([i,j]);
           
           if (direction == 'DIAG1') {
               i++;
               j++;
           } else if (direction == 'DIAG2') {
               i--;
               j++;
           }
           return this.coreChecker(i, j, count + 1, holes, countCheck, direction);
       }
   }
   
   this.takeCenter = function() {
       for (var j = 5; j >= 0; j--) {
           var move = [3, j];
           if (this.validMove(move))
            return move;
       }
       return false;
   }
   
   this.blockHorizLine = function() {
       this.toggleTurn();
       var result = this.expandHorizLine(true);
       this.toggleTurn();
       var streak = result[0];
       var move = result[1];
       if (streak > 1)
        return move;
       return false;
   }
   
   this.blockVerticalLine = function() {
          this.toggleTurn();
          var result = this.expandVerticalLine(true);
          this.toggleTurn();
          var streak = result[0];
          var move = result[1];
          if (streak > 1)
             return move;
             return false;
   }
   
   this.blockDiagLine = function() {
          this.toggleTurn();
          var result = this.expandDiagonalLine();
          this.toggleTurn();
          return result;
      }
   
   this.oppCanWinNext = function(move) {
       var oppTurn = (this.turn == X_PLAYER) ? Y_PLAYER : X_PLAYER;
       
       var x = move[0]; 
       var y = move[1];
       
       board[x][y] = this.turn; 
       
       this.toggleTurn();
       var result = this.tryToWin();
       board[x][y] = null;
       this.toggleTurn();
       return result;
   }
   
   this.isFull = function() {
       for (var  i =0 ; i <7; i++) {
          for (var j=0; j <6;j++) {
              if (!board[i][j]) 
                return false;
            }
        }
        return true;
   }
   
   this.randomMove = function() {
       var x,y;
       while (true) {
           x=Math.floor(Math.random()*7);
           y=Math.floor(Math.random()*6);           
           if (this.validMove([x,y]))
                return [x,y];
        }
       
       return false;
   }
   
   this.firstLegalMove = function(move) {
       for (var  i =0 ; i <7; i++) {
          for (var j=0; j <6;j++) {
              var move = [i,j];
              if (this.validMove(move) && !this.oppCanWinNext(move)) 
                   return move;
          }
      }
      //try ANY legal move
       for (var  i =0 ; i <7; i++) {
           for (var j=0; j <6;j++) {
               var move = [i,j];
               if (this.validMove(move)) 
                return move;
           }
       }
       
   }
}


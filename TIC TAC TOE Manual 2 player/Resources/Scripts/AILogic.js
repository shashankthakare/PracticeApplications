$(function () {

                $(".cell").click(function () {

                    var cell_no = $(this).attr("id");
                    var y = Game.prototype.BoardStateFinder(cell_no);
                    var computercell;

                    if (y == 0) {
                        Game.prototype.TotalMovesIncrement();
                        $(this).append("<div>X</div>");
                        Game.prototype.BoardStateEditor(1, cell_no);
                        Game.prototype.ChangeTurn();
                        var wincheck = Game.prototype.WinCheck();
                        if (wincheck == 1) {
                            alert('Player' + 1 + ' won');
                            location.reload();
                        }
                        if (Game.prototype.TotalMoves() == 9) {
                            alert('Draw!');
                            location.reload();
                        }
                        else {
                            
                            computercell = Game.prototype.CalculateCell();
                            $("#" + (computercell)).append("<div>O</div>");
                            Game.prototype.TotalMovesIncrement();
                            Game.prototype.BoardStateEditor(2, computercell);
                            var wincheck = Game.prototype.WinCheck();
                            if (wincheck == 1) {
                                alert('Computer' + ' won');
                                location.reload();
                            }
                            Game.prototype.ChangeTurn();
                        }

                    }


                });
            });


            function Player(playername) {
                this.playername = playername;
                
                
                alert(playername + ' initialised');
            }

        function Game() {
            this.playerOne = null;
            this.playerTwo = null;
            this.currentPlayer = null;
            this.boardstate = null;
            this.winningpositions = null;
            this.totalmoves = null;
            
        }

        Game.prototype.TotalMovesIncrement = function () {
            this.totalmoves++;
        }

        Game.prototype.TotalMoves = function () {
            return this.totalmoves;
        }

        Game.prototype.commence = function (playerOneName, playerTwoName) {
            this.playerOne = new Player(playerOneName);
            this.playerTwo = new Player(playerTwoName);

            this.currentPlayer = this.playerOne;
            this.boardstate = new Array();
            for (i = 0; i < 9; i++)
                this.boardstate[i] = 9;
            Game.prototype.WinningArrayCreator();
            Game.prototype.ValueArrayCreator();
            this.totalmoves = 0;

        }

        Game.prototype.WinningArrayCreator = function () {
            this.winningpositions = new Array();
            for (i = 0; i < 3; i++)
                this.winningpositions = new Array();

            this.winningpositions = [[0, 1, 2],
                                    [3, 4, 5],
                                    [6, 7, 8],
                                    [0, 3, 6],
                                    [1, 4, 7],
                                    [2, 5, 8],
                                    [0, 4, 8],
                                    [2, 4, 6]];

        }

        Game.prototype.ValueArrayCreator=function(){
        this.valuearray=new Array();
        for (i = 0; i < 4; i++)
                this.valuearray = new Array();

        this.valuearray=[[0, -10, -100, -1000],
                         [10, 0, 0, 0],
                         [100, 0, 0, 0],
                         [1000, 0, 0, 0]];
        }

        Game.prototype.BoardStateFinder = function (cell_no) {
            if (this.boardstate[cell_no-1] == 9)
                return 0;
            return 1;

        }

        Game.prototype.BoardStateEditor = function (element_id, cell_no) {
            this.boardstate[cell_no-1] = element_id;
        }

        Game.prototype.ChangeTurn = function () {
            if (this.currentPlayer == this.playerOne) {
                this.currentPlayer = this.playerTwo;
                return;
            }
            this.currentPlayer = this.playerOne;
        }

        Game.prototype.CalculateCell = function () {

            this.valuedetails = new Array();
            this.valuedetails = [-30000, 0];

            var computedvalue, worstvalue, opponentcomputedvalue;
            for (var i = 0; i < 9; i++) {
                if (this.boardstate[i] == 9) {

                    this.boardstate[i] = 2;
                    computedvalue = Game.prototype.FindValue(this.boardstate, 2);
                    worst = -30000;
                    
                    for (var j = 0; j < 9; j++) {
                        if (this.boardstate[j] == 9) {
                            this.boardstate[j] = 1;
                            opponentcomputedvalue = Game.prototype.FindValue(this.boardstate, 1);
                            if (opponentcomputedvalue > worst)
                                worst = opponentcomputedvalue;
                            this.boardstate[j] = 9;
                        }
                    }

                    computedvalue -= worst;
                    this.boardstate[i] = 9;
                    if (this.valuedetails[0] < computedvalue) {
                        this.valuedetails[0] = computedvalue;
                        this.valuedetails[1] = i;
                    }
                }
            }

            return (this.valuedetails[1] + 1);

        }

        Game.prototype.FindValue = function (possibleboard, playerid) {
            var value = 0;
            var opponentid = 0;
            if (playerid == 1)
                opponentid = 2;
            else
                opponentid = 1;
            for (i = 0; i < 8; i++) {
                var favorablecount = 0;
                var opponentcount = 0;
                var cellvalue = 0;
                for (j = 0; j < 3; j++) {

                    cellvalue = possibleboard[this.winningpositions[i][j]];
                    if (cellvalue == playerid)
                        favorablecount++;
                    if (cellvalue == opponentid)
                        opponentcount++;
                }
                value += this.valuearray[favorablecount][opponentcount];
            }
            return value;
        }

        Game.prototype.ReturnName = function () {
            if (this.currentPlayer == this.playerOne) {
                return 1;
            }
            return 2 ;
        }

        Game.prototype.WinCheck = function () {
            var currentplayer = Game.prototype.ReturnName();
            for (i = 0; i < 8; i++) {

                if ((this.boardstate[this.winningpositions[i][0]] != 9) || (this.boardstate[this.winningpositions[i][1]] != 9)) {
                    if ((this.boardstate[this.winningpositions[i][0]] == this.boardstate[this.winningpositions[i][1]]) && (this.boardstate[this.winningpositions[i][1]] == this.boardstate[this.winningpositions[i][2]]))
                        return 1;
                }
            }
            return 0;
        }

        $(function () {
            $("#startButton").click(function () {
                Game.prototype.commence('Player 1', 'Computer');
                
            });
        });

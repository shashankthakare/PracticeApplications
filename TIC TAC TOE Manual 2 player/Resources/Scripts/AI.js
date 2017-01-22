var Board = new Game();
var Dummy = new Game();
var Old = new History();
$(document).ready(function () {

    $("#start").click(function () {
        $(".box").html("");
        var p1name;
        var p2name;
        p1name = $("#p1name").val();
        p2name = $("#p2name").val();

        Board.begin(p1name, p2name);
        Dummy.begin("PQR", "LMN");
        var width = "width:32%;";
        var height = "height:32%;";
        var bhtml = "";
        for (var i = 0; i < 9; i++) {
            bhtml = bhtml + "<div id = \"" + i + "\" class = box " + "style = " + width + height + "> </div>";
        }
        $("#promptzone2").html("");
    });

    $(".box").click(function () {
        var cell_id = $(this).attr("id");
        console.log(cell_id);
        var AIresult;
        var currentsymbol;
        if (!Board.isfull()) {
            if (Board.blockisnottaken(cell_id)) {
                Board.incrementmove();
                currentsymbol = Board.returnmarker();
                Board.record(Number(cell_id), currentsymbol);
                console.log("current player= " + currentsymbol);
                if (currentsymbol == 1) {
                    console.log("showing 1");
                    $(this).append("<img src=\"Resources/Images/cross.png\" alt=\"cross\" class=\"image\" />");
                }
                else if (currentsymbol == 2) {
                    console.log("showing 2");
                    $(this).append("<img src=\"Resources/Images/circle.png\" alt=\"circle\" class=\"image\" />");
                }
                if (Board.WinCheck() == 1) {

                    Board.winner = currentsymbol;
                    console.log("Saving as winner = " + currentsymbol);
                    Old.save(Board);
                    if (currentsymbol == 1) {
                        alert(Board.player1.name + " Wins");
                    }
                    else {
                        alert(Board.player2.name + " Wins");
                    }
                }
                console.log(Board.blockarray);
                if (Board.isfull()) {
                    if (Board.winner == -1) {
                        Board.winner = 0;
                        Old.save(Board);
                        alert("Its a Draw");
                    }
                }
                Board.toggleplayer();
                
            }

        }
        else {
            alert("Press Start to play Again");
        }
    });
    $(".history").on("click", ".Game", function (event) {

        $(".block").html("");
        var gameid;
        gameid = $(this).attr('id');
        console.log("selecting game " + gameid);
        gameid = Number(gameid);
        gameid = (gameid / 100) - 1;
        console.log("Selected Game " + gameid)
        Old.savedgames[gameid].displaygame();
    });
});
function alphabeta(Dummy, depth, alpha, beta, maximizingPlayer) { //(array,2-3,myChance,hisChance,me)
    var opponent;
    if (maximizingPlayer) {
        opponent = 0;
    }
    else opponent = 2;
    var i;
    var full = 0;
    for (i = 0; i < 9; i++) {
        if (Dummy.blockarray[i] != 10) {
            full++;
        }
    }
    if (depth == 0 || full == 9) {
        return Dummy.FindValue(Dummy, maximizingPlayer);
    }
    if (maximizingPlayer) {
        console.log("into alpha with " + maximizingPlayer);
        for (var i = 0; i < 9; i++) {
            if (Dummy.blockarray[i] == 10) {
                Dummy.blockarray[i] = 2;                                                                           //play me
                alpha = Math.max(alpha, alphabeta(Dummy, depth - 1, alpha, beta, opponent));   //MAX(mymin,hismax)  ABS
                Dummy.blockarray[i] = 10;
                console.log("Coming to alpha " + alpha);
                if (beta <= alpha) {    //mymin<=mymax
                    break;
                }
                return alpha;
            }
        }
    }
    else {
        console.log("into beta with " + maximizingPlayer);
        for (var i = 0; i < 9; i++) {
            if (Dummy.blockarray[i] == 10) {
                Dummy.blockarray[i] = 1;                                                                           //play him
                beta = Math.min(beta, alphabeta(Dummy, depth - 1, alpha, beta, opponent));     //MIN(mymax,hismin)  ABS
                Dummy.blockarray[i] = 10;
                if (beta <= alpha) {
                    break;
                }
                return beta;
            }
        }
    }
}

function Player(name) {
    this.name = name;
};

function Game() {
    this.blockarray = [];
    this.sequence = [];
    this.valuearray = null;
    this.winnablecombo = null; ;
    this.player1 = null;
    this.player2 = null;
    this.activeplayer = null;
    this.movecount = 0;
    this.winner = -1;

    this.incrementmove = function () {
        this.movecount++;
    }
    this.telltotalmoves = function () {
        return this.movecount;
    }
    this.isfull = function () {
        if (this.movecount == 9 || this.winner != -1) {
            return true;
        }
        return false;
    }
    this.toggleplayer = function () {
        if (this.activeplayer == this.player1) {
            this.activeplayer = this.player2;
        }
        else {
            this.activeplayer = this.player1;
        }
    }
    this.record = function (cell_id, marker) {
        this.blockarray[cell_id] = marker;
        this.sequence.push(cell_id);
        console.log("Putting Marker " + marker + " on cell " + cell_id);
    }
    this.blockisnottaken = function (cell_id) {
        if (this.blockarray[cell_id] != 10) {
            return false;
        }
        else {
            return true;
        }
    }
    this.returnmarker = function () {
        if (this.activeplayer == this.player1) {
            return 1;
        }
        else {
            return 2;
        }
    }
    this.begin = function (P1name, P2name) {
        this.player1 = new Player(P1name, '../images/cross.png');
        this.player2 = new Player(P2name, '../images/circle.png');
        this.movecount = 0;
        this.winner = -1;
        this.activeplayer = this.player1;
        this.sequence = [];
        this.setmatrix();
        this.setvaluearray();
        for (i = 0; i < 9; i++) {
            this.blockarray[i] = 10;
        }
    }
    this.displaygame = function () {
        $(".box").html("");
        $("#promptzone2").html("");
        console.log(this.blockarray);
        console.log(this.sequence);
        //console.log(this.winner);
        var winnername;
        if (this.winner == 1) {
            winnername = this.player1.name;
            $("#promptzone2").append("Winner was " + winnername + " Playing with X");
        }
        else if (this.winner == 2) {
            winnername = this.player2.name;
            $("#promptzone2").append("Winner was " + winnername + " Playing with O");
        }
        else if (this.winner == 0) {
            $("#promptzone2").append("It was a draw");
        }
        var playingblock;
        for (var i = 0; i < this.movecount; i++) {
            setTimeout(function (presentblock) { }, i * 1000);
            var playingblock = this.sequence[i];
            //console.log(playingblock);
            if (this.blockarray[this.sequence[i]] == 1) {

                setTimeout('showcross(' + playingblock + ')', i * 1000);
                //$("#" + playingblock).append("<img src=\"Resources/Images/cross.png\" alt=\"cross\" class=\"image\" />");
            }
            else if (this.blockarray[this.sequence[i]] == 2) {
                setTimeout('showcircle(' + playingblock + ')', i * 1000);
                //$("#" + playingblock).append("<img src=\"Resources/Images/circle.png\" alt=\"circle\" class=\"image\" />");
            }
        }
    }
    this.setmatrix = function () {

        this.winnablecombo = new Array(9);
        for (var i = 0; i < 3; i++) {
            this.winnablecombo[i] = new Array
        }
        this.winnablecombo = [[0, 1, 2],
                                    [3, 4, 5],
                                    [6, 7, 8],
                                    [0, 3, 6],
                                    [1, 4, 7],
                                    [2, 5, 8],
                                    [0, 4, 8],
                                    [2, 4, 6]];
    }
    this.WinCheck = function () {
        var currentplayer = this.returnmarker();
        //console.log(this.winnablecombo);
        for (var i = 0; i < 8; i++) {

            if ((this.blockarray[this.winnablecombo[i][0]] != 10) || (this.blockarray[this.winnablecombo[i][1]] != 10)) {
                if ((this.blockarray[this.winnablecombo[i][0]] == this.blockarray[this.winnablecombo[i][1]]) && (this.blockarray[this.winnablecombo[i][1]] == this.blockarray[this.winnablecombo[i][2]]))
                    return 1;
            }
        }
        return 0;
    }
    this.FindValue = function (nextboard, playerid) {
        console.log(nextboard.blockarray + "b      p" + playerid);
        var value = 0;
        var opponent = 0;
        if (playerid == 1) {
            opponent = 2;
        }
        else {
            opponent = 1;
        }
        for (var i = 0; i < 8; i++) {
            var favourablecount = 0;
            var opponentcount = 0;
            var cellvalue = 0;
            for (j = 0; j < 3; j++) {
                cellvalue = nextboard[this.winnablecombo[i][j]];
                if (cellvalue == playerid) {
                    favourablecount++;
                }
                if (cellvalue == opponent) {
                    opponentcount++;
                }
            }
            value = value + this.valuearray[favourablecount][opponentcount];
        }
        console.log("returning " + value);
        return value;
    }
    this.setvaluearray = function () {
        this.valuearray = new Array();
        for (var i = 0; i < 4; i++) {
            this.valuearray[i] = new Array();
        }
        this.valuearray = [[0, -10, -100, -1000],
                         [10, 0, 0, 0],
                         [100, 0, 0, 0],
                         [1000, 0, 0, 0]];

    }
}

function History() {
    this.savedgames = Array();
    this.gamecount = 0;
    this.save = function (x) {
        var g = new Game();
        g.movecount = x.movecount;
        g.winner = x.winner;
        g.player1 = x.player1;
        g.player2 = x.player2;
        for (var i = 0; i < 9; i++) {
            g.blockarray[i] = x.blockarray[i];
            g.sequence[i] = x.sequence[i];
        }

        //this.savedgames[this.gamecount] = new Game();
        this.savedgames.push(g)
        this.gamecount++;
        var id = this.gamecount * 100;
        $("#history").append("<p id=" + id + " class=\"Game\">Game " + this.gamecount + "</p>");
    }

    this.enlist = function (i) {
        return this.savedgames[i];
    }
    this.tellcount = function () {
        return this.gamecount;
    }
}

function showcross(presentblock) {
    $("#" + presentblock).append("<img src=\"Resources/Images/cross.png\" alt=\"cross\" class=\"image\" />");
}

function showcircle(presentblock) {
    $("#" + presentblock).append("<img src=\"Resources/Images/circle.png\" alt=\"circle\" class=\"image\" />");
}

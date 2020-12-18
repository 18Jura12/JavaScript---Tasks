
$( document ).ready( function()
{

    let _id = "";
    let cells = [];
    let otvoreno = 0;
    let mine = 0;

    $("#unos").submit(function(e) {

        e.preventDefault();

        let form = $(this);
        let url = 'https://rp2.studenti.math.hr/~zbujanov/dz4/id.php';

        if(validate(form)) {

            $.ajax({
                type: "GET",
                url: url,
                data: form.serialize(),
                success: function(data)
                {
                    form.prop('hidden', true);

                    _id = data.id;
                    let id = _id.split("_");
                    
                    cells = new Array(id[1]);
                    for (let i = 0; i < id[1]; i++) {
                        cells[i] = new Array(id[0]);
                    }

                    let can = $('<canvas id="igra">Neuspjelo učitavanje!</canvas>');
                    $("body").append(can)
                             .append($('<br id="glupost">'))
                             .append($('<p>Preostalo mina: ' + id[2].toString() + ' </p>'))
                             .append($('<button id="ponovno">Igraj ponovno!</button>'));

                    let ctx = can[0].getContext("2d");
                    ctx.canvas.height = id[0]*31+1;
                    ctx.canvas.width = id[1]*31+1;

                    //console.log(id[0], id[1]);
                    ctx.fillStyle = "lightgray";
                    for( let x = 0; x < id[1]; ++x )
                        for( let y = 0; y < id[0]; ++y )
                        {
                            cells[x][y] = 'z';
                            ctx.fillRect( 1 + x*31, 1 + y*31, 30, 30 );
                            //tx.strokeRect( x*31, y*31, 31, 31 );
                        }
                    
                    if(id[0]*id[1] - id[2] == 0) {

                        $('body').prepend($('<h3>You Win!</h3>'));
                        $('body').off('mousedown', '#igra');

                    }

                    $('body').on('mousedown', '#igra', igraj);
                    //console.log(cells);
                }
                });

        }

    });

    function igraj() {

        $(this).on("contextmenu", function() { return false; });
        let can = $('#igra')[0].getBoundingClientRect();
        let ctx = $('#igra')[0].getContext("2d");
        let col = Math.floor((event.clientX - can.left) / 31);
        let row = Math.floor((event.clientY - can.top) / 31);
        let id = _id.split("_");

        if(event.button == 0) {

            if(cells[col][row] != '?') {

                $.ajax({
                    type: 'GET',
                    url: 'https://rp2.studenti.math.hr/~zbujanov/dz4/cell.php',
                    data: {
                        id: _id,
                        row: row,
                        col: col
                    },
                    success: function(data)
                    {
    
                        if(data.boom == true) {
    
                            ctx.fillStyle = "gray";
                            ctx.fillRect( 1 + col*31, 1 + row*31, 30, 30);
                            ctx.font = '20px Candara';
                            ctx.fillStyle = 'black';
                            ctx.textAlign = 'center';
                            ctx.fillText('💣', col*31 + 16, row*31 + 23);
                            console.log(data.cells.length);
                            if($('h3').length == 0)
                                $('body').prepend($('<h3>Game Over</h3>'));
                            $('body').off('mousedown', '#igra');
    
                        } else {
    
                            for(let i = 0; i < data.cells.length; ++i) {
    
                                //console.log(data.cells[i].mines);
                                ctx.fillStyle = "gray";
                                ctx.fillRect( 1 + data.cells[i].col*31, 1 + data.cells[i].row*31, 30, 30);
                                ctx.font = '20px Candara';
                                ctx.fillStyle = 'black';
                                ctx.textAlign = 'center';
                                if(data.cells[i].mines != 0) {
    
                                    let broj = data.cells[i].mines;
                                    switch(broj) {
    
                                        case 1:
                                            ctx.fillStyle = 'blue';
                                            break;
                                        case 2:
                                            ctx.fillStyle = 'green';
                                            break;
                                        case 3:
                                            ctx.fillStyle = 'red';
                                            break;
                                        case 4:
                                            ctx.fillStyle = 'purple';
                                            break;
                                        case 5:
                                            ctx.fillStyle = 'maroon';
                                            break;
                                        case 6:
                                            ctx.fillStyle = 'turquoise';
                                            break;
                                        case 7:
                                            ctx.fillStyle = 'black';
                                            break;
                                        case 8:
                                            ctx.fillStyle = 'gray';
                                            break;
    
                                    }
                                    ctx.fllStroke = 'black';
                                    ctx.fillText(data.cells[i].mines.toString(), data.cells[i].col*31 + 16, data.cells[i].row*31 + 23);
    
                                }
                                cells[data.cells[i].col][data.cells[i].row] = data.cells[i].mines;
    
                            }
    
                            otvoreno = update(cells);
                            console.log(otvoreno);
                            if(id[0]*id[1] - otvoreno - id[2] == 0) {
    
                                $('body').prepend($('<h3>You Win!</h3>'));
                                $('body').off('mousedown', '#igra');
    
                            }
    
                        }
    
                    }
                });

            }

        } else if(event.button == 2) {

            //console.log(row, col);
            if(cells[col][row] == 'z') {

                ctx.fillStyle = "lightgray";
                ctx.fillRect( 1 + col*31, 1 + row*31, 30, 30);
                ctx.font = '20px Candara';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText('?', col*31 + 16, row*31 + 23);
                cells[col][row] = '?';
                ++mine;
                $('p').html('Preostalo mina: ' + (id[2] - mine).toString());

            } else if(cells[col][row] == '?') {

                ctx.fillStyle = "lightgray";
                ctx.fillRect( 1 + col*31, 1 + row*31, 30, 30 );
                cells[col][row] = 'z';
                --mine;
                $('p').html('Preostalo mina: ' + (id[2] - mine).toString());

            }

        }
        

    }

    //$('body').on('mousedown', '#igra', igraj);

    $('body').on('click', '#ponovno', function() {

        $('h3').remove();
        $('#igra').remove();
        $('#unos').prop('hidden', false);
        $('#ponovno').remove();
        $('#glupost').remove();
        $('p').remove();
        otvoreno = 0;
        mine = 0;

    });

} );

function validate(form) {

    let forma = form.serializeArray();
    return forma[2].value <= forma[0].value*forma[1].value;

}

function update(cells) {

    let otvoreno = 0;
    for(let i = 0; i < cells.length; ++i)
    {
        //console.log(cells[i]);
        for(let j = 0; j < cells[i].length; ++j) {

            if(cells[i][j] != 'z' && cells[i][j] != '?') ++otvoreno;

        }
    }

    return otvoreno;

}
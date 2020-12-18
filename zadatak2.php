<?php 

// .. Npr. $vlakovi[1]["cilj"] je "Osijek".
$vlakovi = array
(
	array( "start" => "Zagreb", "cilj" => "Split",  "polazak" => "8h",  "cijena" => 150 ),
	array( "start" => "Zagreb", "cilj" => "Osijek", "polazak" => "12h", "cijena" => 100 ),
	array( "start" => "Osijek", "cilj" => "Rijeka", "polazak" => "10h", "cijena" => 200 ),
	array( "start" => "Rijeka", "cilj" => "Zagreb", "polazak" => "21h", "cijena" => 120 ),
	array( "start" => "Zagreb", "cilj" => "Split",  "polazak" => "15h", "cijena" => 140 ),
	array( "start" => "Split",  "cilj" => "Zagreb", "polazak" => "11h", "cijena" => 150 ),
	array( "start" => "Zagreb", "cilj" => "Split",  "polazak" => "5h",  "cijena" => 120 ),
	array( "start" => "Osijek", "cilj" => "Rijeka", "polazak" => "20h", "cijena" => 220 ),
	array( "start" => "Split",  "cilj" => "Osijek", "polazak" => "14h", "cijena" => 250 ),
);

if($_SERVER['REQUEST_METHOD'] === 'GET') {

    $izlaz = [];
    if(!isset($_GET['ciljni'])) {

        foreach($vlakovi as $vlak) {

            if($vlak['start'] === $_GET['polazni']) {
    
                if(!in_array($vlak['cilj'], $izlaz)) {

                    $izlaz[] = $vlak['cilj'];

                }
    
            }
    
        }

    } else {

        foreach($vlakovi as $vlak) {

            if($vlak['start'] === $_GET['polazni'] && $vlak['cilj'] === $_GET['ciljni']) {

                $izlaz[] = $vlak;
    
            }

        }

    }

    sendJSONandExit($izlaz);

}

function sendJSONandExit( $message ) {
    // Kao izlaz skripte pošalji $message u JSON formatu i
    // prekini izvođenje.
    header( 'Content-type:application/json;charset=utf-8' );
    echo json_encode( $message );
    flush();
    exit( 0 );
}

?>
<?php 

// Npr. $memory["PRVA"][0][2] je "B"
$memory = array
(
    "PRVA" => array( "AABB", 
                     "DDEE",
                     "GGHH",
                     "MMNN" ),

    "DRUGA" => array( "LCIAFDZ", 
                      "HKBEQHW",
                      "ENQDKGX",
                      "MAPJCMZ",
                      "JRNGLOX",
                      "PFIOBRW" ),

    "TRECA" => array( "ACEB", 
                      "HDCF",
                      "GAHE",
                      "DFGB" )
);

if($_SERVER['REQUEST_METHOD'] === 'GET') {

    $izlaz = [];
    if(!isset($_GET['R'])) {

        $izlaz = ['R' => sizeof($memory[$_GET['ime']]), 'S' => strlen($memory[$_GET['ime']][0])];

    } else {

        $izlaz = $memory[$_GET['ime']][$_GET['R']][$_GET['S']];

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


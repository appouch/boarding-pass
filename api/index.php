<?php 
    header("Access-Control-Allow-Origin: *");
    
    include("config.php");
    #echo "hello cross domain.";

    $requestPath = $_SERVER['PHP_SELF'];    
    $pos = strpos($requestPath, 'index.php');
    $requestPath = substr($requestPath, $pos+strlen('index.php'));
    $tokens = explode('/', $requestPath);
    $username = $tokens[sizeof($tokens)-1];
    
    $sql = "SELECT * FROM passenger WHERE name='$username'";
    $result = mysql_query($sql) or die('Invalid query: ' . mysql_error());
    $num_rows = mysql_num_rows($result);
    
    if ($row = mysql_fetch_row($result)) 
    {
        $date = substr($row[1], 0, -3);
        $flight = $row[2];
        $seat = $row[3];
        $gate = $row[4];
        $boardingTime = substr($row[5], 0, -3);
        
        $array = array(
            "name" => $username,
            "date" => $date,
            "flight" => $flight,
            "seat" => $seat,
            "gate" => $gate,
            "boardingTime" => $boardingTime,
        );
        $ret = json_encode($array);    
    }
    else
    {
        $array = array(
            "name" => $username,
            "error" => "401 User Unauthorized",
        );
        $ret = json_encode($array);        
    }
    
    echo $ret;
    mysql_free_result($result);
    
?>
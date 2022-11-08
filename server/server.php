<?php

$x = isset($_GET['x']) ? floatval($_GET['x']) : null;
$y = isset($_GET['y']) ? floatval($_GET['y']) : null;
$r = isset($_GET['r']) ? floatval($_GET['r']) : null;

session_start();

date_default_timezone_set('Europe/Moscow');
$current_time = date("H:i:s:ms");

if (!check_values($x, $y, $r)) {
    http_response_code(412);
    echo ("x={$x}, y={$y}, r={$r}");
    return;
}

$result = check_area($x, $y, $r) ? "<span class='successful'>Попадание</span>" : "<span class='missed'>Мимо</span>";

$exec_time = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];

$_SESSION['results'][] = [$x, $y, $r, $current_time, $exec_time, $result];

function check_area($x, $y, $r)
{
    return ($x <= 0 and $y >= 0 and pow($x, 2) + pow($y, 2) <= pow($r/2, 2)) or
        ($x <= 0 and $x >= -$r/2 and $y <= 0 and $y >= -$r) or
        ($x >= 0 and $y <= -$x + $r/2 and $y >= 0);
}

function check_values($x, $y, $r)
{
    return (is_numeric($x) and $x > -5 and $x < 3)
            and (is_numeric($y) and $y > -5 and $y < 3)
            and in_array($r, [1, 1.5, 2, 2.5, 3]);
}

foreach ($_SESSION['results'] as $resp) {
    $table .= "<tr>";
    $table .= "<td>" . $resp[0] . "</td>";
    $table .= "<td>" . $resp[1] . "</td>";
    $table .= "<td>" . $resp[2] . "</td>";
    $table .= "<td>" . $resp[3] . "</td>";
    $table .= "<td>" . $resp[4] . "</td>";
    $table .= "<td>" . $resp[5] . "</td>";
    $table .= "</tr>";
}

?>
    <thead>
    <tr>
        <th>X</th>
        <th>Y</th>
        <th>R</th>
        <th>Время запуска</th>
        <th>Время работы</th>
        <th>Результат</th>
    </tr>
    </thead>
<?php echo $table ?>


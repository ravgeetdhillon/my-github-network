<?php

if (empty($_REQUEST['username'])) {
    $response = [
        "status" => "negative",
        "message" => "Username is empty."
    ];
    print_r(json_encode($response));
    exit(1);
}

$username = $_REQUEST['username'];

function hasFollower($follower, $arr) {
    $l = count($arr['nodes']);
    for ($j = 0; $j < $l; $j++) {
        if ($arr['nodes'][$j]['id'] == $follower->{'login'}) {
            return true;
        }
    }
    return false;
}

$opts = [
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: PHP'
        ]
    ]
];

header('Content-Type: application/json');
$context = stream_context_create($opts);

if (false === ($apiResult = @file_get_contents("https://api.github.com/users/".$username, false, $context))) {
    $response = [
        "status" => "negative",
        "message" => "Sorry, we couldn't find this username."
    ];
    print_r(json_encode($response));
    exit(1);
}

$masterUser = json_decode($apiResult);
$data = [
    "nodes" => [],
    "links" => []
];

$stack = [];
$z = 0;
$level = 1;

array_push($data['nodes'], ['id' => $masterUser->{'login'}, 'group' => 1]);
array_push($stack, $masterUser);

while (count($stack) > 0) {
    $now = array_pop($stack);

    $apiResult = file_get_contents($now->{'followers_url'}, false, $context);
    $followersList = json_decode($apiResult);
    
    $l = count($followersList);
    for ($i = 0; $i < $l; $i++) {
        if (!hasFollower($followersList[$i], $data)) {
            if ($z < $level) {
                array_push($stack, $followersList[$i]);
            }
            array_push($data['nodes'], ['id' => $followersList[$i]->{'login'}, 'group' => 1]);
        }
        array_push($data['links'], ['source' => $now->{'login'}, "target" => $followersList[$i]->{'login'},'value' => 1]);
    }
    $z++;
}

$response = [
    "status" => "positive",
    "message" => "Hey ".$masterUser->{'name'}."! Check out your great network.",
    "data" => $data
];

print_r(json_encode($response));

?>
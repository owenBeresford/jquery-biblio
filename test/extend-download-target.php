<?php

header('Last-modified: '.date('r', time()-7*24*60*60));
echo <<<EOHTML
<!DOCTYPE html>
<html>
<head>
<title>Boring Page title #1</title>
</head>
<body>
<h1>Minimal test page to test downloading.  Contains no content.</h1>
</body>
</html>
EOHTML;

<?php

header('Last-modified: '.date('r', time()-7*24*60*60));
echo <<<EOHTML
<!DOCTYPE head>
<html>
<head>
<title>Boring Page title #2</title>
<meta name="description" value="Exciting meta text!!!!1" />
</head>
<body>
<h1>Minimal test page to test downloading.  Contains no content.</h1>
</body>
</html>
EOHTML;

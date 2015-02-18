<?php

header('Last-modified: '.date('r', time()-7*24*60*60));
echo <<<EOHTML
<!DOCTYPE head>
<html>
<head>
<title>Boring Page title #3</title>
<meta name="Description" content="Exciting meta text!!!!1" />
<meta name="Author" content="B Perovic" />
</head>
<body>
<h1>Minimal test page to test downloading.  Contains no content.</h1>
</body>
</html>
EOHTML;

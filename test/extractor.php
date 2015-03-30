<?php
// this is really simple and isolated code to build JSON indexes.
// please don't make web resources like this, but no-deps is useful here.
//
// Secondly please DO NOT put this file on the internet, its NOT proper code.
//
// To comply to various security limitations you may need to cross domain scripting; but I have a test server copy and ran it from there...

if(!is_array($_SERVER)) {
	die("Script to be run via a webserver only.");
}
if(!function_exists('curl_init')) {
	die("Needs cURL support builtin.");
}

if($_SERVER['REQUEST_METHOD']=='GET') {
// i made the HTML, by extracting a form built by my libaries

	echo <<<'EOHTML'
<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en-GB-oed" class="ie6 noJS"> <![endif]-->
<!--[if IE 7]>         <html lang="en-GB-oed" class="ie7 noJS"> <![endif]-->
<!--[if IE 8]>         <html lang="en-GB-oed" class="ie8 noJS"> <![endif]-->
<!--[if IE 9]>         <html lang="en-GB-oed" class="ie9 noJS"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en-GB-oed" class="noJS"> <!--<![endif]-->
<head>
<!-- This website is written by a guy who claims to have lots of specialised technical skills, but this website only partially demonstrates them.  This website is a vehicle for about 100,000 words, please read some of them. -->
<title>Biblio extract generator.</title>
<meta http-equiv="X-UA-Compatible" content="IE=9" />
<meta name="viewport" content="width=device-width, maximum-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en-GB-oed" />
<meta name="Generator" content="iceline webkit 2.1" />
<meta name="Author" content="Owen Beresford" />
<meta name="Description" content="Read an exciting article on my site." />

<link rel="stylesheet" type="text/css" href="http://owenberesford.me.uk/resource/reach-positional" />
<style type="text/css">
/* I am told there are issues with IE and the force-media-queries-to-work script if this isn't in the main page. */
@media screen and (max-width:1000px) {
.h4_title h1, .h4_title h2, .h4_title { max-width:570px; }
}

@media screen and (max-width:900px) {
.h4_title h1, .h4_title h2, .h4_title { max-width:500px; margin:0px; }
}

@media screen and (max-width:800px) {
.h4_title h1, .h4_title h2, .h4_title { max-width:400px; margin:0px; }
}

@media screen and (max-width:700px) {
.h4_title h1, .h4_title h2, .h4_title, #shareGroup { max-width:350px; margin:0px; width:auto; min-width:300px; }
.h4_menu { margin:0px; }
.h4_closed { width:180px; }
.outer_menu { height:auto; }
.halferWords { width:auto; }
.halferWords .pullout, .halferWords .pullout2, .fewWords .pullout, .fewWords .pullout2, .lotsOfWords .pullout, .lotsOfWords .pullout2 { width:auto; margin-left:1px; }
}
@media screen and (max-width:640px) {
.h4_title h1, .h4_title h2, .h4_title, #shareGroup { max-width:340px; min-width:300px; }
}
@media screen and (max-width:620px) {
.h4_title h1, .h4_title h2, .h4_title, #shareGroup { max-width:330px; min-width:300px; }
}

@media screen and (max-width:600px) {

#tinyScreen { display:block; } 
#bigScreen  { display:none; }
.outer_menu { margin:0px; margin-left:0px; }
.fewWords { width:95%; }

}
@media mobile {
.fewWords { width:95%; }
.outer_menu { margin:0px; margin-left:0px; }

}
</style>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/es5-shim.js" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery-1.11.1" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery.validate" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery-ui.min" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/correction" ></script>

</head>
<body id="body">
<div class="h4_page">
<div class="after_menu">
<main id="main">
<article>
<div class="blocker">
<div class="fewWords">
<p>Please enter the URL to the resource that you wish to build the index/ reference cache for.</p>
<form method="post" name="dE" id="dE">
<p id="nmWrapper" class=""><label for="nm" id="nmLabel" class="h4_label">URL :</label><input type="text" name="url" id="url" value="" size="50" maxlength="150" /></p>
<input type="hidden" name="resource" id="resource" value="extractor" />
<input type="hidden" name="links" id="links" value="" />
<p id="btnSubmitWrapper" class=""><input type="button" name="btnSubmit" id="btnSubmit" value="fetch -->" class="h4_btn" /></p>

</form>

</div>
</div>
</article>
</main>
</div>
<br />
</div>
<fieldset class="outer_menu">
<legend></legend>
<div id="bigScreen">
<div class="h4_title"><header><h1>Reference cache builder</h1></header>


<p id="shareGroup"> <a href="http://owenberesford.me.uk/resource/rss" title="Access the sites RSS feed."><img alt="RSS." src="/asset/rss-128x128" height="25" width="25"></a> Share: 
<!-- <iframe src="http://www.facebook.com/widgets/like.php?href=http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me" ><img src="/asset/small-facebook-logo.png" alt="Share this resource on your FB account." /></iframe>  -->
<a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me&amp;title=Contact+me.&amp;summary=Read+an+exciting+article+on+my+site.&amp;source=owenberesford.me.uk" title="Share this resource with your linked-in account." target="_blank"><img src="/asset/small-LinkedIn-logo.jpg" alt="Share this resource on your linked-in account." /></a>
<a target="_blank" title="Share this resource on your twitter account." href="http://twitter.com/home?status=I+think+this+is+important+http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me"><img alt="Share this resource on your twitter account." src="/asset/small-twitter-logo.png"></a>
<a target="_blank" title="Share this resource over googleplus." href="https://plus.google.com/share?url=http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me&amp;hl=en"><img src="/asset/gplus.png" height="25" width="25" alt="G+" /></a> 
&shy; Follow <a href="https://twitter.com/@publishowen" class="twitterLink"><img src="/asset/twitter-bird-light-25x25" alt="small twitter bluebird"> @publishowen</a> 
<a href="http://owenberesford.me.uk/resource/contact-me" class="twitterLink">[look]</a>
</p></div>
<nav>
<fieldset class="h4_menu">
<legend><a id="pageMenu">Table of Contents</a></legend>
<ul class="h4_lean">
<li class="h4_odd"><a href="/resource/home">Home</a></li>
<li><a href="/resource/authenticate">Login --&gt;</a></li>
<li class="h4_odd"><a href="/resource/search">Search --&gt;</a></li>
<li><a href="/resource/appearance">Appearance --&gt;</a></li>
<li class="h4_odd"><a href="/resource/translate" id="translateA">Translate --&gt;</a></li>
</ul>
<br />

</fieldset>
</nav>
<br />
</div>
</fieldset>

<br class="blocker" />
<div id="biblio"></div>
<br class="blocker" />
<footer>
<div class="h4_footer"> <div class="w3cpix"><a href="http://jigsaw.w3.org/css-validator/check/referer"><img src="/asset/vcss" alt="Valid CSS!" /></a> 
<a href="http://validator.w3.org/check?uri=referer"><img src="/asset/valid-xhtml10" alt="Valid XHTML 1.0 Transitional" /></a> 
My profile: <a href="http://www.linkedin.com/profile/view?id=110213562" ><img src="/asset/linkedin" alt="Look at my linked-in profile." id="linkedinpix" /></a>
</div> Page rendered 29th of Mar, 18:08:26, Copywright &copy; 2013 Owen Beresford, <a class="" href="http://owenberesford.me.uk/resource/contact-me#">contact me</a>.  Last modified 1425364900. <br />

Read the generous <a class="" href="http://owenberesford.me.uk/resource/licence#">licence terms</a>, if you feel the need, there is a <a class="" href="http://owenberesford.me.uk/resource/privacy#">privacy here</a>.    View the <a class="" href="http://owenberesford.me.uk/resource/site-chart#">site map</a> or the view source of <a class="" href="http://owenberesford.me.uk/resource/render-source&amp;view=contact-me">this page</a>.  <a href="#pageMenu">Jump to menu</a>
</div>
</footer>
<script type="text/javascript">
$(document).ready(
// do not write code like this, its crap.
	function() {
		$('#dE').attr('disabled', 'disabled');

		$('#btnSubmit').click(
			function() {

				var url=$('#url').val();
				$.ajax( {url:url, context:this, timeout:3000, dataType:"html", success:function(data, status, jqXHR) {

					var $data=$.parseHTML(data );
					$data=$($data);
					var list=[];
					$data.find('sup a').each(
						function(name, val) {
							var $val=$(val);
							list[list.length]=$val.attr('href');
						}
					);
					$('#links').val(JSON.stringify(list));
					$('#dE').attr('disabled', null);

console.log("submit now");
					$('#dE').submit();
} });
			}
);
	}
);
</script>
</body>
</html>
EOHTML;
	exit(0);

} else {
	if(isset($_POST['url']) || strlen($_POST['url'])>5) {
		$links	=json_decode($_POST['links']);
		$list	=array();

		foreach($links as $k=>$v) {
			$list[]=_list($v);
		}
		$json=json_encode($list,JSON_UNESCAPED_SLASHES );	
	
		echo <<<EOHTML
<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en-GB-oed" class="ie6 noJS"> <![endif]-->
<!--[if IE 7]>         <html lang="en-GB-oed" class="ie7 noJS"> <![endif]-->
<!--[if IE 8]>         <html lang="en-GB-oed" class="ie8 noJS"> <![endif]-->
<!--[if IE 9]>         <html lang="en-GB-oed" class="ie9 noJS"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en-GB-oed" class="noJS"> <!--<![endif]-->
<head>
<!-- This website is written by a guy who claims to have lots of specialised technical skills, but this website only partially demonstrates them.  This website is a vehicle for about 100,000 words, please read some of them. -->
<title>Biblio extract generator.</title>
<meta http-equiv="X-UA-Compatible" content="IE=9" />
<meta name="viewport" content="width=device-width, maximum-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en-GB-oed" />
<meta name="Generator" content="iceline webkit 2.1" />
<meta name="Author" content="Owen Beresford" />
<meta name="Description" content="Read an exciting article on my site." />

<link rel="stylesheet" type="text/css" href="http://owenberesford.me.uk/resource/reach-positional" />
<style type="text/css">
/* I am told there are issues with IE and the force-media-queries-to-work script if this isn't in the main page. */
@media screen and (max-width:1000px) {
.h4_title h1, .h4_title h2, .h4_title { max-width:570px; }
}

@media screen and (max-width:900px) {
.h4_title h1, .h4_title h2, .h4_title { max-width:500px; margin:0px; }
}

@media screen and (max-width:800px) {
.h4_title h1, .h4_title h2, .h4_title { max-width:400px; margin:0px; }
}

@media screen and (max-width:700px) {
.h4_title h1, .h4_title h2, .h4_title, #shareGroup { max-width:350px; margin:0px; width:auto; min-width:300px; }
.h4_menu { margin:0px; }
.h4_closed { width:180px; }
.outer_menu { height:auto; }
.halferWords { width:auto; }
.halferWords .pullout, .halferWords .pullout2, .fewWords .pullout, .fewWords .pullout2, .lotsOfWords .pullout, .lotsOfWords .pullout2 { width:auto; margin-left:1px; }
}
@media screen and (max-width:640px) {
.h4_title h1, .h4_title h2, .h4_title, #shareGroup { max-width:340px; min-width:300px; }
}
@media screen and (max-width:620px) {
.h4_title h1, .h4_title h2, .h4_title, #shareGroup { max-width:330px; min-width:300px; }
}

@media screen and (max-width:600px) {

#tinyScreen { display:block; } 
#bigScreen  { display:none; }
.outer_menu { margin:0px; margin-left:0px; }
.fewWords { width:95%; }

}
@media mobile {
.fewWords { width:95%; }
.outer_menu { margin:0px; margin-left:0px; }

}
</style>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/es5-shim.js" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery-1.11.1" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery.validate" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery-ui.min" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/correction" ></script>

</head>
<body id="body">
<div class="h4_page">
<div class="after_menu">
<main id="main">
<article>
<div class="blocker">
<div class="fewWords">
<p> The results as a JSON array:
<pre>
$json
</pre>

</div>
</div>
</article>
</main>
</div>
<br />
</div>
<fieldset class="outer_menu">
<legend></legend>
<div id="bigScreen">
<div class="h4_title"><header><h1>Results.</h1></header>


<p id="shareGroup"> <a href="http://owenberesford.me.uk/resource/rss" title="Access the sites RSS feed."><img alt="RSS." src="/asset/rss-128x128" height="25" width="25"></a> Share: 
<!-- <iframe src="http://www.facebook.com/widgets/like.php?href=http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me" ><img src="/asset/small-facebook-logo.png" alt="Share this resource on your FB account." /></iframe>  -->
<a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me&amp;title=Contact+me.&amp;summary=Read+an+exciting+article+on+my+site.&amp;source=owenberesford.me.uk" title="Share this resource with your linked-in account." target="_blank"><img src="/asset/small-LinkedIn-logo.jpg" alt="Share this resource on your linked-in account." /></a>
<a target="_blank" title="Share this resource on your twitter account." href="http://twitter.com/home?status=I+think+this+is+important+http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me"><img alt="Share this resource on your twitter account." src="/asset/small-twitter-logo.png"></a>
<a target="_blank" title="Share this resource over googleplus." href="https://plus.google.com/share?url=http%3A%2F%2F127.0.0.1%3A81%2Fresource%2Fcontact-me&amp;hl=en"><img src="/asset/gplus.png" height="25" width="25" alt="G+" /></a> 
&shy; Follow <a href="https://twitter.com/@publishowen" class="twitterLink"><img src="/asset/twitter-bird-light-25x25" alt="small twitter bluebird"> @publishowen</a> 
<a href="http://owenberesford.me.uk/resource/contact-me" class="twitterLink">[look]</a>
</p></div>
<nav>
<fieldset class="h4_menu">
<legend><a id="pageMenu">Table of Contents</a></legend>
<ul class="h4_lean">
<li class="h4_odd"><a href="/resource/home">Home</a></li>
<li><a href="/resource/authenticate">Login --&gt;</a></li>
<li class="h4_odd"><a href="/resource/search">Search --&gt;</a></li>
<li><a href="/resource/appearance">Appearance --&gt;</a></li>
<li class="h4_odd"><a href="/resource/translate" id="translateA">Translate --&gt;</a></li>
</ul>
<br />

</fieldset>
</nav>
<br />
</div>
</fieldset>

<br class="blocker" />
<div id="biblio"></div>
<br class="blocker" />
<footer>
<div class="h4_footer"> <div class="w3cpix"><a href="http://jigsaw.w3.org/css-validator/check/referer"><img src="/asset/vcss" alt="Valid CSS!" /></a> 
<a href="http://validator.w3.org/check?uri=referer"><img src="/asset/valid-xhtml10" alt="Valid XHTML 1.0 Transitional" /></a> 
My profile: <a href="http://www.linkedin.com/profile/view?id=110213562" ><img src="/asset/linkedin" alt="Look at my linked-in profile." id="linkedinpix" /></a>
</div> Page rendered 29th of Mar, 18:08:26, Copywright &copy; 2013 Owen Beresford, <a class="" href="http://owenberesford.me.uk/resource/contact-me#">contact me</a>.  Last modified 1425364900. <br />

Read the generous <a class="" href="http://owenberesford.me.uk/resource/licence#">licence terms</a>, if you feel the need, there is a <a class="" href="http://owenberesford.me.uk/resource/privacy#">privacy here</a>.    View the <a class="" href="http://owenberesford.me.uk/resource/site-chart#">site map</a> or the view source of <a class="" href="http://owenberesford.me.uk/resource/render-source&amp;view=contact-me">this page</a>.  <a href="#pageMenu">Jump to menu</a>
</div>
</footer>
</body>
</html>
EOHTML;

	} else {
		die("Go way hacker.");
	}
}

function _list($url) {
	$item	=[];
	$matches=[];

// security validation?	
	$c		=curl_init( $url );
	curl_setopt($c, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($c, CURLOPT_HTTPGET, true);
	curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($c, CURLOPT_TIMEOUT, 5);
	curl_setopt($c, CURLOPT_HEADER, true);
	curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
	$text=curl_exec($c);
	if(  curl_errno($c)  ) {
		$tt=curl_strerror( curl_errno($c));
		return array(
				'url'=>$url,
				'descrip'=>$tt,
				'title'=>'',
				'auth'=>'',
				'date'=>'',
						);
	}

# int preg_match ( string $pattern , string $subject [, array &$matches [, int $flags = 0 [, int $offset = 0 ]]] )
	$count=preg_match('/<meta[ \\t]+name=["\']description["\'][ \\t]+content="([^"]+)"/i', $text, $matches);
	if($count) { 
		$item['descrip']=str_replace('"', '\\"', $matches[1]);
	}
	$count=preg_match('/<title>([^<]+)<\\/title>/i', $text, $matches);
	if($count) { 
		$item['title']=str_replace('"', '\\"',trim($matches[1]));
	}
	$count=preg_match('/<meta[ \\t]+name=["\']author["\'][ \\t]+content="([^"]+)"/i', $text, $matches);
	if($count) { 
		$item['auth']=str_replace('"', '\\"',$matches[1]);
	}

	$count=preg_match('/^Last-Modified: (.+)$/m', $text, $matches);
	if($count) { 
		$item['date']=strtotime($matches[1]);
	}

	$item['url']= $url;

/*
				$item=array(
				'descrip'=>'',
				'title'=>'',
				'auth'=>'',
				'date'=>'',
						);
*/
	return $item;
}



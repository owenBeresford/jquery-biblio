<?php $myurl="http://127.0.0.1:81/external/"; ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en-GB-oed" class="ie6 noJS"> <![endif]-->
<!--[if IE 7]>         <html lang="en-GB-oed" class="ie7 noJS"> <![endif]-->
<!--[if IE 8]>         <html lang="en-GB-oed" class="ie8 noJS"> <![endif]-->
<!--[if IE 9]>         <html lang="en-GB-oed" class="ie9 noJS"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en-GB-oed" class="noJS"> <!--<![endif]-->
<head>
<!-- This website is written by a guy who claims to have lots of specialised technical skills, but this website only partially demonstrates them.  This website is a vehicle for about 100,000 words, please read some of them. -->
<title>Static UI demo 2.</title>
<meta http-equiv="X-UA-Compatible" content="IE=9" />
<meta name="viewport" content="width=device-width, maximum-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en-GB-oed" />
<meta name="Generator" content="iceline webkit 2.1" />
<meta name="Author" content="Owen Beresford" />
<meta name="Description" content="I have read up on Drupal, here are some notes." />

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
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery-ui.min" ></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery.columniser"></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/jquery-wresize-0.1.1"></script>
<script type="text/javascript" src="/asset/jquery-biblio-0.5.0.js"></script>
<script type="text/javascript" src="http://owenberesford.me.uk/asset/correction" ></script>
<script type="text/javascript" >
$(document).ready(function() {
$('document').biblio({
		width:1500,
		debug:1,
		extendViaDownload:1,
				});
});
</script>
</head>
<body id="body">
<div class="h4_page">
<div class="after_menu">
<article>
<div class="blocker">
<div class="lotsOfWords">
<div class="pullout" id="notice">
<h3>Static biblio demo 2.</h3> 
I have hack this script to extract the references for all screen sizes.  This will normally only occur below a certain trigger size.  Please refer to the actual <a href="./jquery-biblio-test.html" title="Load the real unit test,">unit-test</a>, and the <a href="http://owenberesford.me.uk/resource/jQuery-biblio" title="goto the dev notes article for this project." >dev notes</a> article. <p>I don't have a proper unit test for the download feature, as mocking $.ajax would be a pain. The files here show you it running, and many people are likely to want to tweak the UI.
</div>
<p>There have been a number of iterations on Drupal.  My notes go back to Drupal6.  Drupal 7 added a few new features (please see <sup><a href="<?php echo $myurl ?>extend-download-target.php" target="_blank">1</a></sup> <sup><a href="<?php echo $myurl ?>extend-download-target.php" target="_blank">2</a></sup>); and is the “current one”.  Drupal8 breaks backwards compatibility, but has finally joined the &gt;1980s by going OO and using namespaces.  Drupal8 also supports HTML5 and mobile.  Whilst I understand inertia on big projects, I find it hard to take lack of support for these things seriously.<br />
There is a catalogue that lists Drupal sites <sup><a href="<?php echo $myurl ?>/extend-download-target2.php" target="_blank">3</a></sup>, this is useful for looking at features for Drupal.  <sup><a href="<?php echo $myurl ?>extend-download-target2.php" target="_blank">Seasonal fluff</a></sup> that showed up on my linkedin. <sup><a href="<?php echo $myurl ?>/extend-download-target3.php" target="_blank">404</a></sup> </p>



</div>

<div style="display:none" id="biblio">
<hr />
<h3><a name="biblio">Exported bibliography (UI for mobile).</a></h3>
<p>Use jQuery to extract all &lt;SUP&gt;; inject UL, with the links, add CSS padding so can be thumbed.  Problem: Links are generated and have no meta data  look at aira attrib...</p>
<p>Rewrite as a jQuery for reuse...</p>
<ul>
</ul>
</div>
</div>
</article>
</div>
<br />
</div>
<fieldset class="outer_menu">
<legend></legend>
<div id="tinyScreen">
<h1>Static biblio demo.</h1>
<a class="twitterLink" href="/resource/site-chart">Sitemap</a> <a href="http://127.0.0.1/resource/rss"><img alt="RSS." src="/asset/rss-128x128" height="25" width="25"></a> Share: <a href="http://twitter.com/home?status=I+think+this+is+important+http%3A%2F%2F127.0.0.1%2Fresource%2Fdrupal-notes" title="Share this resource on your twitter account." target="_blank"><img src="/asset/small-twitter-logo.png" alt="Share this resource on your twitter account." height="25" width="25" /></a> 
<a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2F127.0.0.1%2Fresource%2Fdrupal-notes&amp;title=Notes+on+Drupal.&amp;summary=I+have+read+up+on+Drupal%2C+here+are+some+notes.&amp;source=owenberesford.me.uk" target="_blank"><img src="/asset/small-LinkedIn-logo.jpg" alt="Share this resource on your linked-in account." height="25" width="25" /></a>
<a target="_blank" title="Share this resource over googleplus." href="https://m.google.com/app/plus/x/?v=compose&amp;content=I+think+this+is+important+http%3A%2F%2F127.0.0.1%2Fresource%2Fdrupal-notes"><img src="/asset/gplus.png" height="25" width="25" alt="G+" /></a> 

</div>
<div id="bigScreen">
<div class="h4_title"><header><h1>Static biblio demo 2.</h1></header>


<p id="shareGroup"> <a href="http://127.0.0.1/resource/rss" title="Access the sites RSS feed."><img alt="RSS." src="/asset/rss-128x128" height="25" width="25"></a> Share: 
<!-- <iframe src="http://www.facebook.com/widgets/like.php?href=http%3A%2F%2F127.0.0.1%2Fresource%2Fdrupal-notes" ><img src="/asset/small-facebook-logo.png" alt="Share this resource on your FB account." /></iframe>  -->
<a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2F127.0.0.1%2Fresource%2Fdrupal-notes&amp;title=Notes+on+Drupal.&amp;summary=I+have+read+up+on+Drupal%2C+here+are+some+notes.&amp;source=owenberesford.me.uk" title="Share this resource with your linked-in account." target="_blank"><img src="/asset/small-LinkedIn-logo.jpg" alt="Share this resource on your linked-in account." /></a>
<a target="_blank" title="Share this resource on your twitter account." href="http://twitter.com/home?status=I+think+this+is+important+http%3A%2F%2F127.0.0.1%2Fresource%2Fdrupal-notes"><img alt="Share this resource on your twitter account." src="/asset/small-twitter-logo.png"></a>
<a target="_blank" title="Share this resource over googleplus." href="https://plus.google.com/share?url=http%3A%2F%2F127.0.0.1%2Fresource%2Fdrupal-notes&amp;hl=en"><img src="/asset/gplus.png" height="25" width="25" alt="G+" /></a> 
&shy; Follow <a href="https://twitter.com/@publishowen" class="twitterLink"><img src="/asset/twitter-bird-light-25x25" alt="small twitter bluebird"> @publishowen</a> 
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
<li>Audience</li>
<li class="h4_odd">Comparison to other CMS</li>
<li>Drupal 7 features</li>
<li class="h4_odd">Performance</li>
<li>Architecture</li>
<li class="h4_odd">Testing</li>
<li>Exported bibliography (UI for mobile).</li>
<li class="h4_odd">Page 1 references</li>
<li>Page 2 references</li>
</ul>
<br />

</fieldset>
</nav>
<br />
</div>
</fieldset>

<br class="blocker" />
<footer>
<div class="h4_footer"> <div class="w3cpix"><a href="http://jigsaw.w3.org/css-validator/check/referer"><img src="/asset/vcss" alt="Valid CSS!" /></a> 
<a href="http://validator.w3.org/check?uri=referer"><img src="/asset/valid-xhtml10" alt="Valid XHTML 1.0 Transitional" /></a> 
My profile: <a href="http://www.linkedin.com/profile/view?id=110213562" ><img src="/asset/linkedin" alt="Look at my linked-in profile." id="linkedinpix" /></a>
</div> Page rendered 15th of Jan, 11:24:19, Copywright &copy; 2013 Owen Beresford, <a class="" href="http://127.0.0.1/resource/contact-me#">contact me</a>.  Last modified 1420198552. <br />

Read the generous <a class="" href="http://127.0.0.1/resource/licence#">licence terms</a>, if you feel the need, there is a <a class="" href="http://127.0.0.1/resource/privacy#">privacy here</a>.    View the <a class="" href="http://127.0.0.1/resource/site-chart#">site map</a> or the view source of <a class="" href="http://127.0.0.1/resource/render-source&amp;view=drupal-notes">this page</a>.  <a href="#pageMenu">Jump to menu</a>
</div>
</footer>
</body>
</html>

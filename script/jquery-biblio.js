/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
/**
 *  jquery-biblio
 * 
 * Copyright (c) 2015 Owen Beresford, All rights reserved.
 * I have not signed a total rights contract, my employer isn't relevant.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * jquery-biblio ~ a module to extract Harvard style references from web pages, and append to a OL list at the end of the page.  Written to assist mobile users.  
 *
 * @author: Owen beresford owenberesford@users.noreply.github.com
 * @version: 0.3.1
 * @date: 15/03/2017
 * @licence: AGPL <http://www.gnu.org/licenses/agpl-3.0.html> 
 * 
 * deps: 
 *  jQuery must already be loaded 
 *  window.currentSize 

These are the options that are currently supported:
  ** debug ~ whether to write to console.log, or not.
  ** width ~ default: 400 ~ size to trigger the extraction.
  ** tooltip ~ default: false ~ add a hoover tooltip for desktop users, implies extendViaDownload===4
  ** wholeURL ~ default:8 ~ how long an URL must be to be "converted" to a simpler name.
  ** extendViaDownload ~ default:0 ~ Attempt to download further information from the target link. 0= off, 1 on button click, 2= force on page load, 4= on page load from a cache, so CORS is okay
  ** selector ~ default:'sup a' ~ what to look for, WRT the links that being extracted.
  ** gainingElement ~ default:'#biblio' ~ where to add the generated OL.
  ** loosingElement ~ default:'.lotsOfWords' ~ where to look for the links (you probably don't want footer links to show up, for example)
  ** textAsName ~ default:3 ~ if using the visible text in a link, minimum number of chars before guess its word.
  ** referencesCache ~ if using the single remote download option, what URL?
  ** callbacks ~ default:{
			appendLi:_appendLi,
			appendList:_appendList,
			neuterLink:_neuterLink,
			appendTitle:_appendTitle,
			appendSection:_appendBiblioTitle,
			emptyList:_emptyList,
			postList:_postList,
			haveEmptyPage:_emptyPage
						}
Callbacks are functions called in the context of the BibliographyExtractor class, so may access the options hash.  They should return HTML, or perform the stated change.   If you want to override many of these, it may be faster to fork the plugin and edit the library. 

Internal items, don't touch please:	
  ** type ~ default: 'biblio' ~ jQuery infrastructure, pls ignore.
  ** pageInitRun ~ default:0,
  ** currentId
  ** currentURL
  ** download:0,
  ** ready:1,
*/



(function($){
	"use strict";
	if(typeof isMobile !== 'function') {
	var isMobile=function() {
		try{ document.createEvent("TouchEvent"); return true; }
		catch(e){ return false; }
	};
	}

// add leading 0 to strings holding an int if needed.
	if(typeof pad !== 'function') {{{
        var pad=function(number) {
            var r = String(number);
            if ( r.length === 1 ) {
                r = '0' + r;
            }
            return r;
        }
	}}}

// like really small version of moment, converts ascii string to Date object 
	function importDate(format, day, time) {{{
		var day1, time1, fpos, bpos;
		var year1, month1, _day1, hour1, min1, sec1;

		var tt       =day.split('T');
		var found    =false;

		if(tt.length==2) {
			day1       =tt[0];
			time1      =tt[1];
			found      =true;
		}

		var tt       =day.split(' ');
		if(!found && tt.length==2) {
			day1       =tt[0];
			time1      =tt[1];
			found      =true;
		} 

		if(!found && time) {
			day1       =day; 
			time1      =time;
			found      =true;
		} else if(!found ){     
			day1       =day;
			time1      ='00:00:00';
		} 

		if(day1.indexOf('-') ){
			day1       = day1.split('-');
		}else{       
			day1       = day1.split('/');
		} 
		time1        = time1.split(':');
		for(var j =0; j<time1.length; j++) {
			day1[day1.length]=time1[j];
		}

		fpos         = 0;
		while(fpos<format.length) {
			switch(format.charAt(fpos)) {
				case 'y': { year1 = parseInt(day1[fpos], 10); break; }
				case 'm': { month1 = parseInt(day1[fpos], 10); month1--; break; }
				case 'd': { _day1 = parseInt(day1[fpos], 10); break; }
				case 'h': { hour1 = parseInt(day1[fpos], 10); hour1--; break; }
				case 'i': { min1 = parseInt(day1[fpos], 10); break; }
				case 's': { sec1 = parseInt(day1[fpos], 10); break; }
			}
			fpos++;
		}

		return new Date(year1, month1, _day1, hour1, min1, sec1, 0 );
	}}}


	/**
	 * biblio ~ jQuery style constructor 
	 * 
	 * @param DOMElement el
	 * @param array options ~ see doc header
	 * @access public
	 * @return <object>
	 */
	$.biblioImpl = function(el, options) {
// msie 8
		if (window.attachEvent && !window.addEventListener) {
			if(options.debug) {
				alert("biblio() WARNING: Ancient browser, hopefully everything still computes.\n(Dev import es5-shim to avoid this message.)");
			}
		}

		/**
		 * BibliographyExtractor
		 * 
		 * @param DOMElement el 
		 * @param array options 
		 * @return <self>
		 */
		function BibliographyExtractor(el, options) {
			this.$el  = $(el);
			this.el   = el;
			this.delayedLoad=[];
			this.$el.data("biblio", this);
	        this.options = $.extend({}, $.biblioImpl.defaultOptions, options);
			if(this.options.debug) {
				console.log("biblio() Created a BibliographyExtractor.");
			}
			return this; 
		}

		/**
		 * trigger ~ API point to move the elements round
		 *
		 * @return <self> 
		 */
		BibliographyExtractor.prototype.trigger=function() {
			var i, LENGTH;

			if( isMobile() || window.currentSize()[0] <this.options.width ) {
				if(this.options.debug) { 
					console.log("Running the biblio extractor (its an active size...)");
				}
				if(this.options.pageInitRun) { return; }
				this.options.pageInitRun = 1;
				if(this.options.debug) {
					console.log("and this the first run (so will do something)..."); 
				}
				this.options.callbacks.emptyList.apply(this, [this.options.gainingElement ]);
				$(this.options.gainingElement).append( this.options.callbacks.appendSection.apply(this, [ ]));
				const $SELF	=this; 
				if(this.options.extendViaDownload===1) {
					$('#mapper').click(function() { $SELF._iterate($SELF); } );
				} else if(this.options.extendViaDownload==2) {
					$('#mapper').parent().css('display', 'none');
				} else if(this.options.extendViaDownload==4) {
					$('#mapper').parent().css('display', 'none');
					$SELF.downloadOne();
				}
				this.options.index=0;

				LENGTH=$(this.options.loosingElement).length;
				for( i=0; i<LENGTH; i++) {
					this._build1Page(i);
				}
				this.options.callbacks.postList.apply(this, [this.options.gainingElement ]);

			} else if (this.options.tooltip){
				this.options.index=0;
				if(! this.options.extendViaDownload===4) {
					throw new Error("devs: Option tooltip=true requires extendViaDownload===4");
				}
				if(this.options.debug) {
					console.log("Creating tooltips for desktop"); 
				}
				this.downloadOne();
				LENGTH=$(this.options.loosingElement).length;
				for( i=0; i<LENGTH; i++) {
					this._build1Page(i);
				}				
			}
			return this;
		};

		/**
		 * downloadOne ~ mapper for the server datacache 
		 * 
		 * @access private
	 	 * @return <self>
		 */
		BibliographyExtractor.prototype.downloadOne =function() {
			this.options.ready=0;
			this.options.currentId=0;
			this.options.currentURL=this.options.referencesCache;

			if(this.options.debug) {
				console.log("Starting external data retreival for "+this.options.referencesCache);
			}
			try {
				$.ajax( {url:this.options.referencesCache, success:_extraCached, context:this, timeout:3000, error:function(xhr, t, e) {console.log("ERROR: "+t+" "+e); } , dataType:"json"});
			} catch( e) {
				if(this.options.debug) { // trap needed or msie people will crash
					console.log("security exception? "+e.getMessage());
				}
			}
			return this;
		}

		/**
		 * _build1Page ~ actually build a OL for the current page
		 * 
		 * @param int offset
		 * @access private
	 	 * @return true
		 */
		BibliographyExtractor.prototype._build1Page =function(offset) {
			var nm		=this.options.gainingElement;
			var loss	=this.options.loosingElement;
			var cb		=this.options.callbacks;
			var ss		="Alist";
			if( this.options.tooltip) {
				ss="";
			}
			this.$_ul	=$(cb.appendList.apply(this, [offset, ss]));
			var $biblio =$(nm);
			const $SELF	=this; // sigh JS.
			
			if($($(loss)[offset]).find(this.options.selector).length==0) {
				$biblio.append(cb.haveEmptyPage.apply(this, [offset]));
			} else {
				$biblio.append(cb.appendTitle.apply(this, [offset]));
			}

			$biblio.append(this.$_ul);
// this hack via find() seems to be necessary inside this page.
// I confirm: 1) the data is present as expected 2) the jQuery works 
// I guess a consequence of the columnise module
			$($(loss)[offset]).find(this.options.selector).each(function(pos, ele) {

//			$( loss+':nth-child('+offset+') sup a').each(function(pos, ele) 
				if( $SELF.options.tooltip ) {
					$SELF._tooltip(pos, ele);
				} else {
					$SELF._biblioChart(pos, ele);
				}
			});

			if(this.options.extendViaDownload==2) {
				this._iterate(this);
			}
			return true;
		};

		BibliographyExtractor.prototype._biblioChart=function(pos, ele) {
			var $ele 	= $(ele);
			var url		=$ele.attr('href');
			var cb		=this.options.callbacks;

			var name	=this._extractName(url, $ele.text(), $ele.attr('aria-label'), $ele.attr('title'));
			if(this.options.extendViaDownload) {
				this.delayedLoad[pos]=function() { _downloadExtra.apply(this, [pos, url]); };
			}
			this.$_ul.append( cb.appendLi.apply(this, [this.options.index, url, name]) );
			this.options.index++;
			cb.neuterLink.apply(this, [$ele.selector]);
		};

		BibliographyExtractor.prototype._tooltip=function(pos, ele) {
			let $ele	=$(ele);
			let cb		=this.options.callbacks;
// get href from a; send to tooltip 
			this.$_ul.append(cb.tooltip( "", $ele.attr('href'), this.options.index ));
			$ele.attr('data_id', 'replace'+this.options.index);
			$ele.on("mouseenter", function(e) { 
				let msg=$("#"+e.target.getAttribute('data_id')); 
				msg.addClass('h4display'); 
				msg.removeClass('h4hidden'); 
				let lnk=$(e.target);
				let pos=lnk.offset(); 
				if(pos.left + 450 > $(document).width() ) {
					pos.left=$(document).width()-452; 
				}
				msg.attr('style', 'left:'+pos.left+"px; top:"+pos.top+"px;");
			 	msg=$("#"+e.target.getAttribute('data_id')+" cite"); 
                msg.attr('href', lnk.attr('href'));
		     });
			
			var $made=$('#replace'+this.options.index);
			var ff=function(e) { 
				let msg=$("#"+e.target.getAttribute('data_id')); 
				msg.removeClass('h4display');
				msg.addClass('h4hidden');
				return false;
			};
			$made.on("mouseleave", ff);
			var $made=$('#go'+this.options.index);
			$made.attr('href', $ele.attr('href'));
			$made.attr('target', '_blank');
			
			var $made=$('#close'+this.options.index);
			$made.on("click", ff);
			$made.attr('data_id', 'replace'+this.options.index);
			this.options.index++;
		};

		/**
		 * _extractName ~ Isolated point of change for name parsing rules.
		 * 
		 * @param string raw
		 * @param string label OPTIONAL
		 * @access private
	 	 * @return string
		 */
		BibliographyExtractor.prototype._extractName=function(raw, text, label, title) {
			if(typeof raw !=="string") {
				throw "What ya dooin? '"+raw+"'";
			}

			if(label) {
				return label;
			}
			if(title && title.length > this.options.textAsName && title.length < this.options.wholeTitle) {
				return title;
			}
			if(text && text.length> this.options.textAsName) {
				return text;
			}
			if(raw.length<this.options.wholeURL) {
				return raw;
			}

// literals are defined in the URL RFC and not likely to change.
			var bits	= raw.split('.');
			var name 	= bits[1];
			if(name.match(/\//)) {
				bits	=bits[0].split('/');
				name	=bits[2];				
			}
			if(bits.length ==2) {
				name 	=bits[0];
			}
			return name;
		};

		/**
		 * _iterate ~ delay and execute all the lambdas to populate better link information.
		 * 
		 * @param BibliographyExtractor myself ~ needs to be passed self, to support the setTimeout() non-OO nature.
		 * @return <void>
		 */
		BibliographyExtractor.prototype._iterate=function(myself) {
// need to have a set a flag, as soon as a replace has happened can start the next
			if(myself.options.ready) {
				var t= myself.delayedLoad[ myself.options.download];
				if(typeof t != 'function') {
					if(myself.options.debug) {
						console.log("Hit end of function pointer list, stopping.");
					}
					return;
				}
				t.apply(myself, [ ]);
				myself.options.download++;
			} else if(myself.options.debug) {
				console.log("Flag not set, delaying 1/2 s ");
			}
			setTimeout(myself._iterate, 500, myself);
		};

	    return new BibliographyExtractor(el, options);
	};


// pls see doc header 
	$.biblioImpl.defaultOptions = {
		debug:0,
		type:'biblio',
		width:400,
		wholeURL:8,
		extendViaDownload:0,
		referencesCache:'/resource/XXXreferences',
		selector:'sup a',
		gainingElement:'#biblio',
		loosingElement:'.lotsOfWords',
		tocElement:'fieldset.h4_menu > .h4_lean',
		tocEdit:0,
		textAsName:3,
        tooltip:false,
		wholeTitle:50,
		pageInitRun:0,
		download:0,
		ready:1,
		limitDesc:150,
		callbacks:{
			appendLi:_appendLi,
			appendList:_appendList,
			neuterLink:_neuterLink,
			appendTitle:_appendTitle,
			appendSection:_appendBiblioTitle,
			emptyList:_emptyList,
			postList:_postList,
			haveEmptyPage:_emptyPage,
			tooltip:_tooltip,
				},
		
	};
	
	/**
	 * biblio ~ only makes sense for singular objects.
     * Should be applied to the entire document.
	 * Will need to be refactored to apply to tabbed interfaces, but this is all I have requirements for at present. 
	 * 
	 * @param array options
	 * @access public
	 * @return void;
	 */ 
	$.fn.biblio = function(options) { 
		try {
			var $t =$.biblioImpl(this, options);
			return $t.trigger();
		} catch( $e) {
			console.log($e);
			console.log($e.stack);
		}
	};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// the following a free standing default implementation callbacks.
// these are supposed to be stateless

	/**
	 * _appendList ~ generate the HTML for the OL list
	 * 
	 * @param int $offset ~  which page
	 * @return string
	 */
	function _appendList(offset, style) {
		return "<ol id=\"aList_pg"+offset+"\" class=\""+style+"\"></ol>";
	}

	/**
	 * _appendLi ~ generate the HTML for LI
	 * 
	 * @param int pos 
	 * @param string url 
	 * @param string name 
	 * @return string
	 */
	function _appendLi(pos, url, name) {
		return '<li> <cite href="'+url+'" id="replace'+pos+'" title="Link to external site (sorry this text is generated, I don\'t have any meta data.)">'+name+'</cite> </li>';
	}
	
	/**
	 * _neuterLink ~ edit the link
	 * 
	 * @param string select 
	 * @return true
	 */
	function _neuterLink(select) {
		$(select).attr('href', this.options.gainingElement);
		return true;
	}

	/**
	 * _emptyPage ~ report no links on that "page" of content
	 * 
	 * @param string select 
	 * @return true
	 */
	function _emptyPage(select) {
		return "<p>["+select+"] There are no references on this section.</p>";
	}


	/**
	 * _appendBiblioTitle ~ generate the H4 HTML
	 * 
	 * @param int offset 
	 * @return string
	 */
	function _appendBiblioTitle() {
		return "<h2 class=\"biblioSection\">References (for mobile UI)</h2> <p>The references embedded in the text are displayed here. </p><p><a id=\"mapper\" class=\"twitterLink\">Lookup extra link details</a>.</p>";
	}
	
	/**
	 * _appendTitle ~ generate the H4 HTML
	 * 
	 * @param int offset 
	 * @return string
	 */
	function _appendTitle(offset) {
		offset++;
		return "<h4>Page "+offset+" references.</h4>";
	}
	
	/**
	 * _emptyList ~ whatever is necessary to occur first.
	 * 
	 * @param string select 
	 * @return true
	 */
	function _emptyList(select) {
// wipe all P and OL
		$(select+" *").empty();
		return true;
	}

	/**
	 * _postList ~ stuff that occurs afterwards, in my usecase make visible.
	 * 
	 * @param string select 
	 * @return true
	 */
	function _postList(select) {
		$(select).css('display', 'block');
		if(this.options.tocEdit ) {
			var $toc = $(this.options.tocElement);
			var odd=$toc.children().length-1;
			var html = _hiddenLiBuilder($(this.options.gainingElement+' h2.biblioSection').text(), odd);
			$toc.append(html);
			odd++;

			var $list= $(this.options.gainingElement+" h4");
			for(var i=0; i< $list.length; i++ ) {
				html= _hiddenLiBuilder( $($list[i]).text(), odd);	
				$toc.append(html);
				odd++;
			}
			$toc.css('overflow-y', 'scroll');
			$toc.parent().css('overflow-y', 'hidden');
		}
		return true;
	}

	function _tooltip(name, url, pos ) {
		return '<li><div class="h4tooltip h4hidden" id="replace'+pos+'"> <div> <a id="close'+pos+'" class="button" href="#">X</a>  <a id="go'+pos+'" href="#" class="button">-&gt;</a> </div><cite href="'+url+'" title="This reference doesn\'t supply a title">'+name+' </cite> </div></li>';
	}

	/**
	 * _hiddenLiBuilder
	 * 
	 * @param text $text 
	 * @param odd $odd 
	 * @return <self>
	 */
	function _hiddenLiBuilder(text, odd) {
		var html;
		if(odd % 2) {
			html="<li class=\"h4_odd\">";
		} else {
			html="<li>" ;
		}
		html    +=text;
		html	+="</li>";
		return html;
	}

	/**
	 * _downloadExtra ~ 
	 * Download the URL, extract any META DESCRIPTION headers, or TITLE
	 * 
	 * @param int id ~ which A to update 
	 * @param string url 
	 * @return <void>
	 */
	function _downloadExtra(id, url) {
		this.options.ready=0;
		this.options.currentId=id;
		this.options.currentURL=url;

		if(this.options.debug) {
			console.log("Starting external data retreival for "+url);
		}
		try {
			$.ajax( {url:url, success:_extra, context:this, timeout:3000, dataType:"html"});
		} catch( e) {
			if(this.options.debug) { // trap needed or msie5/6/8 people will crash
				console.log("security exception? "+e.getMessage());
			}
		}
		return;
	}

	/**
	 * _extra ~ 
	 * The success handler, does the actual work.
	 * 
	 * @param string data
	 * @param string status
     * @param object jqXHR ~ the wrapped jQuery XHR object
	 * @return true
	 */
	function _extra(data, status, jqXHR) {
		var po=[ 
			"[No author]",  
			"Resource doesn't set a description tag.",
			"[No date]"
			];

		if(this.options.debug) {
			console.log("Completed as '"+status+"' for "+this.options.currentURL);
		}
		var title=false, descrip='', date='', auth='';
		date =_dateMunge(jqXHR.getResponseHeader('Last-Modified'), po[2]);
		var $data=$.parseHTML(data );
		$data=$($data);
// parseHTML will dump the head and body tags as they don't make sense inside a document
// therefore you get a list of the child elements back
// therefore need filter() not find()
		title=$data.filter('title').text();
		descrip=$data.filter("meta[name$='escription']").attr('value');
		if(! descrip) { descrip= $data.filter("meta[name$='escription']").attr('content'); }
		auth=$data.filter("meta[name$='uthor']").attr('content') || po[0];
		descrip2=descrip;
		if(descrip.length>this.options.limitDesc) {
			descrip2=descrip.substr(0, this.options.limitDesc)+"...";
		}
		var selct="#replace"+this.options.currentId;

		if(descrip) {
			$(selct).text(auth+" ["+date+"] ");
			$(selct).append("<strong>"+title+"</strong>");
			$(selct).after("<br />~ "+descrip2);
			$(selct).attr('title', descrip);
		} else {
			$(selct).text(auth+" ["+date+"] ");
			$(selct).append("<strong>"+title+"</strong>");
			$(selct).attr('title', po[1]);
		}
		this.options.ready=1;
	}

	function _dateMunge(din, ddefault, monthText) {
		var date='';

		if( Number(din)===din && din%1===0 ) {
			date=new Date(din*1000);
		} else if(typeof din === 'string') {
			date=importDate('ymdhis', din);
		} else {
			date =ddefault;
		}

		if(typeof date !== 'string') {
			var months=["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December" ];
			date=" "+date.getUTCFullYear() + '-' + 
				(monthText? months[ date.getMonth() + 1 ]:pad( date.getMonth()+1) ) +
				'-' + pad( date.getDate() ) +' ' +
				( monthText?"":pad( date.getHours()) +':00' ) ;
		}
		return date;
	}


	/**
	 * _extraCached ~ 
	 * The success handler, does the actual work.
	 * Not much security on here, but its the client.
	 * 
	 * @param string data
	 * @param string status
     * @param object jqXHR ~ the wrapped jQuery XHR object
	 * @return true
	 */
	function _extraCached(data, status, jqXHR) {
		var po=[ 
			"[No author]",  
			"Resource doesn't set a description tag.",
			"No date"
			];

		if(this.options.debug) {
			console.log("Completed as '"+status+"' for "+this.options.currentURL);
		}
		for(var i=0; i<data.length; i++) {
			if(this.options.debug>1) {
				console.log("Looking at "+i+" which is "+data[i].url);
			}

			var date =_dateMunge(data[i].date, po[2], true), 
				 date2 =_dateMunge(data[i].date, po[2], false);
			var title=data[i].title+""; // this stops errors later...
			if(title.length>this.options.wholeTitle) {
				if(data[i].descrip && data[i].descrip.length > 10 ) {
					title=title.substring(0, this.options.wholeTitle )+"...";
				}
			}
			var auth=data[i].auth || po[0];
			var selct ="#replace"+i+" cite";

			if(data[i].descrip) {
				var descrip=data[i].descrip;
				if(data[i].descrip.length>this.options.limitDesc) {
					descrip=data[i].descrip.substr(0, this.options.limitDesc)+"...";
				}

				$(selct).html(auth+" <time datetime=\""+date2+"\" >["+date+"]</time> ");
				$(selct).append("<br /><strong>"+title+"</strong>");
				if(this.options.tooltip){
					$(selct).append("<br /> "+descrip);
				} else {
					$(selct).after("<br />~ "+descrip);
				}
				$(selct).attr('title', data[i].descrip);
			} else {
				$(selct).text(auth+" ["+date+"] ");
				$(selct).append("<br /><strong>"+title+"</strong>");
				$(selct).attr('title', po[1]);
			}
		}
		this.options.ready=1;
	}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
}(jQuery));


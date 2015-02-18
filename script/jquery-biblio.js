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
 * @author: Owen beresford owencanprogram@fastmail.fm
 * @version: 0.1.1
 * @date: 15/01/2015
 * @licence: AGPL <http://www.gnu.org/licenses/agpl-3.0.html> 
 * 
 * deps: 
 *  jQuery must already be loaded 
 *
These are the options that are currently supported:
  ** debug ~ whether to write to console.log, or not.
  ** width ~ default: 400 ~ size to trigger the extraction.
  ** wholeURL ~ default:8 ~ how long an URL must be to be "converted" to a simpler name.
  ** extendViaDownload ~ default:0 ~ Attempt to download further information from the target link. 0= off, 1 on button click, 2= force on page load
  ** selector ~ default:'sup a' ~ what to look for, WRT the links that being extracted.
  ** gainingElement ~ default:'#biblio' ~ where to add the generated OL.
  ** loosingElement ~ default:'.lotsOfWords' ~ where to look for the links (you probably don't want footer links to show up, for example)
  ** textAsName ~ default:3 ~ if using the visible text in a link, minimum number of chars before guess its word.
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
				var $self	=this; // sigh JS.
				if(this.options.extendViaDownload==1) {
					$('#mapper').click(function() { $self._iterate($self); } );
				} else if(this.options.extendViaDownload==2) {
					$('#mapper').parent().css('display', 'none');
				}

				LENGTH=$(this.options.loosingElement).length;
				for( i=0; i<LENGTH; i++) {
					this._build1Page(i);
				}
				this.options.callbacks.postList.apply(this, [this.options.gainingElement ]);
			}
			return this;
		};

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

			var $ul		=$(cb.appendList.apply(this, [offset]));
			var $biblio =$(nm);
			var $self	=this; // sigh JS.
			

			if($($(loss)[offset]).find(this.options.selector).length==0) {
				$biblio.append(cb.haveEmptyPage.apply(this, [offset]));
			} else {
				$biblio.append(cb.appendTitle.apply(this, [offset]));
			}
// this hack via find() seems to be necessary inside this page.
// I confirm: 1) the data is present as expected 2) the jQuery works 
// I guess a consequence of the columnise module
			$($(loss)[offset]).find(this.options.selector).each(function(pos, ele) {
//			$( loss+':nth-child('+offset+') sup a').each(function(pos, ele) 
					var $ele = $(ele);
					var url		=$ele.attr('href');

					var name=$self._extractName(url, $ele.text(), $ele.attr('aria-label'), $ele.attr('title'));
					if($self.options.extendViaDownload) {
						$self.delayedLoad[pos]=function() { _downloadExtra.apply(this, [pos, url]); };
					}
					$ul.append( cb.appendLi.apply($self, [pos, url, name]) );
					cb.neuterLink.apply($self, [$ele.selector]);
					});

			$biblio.append($ul);
			if(this.options.extendViaDownload==2) {
				this._iterate(this);
			}
			return true;
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
		selector:'sup a',
		gainingElement:'#biblio',
		loosingElement:'.lotsOfWords',
		tocElement:'fieldset.h4_menu > .h4_lean',
		tocEdit:0,
		textAsName:3,
		wholeTitle:50,
		pageInitRun:0,
		download:0,
		ready:1,
		callbacks:{
			appendLi:_appendLi,
			appendList:_appendList,
			neuterLink:_neuterLink,
			appendTitle:_appendTitle,
			appendSection:_appendBiblioTitle,
			emptyList:_emptyList,
			postList:_postList,
			haveEmptyPage:_emptyPage
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
	function _appendList(offset) {
		return "<ol id=\"aList_pg"+offset+"\" class=\"Alist\"></ol>";
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
		return '<li> <a href="'+url+'" id="replace'+pos+'" title="Link to external site (sorry this text is generated, I don\'t have any meta data.)">'+name+'</a> </li>';
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
			console.log("Srtating external data retreival for "+url);
		}
		$.ajax( {url:url, success:_extra, context:this, timeout:3000, dataType:"html"});
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
			"No author set",  
			"Resource doesn't set a description tag."
			];

		if(this.options.debug) {
			console.log("Completed as '"+status+"' for "+this.options.currentURL);
		}
		var title=false, descrip='', date='', auth='';
		date=jqXHR.getResponseHeader('Last-Modified') || "No date";
		date=new Date(date);
		date=date.getUTCFullYear() + 
				'-' + pad( date.getUTCMonth() + 1 ) +
                '-' + pad( date.getUTCDate() ) +
                ' ' + pad( date.getUTCHours() );

		var $data=$.parseHTML(data );
		$data=$($data);
// parseHTML will dump the head and body tags as they don't make sense inside a document
// therefore you get a list of the child elements back
// therefore need filter() not find()
		title=$data.filter('title').text();
		descrip=$data.filter("meta[name$='escription']").attr('value');
		if(! descrip) { descrip= $data.filter("meta[name$='escription']").attr('content'); }
		auth=$data.filter("meta[name$='uthor']").attr('content');
		if(! auth) { auth=po[0]; }

		if(descrip) {
			$("#replace"+this.options.currentId).text(auth+" ["+date+"] "+title);
			$('#replace'+this.options.currentId).append("<br />~ "+descrip);
			$('#replace'+this.options.currentId).attr('title', descrip);
		} else {
			$("#replace"+this.options.currentId).text(auth+" ["+date+"] "+title);
			$('#replace'+this.options.currentId).attr('title', po[1]);
		}
		this.options.ready=1;
	}

// add leading 0 to strings holding an int if needed.
	if(typeof pad != 'function') {
        var pad=function(number) {
            var r = String(number);
            if ( r.length === 1 ) {
                r = '0' + r;
            }
            return r;
        }
	}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
}(jQuery));


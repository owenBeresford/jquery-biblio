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
  ** extendViaDownload ~ default:0 ~ NOIMPL yet. Attempt to download further information from the target link.
  ** selector ~ default:'sup a' ~ what to look for, WRT the links that being extracted.
  ** gainingElement ~ default:'#biblio' ~ where to add the generated OL.
  ** loosingElement ~ default:'.lotsOfWords' ~ where to look for the links (you probably don't want footer links to show up, for example)
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

					var t=$self._extractName(url, $ele.attr('aria-label'));
					// IOIO inject to alter stack, when enabled...
					if($self.options.extendViaDownload) {
						$self.delayedLoad[pos]=function() { _downloadExtra(pos, url); };
					}
					$ul.append( cb.appendLi.apply($self, [pos, url, t]) );
					cb.neuterLink.apply($self, [$ele.selector]);
					});

			$biblio.append($ul);
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
		BibliographyExtractor.prototype._extractName=function(raw, label) {
			if(typeof raw !=="string") {
				throw "What ya dooin? '"+raw+"'";
			}
			if(label) {
				return label;
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
		pageInitRun:0,
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
		return '<li> <a href="'+url+'" title="Link to external site (sorry this text is generated, I don\'t have any meta data.)">'+name+'</a> </li>';
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
		return "<h2 class=\"biblioSection\">References (for mobile UI)</h2> <p>Te references embedded in the text are displayed here. </p><p><strike class=\"twitterLink\">Lookup extra details</strike>.</p>";
	}
	
	/**
	 * _appendTitle ~ generate the H4 HTML
	 * 
	 * @param int offset 
	 * @return string
	 */
	function _appendTitle(offset) {
		offset++;
		return "<h4>Page "+offset+" references</h4>";
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
	 * _downloadExtra ~ NOIMPL
	 * Would download the URL, extract any META DESCRIPTION headers, or TITLE
	 * 
	 * @param string select 
	 * @return true
	 */
	function _downloadExtra(id, url) {
		alert("No impl appending "+id+" "+url);
	}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

}(jQuery));


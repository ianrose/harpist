/* globals feature */
/**
* Toolkit JavaScript
*/

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  'use strict';

  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if(!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if(callNow) {
      func.apply(context, args);
    }
  };
}

$(document).ready(function(){
  'use strict';

  var $article = $('[data-sset="article"]');
  var $progress = $('[data-sset="progress"]');
  var $siteHeader = $('[data-sset="site-header"]');
  var scrollToOffset = -56;

  // Pauses other video/audio
  $('audio, video').bind('play', function() {
    var activated = this;

    $('audio, video').each(function() {
      if(this !== activated) {
        this.pause();
      }
    });
  });

  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: (target.offset().top + scrollToOffset)
          }, 800);
          return false;
        }
      }
    });
  });

  // Scroll to Top
  $('[data-sset="top"]').click(function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 800);
  });

  // Hide Header
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var headerHeight = $siteHeader.outerHeight();

  $(window).scroll(function() {
    didScroll = true;
  });

  function hasScrolled() {
    var start = $(window).scrollTop();

    if(Math.abs(lastScrollTop - start) <= delta) {
      return;
    }

    if(start > lastScrollTop && start > headerHeight) {
      $siteHeader.removeClass('is-down').addClass('is-up');
    } else {
      if (start + $(window).height() < $(document).height()) {
        $siteHeader.removeClass('is-up').addClass('is-down');
      }
    }
    lastScrollTop = start;
  }

  setInterval(function() {
    if(didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  // Progress
  var getMax = function(){
    return $article.height() - $(window).height();
  };

  var max = getMax();
  var value;
  var width;

  var getWidth = function() {
    value = $(window).scrollTop();
    width = (value/max) * 100;
    width = width + '%';
    return width;
  };

  var setWidth = function() {
    $progress.css({ width: getWidth()});
  };

  var progressDebounced = debounce(function() {
    max = getMax();
    setWidth();
  }, 13);

  setWidth();
  $progress.css({opacity: 1});

  $(document).on('scroll', progressDebounced);
  $(window).on('resize', progressDebounced);

  // Waypoints

  // Changes header styles when over main art vs article body
  $('[data-sset="article-body"]').waypoint(function() {
    $($siteHeader).toggleClass('is-top');
    $('[data-sset="site-title"]').toggleClass('is-hidden');
  }, {
    offset: '27px'
  });

  // Fades in from the left hanging elements as they enter viewport
  $('[data-animated]').waypoint(function() {
    $(this.element).toggleClass($(this.element).data('animated'));
    this.destroy();
  }, {
    offset: 'bottom-in-view' 
  });
});

feature.testAll();

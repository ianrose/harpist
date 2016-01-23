/* globals Modernizr */

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

  var $article = $('#js-article');
  var $articleHeaderHeight = $('#js-article-header').outerHeight();
  var $progress = $('#js-progress');
  var $siteHeader = $('#js-site-header');

  // Pauses other video/audio
  $('audio, video').bind('play', function() {
    var activated = this;

    $('audio, video').each(function() {
      if(this !== activated) {
        this.pause();
      }
    });
  });

  // Scroll to Top
  $('.js-top').click(function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 800);
  });

  // Slider
  $('.js-slick').slick({
    dots: true,
    arrows: false
  });

  // Hide Header
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var headerHeight = $siteHeader.outerHeight();

  $(window).scroll(function() {
    didScroll = true;
  });

  setInterval(function() {
    if(didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

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
  $('#js-article-body').waypoint(function() {
    $($siteHeader).toggleClass('is-top');
    $('#js-site-title').toggleClass('is-hidden');
    $('#js-article-header-bg').toggleClass('is-fixed');
    }, {
      offset: '27px'
    });

  // Fades in from the left hanging elements as they enter viewport
  $('.js-hang').waypoint(function() {
    $(this.element).toggleClass($(this.element).data('animated'));
    this.destroy();
  }, {
    offset: 'bottom-in-view'
  });

  // Parallax
  if (!Modernizr.touch && Modernizr.csstransitions) {
    var getHeaderHeightDebounced = debounce(function() {
      $articleHeaderHeight = $('#js-article-header').height();
      return $articleHeaderHeight;
    }, 100);

    $(window).on('resize', getHeaderHeightDebounced);

    $(window).scroll(function() {
      var $windowScroll = $(this).scrollTop();
      if ($windowScroll <= $articleHeaderHeight) {
        $('#js-article-intro').css({
          'transform': 'translateY('+$windowScroll / 4+'%)'
        });
      }
    });
  }
});

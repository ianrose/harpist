// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

$(document).ready(function(){

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
  var $header = $('.js-header');
  var headerHeight = $header.outerHeight();

  $(window).scroll(function(e) {
    didScroll = true;
  });

  setInterval(function() {
    if(didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var start = $(this).scrollTop();

    if(Math.abs(lastScrollTop - start) <= delta) {
      return;
    }

    if(start > lastScrollTop && start > headerHeight) {
      $header.removeClass('is-down').addClass('is-up');
    } else {
      if (start + $(window).height() < $(document).height()) {
        $header.removeClass('is-up').addClass('is-down');
      }
    }
    lastScrollTop = start;
  }

  // Progress
  var $article = $('#js-article');

  var getMax = function(){
    return $article.height() - $(window).height();
  };

  var $progress = $('.progress');
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
    $($header).toggleClass('is-top');
    $('#js-site-title').toggleClass('is-hidden');
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
  if (!Modernizr.touch) { 
    
    $(window).scroll(function() {
      var $windowScroll = $(this).scrollTop();
      
       $('#js-article-intro').css({
          'transform': 'translateY('+$windowScroll / 4+'%)'
        }); 
    });
  }

  var data = {
    // A labels array that can contain any sort of values
    labels: ['1985', '1990', '1995', '2000', '2010'],
    // Our series array that contains series objects or in this case series data arrays
    series: [
      {
        name: 'Revenue',
        data: [10, 11, 19, 15, 100, 150]
      }
    ]
  };

  // We are setting a few options for our chart and override the defaults
  var options = {
    // Don't draw the line chart points
    showPoint: true,
    // Disable line smoothing
    lineSmooth: false,
    // X-Axis specific configuration
    axisX: {
      // We can disable the grid for this axis
      showGrid: false,
      // and also don't show the label
      showLabel: true
    },
    // Y-Axis specific configuration
    axisY: {
      // Lets offset the chart a bit from the labels
      offset: 60,
      // The label interpolation function enables you to modify the values
      // used for the labels on each axis. Here we are converting the
      // values into million pound.
      labelInterpolationFnc: function(value) {
        return '$' + value + 'b';
      }
    }
  };

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
  new Chartist.Line('.ct-chart', data, options);

  var $chart = $('.ct-chart');

  var $toolTip = $chart
    .append('<div class="chart--tooltip"></div>')
    .find('.chart--tooltip')
    .hide();

  $chart.on('mouseenter', '.ct-point', function() {
    var $point = $(this),
      value = $point.attr('ct:value'),
      seriesName = $point.parent().attr('ct:series-name');
    $toolTip.html(seriesName + '<br>' + '$' + value + 'b').show();
  });

  $chart.on('mouseleave', '.ct-point', function() {
    $toolTip.hide();
  });

  $chart.on('mousemove', function(event) {
    $toolTip.css({
      left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
      top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 20
    });
  });
});

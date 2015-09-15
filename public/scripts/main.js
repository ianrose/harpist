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
    $(document.body).animate({scrollTop: 0}, 800);
  });

  // Slider
  $('.js-slick').slick({
    dots: true,
    arrows: false
  });

  // Progress
  var $article = $('.js-article');

  var getMax = function(){
    return $article.height() - $(window).height();
  };

  var getValue = function(){
    return $(window).scrollTop();
  };

  var $progress = $('.progress');
  var max = getMax();
  var value;
  var width;

  var getWidth = function() {
    value = getValue();
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
});

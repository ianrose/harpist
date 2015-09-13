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
});

$(window).load(function(){

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
    $progress.css({ width: getWidth(), opacity: 1 });
  };

  setWidth();

  $(document).on('scroll', setWidth);

  $(window).on('resize', function(){
    max = getMax();
    setWidth();
  });
});

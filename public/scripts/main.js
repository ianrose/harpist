$(function () {
  // Scroll to Top
  $('.js-top').click(function(e) {
    e.preventDefault();
    $(document.body).animate({scrollTop: 0}, 800);
  });
});
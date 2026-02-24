$(function () {

  /* ── GNB 서브메뉴 (데스크탑 hover) ── */
  $(".has-sub").hover(
    function () { $(this).children(".sub-menu").stop(true, true).slideDown(200); },
    function () { $(this).children(".sub-menu").stop(true, true).slideUp(200); }
  );

  /* ── 언어 드롭다운 ── */
  $(".locale").hover(
    function () { $(this).find(".locale-list").stop(true, true).slideDown(150); },
    function () { $(this).find(".locale-list").stop(true, true).slideUp(150); }
  );

  /* ── 슬라이드 ── */
  let i = 0;
  const $track = $(".slide-track");
  const len = $(".slide-container").length;

  function move(n) {
    i = (n + len) % len;
    $track.css("transform", "translateX(-" + (i * 100) + "%)");
  }

  let timer = setInterval(() => move(i + 1), 4000);

  $(".slide-nav.next").click(() => move(i + 1));
  $(".slide-nav.prev").click(() => move(i - 1));

  $(".slide").hover(
    () => clearInterval(timer),
    () => { timer = setInterval(() => move(i + 1), 4000); }
  );

  function openDrawer() {
    $(".mob-drawer").addClass("is-open");
    $(".mob-overlay").fadeIn(250);
    $("body").addClass("mob-lock");
    $(".hamburger i").removeClass("fa-bars").addClass("fa-xmark");
  }

  function closeDrawer() {
    $(".mob-drawer").removeClass("is-open");
    $(".mob-overlay").fadeOut(250);
    $("body").removeClass("mob-lock");
    $(".hamburger i").removeClass("fa-xmark").addClass("fa-bars");
    $(".mob-sub").slideUp(200);
    $(".mob-has-sub").removeClass("is-active");
  }

  $(".hamburger").click(openDrawer);
  $(".mob-overlay").click(closeDrawer);
  $(".mob-close").click(closeDrawer);

  $(document).keydown(function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  $(document).on("click", ".mob-has-sub > .mob-link", function (e) {
    e.preventDefault();
    const $sub  = $(this).siblings(".mob-sub");
    const isOpen = $(this).parent().hasClass("is-active");

    $(".mob-has-sub").not($(this).parent()).removeClass("is-active");
    $(".mob-sub").not($sub).slideUp(200);

    $(this).parent().toggleClass("is-active", !isOpen);
    $sub.stop(true, true).slideToggle(220);
  });

  $(window).resize(function () {
    if ($(window).width() > 540) closeDrawer();
  });

});

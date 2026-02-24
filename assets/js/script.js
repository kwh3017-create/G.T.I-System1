$(function () {
  const hoverToggle = ($el, $target, ms) =>
    $el.hover(
      () => $target.stop(true, true).slideDown(ms),
      () => $target.stop(true, true).slideUp(ms)
    );

  hoverToggle($(".has-sub"), $(".has-sub > .sub-menu"), 200);
  hoverToggle($(".locale"), $(".locale .locale-list"), 150);

  const $slide = $(".slide");
  const $track = $(".slide-track");
  const len = $(".slide-container").length;
  let i = 0, timer;

  const move = (n) => {
    i = (n + len) % len;
    $track.css("transform", `translateX(-${i * 100}%)`);
  };

  const auto = (on) => {
    clearInterval(timer);
    if (on) timer = setInterval(() => move(i + 1), 4000);
  };

  $(".slide-nav.next").on("click", () => move(i + 1));
  $(".slide-nav.prev").on("click", () => move(i - 1));
  $slide.hover(() => auto(false), () => auto(true));
  auto(true);

  const setDrawer = (open) => {
    $(".mob-drawer").toggleClass("is-open", open);
    $(".mob-overlay");
    $("body").toggleClass("mob-lock", open);
    $(".hamburger i").toggleClass("fa-bars", !open).toggleClass("fa-xmark", open);

    if (!open) {
      $(".mob-sub").slideUp(200);
      $(".mob-has-sub").removeClass("is-active");
    }
  };

  $(".hamburger").on("click", () => setDrawer(true));
  $(".mob-overlay, .mob-close").on("click", () => setDrawer(false));
  $(document).on("keydown", (e) => e.key === "Escape" && setDrawer(false));
  $(window).on("resize", () => $(window).width() > 540 && setDrawer(false));

  $(document).on("click", ".mob-has-sub > .mob-link", function (e) {
    e.preventDefault();
    const $parent = $(this).parent();
    const $sub = $(this).siblings(".mob-sub");

    $(".mob-has-sub").not($parent).removeClass("is-active");
    $(".mob-sub").not($sub).slideUp(200);

    $parent.toggleClass("is-active");
    $sub.stop(true, true).slideToggle(220);
  });

  const $viewport = $(".service-right");
  const $cards = $viewport.find(".service-card");
  const $prev = $(".service-left-btn");
  const $next = $(".service-right-btn");

  if ($viewport.length && $cards.length && $prev.length && $next.length) {
    const $svcTrack = $("<div class='service-track'></div>");
    $cards.appendTo($svcTrack);
    $viewport.append($svcTrack);

    let idx = 0;

    const perView = () => {
      const w = $(window).width();
      if (w <= 768) return 1;
      if (w <= 1024) return 2;
      return 3;
    };

    const maxIdx = () => Math.max(0, $svcTrack.find(".service-card").length - perView());
    const step = () => {
      const $first = $svcTrack.find(".service-card").first();
      const gap = parseFloat($svcTrack.css("gap")) || 0;
      return $first.outerWidth() + gap;
    };

    const render = () => {
      const max = maxIdx();
      idx = Math.min(Math.max(idx, 0), max);

      $svcTrack.css("transform", `translateX(${-idx * step()}px)`);
      $prev.prop("disabled", idx === 0).css("opacity", idx === 0 ? 0.35 : 1);
      $next.prop("disabled", idx === max).css("opacity", idx === max ? 0.35 : 1);
    };

    $prev.on("click", () => (idx--, render()));
    $next.on("click", () => (idx++, render()));
    $(window).on("resize", render);
    render();
  }
});
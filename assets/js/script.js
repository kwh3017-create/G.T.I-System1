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

  /* =============================================
     Service Slider
  ============================================= */
  const DURATION = 450;

  const $vp   = $(".service-right");
  const $trk  = $vp.find(".service-track");
  const $prev = $(".service-left-btn");
  const $next = $(".service-right-btn");
  const $prog = $(".service-progress");
  const $ind  = $(".service-indicator");

  if ($vp.length && $trk.length && $prev.length && $next.length) {

    const $real = $trk.find(".service-card");
    const n = $real.length;

    if (n >= 2) {
      $trk.prepend($real.last().clone(true));
      $trk.append($real.first().clone(true));
    }

    let idx      = (n >= 2) ? 1 : 0;
    let moving   = false;
    let svcTimer = null;

    // 캐싱 없이 항상 DOM에서 직접 계산 (이미지 로드 후에도 정확한 값 보장)
    const getStep = () => {
      const gap = parseFloat($trk.css("gap")) || 0;
      return $trk.find(".service-card").first().outerWidth() + gap;
    };

    const go = (to, animate) => {
      const step = getStep();
      $trk.css("transition", animate ? `transform ${DURATION}ms ease` : "none");
      if (!animate) $trk[0].getBoundingClientRect(); // reflow 강제
      $trk.css("transform", `translateX(${-to * step}px)`);
    };

    const realIndex = () => {
      if (n <= 1) return 0;
      let r = idx - 1;
      if (r < 0) r = n - 1;
      if (r >= n) r = 0;
      return r;
    };

    const moveIndicator = () => {
      if (!$prog.length || !$ind.length || n <= 1) return;
      const maxX = Math.max(0, $prog.width() - $ind.outerWidth());
      const t    = realIndex() / Math.max(1, n - 1);
      $ind.css("transform", `translate(${maxX * t}px, -50%)`);
    };

    const jumpTo = (to) => {
      idx = to;
      go(idx, false);
      moveIndicator();
    };

    const next = () => {
      if (moving || n <= 1) return;
      moving = true;
      idx++;
      go(idx, true);
      moveIndicator();
      setTimeout(() => {
        if (idx >= n + 1) jumpTo(1);
        moving = false;
      }, DURATION);
    };

    const prev = () => {
      if (moving || n <= 1) return;
      moving = true;
      idx--;
      go(idx, true);
      moveIndicator();
      setTimeout(() => {
        if (idx <= 0) jumpTo(n);
        moving = false;
      }, DURATION);
    };

    const autoSvc = (on) => {
      clearInterval(svcTimer);
      if (on && n > 1) svcTimer = setInterval(next, 3000);
    };

    $next.off("click").on("click", () => { autoSvc(false); next(); autoSvc(true); });
    $prev.off("click").on("click", () => { autoSvc(false); prev(); autoSvc(true); });
    $vp.hover(() => autoSvc(false), () => autoSvc(true));
    $(window).on("resize", () => jumpTo(idx));

    // 이미지가 완전히 로드된 뒤 초기화 (카드 너비 확정 후 step 계산)
    const init = () => { jumpTo(idx); autoSvc(true); };
    const $imgs = $trk.find("img");
    let loaded = 0;
    const onLoad = () => { if (++loaded >= $imgs.length) init(); };
    if ($imgs.length === 0) {
      init();
    } else {
      $imgs.each(function () {
        if (this.complete) { onLoad(); }
        else { $(this).one("load error", onLoad); }
      });
    }
  }
});
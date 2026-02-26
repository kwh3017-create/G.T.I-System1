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
     Service Slider (seamless)
     - transform 슬라이드 + transitionend에서 DOM 재배치
     - 끊김(점프) 없이 자연스럽게 무한 루프
  ============================================= */
  const $trk  = $(".service-track");
  const $prev = $(".service-left-btn");
  const $next = $(".service-right-btn");
  const $prog = $(".service-progress");
  const $ind  = $(".service-indicator");

  if ($trk.length && $prev.length && $next.length) {

    const $cards = () => $trk.children(".service-card");
    const totalN = $cards().length;

    // 원본 순서 인덱스(인디케이터용)
    $cards().each(function(i){ $(this).attr("data-svc-idx", i); });

    const duration = 650; // ms
    let moving   = false;
    let svcTimer = null;

    // flex gap(px) 구하기
    const getGap = () => {
      const st = window.getComputedStyle($trk[0]);
      const g  = parseFloat(st.columnGap || st.gap || "0");
      return isNaN(g) ? 0 : g;
    };

    // 한 칸 이동 거리(px) = 카드 폭 + gap
    const stepPx = () => {
      const $first = $cards().first();
      if (!$first.length) return 0;
      return $first.outerWidth() + getGap();
    };

    const moveIndicator = () => {
      if (!$prog.length || !$ind.length || totalN <= 1) return;
      const cur  = parseInt($cards().first().attr("data-svc-idx") || 0, 10);
      const maxX = Math.max(0, $prog.width() - $ind.outerWidth());
      const t    = cur / Math.max(1, totalN - 1);
      $ind.css("transform", `translate(${maxX * t}px, -50%)`);
    };

    const setTransition = (on) => {
      $trk.css("transition", on ? `transform ${duration}ms ease` : "none");
    };

    const nextSlide = () => {
      if (moving || totalN <= 1) return;
      moving = true;

      const d = stepPx();
      if (!d) { moving = false; return; }

      setTransition(true);
      $trk.css("transform", `translateX(-${d}px)`);

      $trk.one("transitionend webkitTransitionEnd", function(){
        // 1) 첫 카드를 맨 뒤로
        $cards().first().appendTo($trk);

        // 2) transition 없이 원위치로 스냅(사용자는 못 느낌)
        setTransition(false);
        $trk.css("transform", "translateX(0)");

        // 3) reflow 후 transition 복원
        $trk[0].offsetHeight; // force reflow
        setTransition(true);

        moveIndicator();
        moving = false;
      });
    };

    const prevSlide = () => {
      if (moving || totalN <= 1) return;
      moving = true;

      const d = stepPx();
      if (!d) { moving = false; return; }

      // 1) 마지막 카드를 맨 앞으로 미리 당겨놓고
      $cards().last().prependTo($trk);

      // 2) transition 없이 -d 위치에서 시작
      setTransition(false);
      $trk.css("transform", `translateX(-${d}px)`);
      $trk[0].offsetHeight; // force reflow

      // 3) transition 켜고 0으로 돌아오면 자연스러운 prev
      setTransition(true);
      $trk.css("transform", "translateX(0)");

      $trk.one("transitionend webkitTransitionEnd", function(){
        moveIndicator();
        moving = false;
      });
    };

    const autoSvc = (on) => {
      clearInterval(svcTimer);
      if (on && totalN > 1) svcTimer = setInterval(nextSlide, 3000);
    };

    $next.off("click").on("click", () => { autoSvc(false); nextSlide(); autoSvc(true); });
    $prev.off("click").on("click", () => { autoSvc(false); prevSlide(); autoSvc(true); });
    $(".service-right").hover(() => autoSvc(false), () => autoSvc(true));

    $(window).on("resize", () => {
      // 리사이즈 시 위치 꼬임 방지
      setTransition(false);
      $trk.css("transform", "translateX(0)");
      $trk[0].offsetHeight;
      setTransition(true);
      moveIndicator();
    });

    // 초기화
    setTransition(true);
    moveIndicator();
    autoSvc(true);
  }
});

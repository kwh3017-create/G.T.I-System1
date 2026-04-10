$(function () {
  'use strict';

  /* ── 헤더 서브메뉴 ── */
  $('.has-sub > a').attr({ 'aria-haspopup': 'true', 'aria-expanded': 'false' });
  $('.locale-btn').attr({ 'aria-haspopup': 'true', 'aria-expanded': 'false' });

  const setSubMenu = ($item, open) => {
    $item.children('a').attr('aria-expanded', String(open));
    $item.children('.sub-menu').stop(true, true)[open ? 'slideDown' : 'slideUp'](200);
  };

  const setLocaleMenu = ($item, open) => {
    $item.find('.locale-btn').attr('aria-expanded', String(open));
    $item.find('.locale-list').stop(true, true)[open ? 'slideDown' : 'slideUp'](150);
  };

  $('.has-sub').hover(
    function () { setSubMenu($(this), true); },
    function () { setSubMenu($(this), false); }
  ).on('focusin', function () {
    setSubMenu($(this), true);
  }).on('focusout', function (e) {
    if (!this.contains(e.relatedTarget)) setSubMenu($(this), false);
  });

  $('.locale').hover(
    function () { setLocaleMenu($(this), true); },
    function () { setLocaleMenu($(this), false); }
  ).on('focusin', function () {
    setLocaleMenu($(this), true);
  }).on('focusout', function (e) {
    if (!this.contains(e.relatedTarget)) setLocaleMenu($(this), false);
  });

  /* ── 모바일 드로어 ── */
  const $drawer = $('.mob-drawer');
  const $overlay = $('.mob-overlay');
  const $hamburger = $('.hamburger');
  const $hamburgerIcon = $('.hamburger i');

  const closeSubs = () => {
    $('.mob-sub').stop(true, true).slideUp(200);
    $('.mob-has-sub').removeClass('is-active');
  };

  const setDrawer = (open) => {
    $drawer.toggleClass('is-open', open);
    $overlay.toggle(open);
    $('body').toggleClass('mob-lock', open);
    $hamburger.attr('aria-expanded', String(open));
    $hamburgerIcon.toggleClass('fa-bars', !open).toggleClass('fa-xmark', open);
    if (!open) closeSubs();
  };

  $hamburger.attr('aria-expanded', 'false');
  $hamburger.on('click', () => setDrawer(!$drawer.hasClass('is-open')));
  $overlay.add('.mob-close').on('click', () => setDrawer(false));
  $(document).on('keydown', function (e) {
    if (/^F\d{1,2}$/.test(e.key)) return;
    if (e.key === 'Escape') setDrawer(false);
  });
  $(window).on('resize', () => $(window).width() > 540 && setDrawer(false));

  $(document).on('click', '.mob-has-sub > .mob-link', function (e) {
    e.preventDefault();
    const $parent = $(this).parent();
    const $sub = $(this).siblings('.mob-sub');
    $('.mob-has-sub').not($parent).removeClass('is-active');
    $('.mob-sub').not($sub).stop(true, true).slideUp(200);
    $parent.toggleClass('is-active');
    $sub.stop(true, true).slideToggle(220);
  });

  /* ── 연혁 슬라이더 ── */
  var $track = $('#historyTrack');
  var currentIdx = 0;
  var $cols = $track.find('.history-year-col');
  var totalCols = $cols.length;

  function getVisibleCount() {
    if ($(window).width() <= 540) return 1;
    if ($(window).width() <= 768) return 2;
    return 3;
  }

  function updateHistory() {
    var vis = getVisibleCount();
    var maxIdx = Math.max(0, totalCols - vis);
    currentIdx = Math.min(currentIdx, maxIdx);

    if (vis >= totalCols) {
      $track.css('transform', 'translateX(0)');
      return;
    }

    var colWidth = $cols.eq(0).outerWidth(true);
    $track.css('transform', 'translateX(-' + (colWidth * currentIdx) + 'px)');
  }

  $('.history-prev').on('click', function () {
    if (currentIdx > 0) { currentIdx--; updateHistory(); }
  });
  $('.history-next').on('click', function () {
    var vis = getVisibleCount();
    if (currentIdx < totalCols - vis) { currentIdx++; updateHistory(); }
  });

  $(window).on('resize', updateHistory);

  /* ── 스크롤 탑 버튼 ── */
  $(window).on('scroll', function () {
    $('#scrollTop').toggleClass('visible', $(this).scrollTop() > 300);
  });
  $('#scrollTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 300);
  });

});

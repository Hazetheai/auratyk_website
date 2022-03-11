<template>
  <header class="header position-relative js-header">
    <div class="header__container container max-width-lg">
      <div class="header__logo">
        <a href="#0">
          <svg width="104" height="30" viewBox="0 0 104 30">
            <title>Go to homepage</title>
            <path
              d="M37.54 24.08V3.72h4.92v16.37h8.47v4zM60.47 24.37a7.82 7.82 0 01-5.73-2.25 8.36 8.36 0 01-2-5.62 8.32 8.32 0 012.08-5.71 8 8 0 015.64-2.18 8.07 8.07 0 015.68 2.2 8.49 8.49 0 012 5.69 8.63 8.63 0 01-1.78 5.38 7.6 7.6 0 01-5.89 2.49zm0-3.67c2.42 0 2.73-3 2.73-4.23s-.31-4.26-2.73-4.26-2.79 3-2.79 4.26.32 4.23 2.82 4.23zM95.49 24.37a7.82 7.82 0 01-5.73-2.25 8.36 8.36 0 01-2-5.62 8.32 8.32 0 012.08-5.71 8.4 8.4 0 0111.31 0 8.43 8.43 0 012 5.69 8.6 8.6 0 01-1.77 5.38 7.6 7.6 0 01-5.89 2.51zm0-3.67c2.42 0 2.73-3 2.73-4.23s-.31-4.26-2.73-4.26-2.8 3-2.8 4.26.31 4.23 2.83 4.23zM77.66 30c-5.74 0-7-3.25-7.23-4.52l4.6-.26c.41.91 1.17 1.41 2.76 1.41a2.45 2.45 0 002.82-2.53v-2.68a7 7 0 01-1.7 1.75 6.12 6.12 0 01-5.85-.08c-2.41-1.37-3-4.25-3-6.66 0-.89.12-3.67 1.45-5.42a5.67 5.67 0 014.64-2.4c1.2 0 3 .25 4.46 2.82V8.81h4.85v15.33a5.2 5.2 0 01-2.12 4.32A9.92 9.92 0 0177.66 30zm.15-9.66c2.53 0 2.81-2.69 2.81-3.91s-.31-4-2.81-4-2.81 2.8-2.81 4 .27 3.91 2.81 3.91zM55.56 3.72h9.81v2.41h-9.81z"
              fill="var(--color-contrast-higher)"
            />
            <circle cx="15" cy="15" r="15" fill="var(--color-primary)" />
          </svg>
        </a>
      </div>

      <button
        class="btn btn--subtle header__trigger js-header__trigger"
        aria-label="Toggle menu"
        aria-expanded="false"
        aria-controls="header-nav"
      >
        <i class="header__trigger-icon" aria-hidden="true"></i>
        <span>Menu</span>
      </button>

      <nav
        id="header-nav"
        class="header__nav js-header__nav"
        role="navigation"
        aria-label="Main"
      >
        <div class="header__nav-inner">
          <div class="header__label">Main menu</div>
          <ul class="header__list">
            <li class="header__item">
              <a href="#0" class="header__link">About</a>
            </li>
            <li class="header__item">
              <a href="#0" class="header__link">Solutions</a>
            </li>
            <li class="header__item">
              <a href="#0" class="header__link" aria-current="page"
                >Resources</a
              >
            </li>
            <li class="header__item">
              <a href="#0" class="header__link">Pricing</a>
            </li>
            <li class="header__item">
              <a href="#0" class="header__link">Contact</a>
            </li>
            <li
              class="header__item header__item--divider"
              aria-hidden="true"
            ></li>
            <li class="header__item">
              <a href="#0" class="header__nav-btn btn btn--primary">Download</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'G-MainHeader-1',
  mounted() {
    // File#: _1_main-header
    // Usage: codyhouse.co/license
    ;(function () {
      var mainHeader = document.getElementsByClassName('js-header')
      if (mainHeader.length > 0) {
        var trigger =
            mainHeader[0].getElementsByClassName('js-header__trigger')[0],
          nav = mainHeader[0].getElementsByClassName('js-header__nav')[0]

        // we'll use these to store the node that needs to receive focus when the mobile menu is closed
        var focusMenu = false

        //detect click on nav trigger
        trigger.addEventListener('click', function (event) {
          event.preventDefault()
          toggleNavigation(!Util.hasClass(nav, 'header__nav--is-visible'))
        })

        // listen for key events
        window.addEventListener('keyup', function (event) {
          // listen for esc key
          if (
            (event.keyCode && event.keyCode == 27) ||
            (event.key && event.key.toLowerCase() == 'escape')
          ) {
            // close navigation on mobile if open
            if (
              trigger.getAttribute('aria-expanded') == 'true' &&
              isVisible(trigger)
            ) {
              focusMenu = trigger // move focus to menu trigger when menu is close
              trigger.click()
            }
          }
          // listen for tab key
          if (
            (event.keyCode && event.keyCode == 9) ||
            (event.key && event.key.toLowerCase() == 'tab')
          ) {
            // close navigation on mobile if open when nav loses focus
            if (
              trigger.getAttribute('aria-expanded') == 'true' &&
              isVisible(trigger) &&
              !document.activeElement.closest('.js-header')
            )
              trigger.click()
          }
        })

        // listen for resize
        var resizingId = false
        window.addEventListener('resize', function () {
          clearTimeout(resizingId)
          resizingId = setTimeout(doneResizing, 500)
        })

        function doneResizing() {
          if (
            !isVisible(trigger) &&
            Util.hasClass(mainHeader[0], 'header--expanded')
          )
            toggleNavigation(false)
        }
      }

      function isVisible(element) {
        return (
          element.offsetWidth ||
          element.offsetHeight ||
          element.getClientRects().length
        )
      }

      function toggleNavigation(bool) {
        // toggle navigation visibility on small device
        Util.toggleClass(nav, 'header__nav--is-visible', bool)
        Util.toggleClass(mainHeader[0], 'header--expanded', bool)
        trigger.setAttribute('aria-expanded', bool)
        if (bool) {
          //opening menu -> move focus to first element inside nav
          nav
            .querySelectorAll(
              '[href], input:not([disabled]), button:not([disabled])'
            )[0]
            .focus()
        } else if (focusMenu) {
          focusMenu.focus()
          focusMenu = false
        }
      }
    })()
  },
}
</script>

<style lang="scss"></style>

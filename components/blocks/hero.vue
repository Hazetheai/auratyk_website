<template>
  <section class="diagonal-section bg-contrast-lower bg-opacity-50%">
    <div class="container max-width-adaptive-sm padding-y-xxl">
      <div class="text-center">
        <div class="text-sm opacity-60% margin-bottom-xxs">This is a Label</div>

        <div class="text-component margin-bottom-sm">
          <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam vero
            aliquam, natus quae architecto hic quod!
          </p>
        </div>

        <div class="flex flex-wrap flex-center gap-sm">
          <a href="#0" class="btn btn--primary">Download</a>
          <a href="#0" class="color-inherit">Learn more</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {}
</script>

<style lang="scss">
@use '~assets/scss/base' as *;

/* -------------------------------- 

File#: _1_diagonal-section
Title: Diagonal Section
Descr: Section with diagonal edges
Usage: codyhouse.co/license

-------------------------------- */

:root {
  --diagonal-section-offset: 50px;
}

.diagonal-section,
.diagonal-section-top,
.diagonal-section-bottom {
  position: relative;
  z-index: 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

@supports (clip-path: inset(50%)) {
  .diagonal-section,
  .diagonal-section-top.diagonal-section-bottom {
    padding-top: calc(var(--diagonal-section-offset) / 2);
    padding-bottom: calc(var(--diagonal-section-offset) / 2);
    clip-path: polygon(
      0% 0%,
      100% var(--diagonal-section-offset),
      100% 100%,
      0% calc(100% - var(--diagonal-section-offset))
    );
  }

  .diagonal-section--flip-x {
    clip-path: polygon(
      0% var(--diagonal-section-offset),
      100% 0%,
      100% calc(100% - var(--diagonal-section-offset)),
      0% 100%
    );
  }

  .diagonal-section-top {
    padding-top: calc(var(--diagonal-section-offset) / 2);
    clip-path: polygon(
      0% 0%,
      100% var(--diagonal-section-offset),
      100% 100%,
      0% 100%
    );
  }

  .diagonal-section-top--flip-x {
    clip-path: polygon(
      0% var(--diagonal-section-offset),
      100% 0%,
      100% 100%,
      0% 100%
    );

    &.diagonal-section-bottom {
      clip-path: polygon(
        0% var(--diagonal-section-offset),
        100% 0%,
        100% 100%,
        0% calc(100% - var(--diagonal-section-offset))
      );
    }
  }

  .diagonal-section-bottom {
    padding-bottom: calc(var(--diagonal-section-offset) / 2);
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% calc(100% - var(--diagonal-section-offset))
    );
  }

  .diagonal-section-bottom--flip-x {
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% calc(100% - var(--diagonal-section-offset)),
      0% 100%
    );

    &.diagonal-section-top {
      clip-path: polygon(
        0% 0%,
        100% var(--diagonal-section-offset),
        100% calc(100% - var(--diagonal-section-offset)),
        0% 100%
      );
    }
  }

  .diagonal-section-top--flip-x.diagonal-section-bottom--flip-x {
    clip-path: polygon(
      0% var(--diagonal-section-offset),
      100% 0%,
      100% calc(100% - var(--diagonal-section-offset)),
      0% 100%
    );
  }
}
</style>

<template>
  <div class="socials">
    <a
      :href="this.socials.instagram"
      rel="noopener nofollow"
      target="_blank"
      @click="logSocial('instagram')"
    >
      <icon-instagram :width="24" />
    </a>
    <a
      rel="noopener nofollow"
      :href="this.socials.soundcloud"
      target="_blank"
      @click="logSocial('soundcloud')"
    >
      <icon-soundcloud-bw :width="48" />
    </a>
    <a
      :href="this.socials.bandcamp"
      rel="noopener nofollow"
      target="_blank"
      @click="logSocial('bandcamp')"
    >
      <icon-bandcamp-circle-0 :width="32" />
    </a>
    <a
      rel="noopener nofollow"
      :href="this.socials.youtube"
      target="_blank"
      @click="logSocial('youtube')"
    >
      <icon-youtube :width="32" />
    </a>
  </div>
</template>

<script>
import socials from '@/assets/js/utils/getSocials'
export default {
  data() {
    return { socials }
  },

  methods: {
    logSocial(platform) {
      const socialIcons = {
        instagram: '📷',
        bandcamp: '🎸',
        youtube: '🎥',
        soundcloud: '☁️',
      }

      this.$logsnag.publish({
        project: 'auratyk_website',
        channel: 'main',
        event: `User clicked ${platform} link`,
        icon: socialIcons[platform],
        notify: true,
      })
    },
  },
}
</script>

<style lang="scss">
.socials {
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    text-decoration: none;
    display: inline-block;
    margin: 0 var(--space-md);
    color: var(--color-contrast-high); // icons color

    &:hover {
      color: var(--color-accent);
    }

    .icon {
      display: block;
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}
</style>

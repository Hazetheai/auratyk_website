<template>
  <section
    class="press main__content position-relative z-index-1 margin-bottom-xl"
  >
    <!-- Hook -->
    <div class="max-width-sm margin-bottom-lg">
      <div class="text-component">
        <h1 class="main__content-heading">Press</h1>
        <p class="main__content-intro">
          Audio-visual artist turning scanned spaces and sampled sound into live
          worlds about memory, nostalgia and the places we carry with us.
        </p>
        <p class="text-sm color-contrast-medium">
          Auratyk (Jake Riordan) · they/them · Berlin, from Cork, Ireland
        </p>
      </div>
    </div>

    <figure v-if="hero" class="press__hero margin-bottom-lg">
      <img
        :src="hero.full"
        :data-full="hero.full"
        :alt="hero.alt"
        loading="eager"
      />
      <figcaption class="text-xs color-contrast-medium margin-top-xxs">
        {{ hero.caption }}<template v-if="hero.credit">
          · Photo: {{ hero.credit }}</template
        >
      </figcaption>
    </figure>

    <!-- Downloads -->
    <div class="press__downloads flex flex-wrap gap-sm margin-bottom-xl">
      <a
        v-for="d in downloads.filter((d) => !d.href.startsWith('#'))"
        :key="d.href"
        class="btn btn--subtle"
        :href="d.href"
        :download="d.download"
        target="_blank"
        rel="noopener"
        >{{ d.label }}</a
      >
    </div>

    <!-- Bios -->
    <div class="max-width-sm margin-bottom-xl">
      <h2 class="text-lg margin-bottom-sm">Bios</h2>
      <p class="text-sm color-contrast-medium margin-bottom-sm">
        Free to copy. Please use they/them pronouns.
      </p>
      <div
        class="press__tabs flex flex-wrap gap-xs margin-bottom-sm"
        role="tablist"
      >
        <button
          v-for="b in bios"
          :key="b.key"
          class="btn btn--sm"
          :class="activeBio === b.key ? 'btn--primary' : 'btn--subtle'"
          role="tab"
          :aria-selected="activeBio === b.key"
          @click="activeBio = b.key"
        >
          {{ b.label }}
        </button>
      </div>
      <div class="press__bio text-component">
        <p v-for="(para, i) in currentBio.text" :key="i">{{ para }}</p>
      </div>
      <button class="btn btn--sm btn--subtle margin-top-sm" @click="copyBio">
        {{ copied ? 'Copied!' : 'Copy this bio' }}
      </button>
    </div>

    <!-- Photos -->
    <div class="margin-bottom-xl">
      <h2 class="text-lg margin-bottom-sm">Photos</h2>
      <p class="text-sm color-contrast-medium margin-bottom-sm max-width-sm">
        Web-size JPGs below; full-resolution files via “Hi-res photos (zip)”.
        Free to use for press about Auratyk with the photo credit.
      </p>
      <div class="press__grid">
        <figure v-for="p in photos" :key="p.id" class="press__photo">
          <img
            :src="p.src"
            :data-full="p.full"
            :alt="p.alt"
            :width="p.width"
            :height="p.height"
            loading="lazy"
          />
          <figcaption class="text-xs color-contrast-medium margin-top-xxs">
            {{ p.caption }}<template v-if="p.credit">
              · Photo: {{ p.credit }}</template
            >
            ·
            <a :href="p.full" target="_blank" rel="noopener" download
              >Download</a
            >
          </figcaption>
        </figure>
      </div>
    </div>

    <!-- Current work + selected works -->
    <div class="max-width-adaptive-md margin-bottom-xl">
      <h2 class="text-lg margin-bottom-sm">Works</h2>
      <div class="grid gap-lg">
        <article v-for="w in works" :key="w.slug" class="col-4@md">
          <img
            :src="w.img"
            :alt="w.title"
            class="press__work-img"
            loading="lazy"
          />
          <h3 class="text-md margin-top-sm">
            <nuxt-link :to="`/projects/${w.slug}`">{{ w.title }}</nuxt-link>
            <span v-if="w.year" class="color-contrast-medium"
              >({{ w.year }})</span
            >
          </h3>
          <p class="text-xs color-contrast-medium margin-y-xxs">
            {{ w.caption }}
          </p>
          <p class="text-sm">{{ w.text }}</p>
        </article>
      </div>
    </div>

    <!-- Shows -->
    <div class="max-width-sm margin-bottom-xl">
      <h2 class="text-lg margin-bottom-sm">Selected shows</h2>
      <dl class="details-list details-list--rows">
        <div
          v-for="s in shows"
          :key="s.id"
          class="details-list__item padding-y-xs flex gap-md"
        >
          <dt class="text-xs color-contrast-medium press__date">
            {{ s.date }}
          </dt>
          <dd class="text-sm">{{ s.event }}</dd>
        </div>
      </dl>
      <p class="text-sm margin-top-sm">
        Full list: <nuxt-link to="/past-shows">past shows</nuxt-link>
      </p>
    </div>

    <!-- Tech + contact -->
    <div class="max-width-adaptive-md grid gap-lg margin-bottom-lg">
      <div class="col-6@md">
        <h2 class="text-lg margin-bottom-sm">Live AV set: tech</h2>
        <ul class="text-sm press__list">
          <li>
            <strong>Brings:</strong> laptop, desktop PC, 4 MIDI controllers,
            audio interface, foot pedal
          </li>
          <li>
            <strong>Needs:</strong> table 140×80×100 cm, 3 power sockets, L/R
            monitors
          </li>
          <li>
            <strong>Outputs:</strong> L/R 1/4" jack to FOH · HDMI 1920×1080 / 30
            fps
          </li>
          <li>
            <strong>Setup:</strong> ~25 min + 15 min soundcheck · single-person
            team
          </li>
          <li><strong>Duration:</strong> 45 min · darker room is better</li>
        </ul>
      </div>
      <div class="col-6@md">
        <h2 class="text-lg margin-bottom-sm">Contact</h2>
        <p class="text-sm margin-bottom-xs">
          Booking, press and collaborations
        </p>
        <span
          class="link email-copy text-md"
          title="Click to copy"
          @click="copyEmail('info@auratyk.com')"
          >info@auratyk.com</span
        >
        <span v-if="emailCopied" class="text-xs color-contrast-medium">
          Copied!</span
        >
        <div class="margin-top-sm"><SocialIcons /></div>
      </div>
    </div>
  </section>
</template>

<script>
import getSiteMeta from '@/assets/js/utils/getSiteMeta'
import SocialIcons from '@/components/blocks/SocialIcons.vue'
import pressData from '@/content/notion/press.json'
import showsData from '@/content/notion/shows.json'
import projectsData from '@/content/notion/projects.json'
import { yearSpan, byRecency } from '@/libs/project-utils'

// Photos, selected works and selected shows all come from Notion:
// - photos: "Auratyk Website Press Photos" (Hero = the big image at the top)
// - works: Projects with Press ticked (PressCaption, PressText)
// - shows: Shows with Press ticked (PressLabel), newest first
const pressPhotos = pressData.items || []

function pressDate(iso) {
  const [y, m] = String(iso).split('-')
  return `${m}.${y}`
}

export default {
  name: 'PressPage',
  components: { SocialIcons },
  layout() {
    return 'main'
  },
  data() {
    return {
      title: 'Press',
      description:
        'Press kit for Auratyk: bios, hi-res photos, works, tech rider and contact.',
      activeBio: 'short',
      copied: false,
      emailCopied: false,
      downloads: [
        {
          label: 'Press kit (PDF)',
          href: '/press/docs/Auratyk_PressKit_AV_2026.pdf',
          download: true,
        },
        {
          label: 'Music one-sheet (PDF)',
          href: '/press/docs/Auratyk_OneSheet_Music_2026.pdf',
          download: true,
        },
        {
          label: 'Tech rider (PDF)',
          href: '/press/docs/Auratyk_Tech_Rider_read-rites.pdf',
          download: true,
        },
        {
          label: 'Stage diagram (PDF)',
          href: '/press/docs/Auratyk_Stage_Diagram.pdf',
          download: true,
        },
        // TODO: replace with a Dropbox share link to images/selects (full-res) + logos
        {
          label: 'Hi-res photos (zip)',
          href: '#hi-res-link-tbc',
          download: false,
        },
      ],
      bios: [
        {
          key: 'one',
          label: 'One line',
          text: [
            'Berlin-based audio-visual artist turning scanned spaces and sampled sound into live worlds.',
          ],
        },
        {
          key: 'short',
          label: '50 words',
          text: [
            'Auratyk (Jake Riordan, they/them) is an Irish audio-visual artist based in Berlin. Their live sets and video works start from sound – field recordings, synths, resampled voice – and grow into point-cloud landscapes scanned from real places. The work circles memory, nostalgia and digital hauntology, and how the spaces we inhabit shape us.',
          ],
        },
        {
          key: 'medium',
          label: '150 words',
          text: [
            'Auratyk is the audio-visual project of Jake Riordan (they/them, b. 1992, Cork, Ireland), based in Berlin. With a background in music performance and production, they create work that is overtly visual but grounded in, and driven by, sound.',
            'Inspired by our obsession with nostalgia, by folkloric traditions and by the impact of physical spaces, Auratyk builds distant but familiar landscapes from point-cloud scans, volumetric video and found footage, animated by glitchy, granulated sound that is both inspired by and derived from the places it comes from. The work evokes the fallibility of memory – digital and analogue.',
            'They perform live AV sets in TouchDesigner and Ableton, most recently read:rites | cannibalize, a performance about cultural recycling. Recent shows include Berlin New Media Art Week (MaHalla, 2025), XoK Blackout at Neue Zukunft (2025) and B.L.O. Ateliers (2026). They also create live visuals for Culture Crush, including at Fusion Festival 2025.',
          ],
        },
        {
          key: 'de',
          label: 'Deutsch',
          text: [
            'Auratyk (Jake Riordan) ist ein:e irische:r audiovisuelle:r Künstler:in mit Sitz in Berlin. Die Live-Sets und Videoarbeiten beginnen beim Klang – Feldaufnahmen, Synthesizer, gesampelte Stimmen – und wachsen zu Punktwolken-Landschaften, gescannt an realen Orten. Im Zentrum stehen Erinnerung, Nostalgie, digitale Hauntologie und die Frage, wie Räume uns prägen.',
          ],
        },
      ],
      hero: pressPhotos.find((p) => p.hero) || pressPhotos[0] || null,
      photos: pressPhotos,
      works: (projectsData.items || [])
        .filter((p) => p.properties.press)
        .sort(byRecency)
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          year: yearSpan(p),
          img: p.properties.coverUrl,
          caption: p.properties.pressCaption || (p.properties.tags || []).join(' · '),
          text: p.properties.pressText || p.description,
        })),
      shows: (showsData.items || [])
        .filter((s) => s.properties.press && s.properties.date)
        .sort((a, b) => (a.properties.date < b.properties.date ? 1 : -1))
        .map((s) => {
          const projects = (projectsData.items || [])
            .filter((p) => (s.properties.projects || []).includes(p.id))
            .map((p) => p.title)
          return {
            id: s.id,
            date: pressDate(s.properties.date),
            event:
              s.properties.pressLabel ||
              [s.title, projects.join(', ')].filter(Boolean).join(' – '),
          }
        }),
    }
  },
  head() {
    return {
      title: `Auratyk | ${this.title}`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}${this.$route.path}`,
        },
      ],
    }
  },
  computed: {
    currentBio() {
      return this.bios.find((b) => b.key === this.activeBio) || this.bios[0]
    },
    meta() {
      return getSiteMeta({
        type: 'website',
        title: this.title,
        description: this.description,
        url: `${this.$config.baseUrl}${this.$route.path}`,
        socialImage: this.hero ? this.hero.full : undefined,
      })
    },
  },
  methods: {
    async writeClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const input = document.createElement('textarea')
        input.value = text
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
    },
    async copyBio() {
      await this.writeClipboard(this.currentBio.text.join('\n\n'))
      this.copied = true
      setTimeout(() => (this.copied = false), 2000)
    },
    async copyEmail(email) {
      await this.writeClipboard(email)
      this.emailCopied = true
      setTimeout(() => (this.emailCopied = false), 2000)
    },
  },
}
</script>

<style lang="scss">
.press {
  &__hero img {
    width: 100%;
    max-height: 70vh;
    object-fit: cover;
    display: block;
  }
  // Masonry columns: every photo keeps its own shape (portraits aren't cropped).
  &__grid {
    columns: 3 260px;
    column-gap: var(--space-md);
  }
  &__photo {
    break-inside: avoid;
    margin: 0 0 var(--space-md);
    img {
      width: 100%;
      height: auto;
      display: block;
      cursor: zoom-in;
    }
  }
  &__hero img {
    cursor: zoom-in;
  }
  &__work-img {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    display: block;
  }
  &__date {
    min-width: 4.5em;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
  &__bio p {
    max-width: var(--max-width-sm);
  }
  &__list li {
    margin-bottom: var(--space-xxs);
  }
  .email-copy {
    cursor: pointer;
  }
}
</style>

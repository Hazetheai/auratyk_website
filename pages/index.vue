<template>
  <div class="home"><AuratykHomeScene /> <AuratykHomeSceneOverlay /></div>
</template>

<script>
import AuratykHomeScene from '@/components/webgl/AuratykHomeScene'
import AuratykHomeSceneOverlay from '@/components/blocks/AuratykHomeSceneOverlay'
export default {
  layout(context) {
    return 'default'
  },
  name: 'IndexPage',
  components: { AuratykHomeScene, AuratykHomeSceneOverlay },
}
</script>

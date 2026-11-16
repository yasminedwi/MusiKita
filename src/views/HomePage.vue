<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="home">

        <!-- =================================================
             AMBIENT BACKGROUND
        ================================================== -->

        <div class="ambient ambient-one"></div>
        <div class="ambient ambient-two"></div>
        <div class="ambient ambient-three"></div>

        <div class="ambient-noise"></div>


        <!-- =================================================
             GREETING
        ================================================== -->

        <section class="greeting glass-surface">

          <div class="greeting-shine"></div>

          <p class="eyebrow">
            YOUR MUSIC
          </p>

          <h1>
            Listen to<br />
            your music.
          </h1>

          <p class="subtitle">
            Your local music, all in one place.
          </p>

        </section>


        <!-- =================================================
             HIDDEN FILE PICKER
        ================================================== -->

        <input
          ref="fileInput"
          type="file"
          accept=".mp3,.flac,.wav,.m4a,.aac,.ogg,.opus,audio/*"
          multiple
          hidden
          @change="handleFiles"
        />


        <!-- =================================================
             ACTIONS
        ================================================== -->

        <div class="actions">

          <ion-button
            class="glass-button primary-button"
            expand="block"
            @click="selectMusic"
          >
            <ion-icon
              slot="start"
              :icon="addOutline"
            />

            <span>Add Music</span>
          </ion-button>


          <ion-button
            class="glass-button secondary-button"
            expand="block"
            fill="clear"
            @click="openLibrary"
          >
            <ion-icon
              slot="start"
              :icon="libraryOutline"
            />

            <span>Open Library</span>
          </ion-button>

        </div>


        <!-- =================================================
             RECENTLY PLAYED
        ================================================== -->

        <section class="section">

          <div class="section-header">

            <div>
              <p class="section-eyebrow">
                HISTORY
              </p>

              <h2>
                Recently Played
              </h2>
            </div>

          </div>


          <!-- Recent songs -->

          <div
            v-if="recentSongs.length > 0"
            class="recent-list"
          >

            <div
              v-for="song in recentSongs"
              :key="song.id"
              class="recent-item glass-surface"
              @click="playRecent(song)"
            >

              <!-- Cover -->

              <div class="recent-cover">

                <img
                  v-if="song.coverUrl"
                  :src="song.coverUrl"
                  :alt="song.album"
                />

                <div
                  v-else
                  class="cover-placeholder"
                >
                  <ion-icon
                    :icon="musicalNotesOutline"
                  />
                </div>

              </div>


              <!-- Song info -->

              <div class="recent-info">

                <strong>
                  {{ song.title }}
                </strong>

                <span>
                  {{ song.artist }}
                </span>

              </div>


              <!-- Play button -->

              <div class="recent-play">

                <ion-icon
                  :icon="playOutline"
                />

              </div>

            </div>

          </div>


          <!-- Empty state -->

          <div
            v-else
            class="empty-state glass-surface"
          >

            <div class="empty-icon">

              <ion-icon
                :icon="musicalNotesOutline"
              />

            </div>

            <h3>
              No recently played songs
            </h3>

            <p>
              Play a song and it will appear here.
            </p>

          </div>

        </section>


        <!-- =================================================
             LIBRARY
        ================================================== -->

        <section class="section">

          <div class="section-header">

            <div>
              <p class="section-eyebrow">
                COLLECTION
              </p>

              <h2>
                Your Library
              </h2>
            </div>

          </div>


          <div
            class="library-card glass-surface"
            @click="openLibrary"
          >

            <div class="library-icon">

              <ion-icon
                :icon="libraryOutline"
              />

            </div>


            <div class="library-info">

              <strong>
                Music Library
              </strong>

              <span>
                Browse all your songs
              </span>

            </div>


            <div class="arrow-container">

              <ion-icon
                class="arrow"
                :icon="chevronForwardOutline"
              />

            </div>

          </div>

        </section>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  computed
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/vue'

import {
  addOutline,
  libraryOutline,
  musicalNotesOutline,
  chevronForwardOutline,
  playOutline
} from 'ionicons/icons'

import {
  songs,
  recentlyPlayed,
  addMusicFiles
} from '../composables/UseMusicLibrary'

import type {
  MusicFile
} from '../composables/UseMusicLibrary'

import {
  playSong
} from '../composables/UsePlayer'


const router = useRouter()


const fileInput =
  ref<HTMLInputElement | null>(null)


/* =========================================================
   RECENTLY PLAYED
========================================================= */

const recentSongs = computed(() => {

  return recentlyPlayed.value
    .map(id => {

      return songs.value.find(
        song => song.id === id
      )

    })
    .filter(
      (song): song is MusicFile =>
        song !== undefined
    )

})


/* =========================================================
   ADD MUSIC
========================================================= */

const selectMusic = () => {

  fileInput.value?.click()

}


const handleFiles = async (
  event: Event
) => {

  const input =
    event.target as HTMLInputElement

  if (!input.files) {
    return
  }

  const files =
    Array.from(input.files)

  await addMusicFiles(files)

  // Reset agar file yang sama
  // tetap bisa dipilih lagi.

  input.value = ''

}


/* =========================================================
   OPEN LIBRARY
========================================================= */

const openLibrary = () => {

  router.push('/library')

}


/* =========================================================
   PLAY RECENT SONG
========================================================= */

const playRecent = async (
  song: MusicFile
) => {

  await playSong(song)

  router.push('/now-playing')

}

</script>


<style scoped>

/* =========================================================
   PAGE
========================================================= */

ion-content {
  --background: #09090b;
  --color: white;
}


.home {
  position: relative;

  min-height: 100%;

  overflow: hidden;

  padding:
    calc(22px + max(var(--mk-safe-top, 0px), env(safe-area-inset-top, 0px), 32px))
    clamp(16px, 5vw, 24px)
    calc(118px + var(--mk-safe-bottom, 0px));

  isolation: isolate;

  background:
    radial-gradient(
      circle at 8% -5%,
      rgba(130, 100, 255, 0.16),
      transparent 34%
    ),

    radial-gradient(
      circle at 100% 22%,
      rgba(255, 100, 180, 0.075),
      transparent 31%
    ),

    radial-gradient(
      circle at 50% 105%,
      rgba(70, 150, 255, 0.065),
      transparent 42%
    ),

    #09090b;
}


/* =========================================================
   GLASS SURFACE
========================================================= */

.glass-surface {
  position: relative;

  border:
    1px solid
    rgba(255, 255, 255, 0.095);

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.095),
      rgba(255, 255, 255, 0.038) 52%,
      rgba(255, 255, 255, 0.022)
    );

  backdrop-filter:
    blur(26px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(26px)
    saturate(175%);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.13),

    inset 0 -1px 0
      rgba(0, 0, 0, 0.08),

    0 12px 35px
      rgba(0, 0, 0, 0.10);

  transform:
    translate3d(0, 0, 0);

  will-change: transform;

  contain: paint;
}


/* =========================================================
   AMBIENT LIGHT
========================================================= */

.ambient {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(72px);

  z-index: -1;

  will-change:
    transform,
    opacity;

  animation:
    ambient-float 12s ease-in-out infinite;
}


.ambient-one {
  width: 230px;
  height: 230px;

  top: 110px;
  right: -105px;

  background:
    rgba(140, 100, 255, 0.21);

  opacity: 0.72;
}


.ambient-two {
  width: 190px;
  height: 190px;

  top: 560px;
  left: -110px;

  background:
    rgba(70, 160, 255, 0.16);

  opacity: 0.65;

  animation-delay:
    -4s;
}


.ambient-three {
  width: 150px;
  height: 150px;

  top: 850px;
  right: 10%;

  background:
    rgba(255, 100, 180, 0.09);

  opacity: 0.55;

  animation-delay:
    -8s;
}


@keyframes ambient-float {

  0%,
  100% {
    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

  50% {
    transform:
      translate3d(12px, -16px, 0)
      scale(1.05);
  }

}


/* =========================================================
   SUBTLE GLASS NOISE
========================================================= */

.ambient-noise {
  position: absolute;

  inset: 0;

  pointer-events: none;

  z-index: -1;

  opacity: 0.025;

  background-image:
    radial-gradient(
      rgba(255, 255, 255, 0.8) 0.5px,
      transparent 0.5px
    );

  background-size:
    4px 4px;

  mix-blend-mode:
    soft-light;
}


/* =========================================================
   GREETING
========================================================= */

.greeting {
  margin-top: 8px;

  padding:
    clamp(22px, 6vw, 28px)
    clamp(19px, 5.5vw, 24px);

  border-radius:
    clamp(24px, 6vw, 28px);

  overflow: hidden;

  animation:
    card-in 650ms var(--mk-glass-ease)
    both;
}


.greeting-shine {
  position: absolute;

  top: -80px;
  right: -45px;

  width: 190px;
  height: 190px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(170, 135, 255, 0.14),
      transparent 68%
    );

  filter: blur(10px);

  pointer-events: none;

  animation:
    shine-float 9s ease-in-out infinite;
}


@keyframes shine-float {

  0%,
  100% {
    transform:
      translate3d(0, 0, 0);
  }

  50% {
    transform:
      translate3d(-15px, 12px, 0);
  }

}


.eyebrow {
  position: relative;

  margin:
    0
    0
    9px;

  font-size:
    clamp(10px, 2.7vw, 11px);

  font-weight: 700;

  letter-spacing: 1.8px;

  color:
    rgba(255, 255, 255, 0.54);
}


h1 {
  position: relative;

  margin: 0;

  font-size:
    clamp(32px, 9.2vw, 39px);

  line-height: 1.055;

  font-weight: 800;

  letter-spacing:
    clamp(-1.2px, -0.25vw, -0.8px);

  color: white;

  text-wrap: balance;
}


.subtitle {
  position: relative;

  margin:
    14px
    0
    0;

  max-width: 290px;

  font-size:
    clamp(13px, 3.6vw, 14px);

  line-height: 1.5;

  color:
    rgba(255, 255, 255, 0.50);
}


/* =========================================================
   ACTIONS
========================================================= */

.actions {
  position: relative;

  z-index: 2;

  display: flex;

  flex-direction: column;

  gap: 9px;

  margin-top: 15px;

  animation:
    card-in 700ms var(--mk-glass-ease)
    70ms both;
}


.actions ion-button {
  margin: 0;

  height:
    clamp(49px, 13vw, 53px);

  --border-radius: 17px;

  --box-shadow: none;

  font-size:
    clamp(13px, 3.6vw, 14px);

  font-weight: 600;

  letter-spacing: -0.01em;

  transition:
    transform 420ms var(--mk-bounce);
}


/* =========================================================
   PRIMARY BUTTON
========================================================= */

.primary-button {
  position: relative;

  --background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.17),
      rgba(255, 255, 255, 0.065)
    );

  --color: white;

  --background-hover:
    rgba(255, 255, 255, 0.14);

  --background-activated:
    rgba(255, 255, 255, 0.17);

  border:
    1px solid
    rgba(255, 255, 255, 0.15);

  border-radius: 17px;

  backdrop-filter:
    blur(24px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(24px)
    saturate(175%);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.19),

    inset 0 -1px 0
      rgba(0, 0, 0, 0.08),

    0 9px 28px
      rgba(0, 0, 0, 0.14);

  overflow: hidden;
}


.primary-button::after {
  content: '';

  position: absolute;

  top: 0;
  left: 12%;

  width: 76%;
  height: 1px;

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.25);

  pointer-events: none;
}


/* =========================================================
   SECONDARY BUTTON
========================================================= */

.secondary-button {
  --color:
    rgba(255, 255, 255, 0.78);

  --border-color:
    rgba(255, 255, 255, 0.11);

  --border-width: 1px;

  --border-style: solid;

  --background:
    rgba(255, 255, 255, 0.038);

  --background-hover:
    rgba(255, 255, 255, 0.075);

  --background-activated:
    rgba(255, 255, 255, 0.10);

  backdrop-filter:
    blur(24px)
    saturate(165%);

  -webkit-backdrop-filter:
    blur(24px)
    saturate(165%);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.09);
}


/* Button press */

.actions ion-button:active {
  transform:
    scale(0.965);
}


/* =========================================================
   SECTIONS
========================================================= */

.section {
  position: relative;

  z-index: 2;

  margin-top:
    clamp(31px, 8vw, 38px);

  animation:
    section-in 700ms var(--mk-glass-ease)
    both;
}


.section:nth-of-type(4) {
  animation-delay: 120ms;
}


.section-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin:
    0
    4px
    13px;
}


.section-eyebrow {
  margin:
    0
    3px;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 1.7px;

  color:
    rgba(255, 255, 255, 0.36);
}


.section-header h2 {
  margin: 0;

  font-size:
    clamp(19px, 5vw, 21px);

  font-weight: 700;

  letter-spacing: -0.35px;
}


/* =========================================================
   RECENT LIST
========================================================= */

.recent-list {
  display: flex;

  flex-direction: column;

  gap: 8px;
}


.recent-item {
  display: flex;

  align-items: center;

  padding: 9px;

  border-radius: 19px;

  cursor: pointer;

  transition:
    transform 420ms var(--mk-bounce),
    background 260ms ease,
    border-color 260ms ease,
    box-shadow 420ms ease;

  -webkit-tap-highlight-color:
    transparent;

  touch-action: manipulation;

  animation:
    recent-in 520ms var(--mk-glass-ease)
    both;
}


.recent-item:nth-child(2) {
  animation-delay: 35ms;
}


.recent-item:nth-child(3) {
  animation-delay: 70ms;
}


.recent-item:nth-child(4) {
  animation-delay: 105ms;
}


.recent-item:active {
  transform:
    scale(0.965);

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.13),
      rgba(255, 255, 255, 0.055)
    );

  border-color:
    rgba(255, 255, 255, 0.15);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.15),

    0 6px 20px
      rgba(0, 0, 0, 0.12);
}


/* =========================================================
   RECENT COVER
========================================================= */

.recent-cover {
  position: relative;

  width:
    clamp(50px, 13vw, 55px);

  height:
    clamp(50px, 13vw, 55px);

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-right: 12px;

  overflow: hidden;

  border-radius: 14px;

  background:
    rgba(255, 255, 255, 0.065);

  border:
    1px solid
    rgba(255, 255, 255, 0.10);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.14),

    0 4px 12px
      rgba(0, 0, 0, 0.10);

  transition:
    transform 450ms var(--mk-bounce);
}


.recent-item:active .recent-cover {
  transform:
    scale(0.94);
}


.recent-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}


.cover-placeholder {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    radial-gradient(
      circle at 30% 20%,
      rgba(255, 255, 255, 0.10),
      transparent 55%
    );
}


.cover-placeholder ion-icon {
  font-size: 22px;

  color:
    rgba(255, 255, 255, 0.48);
}


/* =========================================================
   SONG INFO
========================================================= */

.recent-info {
  min-width: 0;

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 4px;
}


.recent-info strong {
  overflow: hidden;

  font-size:
    clamp(13px, 3.6vw, 14px);

  font-weight: 600;

  letter-spacing: -0.01em;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: white;
}


.recent-info span {
  overflow: hidden;

  font-size: 12px;

  color:
    rgba(255, 255, 255, 0.46);

  text-overflow: ellipsis;

  white-space: nowrap;
}


/* =========================================================
   RECENT PLAY
========================================================= */

.recent-play {
  width: 35px;
  height: 35px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-left: 8px;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.075);

  border:
    1px solid
    rgba(255, 255, 255, 0.09);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.13);

  transition:
    transform 420ms var(--mk-bounce),
    background 250ms ease;
}


.recent-play ion-icon {
  font-size: 17px;

  color:
    rgba(255, 255, 255, 0.78);

  transition:
    transform 420ms var(--mk-bounce);
}


.recent-item:active .recent-play {
  transform:
    scale(0.88);

  background:
    rgba(255, 255, 255, 0.13);
}


.recent-item:active .recent-play ion-icon {
  transform:
    scale(1.12);
}


/* =========================================================
   EMPTY STATE
========================================================= */

.empty-state {
  padding:
    38px
    20px;

  text-align: center;

  border-radius: 22px;

  animation:
    empty-in 550ms var(--mk-glass-ease)
    both;
}


.empty-icon {
  width: 58px;
  height: 58px;

  margin:
    0
    auto
    16px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.105),
      rgba(255, 255, 255, 0.045)
    );

  border:
    1px solid
    rgba(255, 255, 255, 0.10);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.14);
}


.empty-icon ion-icon {
  font-size: 27px;

  color:
    rgba(255, 255, 255, 0.56);

  animation:
    empty-float 3.5s ease-in-out infinite;
}


.empty-state h3 {
  margin:
    0
    0
    7px;

  font-size: 17px;

  font-weight: 650;

  color: white;
}


.empty-state p {
  max-width: 260px;

  margin:
    0
    auto;

  font-size: 13px;

  line-height: 1.5;

  color:
    rgba(255, 255, 255, 0.46);
}


@keyframes empty-float {

  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-4px);
  }

}


/* =========================================================
   LIBRARY CARD
========================================================= */

.library-card {
  display: flex;

  align-items: center;

  padding: 13px;

  border-radius: 21px;

  cursor: pointer;

  -webkit-tap-highlight-color:
    transparent;

  touch-action: manipulation;

  transition:
    transform 420ms var(--mk-bounce),
    background 260ms ease,
    border-color 260ms ease;
}


.library-card:active {
  transform:
    scale(0.965);

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.13),
      rgba(255, 255, 255, 0.05)
    );

  border-color:
    rgba(255, 255, 255, 0.15);
}


/* =========================================================
   LIBRARY ICON
========================================================= */

.library-icon {
  width:
    clamp(50px, 13vw, 54px);

  height:
    clamp(50px, 13vw, 54px);

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-right: 13px;

  border-radius: 15px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.045)
    );

  border:
    1px solid
    rgba(255, 255, 255, 0.11);

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.17);

  transition:
    transform 450ms var(--mk-bounce);
}


.library-card:active .library-icon {
  transform:
    scale(0.92)
    rotate(-3deg);
}


.library-icon ion-icon {
  font-size: 24px;

  color:
    rgba(255, 255, 255, 0.72);
}


/* =========================================================
   LIBRARY INFO
========================================================= */

.library-info {
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 4px;

  flex: 1;
}


.library-info strong {
  overflow: hidden;

  font-size: 15px;

  font-weight: 600;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.library-info span {
  overflow: hidden;

  font-size: 12px;

  color:
    rgba(255, 255, 255, 0.44);

  text-overflow: ellipsis;

  white-space: nowrap;
}


/* =========================================================
   ARROW
========================================================= */

.arrow-container {
  width: 33px;
  height: 33px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-left: 8px;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.055);

  border:
    1px solid
    rgba(255, 255, 255, 0.075);

  transition:
    transform 450ms var(--mk-bounce),
    background 250ms ease;
}


.arrow {
  font-size: 17px;

  color:
    rgba(255, 255, 255, 0.40);

  transition:
    transform 450ms var(--mk-bounce);
}


.library-card:active .arrow-container {
  transform:
    translateX(3px)
    scale(0.91);

  background:
    rgba(255, 255, 255, 0.10);
}


.library-card:active .arrow {
  transform:
    translateX(2px);
}


/* =========================================================
   ENTRANCE ANIMATIONS
========================================================= */

@keyframes card-in {

  from {
    opacity: 0;

    transform:
      translate3d(0, 14px, 0)
      scale(0.985);

    filter:
      blur(5px);
  }

  to {
    opacity: 1;

    transform:
      translate3d(0, 0, 0)
      scale(1);

    filter:
      blur(0);
  }

}


@keyframes section-in {

  from {
    opacity: 0;

    transform:
      translate3d(0, 18px, 0);

    filter:
      blur(4px);
  }

  to {
    opacity: 1;

    transform:
      translate3d(0, 0, 0);

    filter:
      blur(0);
  }

}


@keyframes recent-in {

  from {
    opacity: 0;

    transform:
      translate3d(0, 8px, 0)
      scale(0.985);
  }

  to {
    opacity: 1;

    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

}


@keyframes empty-in {

  from {
    opacity: 0;

    transform:
      translate3d(0, 10px, 0)
      scale(0.98);
  }

  to {
    opacity: 1;

    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

}


/* =========================================================
   DESKTOP / LARGE SCREEN
========================================================= */

@media (min-width: 700px) {

  .home {
    width:
      min(
        680px,
        calc(100vw - 40px)
      );

    margin:
      0
      auto;

    padding-left: 0;
    padding-right: 0;
  }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .ambient,
  .greeting-shine,
  .empty-icon ion-icon,
  .greeting,
  .actions,
  .section,
  .recent-item,
  .empty-state {
    animation: none !important;
  }

}

</style>
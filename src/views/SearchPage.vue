<template>
  <ion-page>

    <ion-content :fullscreen="true">

      <div class="search-page">

        <!-- =====================================================
             AMBIENT
             ===================================================== -->

        <div class="ambient ambient-one"></div>
        <div class="ambient ambient-two"></div>
        <div class="ambient ambient-three"></div>
        <div class="ambient-noise"></div>


        <!-- =====================================================
             HEADER
             ===================================================== -->

        <div class="page-header">

          <div class="header-shine"></div>

          <div class="header-copy">

            <span class="eyebrow">
              YOUR MUSIC
            </span>

            <h1>
              Search
            </h1>

            <p>
              Find something to listen to.
            </p>

          </div>

        </div>


        <!-- =====================================================
             SEARCH BOX
             ===================================================== -->

        <div
          class="search-box"
          :class="{ focused: query.length > 0 }"
        >

          <div class="search-icon-shell">

            <ion-icon
              :icon="searchOutline"
            />

          </div>

          <ion-input
            v-model="query"
            placeholder="Search your music..."
            clear-input
          />

        </div>


        <!-- =====================================================
             EMPTY — NO MUSIC
             ===================================================== -->

        <div
          v-if="songs.length === 0"
          class="empty-state"
        >

          <div class="empty-icon">

            <ion-icon
              :icon="musicalNotesOutline"
            />

          </div>

          <h2>
            No music yet
          </h2>

          <p>
            Add music to your library first.
          </p>

        </div>


        <!-- =====================================================
             EMPTY — NO QUERY
             ===================================================== -->

        <div
          v-else-if="query.trim() === ''"
          class="empty-state search-empty"
        >

          <div class="empty-icon">

            <ion-icon
              :icon="searchOutline"
            />

          </div>

          <h2>
            Search your library
          </h2>

          <p>
            Search by title, artist, album, or genre.
          </p>

        </div>


        <!-- =====================================================
             EMPTY — NO RESULTS
             ===================================================== -->

        <div
          v-else-if="filteredSongs.length === 0"
          class="empty-state search-empty"
        >

          <div class="empty-icon">

            <ion-icon
              :icon="searchOutline"
            />

          </div>

          <h2>
            No results
          </h2>

          <p>
            Nothing matches "{{ query }}".
          </p>

        </div>


        <!-- =====================================================
             RESULTS
             ===================================================== -->

        <div
          v-else
          class="results"
        >

          <div class="results-header">

            <span class="result-count">

              {{ filteredSongs.length }}

              {{
                filteredSongs.length === 1
                  ? 'result'
                  : 'results'
              }}

            </span>

          </div>


          <div class="song-list">

            <div
              v-for="(song, index) in filteredSongs"
              :key="song.id"
              class="song-item"
              :style="{ '--item-index': index }"
              @click="openSong(song)"
            >

              <!-- COVER -->

              <div class="cover">

                <img
                  v-if="song.coverUrl"
                  :src="song.coverUrl"
                  :alt="song.title"
                />

                <ion-icon
                  v-else
                  :icon="musicalNotesOutline"
                />

              </div>


              <!-- INFO -->

              <div class="song-info">

                <strong>
                  {{ song.title }}
                </strong>

                <span>
                  {{ song.artist }}
                </span>

                <small>
                  {{ song.album }}
                </small>

              </div>


              <!-- PLAY -->

              <div class="play-button">

                <ion-icon
                  :icon="playOutline"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  computed,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'


import {
  IonPage,
  IonContent,
  IonInput,
  IonIcon
} from '@ionic/vue'


import {
  searchOutline,
  musicalNotesOutline,
  playOutline
} from 'ionicons/icons'


import {
  songs
} from '../composables/UseMusicLibrary'


import {
  playSong
} from '../composables/UsePlayer'


const router = useRouter()


const query =
  ref('')


const filteredSongs =
  computed(() => {

    const search =
      query.value
        .trim()
        .toLowerCase()


    if (!search) {
      return []
    }


    return songs.value.filter(
      song => {

        return (

          song.title
            .toLowerCase()
            .includes(search)

          ||

          song.artist
            .toLowerCase()
            .includes(search)

          ||

          song.album
            .toLowerCase()
            .includes(search)

          ||

          song.genre
            .toLowerCase()
            .includes(search)

        )

      }
    )

  })


const openSong = async (
  song: typeof songs.value[number]
) => {

  await playSong(
    song
  )

  router.push(
    '/now-playing'
  )

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


.search-page {
  --ease-smooth: var(--mk-glass-ease, cubic-bezier(0.22, 1, 0.36, 1));
  --ease-bounce: var(--mk-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));

  --glass-bg:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.105),
      rgba(255,255,255,0.032)
    );

  --glass-bg-active:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.145),
      rgba(255,255,255,0.055)
    );

  --glass-border:
    rgba(255,255,255,0.105);

  --glass-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15),

    inset 0 -1px 1px
      rgba(0,0,0,0.05),

    0 12px 34px
      rgba(0,0,0,0.10);

  position: relative;

  min-height: 100%;

  overflow: hidden;

  padding:
    calc(22px + max(var(--mk-safe-top, 0px), env(safe-area-inset-top, 0px), 32px))
    clamp(16px, 5vw, 24px)
    calc(118px + var(--mk-safe-bottom, 0px));

  isolation: isolate;

  -webkit-tap-highlight-color: transparent;

  background:
    radial-gradient(
      circle at 8% -5%,
      rgba(130,100,255,0.16),
      transparent 34%
    ),

    radial-gradient(
      circle at 100% 22%,
      rgba(255,100,180,0.075),
      transparent 31%
    ),

    radial-gradient(
      circle at 50% 105%,
      rgba(70,150,255,0.065),
      transparent 42%
    ),

    #09090b;
}


/* =========================================================
   AMBIENT
   ========================================================= */

.ambient {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  z-index: -1;

  filter: blur(72px);

  will-change:
    transform,
    opacity;

  animation:
    ambient-float 12s ease-in-out infinite;
}


.ambient-one {
  width: 240px;
  height: 240px;

  top: 115px;
  right: -135px;

  background:
    rgba(140,100,255,0.21);

  opacity: 0.72;
}


.ambient-two {
  width: 205px;
  height: 205px;

  top: 610px;
  left: -125px;

  background:
    rgba(70,160,255,0.16);

  opacity: 0.65;

  animation-delay: -4s;
}


.ambient-three {
  width: 150px;
  height: 150px;

  top: 390px;
  left: 42%;

  background:
    rgba(255,100,180,0.09);

  opacity: 0.55;

  animation-delay: -8s;
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


.ambient-noise {
  position: absolute;

  inset: 0;

  pointer-events: none;

  z-index: -1;

  opacity: 0.025;

  background-image:
    radial-gradient(
      rgba(255,255,255,0.8) 0.5px,
      transparent 0.5px
    );

  background-size: 4px 4px;

  mix-blend-mode: soft-light;
}


/* =========================================================
   HEADER
   ========================================================= */

.page-header {
  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 8px;
  margin-bottom: 15px;

  padding:
    24px
    22px;

  border:
    1px solid
    var(--glass-border);

  border-radius: 27px;

  background:
    var(--glass-bg);

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow:
    var(--glass-shadow);

  overflow: hidden;

  animation:
    glass-enter 0.7s var(--ease-smooth) both;
}


.page-header::before,
.song-item::before,
.empty-state::before {
  content: '';

  position: absolute;

  top: 0;
  left: 8%;
  right: 8%;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.22),
      transparent
    );

  opacity: 0.7;

  pointer-events: none;
}


.header-shine {
  position: absolute;

  top: -85px;
  right: -45px;

  width: 175px;
  height: 175px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(170,140,255,0.18),
      rgba(170,140,255,0.05) 45%,
      transparent 72%
    );

  filter: blur(8px);

  pointer-events: none;

  animation:
    header-glow 8s ease-in-out infinite alternate;
}


@keyframes header-glow {

  from {
    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

  to {
    transform:
      translate3d(-12px, 10px, 0)
      scale(1.08);
  }

}


.header-copy {
  position: relative;

  z-index: 2;

  min-width: 0;
}


.eyebrow {
  display: block;

  margin-bottom: 8px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 1.8px;

  color:
    rgba(255,255,255,0.55);
}


.page-header h1 {
  margin: 0;

  font-size:
    clamp(32px, 8vw, 38px);

  line-height: 1.06;

  font-weight: 800;

  letter-spacing: -1.15px;

  color: #fff;
}


.page-header p {
  margin:
    10px
    0
    0;

  font-size: 14px;

  line-height: 1.4;

  color:
    rgba(255,255,255,0.48);
}


/* =========================================================
   SEARCH BOX
   ========================================================= */

.search-box {
  position: relative;

  z-index: 3;

  display: flex;

  align-items: center;

  gap: 10px;

  width: 100%;

  min-height: 55px;

  box-sizing: border-box;

  padding:
    5px
    8px
    5px
    7px;

  margin-bottom: 20px;

  border-radius: 19px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.125),
      rgba(255,255,255,0.042)
    );

  border:
    1px solid
    rgba(255,255,255,0.115);

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.17),

    inset 0 -1px 1px
      rgba(0,0,0,0.10),

    0 12px 35px
      rgba(0,0,0,0.14);

  animation:
    glass-enter 0.7s 0.06s var(--ease-smooth) both;

  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.4s ease;
}


.search-box::before {
  content: '';

  position: absolute;

  inset: 1px;

  border-radius: 18px;

  pointer-events: none;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.06),
      transparent 35%
    );
}


.search-box.focused,
.search-box:focus-within {
  border-color:
    rgba(255,255,255,0.17);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.14),
      rgba(255,255,255,0.05)
    );

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18),

    0 15px 42px
      rgba(0,0,0,0.17);
}


.search-icon-shell {
  position: relative;

  z-index: 2;

  width: 39px;
  height: 39px;

  min-width: 39px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.105),
      rgba(255,255,255,0.035)
    );

  border:
    1px solid
    rgba(255,255,255,0.09);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.12);

  transition:
    transform 0.45s var(--ease-bounce);
}


.search-box:focus-within .search-icon-shell {
  transform:
    scale(1.06);
}


.search-icon-shell ion-icon {
  font-size: 18px;

  color:
    rgba(255,255,255,0.58);
}


.search-box ion-input {
  position: relative;

  z-index: 2;

  flex: 1;

  min-width: 0;

  --padding-start: 0;
  --padding-end: 4px;

  --color: #fff;

  --placeholder-color:
    rgba(255,255,255,0.38);

  --placeholder-opacity: 1;

  font-size: 14px;

  --highlight-color: transparent;
}


/* =========================================================
   RESULTS
   ========================================================= */

.results {
  position: relative;

  z-index: 2;

  width: 100%;
}


.results-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin:
    0
    4px
    10px;
}


.result-count {
  margin: 0;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.2px;

  text-transform: uppercase;

  color:
    rgba(255,255,255,0.36);
}


/* =========================================================
   SONG LIST
   ========================================================= */

.song-list {
  display: flex;

  flex-direction: column;

  gap: 8px;
}


/* =========================================================
   SONG ITEM
   ========================================================= */

.song-item {
  --item-index: 0;

  position: relative;

  display: flex;

  align-items: center;

  gap: 11px;

  min-width: 0;

  padding: 9px;

  border-radius: 19px;

  background:
    var(--glass-bg);

  border:
    1px solid
    var(--glass-border);

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow:
    var(--glass-shadow);

  cursor: pointer;

  overflow: hidden;

  transform:
    translate3d(0, 0, 0);

  will-change: transform;

  -webkit-tap-highlight-color:
    transparent;

  touch-action: manipulation;

  user-select: none;

  /* "backwards" so the :active press-scale still works */

  animation:
    result-in
    520ms
    var(--ease-smooth)
    backwards;

  animation-delay:
    calc(min(var(--item-index), 8) * 35ms);

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.4s ease;
}


.song-item:active {
  transform:
    scale(0.975)
    translateY(1px);

  background:
    var(--glass-bg-active);

  border-color:
    rgba(255,255,255,0.15);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18),

    0 5px 16px
      rgba(0,0,0,0.08);
}


@keyframes result-in {

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


/* =========================================================
   COVER
   ========================================================= */

.cover {
  position: relative;

  width: 55px;
  height: 55px;

  min-width: 55px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 14px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.045)
    );

  border:
    1px solid
    rgba(255,255,255,0.10);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15),

    0 5px 12px
      rgba(0,0,0,0.10);

  transition:
    transform 0.45s var(--ease-bounce);
}


.song-item:active .cover {
  transform:
    scale(0.94);
}


.cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  transition:
    transform 0.6s var(--ease-smooth);
}


.song-item:active .cover img {
  transform:
    scale(1.055);
}


.cover ion-icon {
  font-size: 23px;

  color:
    rgba(255,255,255,0.48);
}


/* =========================================================
   SONG INFO
   ========================================================= */

.song-info {
  flex: 1;

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 3px;

  position: relative;

  z-index: 2;
}


.song-info strong,
.song-info span,
.song-info small {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.song-info strong {
  font-size: 14px;

  line-height: 1.25;

  font-weight: 650;

  letter-spacing: -0.01em;

  color: #fff;
}


.song-info span {
  font-size: 12px;

  line-height: 1.25;

  color:
    rgba(255,255,255,0.58);
}


.song-info small {
  font-size: 10px;

  line-height: 1.25;

  color:
    rgba(255,255,255,0.35);
}


/* =========================================================
   PLAY BUTTON
   ========================================================= */

.play-button {
  position: relative;

  z-index: 2;

  width: 35px;
  height: 35px;

  min-width: 35px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    rgba(255,255,255,0.085);

  border:
    1px solid
    rgba(255,255,255,0.11);

  color:
    rgba(255,255,255,0.82);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15);

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease;
}


.song-item:active .play-button {
  transform:
    scale(0.86);

  background:
    rgba(255,255,255,0.15);
}


.play-button ion-icon {
  font-size: 16px;

  margin-left: 1px;
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

.empty-state {
  position: relative;

  z-index: 2;

  display: flex;

  flex-direction: column;

  align-items: center;

  padding:
    54px
    24px;

  text-align: center;

  border-radius: 27px;

  background:
    var(--glass-bg);

  border:
    1px solid
    var(--glass-border);

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow:
    var(--glass-shadow);

  overflow: hidden;

  animation:
    content-enter 0.55s 0.08s var(--ease-smooth) both;
}


.empty-icon {
  width: 66px;
  height: 66px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 18px;

  border-radius: 21px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.14),
      rgba(255,255,255,0.045)
    );

  border:
    1px solid
    rgba(255,255,255,0.12);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.17),

    0 8px 22px
      rgba(0,0,0,0.10);

  animation:
    empty-icon-float
    4s
    ease-in-out
    infinite;
}


@keyframes empty-icon-float {

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


.empty-icon ion-icon {
  font-size: 29px;

  color:
    rgba(255,255,255,0.55);
}


.empty-state h2 {
  margin:
    0
    0
    8px;

  font-size: 20px;

  line-height: 1.2;

  font-weight: 700;

  letter-spacing: -0.3px;

  color: #fff;
}


.empty-state p {
  max-width: 280px;

  margin:
    0
    auto;

  font-size: 13px;

  line-height: 1.5;

  color:
    rgba(255,255,255,0.45);
}


/* =========================================================
   DESKTOP HOVER
   ========================================================= */

@media (hover: hover) and (pointer: fine) {

  .song-item:hover {
    transform:
      translateY(-2px);

    background:
      linear-gradient(
        145deg,
        rgba(255,255,255,0.125),
        rgba(255,255,255,0.045)
      );

    border-color:
      rgba(255,255,255,0.14);

    box-shadow:
      inset 0 1px 1px
        rgba(255,255,255,0.18),

      0 14px 32px
        rgba(0,0,0,0.13);
  }


  .song-item:hover .cover img {
    transform:
      scale(1.035);
  }


  .song-item:hover .play-button {
    transform:
      scale(1.08);

    background:
      rgba(255,255,255,0.14);
  }

}


/* =========================================================
   ENTRANCE ANIMATIONS
   ========================================================= */

@keyframes glass-enter {

  from {
    opacity: 0;

    transform:
      translate3d(0, 12px, 0)
      scale(0.975);

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


@keyframes content-enter {

  from {
    opacity: 0;

    transform:
      translate3d(0, 14px, 0)
      scale(0.985);
  }

  to {
    opacity: 1;

    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      0.01ms !important;

    scroll-behavior:
      auto !important;
  }

}


/* =========================================================
   SMALL SCREENS
   ========================================================= */

@media (max-width: 360px) {

  .search-page {
    padding-left: 15px;
    padding-right: 15px;
  }

  .page-header h1 {
    font-size: 29px;
  }

  .song-item {
    gap: 9px;
    padding: 8px;
  }

  .cover {
    width: 49px;
    height: 49px;
    min-width: 49px;
  }

  .play-button {
    width: 32px;
    height: 32px;
    min-width: 32px;
  }

}

</style>
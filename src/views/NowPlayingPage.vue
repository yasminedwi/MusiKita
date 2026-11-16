<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="player-page" :class="{ paused: !isPlaying }">

        <!-- =====================================================
             BACKGROUND
             ===================================================== -->

        <div
          v-if="currentSong?.coverUrl"
          class="background-art"
          :style="{ backgroundImage: `url(${currentSong.coverUrl})` }"
        ></div>

        <div class="background-overlay"></div>

        <div class="ambient ambient-one"></div>
        <div class="ambient ambient-two"></div>
        <div class="ambient-noise"></div>


        <!-- =====================================================
             TOP BAR
             ===================================================== -->

        <div class="top-bar">

          <button
            type="button"
            class="glass-button"
            aria-label="Close player"
            @click="goBack"
          >
            <ion-icon :icon="chevronDownOutline" />
          </button>

          <div class="playing-label">
            <span>NOW PLAYING</span>
          </div>

          <button
            type="button"
            class="glass-button"
            :class="{ active: showQueue }"
            aria-label="Toggle queue"
            @click="showQueue = !showQueue"
          >
            <ion-icon :icon="listOutline" />
          </button>

        </div>


        <!-- =====================================================
             PLAYER
             ===================================================== -->

        <div class="player-content">

          <!-- ART -->
          <div class="art-wrapper">

            <div
              class="art-shadow"
              :style="
                currentSong?.coverUrl
                  ? { backgroundImage: `url(${currentSong.coverUrl})` }
                  : {}
              "
            ></div>

            <img
              v-if="currentSong?.coverUrl"
              :src="currentSong.coverUrl"
              :alt="currentSong.title"
              class="album-art"
            />

            <div v-else class="album-art empty-art">
              <ion-icon :icon="musicalNotesOutline" />
            </div>

          </div>


          <!-- INFO -->
          <div class="song-info">

            <h1>{{ currentSong?.title || 'Nothing playing' }}</h1>

            <p v-if="currentSong?.artist">{{ currentSong.artist }}</p>

            <span v-if="currentSong?.album">{{ currentSong.album }}</span>

          </div>


          <!-- PROGRESS -->
          <div class="progress-section glass-card">

            <ion-range
              class="glass-range"
              :min="0"
              :max="duration || 1"
              :value="rangeValue"
              @ionKnobMoveStart="onSeekStart"
              @ionInput="onSeekInput"
              @ionKnobMoveEnd="onSeekEnd"
            />

            <div class="time-row">
              <span>{{ seeking ? formatTime(seekValue) : formattedCurrentTime }}</span>
              <span>{{ formattedDuration }}</span>
            </div>

          </div>


          <!-- SHUFFLE / REPEAT -->
          <div class="mode-pill glass-card">

            <button
              type="button"
              class="mode-button"
              :class="{ active: isShuffle }"
              aria-label="Shuffle"
              @click="toggleShuffle"
            >
              <ion-icon :icon="shuffleOutline" />
            </button>

            <div class="mode-divider"></div>

            <button
              type="button"
              class="mode-button"
              :class="{ active: repeatMode !== 'off' }"
              aria-label="Repeat"
              @click="toggleRepeat"
            >
              <div class="repeat-icon">
                <ion-icon :icon="repeatOutline" />
                <small v-if="repeatMode === 'one'">1</small>
              </div>
            </button>

          </div>


          <!-- CONTROLS -->
          <div class="controls">

            <button
              type="button"
              class="control-button"
              aria-label="Previous"
              @click="previousSong"
            >
              <ion-icon :icon="playSkipBackOutline" />
            </button>

            <button
              type="button"
              class="play-button"
              :disabled="!currentSong"
              :aria-label="isPlaying ? 'Pause' : 'Play'"
              @click="togglePlay"
            >
              <ion-icon
                :key="isPlaying ? 'pause' : 'play'"
                class="play-icon"
                :icon="isPlaying ? pauseOutline : playOutline"
              />
            </button>

            <button
              type="button"
              class="control-button"
              aria-label="Next"
              @click="nextSong"
            >
              <ion-icon :icon="playSkipForwardOutline" />
            </button>

          </div>


          <!-- QUEUE -->
          <Transition name="queue">

            <div v-if="showQueue" class="queue-panel glass-card">

              <div class="queue-header">

                <div>
                  <strong>Queue</strong>
                  <span>
                    {{ queue.length }}
                    {{ queue.length === 1 ? 'song' : 'songs' }}
                  </span>
                </div>

                <button
                  type="button"
                  class="close-queue"
                  aria-label="Close queue"
                  @click="showQueue = false"
                >
                  <ion-icon :icon="closeOutline" />
                </button>

              </div>


              <div v-if="queue.length === 0" class="queue-empty">
                Your queue is empty.
              </div>

              <div v-else class="queue-list">

                <div
                  v-for="(song, index) in queue"
                  :key="song.id"
                  class="queue-item"
                  :class="{ current: currentSong?.id === song.id }"
                  @click="playQueueSong(song)"
                >

                  <div class="queue-number">{{ index + 1 }}</div>

                  <div class="queue-art">
                    <img
                      v-if="song.coverUrl"
                      :src="song.coverUrl"
                      :alt="song.title"
                    />
                    <ion-icon v-else :icon="musicalNotesOutline" />
                  </div>

                  <div class="queue-info">
                    <strong>{{ song.title }}</strong>
                    <span>{{ song.artist }}</span>
                  </div>

                  <button
                    type="button"
                    class="queue-remove"
                    aria-label="Remove from queue"
                    @click.stop="removeFromQueue(song.id)"
                  >
                    <ion-icon :icon="closeOutline" />
                  </button>

                </div>

              </div>

            </div>

          </Transition>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import { computed, ref } from 'vue'

import { useRouter } from 'vue-router'

import {
  IonPage,
  IonContent,
  IonIcon,
  IonRange
} from '@ionic/vue'

import {
  chevronDownOutline,
  listOutline,
  musicalNotesOutline,
  shuffleOutline,
  repeatOutline,
  playSkipBackOutline,
  playSkipForwardOutline,
  playOutline,
  pauseOutline,
  closeOutline
} from 'ionicons/icons'

import {
  currentSong,
  isPlaying,
  currentTime,
  duration,
  queue,
  isShuffle,
  repeatMode,
  togglePlay,
  seek,
  nextSong,
  previousSong,
  toggleShuffle,
  toggleRepeat,
  playSong,
  removeFromQueue,
  formattedCurrentTime,
  formattedDuration
} from '../composables/UsePlayer'


const router = useRouter()

const showQueue = ref(false)


/* fall back to home if there is no history to go back to */
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/')
  }
}


/* =========================================================
   SEEKING
   The knob follows the finger while dragging; the player is
   only seeked when the finger lets go, so playback updates
   never fight the drag.
   ========================================================= */

const seeking = ref(false)
const seekValue = ref(0)

const rangeValue = computed(() =>
  seeking.value ? seekValue.value : currentTime.value
)

const formatTime = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds || 0))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const readValue = (event: CustomEvent) => {
  const value = event.detail.value
  return typeof value === 'number' ? value : null
}

const onSeekStart = () => {
  seekValue.value = currentTime.value
  seeking.value = true
}

const onSeekInput = (event: CustomEvent) => {
  const value = readValue(event)
  if (value === null) return

  if (seeking.value) {
    seekValue.value = value
  } else {
    /* tap on the bar without dragging */
    seek(value)
  }
}

const onSeekEnd = (event: CustomEvent) => {
  const value = readValue(event)

  if (value !== null) {
    seek(value)
  }

  seeking.value = false
}


const playQueueSong = async (
  song: typeof queue.value[number]
) => {

  await playSong(song, queue.value)

  showQueue.value = false
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


.player-page {
  --ease-smooth: var(--mk-glass-ease, cubic-bezier(0.22, 1, 0.36, 1));
  --ease-bounce: var(--mk-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));

  --safe-top:
    max(var(--mk-safe-top, 0px), env(safe-area-inset-top, 0px), 32px);

  --safe-bottom:
    max(var(--mk-safe-bottom, 0px), env(safe-area-inset-bottom, 0px));

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

  isolation: isolate;

  color: white;

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
   BACKGROUND
   ========================================================= */

.background-art {
  position: absolute;

  inset: -18%;

  z-index: -3;

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  filter:
    blur(65px)
    saturate(1.45)
    brightness(0.55);

  transform: scale(1.25);

  opacity: 0.7;

  pointer-events: none;
}


.background-overlay {
  position: absolute;

  inset: 0;

  z-index: -2;

  pointer-events: none;

  background:
    linear-gradient(
      180deg,
      rgba(9,9,11,0.10),
      rgba(9,9,11,0.35) 45%,
      rgba(9,9,11,0.75)
    );
}


.ambient {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  z-index: -1;

  filter: blur(72px);

  will-change: transform, opacity;

  animation: ambient-float 12s ease-in-out infinite;
}


.ambient-one {
  width: 240px;
  height: 240px;

  top: 115px;
  right: -135px;

  background: rgba(140,100,255,0.21);

  opacity: 0.6;
}


.ambient-two {
  width: 205px;
  height: 205px;

  bottom: 120px;
  left: -125px;

  background: rgba(70,160,255,0.16);

  opacity: 0.55;

  animation-delay: -4s;
}


@keyframes ambient-float {

  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(12px, -16px, 0) scale(1.05);
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
   GLASS CARD (shared)
   ========================================================= */

.glass-card {
  position: relative;

  background: var(--glass-bg);

  border: 1px solid var(--glass-border);

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow: var(--glass-shadow);

  overflow: hidden;
}


.glass-card::before {
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


/* =========================================================
   TOP BAR
   ========================================================= */

.top-bar {
  position: relative;

  z-index: 10;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    calc(22px + var(--safe-top))
    clamp(16px, 5vw, 24px)
    10px;

  animation: glass-enter 0.7s var(--ease-smooth) both;
}


.glass-button {
  position: relative;

  width: 44px;
  height: 44px;

  padding: 0;

  border-radius: 50%;

  border: 1px solid var(--glass-border);

  display: flex;

  align-items: center;

  justify-content: center;

  color: rgba(255,255,255,0.85);

  background: var(--glass-bg);

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow: var(--glass-shadow);

  overflow: hidden;

  touch-action: manipulation;

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease,
    border-color 0.3s ease;
}


.glass-button:active {
  transform: scale(0.86);

  background: var(--glass-bg-active);

  border-color: rgba(255,255,255,0.15);
}


.glass-button.active {
  background: var(--glass-bg-active);

  border-color: rgba(255,255,255,0.17);
}


.glass-button ion-icon {
  position: relative;

  font-size: 21px;
}


.playing-label {
  font-size: 11px;

  font-weight: 700;

  letter-spacing: 1.8px;

  color: rgba(255,255,255,0.55);
}


/* =========================================================
   PLAYER CONTENT
   ========================================================= */

.player-content {
  position: relative;

  z-index: 5;

  display: flex;

  flex-direction: column;

  align-items: center;

  padding:
    8px
    clamp(16px, 5vw, 24px)
    calc(
      clamp(64px, 17vw, 72px) +
      9px +
      var(--safe-bottom) +
      28px
    );
}


/* =========================================================
   ALBUM ART
   ========================================================= */

.art-wrapper {
  position: relative;

  width: min(78vw, 360px);

  aspect-ratio: 1;

  margin:
    2vh
    auto
    28px;

  animation: glass-enter 0.7s 0.06s var(--ease-smooth) both;
}


.art-shadow {
  position: absolute;

  inset: 5%;

  border-radius: 28px;

  background-size: cover;

  background-position: center;

  filter:
    blur(45px)
    saturate(1.4);

  opacity: 0.6;

  transform:
    translateY(24px)
    scale(0.9);

  transition:
    opacity 0.5s ease,
    transform 0.6s var(--ease-bounce);
}


.album-art {
  position: relative;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 28px;

  border: 1px solid rgba(255,255,255,0.16);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.22),

    0 30px 80px
      rgba(0,0,0,0.38);

  overflow: hidden;

  transition: transform 0.6s var(--ease-bounce);
}


/* art breathes: full size while playing, shrinks when paused */

.paused .album-art {
  transform: scale(0.9);
}


.paused .art-shadow {
  opacity: 0.3;

  transform:
    translateY(14px)
    scale(0.82);
}


.empty-art {
  display: flex;

  align-items: center;

  justify-content: center;

  background: var(--glass-bg);

  backdrop-filter: blur(28px);

  -webkit-backdrop-filter: blur(28px);
}


.empty-art ion-icon {
  font-size: 80px;

  color: rgba(255,255,255,0.35);
}


/* =========================================================
   SONG INFO
   ========================================================= */

.song-info {
  width: 100%;

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 4px;

  margin-bottom: 14px;

  text-align: left;

  animation: glass-enter 0.7s 0.1s var(--ease-smooth) both;
}


.song-info h1,
.song-info p,
.song-info span {
  margin: 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.song-info h1 {
  font-size: 24px;

  line-height: 1.15;

  font-weight: 800;

  letter-spacing: -0.6px;

  color: #fff;
}


.song-info p {
  font-size: 16px;

  line-height: 1.25;

  font-weight: 500;

  color: rgba(255,255,255,0.68);
}


.song-info span {
  font-size: 12px;

  line-height: 1.25;

  color: rgba(255,255,255,0.38);
}


/* =========================================================
   PROGRESS
   ========================================================= */

.progress-section {
  width: 100%;

  box-sizing: border-box;

  padding:
    9px
    12px
    8px;

  border-radius: 19px;

  animation: glass-enter 0.7s 0.14s var(--ease-smooth) both;
}


.glass-range {
  --bar-height: 4px;

  --knob-size: 16px;

  --bar-background: rgba(255,255,255,0.16);

  --bar-background-active: rgba(255,255,255,0.9);

  --knob-background: rgba(255,255,255,0.95);

  padding: 0 0 4px;
}


.time-row {
  display: flex;

  justify-content: space-between;

  font-size: 10px;

  font-weight: 600;

  font-variant-numeric: tabular-nums;

  color: rgba(255,255,255,0.4);
}


/* =========================================================
   SHUFFLE / REPEAT
   ========================================================= */

.mode-pill {
  display: flex;

  align-items: center;

  margin-top: 16px;

  padding: 4px;

  border-radius: 100px;

  animation: glass-enter 0.7s 0.18s var(--ease-smooth) both;
}


.mode-button {
  position: relative;

  z-index: 2;

  width: 46px;
  height: 36px;

  padding: 0;

  border: none;

  border-radius: 100px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: white;

  background: transparent;

  opacity: 0.45;

  touch-action: manipulation;

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease,
    opacity 0.3s ease;
}


.mode-button:active {
  transform: scale(0.88);
}


.mode-button.active {
  opacity: 1;

  background: rgba(255,255,255,0.14);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.2);
}


.mode-button ion-icon {
  font-size: 18px;
}


.mode-divider {
  width: 1px;

  height: 16px;

  background: rgba(255,255,255,0.15);
}


.repeat-icon {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;
}


.repeat-icon small {
  position: absolute;

  top: -2px;

  right: -3px;

  font-size: 7px;

  font-weight: 800;
}


/* =========================================================
   MAIN CONTROLS
   ========================================================= */

.controls {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 28px;

  margin-top: 18px;

  animation: glass-enter 0.7s 0.22s var(--ease-smooth) both;
}


.control-button {
  position: relative;

  width: 52px;
  height: 52px;

  padding: 0;

  border-radius: 50%;

  border: 1px solid var(--glass-border);

  display: flex;

  align-items: center;

  justify-content: center;

  color: rgba(255,255,255,0.9);

  background: var(--glass-bg);

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow: var(--glass-shadow);

  touch-action: manipulation;

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease,
    border-color 0.3s ease;
}


.control-button:active {
  transform: scale(0.86);

  background: var(--glass-bg-active);

  border-color: rgba(255,255,255,0.15);
}


.control-button ion-icon {
  font-size: 25px;
}


.play-button {
  position: relative;

  width: 76px;
  height: 76px;

  padding: 0;

  border-radius: 50%;

  border: 1px solid rgba(255,255,255,0.2);

  display: flex;

  align-items: center;

  justify-content: center;

  color: white;

  background:
    radial-gradient(
      circle at 35% 25%,
      rgba(255,255,255,0.3),
      transparent 34%
    ),

    linear-gradient(
      145deg,
      rgba(255,255,255,0.2),
      rgba(255,255,255,0.065)
    );

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.3),

    inset 0 -4px 10px
      rgba(0,0,0,0.12),

    0 16px 40px
      rgba(0,0,0,0.26);

  overflow: hidden;

  touch-action: manipulation;

  transition:
    transform 0.48s var(--ease-bounce),
    box-shadow 0.4s ease;
}


.play-button:active {
  transform: scale(0.88);
}


.play-button:disabled {
  opacity: 0.45;

  pointer-events: none;
}


.play-button ion-icon {
  position: relative;

  z-index: 2;

  font-size: 30px;
}


/* icon pops each time play / pause swaps (re-keyed in template) */

.play-icon {
  animation: icon-pop 0.5s var(--ease-bounce) both;
}


@keyframes icon-pop {

  from {
    opacity: 0;

    transform: scale(0.55);
  }

  to {
    opacity: 1;

    transform: scale(1);
  }

}


/* =========================================================
   QUEUE
   ========================================================= */

.queue-panel {
  width: 100%;

  box-sizing: border-box;

  margin-top: 26px;

  padding: 15px;

  border-radius: 27px;
}


.queue-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    2px
    2px
    12px;
}


.queue-header div {
  display: flex;

  flex-direction: column;

  gap: 3px;
}


.queue-header strong {
  font-size: 17px;

  font-weight: 700;

  letter-spacing: -0.3px;
}


.queue-header span {
  font-size: 11px;

  color: rgba(255,255,255,0.42);
}


.close-queue {
  width: 34px;
  height: 34px;

  padding: 0;

  border-radius: 50%;

  border: 1px solid var(--glass-border);

  color: rgba(255,255,255,0.8);

  background: rgba(255,255,255,0.085);

  display: flex;

  align-items: center;

  justify-content: center;

  touch-action: manipulation;

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease;
}


.close-queue:active {
  transform: scale(0.84);

  background: rgba(255,255,255,0.15);
}


.queue-empty {
  padding: 22px 0 14px;

  text-align: center;

  font-size: 13px;

  color: rgba(255,255,255,0.42);
}


.queue-list {
  max-height: 300px;

  overflow-y: auto;

  scrollbar-width: none;

  overscroll-behavior: contain;
}


.queue-list::-webkit-scrollbar {
  display: none;
}


.queue-item {
  display: flex;

  align-items: center;

  gap: 10px;

  padding:
    8px
    6px;

  border-radius: 16px;

  cursor: pointer;

  touch-action: manipulation;

  user-select: none;

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease;
}


.queue-item:active {
  transform: scale(0.97);

  background: rgba(255,255,255,0.08);
}


.queue-item.current {
  background: rgba(255,255,255,0.1);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.1);
}


.queue-number {
  width: 18px;

  text-align: center;

  font-size: 10px;

  font-variant-numeric: tabular-nums;

  color: rgba(255,255,255,0.35);
}


.queue-art {
  width: 44px;
  height: 44px;

  min-width: 44px;

  border-radius: 12px;

  overflow: hidden;

  display: flex;

  align-items: center;

  justify-content: center;

  background: rgba(255,255,255,0.08);

  border: 1px solid rgba(255,255,255,0.1);
}


.queue-art img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}


.queue-art ion-icon {
  font-size: 18px;

  color: rgba(255,255,255,0.45);
}


.queue-info {
  flex: 1;

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 3px;
}


.queue-info strong,
.queue-info span {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.queue-info strong {
  font-size: 13px;

  font-weight: 650;

  letter-spacing: -0.01em;
}


.queue-info span {
  font-size: 11px;

  color: rgba(255,255,255,0.5);
}


.queue-remove {
  width: 34px;
  height: 34px;

  padding: 0;

  border: none;

  border-radius: 50%;

  background: transparent;

  color: rgba(255,255,255,0.4);

  display: flex;

  align-items: center;

  justify-content: center;

  touch-action: manipulation;

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease,
    color 0.25s ease;
}


.queue-remove:active {
  transform: scale(0.8);

  background: rgba(255,255,255,0.12);

  color: #fff;
}


/* =========================================================
   QUEUE ANIMATION
   ========================================================= */

.queue-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.55s var(--ease-bounce);
}


.queue-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.28s var(--ease-smooth);
}


.queue-enter-from,
.queue-leave-to {
  opacity: 0;

  transform:
    translateY(22px)
    scale(0.97);
}


/* =========================================================
   DESKTOP HOVER
   ========================================================= */

@media (hover: hover) and (pointer: fine) {

  .glass-button:hover,
  .control-button:hover {
    transform: scale(1.08);

    background: var(--glass-bg-active);

    border-color: rgba(255,255,255,0.15);
  }


  .play-button:hover {
    transform: scale(1.06);
  }


  .mode-button:hover {
    opacity: 0.8;
  }


  .queue-item:hover {
    background: rgba(255,255,255,0.06);
  }

}


/* =========================================================
   ENTRANCE
   ========================================================= */

@keyframes glass-enter {

  from {
    opacity: 0;

    transform:
      translate3d(0, 12px, 0)
      scale(0.975);

    filter: blur(5px);
  }

  to {
    opacity: 1;

    transform:
      translate3d(0, 0, 0)
      scale(1);

    filter: blur(0);
  }

}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;

    scroll-behavior: auto !important;
  }

}


/* =========================================================
   SMALL SCREENS
   ========================================================= */

@media (max-width: 360px) {

  .controls {
    gap: 20px;
  }

  .control-button {
    width: 48px;
    height: 48px;
  }

  .play-button {
    width: 70px;
    height: 70px;
  }

  .song-info h1 {
    font-size: 21px;
  }

}

</style>
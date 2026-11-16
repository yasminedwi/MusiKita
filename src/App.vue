<template>
  <ion-app>
    <!-- =========================
         FLOATING VOLUME
    ========================== -->
    <Transition name="volume-pop">
      <div
        v-if="showVolumeBar"
        class="floating-volume"
      >
        <div class="volume-glow"></div>

        <div class="volume-slider-shell">
          <input
            class="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            aria-label="MusiKita volume"
            @input="handleVolumeInput"
          />
        </div>
      </div>
    </Transition>

    <!-- =========================
         MAIN APP
    ========================== -->
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <!-- =========================
           PLAYLIST EDITOR BAR
      ========================== -->
      <Transition name="editor-bar">
        <div
          v-if="isPlaylistEditing"
          class="playlist-editor-bar"
        >
          <button
            class="editor-button editor-cancel-button"
            type="button"
            @click="handlePlaylistEditorCancel"
          >
            <span>Cancel</span>
          </button>

          <button
            class="editor-button editor-done-button"
            type="button"
            @click="handlePlaylistEditorDone"
          >
            <span>Done</span>
          </button>
        </div>
      </Transition>

      <!-- =========================
           SONG PICKER BAR
      ========================== -->
      <Transition name="editor-bar">
        <div
          v-if="isSongPicking"
          class="playlist-editor-bar"
        >
          <button
            class="editor-button editor-cancel-button"
            type="button"
            @click="handleSongPickerCancel"
          >
            <span>Cancel</span>
          </button>

          <button
            class="editor-button editor-done-button"
            type="button"
            @click="handleSongPickerDone"
          >
            <span>Done</span>
          </button>
        </div>
      </Transition>

      <!-- =========================
           BOTTOM NAVIGATION
      ========================== -->
      <Transition name="nav-bar">
        <ion-tab-bar
          v-if="!isPlaylistEditing && !isSongPicking"
          slot="bottom"
          class="main-tab-bar"
        >
          <ion-tab-button
            tab="home"
            href="/home"
          >
            <ion-icon :icon="homeOutline" />
            <ion-label>Home</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="library"
            href="/library"
          >
            <ion-icon :icon="musicalNotesOutline" />
            <ion-label>Library</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="playlists"
            href="/playlists"
          >
            <ion-icon :icon="albumsOutline" />
            <ion-label>Playlists</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="search"
            href="/search"
          >
            <ion-icon :icon="searchOutline" />
            <ion-label>Search</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="player"
            href="/now-playing"
          >
            <ion-icon :icon="discOutline" />
            <ion-label>Player</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </Transition>
    </ion-tabs>
  </ion-app>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref
} from 'vue'

import {
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/vue'

import {
  homeOutline,
  musicalNotesOutline,
  albumsOutline,
  searchOutline,
  discOutline
} from 'ionicons/icons'

import {
  isPlaying,
  volume,
  setVolume
} from './composables/UsePlayer'

/* =========================
   UI STATE
========================= */

const isPlaylistEditing =
  ref(false)

const isSongPicking =
  ref(false)

/* =========================
   VOLUME
========================= */

const showVolumeBar =
  computed(() =>
    isPlaying.value &&
    !isPlaylistEditing.value &&
    !isSongPicking.value
  )

const handleVolumeInput = (
  event: Event
) => {
  const target =
    event.target as HTMLInputElement

  if (!target) return

  setVolume(
    Number(target.value)
  )
}

/* =========================
   PLAYLIST EDITOR EVENTS
========================= */

const handlePlaylistEditorOpen = () => {
  isPlaylistEditing.value = true
}

const handlePlaylistEditorClose = () => {
  isPlaylistEditing.value = false
}

const handlePlaylistEditorCancel = () => {
  window.dispatchEvent(
    new CustomEvent(
      'playlist-editor-cancel'
    )
  )
}

const handlePlaylistEditorDone = () => {
  window.dispatchEvent(
    new CustomEvent(
      'playlist-editor-done'
    )
  )
}

/* =========================
   SONG PICKER EVENTS
========================= */

const handleSongPickerOpen = () => {
  isSongPicking.value = true
}

const handleSongPickerClose = () => {
  isSongPicking.value = false
}

const handleSongPickerCancel = () => {
  window.dispatchEvent(
    new CustomEvent(
      'song-picker-cancel'
    )
  )
}

const handleSongPickerDone = () => {
  window.dispatchEvent(
    new CustomEvent(
      'song-picker-done'
    )
  )
}

/* =========================
   EVENT LISTENERS
========================= */

onMounted(() => {
  window.addEventListener(
    'playlist-editor-open',
    handlePlaylistEditorOpen
  )

  window.addEventListener(
    'playlist-editor-close',
    handlePlaylistEditorClose
  )

  window.addEventListener(
    'song-picker-open',
    handleSongPickerOpen
  )

  window.addEventListener(
    'song-picker-close',
    handleSongPickerClose
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'playlist-editor-open',
    handlePlaylistEditorOpen
  )

  window.removeEventListener(
    'playlist-editor-close',
    handlePlaylistEditorClose
  )

  window.removeEventListener(
    'song-picker-open',
    handleSongPickerOpen
  )

  window.removeEventListener(
    'song-picker-close',
    handleSongPickerClose
  )
})
</script>

<style>
/* =========================================================
   MUSIKITA — GLOBAL APP SHELL
========================================================= */

:root {
  --mk-glass-ease:
    cubic-bezier(0.22, 1, 0.36, 1);

  --mk-bounce:
    cubic-bezier(0.34, 1.56, 0.64, 1);

  --mk-spring:
    cubic-bezier(0.2, 0.9, 0.25, 1.35);

  --mk-glass-border:
    rgba(255, 255, 255, 0.12);

  --mk-glass-highlight:
    rgba(255, 255, 255, 0.16);

  --mk-glass-shadow:
    0 18px 45px rgba(0, 0, 0, 0.22);

  --mk-text-primary:
    rgba(255, 255, 255, 0.96);

  --mk-text-secondary:
    rgba(255, 255, 255, 0.58);

  --mk-safe-bottom:
    env(safe-area-inset-bottom, 0px);

  --mk-safe-top:
    env(safe-area-inset-top, 0px);
}

/* =========================================================
   APP ROOT
========================================================= */

ion-app {
  background:
    radial-gradient(
      circle at 50% -10%,
      rgba(255, 255, 255, 0.075),
      transparent 34%
    ),
    radial-gradient(
      circle at 100% 100%,
      rgba(120, 150, 255, 0.055),
      transparent 40%
    ),
    #090909;

  color: var(--mk-text-primary);

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  text-rendering: optimizeLegibility;
}

ion-tabs {
  background: transparent;
}

/* =========================================================
   ROUTER OUTLET
========================================================= */

ion-router-outlet {
  background: transparent;
  contain: layout paint;
}

/* =========================================================
   BOTTOM TAB BAR
========================================================= */

.main-tab-bar {
  position: absolute;

  left: clamp(10px, 3vw, 18px);
  right: clamp(10px, 3vw, 18px);

  bottom:
    calc(
      9px +
      var(--mk-safe-bottom)
    );

  width: auto;

  height: clamp(64px, 17vw, 72px);

  padding:
    6px
    6px
    6px;

  border: 1px solid
    rgba(255, 255, 255, 0.11);

  border-radius: 26px;

  overflow: visible;

  isolation: isolate;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.105),
      rgba(255, 255, 255, 0.045) 48%,
      rgba(255, 255, 255, 0.025)
    );

  backdrop-filter:
    blur(28px)
    saturate(180%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(180%);

  box-shadow:
    0 18px 45px
      rgba(0, 0, 0, 0.34),
    0 2px 8px
      rgba(0, 0, 0, 0.16),
    inset 0 1px 0
      rgba(255, 255, 255, 0.10),
    inset 0 -1px 0
      rgba(0, 0, 0, 0.18);

  transform:
    translate3d(0, 0, 0);

  will-change: transform;

  --background: transparent;
  --border: 0;
  --color: rgba(255, 255, 255, 0.52);
}

/* Top glass reflection */

.main-tab-bar::before {
  content: '';

  position: absolute;

  top: 0;
  left: 8%;

  width: 84%;
  height: 1px;

  border-radius: 999px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.28),
      transparent
    );

  opacity: 0.75;

  pointer-events: none;

  z-index: -1;
}

/* Ambient glass bloom */

.main-tab-bar::after {
  content: '';

  position: absolute;

  left: 20%;
  right: 20%;
  bottom: -12px;

  height: 26px;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.045);

  filter: blur(18px);

  pointer-events: none;

  z-index: -2;
}

/* =========================================================
   TAB BUTTON
========================================================= */

.main-tab-bar ion-tab-button {
  position: relative;

  flex: 1;

  min-width: 0;

  height: 100%;

  margin: 0;

  border-radius: 21px;

  background: transparent;

  color:
    rgba(255, 255, 255, 0.48);

  --color:
    rgba(255, 255, 255, 0.48);

  --color-selected:
    rgba(255, 255, 255, 0.98);

  --background: transparent;
  --background-focused: transparent;
  --background-activated: transparent;

  --ripple-color:
    rgba(255, 255, 255, 0.14);

  transition:
    transform 420ms var(--mk-glass-ease),
    color 260ms ease,
    background 320ms var(--mk-glass-ease);

  touch-action: manipulation;

  -webkit-tap-highlight-color:
    transparent;

  user-select: none;

  contain: layout paint;
}

/* Selected glass capsule */

.main-tab-bar ion-tab-button.tab-selected {
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.13),
      rgba(255, 255, 255, 0.055)
    );

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.12),
    inset 0 -1px 0
      rgba(0, 0, 0, 0.10),
    0 5px 18px
      rgba(0, 0, 0, 0.13);

  color:
    rgba(255, 255, 255, 0.98);

  --color:
    rgba(255, 255, 255, 0.98);

  transform:
    translateY(-1px);
}

/* Selected glow */

.main-tab-bar ion-tab-button.tab-selected::before {
  content: '';

  position: absolute;

  inset: 7px;

  border-radius: 17px;

  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(255, 255, 255, 0.10),
      transparent 68%
    );

  opacity: 1;

  pointer-events: none;
}

/* =========================================================
   ICONS
========================================================= */

.main-tab-bar ion-icon {
  position: relative;

  z-index: 2;

  font-size:
    clamp(21px, 5.4vw, 24px);

  margin-bottom: 2px;

  transition:
    transform 520ms var(--mk-bounce),
    filter 350ms ease,
    opacity 250ms ease;

  will-change: transform;
}

.main-tab-bar ion-tab-button.tab-selected ion-icon {
  transform:
    translateY(-1px)
    scale(1.08);

  filter:
    drop-shadow(
      0 4px 9px
      rgba(255, 255, 255, 0.13)
    );
}

/* =========================================================
   LABELS
========================================================= */

.main-tab-bar ion-label {
  position: relative;

  z-index: 2;

  margin-top: 1px;

  font-size:
    clamp(9px, 2.5vw, 11px);

  font-weight: 600;

  letter-spacing: -0.01em;

  opacity: 0.78;

  transition:
    transform 400ms var(--mk-glass-ease),
    opacity 260ms ease;

  white-space: nowrap;
}

.main-tab-bar ion-tab-button.tab-selected ion-label {
  opacity: 1;

  transform:
    translateY(-0.5px);
}

/* =========================================================
   TAB PRESS
========================================================= */

.main-tab-bar ion-tab-button:active {
  transform:
    scale(0.91);
}

.main-tab-bar ion-tab-button.tab-selected:active {
  transform:
    translateY(-1px)
    scale(0.94);
}

/* =========================================================
   EDITOR / PICKER BAR
========================================================= */

.playlist-editor-bar {
  position: absolute;

  left: clamp(10px, 3vw, 18px);
  right: clamp(10px, 3vw, 18px);

  bottom:
    calc(
      9px +
      var(--mk-safe-bottom)
    );

  z-index: 30;

  display: flex;

  align-items: center;

  gap: 8px;

  height: clamp(64px, 17vw, 72px);

  padding: 6px;

  border: 1px solid
    rgba(255, 255, 255, 0.11);

  border-radius: 26px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.11),
      rgba(255, 255, 255, 0.045)
    );

  backdrop-filter:
    blur(28px)
    saturate(180%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(180%);

  box-shadow:
    var(--mk-glass-shadow),
    inset 0 1px 0
      rgba(255, 255, 255, 0.11),
    inset 0 -1px 0
      rgba(0, 0, 0, 0.18);

  transform:
    translate3d(0, 0, 0);

  will-change: transform, opacity;
}

.playlist-editor-bar::before {
  content: '';

  position: absolute;

  top: 0;
  left: 10%;

  width: 80%;
  height: 1px;

  border-radius: 999px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.26),
      transparent
    );

  pointer-events: none;
}

/* =========================================================
   EDITOR BUTTONS
========================================================= */

.editor-button {
  position: relative;

  flex: 1;

  height: 100%;

  border: 0;

  border-radius: 21px;

  background: transparent;

  color:
    rgba(255, 255, 255, 0.76);

  font-family: inherit;

  font-size:
    clamp(13px, 3.6vw, 15px);

  font-weight: 600;

  letter-spacing: -0.01em;

  cursor: pointer;

  transition:
    transform 420ms var(--mk-bounce),
    background 300ms var(--mk-glass-ease),
    color 240ms ease,
    box-shadow 300ms ease;

  -webkit-tap-highlight-color:
    transparent;

  touch-action: manipulation;

  user-select: none;
}

.editor-button::before {
  content: '';

  position: absolute;

  inset: 0;

  border-radius: inherit;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.07),
      rgba(255, 255, 255, 0.025)
    );

  opacity: 0;

  transition:
    opacity 300ms var(--mk-glass-ease);
}

.editor-button span {
  position: relative;
  z-index: 1;
}

.editor-button:active {
  transform:
    scale(0.93);
}

.editor-button:active::before {
  opacity: 1;
}

/* Cancel */

.editor-cancel-button {
  color:
    rgba(255, 255, 255, 0.58);
}

.editor-cancel-button:hover::before {
  opacity: 1;
}

/* Done */

.editor-done-button {
  color:
    rgba(255, 255, 255, 0.96);

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.055)
    );

  box-shadow:
    inset 0 1px 0
      rgba(255, 255, 255, 0.12),
    inset 0 -1px 0
      rgba(0, 0, 0, 0.10);
}

.editor-done-button:hover {
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.07)
    );
}

/* =========================================================
   FLOATING VOLUME
========================================================= */

.floating-volume {
  position: fixed;

  z-index: 100;

  right:
    clamp(8px, 2.5vw, 14px);

  bottom:
    calc(
      var(--mk-safe-bottom) +
      clamp(340px, 46dvh, 440px)
    );

  width:
    clamp(45px, 12vw, 50px);

  height:
    clamp(148px, 37vw, 168px);

  display: flex;

  align-items: center;

  justify-content: center;

  isolation: isolate;

  pointer-events: auto;

  transform:
    translate3d(0, 0, 0);

  will-change: transform, opacity, filter;
}

/* Ambient glow behind volume */

.volume-glow {
  position: absolute;

  inset: 7px;

  border-radius: 25px;

  background:
    rgba(255, 255, 255, 0.035);

  filter: blur(18px);

  z-index: -2;

  pointer-events: none;
}

/* Glass body */

.volume-slider-shell {
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid
    rgba(255, 255, 255, 0.11);

  border-radius: 25px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.115),
      rgba(255, 255, 255, 0.045) 48%,
      rgba(255, 255, 255, 0.025)
    );

  backdrop-filter:
    blur(27px)
    saturate(185%);

  -webkit-backdrop-filter:
    blur(27px)
    saturate(185%);

  box-shadow:
    0 15px 38px
      rgba(0, 0, 0, 0.31),
    inset 0 1px 0
      rgba(255, 255, 255, 0.12),
    inset 0 -1px 0
      rgba(0, 0, 0, 0.17);
}

.volume-slider-shell::before {
  content: '';

  position: absolute;

  top: 0;
  left: 20%;

  width: 60%;
  height: 1px;

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.27);

  pointer-events: none;
}

/* =========================================================
   VOLUME RANGE
========================================================= */

.volume-slider {
  position: absolute;

  width: 124px;
  height: 28px;

  margin: 0;

  appearance: none;

  -webkit-appearance: none;

  background: transparent;

  transform:
    rotate(-90deg);

  cursor: pointer;

  touch-action: none;

  accent-color: white;
}

/* WebKit track */

.volume-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;

  border-radius: 999px;

  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.10),
      rgba(255, 255, 255, 0.17)
    );

  box-shadow:
    inset 0 1px 2px
      rgba(0, 0, 0, 0.16);
}

/* WebKit thumb */

.volume-slider::-webkit-slider-thumb {
  appearance: none;

  -webkit-appearance: none;

  width: 17px;
  height: 17px;

  margin-top: -6px;

  border: 1px solid
    rgba(255, 255, 255, 0.35);

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.96);

  box-shadow:
    0 3px 10px
      rgba(0, 0, 0, 0.30),
    0 0 0 4px
      rgba(255, 255, 255, 0.045);

  transition:
    transform 180ms var(--mk-bounce),
    box-shadow 180ms ease;
}

.volume-slider:active::-webkit-slider-thumb {
  transform:
    scale(1.16);

  box-shadow:
    0 4px 13px
      rgba(0, 0, 0, 0.34),
    0 0 0 6px
      rgba(255, 255, 255, 0.06);
}

/* Firefox */

.volume-slider::-moz-range-track {
  width: 100%;
  height: 5px;

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.14);

  border: 0;
}

.volume-slider::-moz-range-thumb {
  width: 17px;
  height: 17px;

  border: 1px solid
    rgba(255, 255, 255, 0.35);

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.96);

  box-shadow:
    0 3px 10px
      rgba(0, 0, 0, 0.30);
}

/* =========================================================
   VOLUME TRANSITION
========================================================= */

.volume-pop-enter-active,
.volume-pop-leave-active {
  transition:
    opacity 360ms var(--mk-glass-ease),
    transform 500ms var(--mk-bounce),
    filter 360ms ease;
}

.volume-pop-enter-from {
  opacity: 0;

  transform:
    translate3d(22px, 0, 0)
    scale(0.82);

  filter:
    blur(7px);
}

.volume-pop-enter-to {
  opacity: 1;

  transform:
    translate3d(0, 0, 0)
    scale(1);

  filter:
    blur(0);
}

.volume-pop-leave-from {
  opacity: 1;

  transform:
    translate3d(0, 0, 0)
    scale(1);

  filter:
    blur(0);
}

.volume-pop-leave-to {
  opacity: 0;

  transform:
    translate3d(18px, 0, 0)
    scale(0.86);

  filter:
    blur(6px);
}

/* =========================================================
   EDITOR BAR TRANSITION
========================================================= */

.editor-bar-enter-active,
.editor-bar-leave-active {
  transition:
    opacity 320ms var(--mk-glass-ease),
    transform 480ms var(--mk-bounce),
    filter 320ms ease;
}

.editor-bar-enter-from {
  opacity: 0;

  transform:
    translate3d(0, 22px, 0)
    scale(0.94);

  filter:
    blur(7px);
}

.editor-bar-enter-to {
  opacity: 1;

  transform:
    translate3d(0, 0, 0)
    scale(1);

  filter:
    blur(0);
}

.editor-bar-leave-from {
  opacity: 1;

  transform:
    translate3d(0, 0, 0)
    scale(1);

  filter:
    blur(0);
}

.editor-bar-leave-to {
  opacity: 0;

  transform:
    translate3d(0, 18px, 0)
    scale(0.95);

  filter:
    blur(6px);
}

/* =========================================================
   NAV BAR TRANSITION
========================================================= */

.nav-bar-enter-active,
.nav-bar-leave-active {
  transition:
    opacity 300ms ease,
    transform 420ms var(--mk-bounce),
    filter 300ms ease;
}

.nav-bar-enter-from,
.nav-bar-leave-to {
  opacity: 0;

  transform:
    translate3d(0, 22px, 0)
    scale(0.95);

  filter:
    blur(6px);
}

.nav-bar-enter-to,
.nav-bar-leave-from {
  opacity: 1;

  transform:
    translate3d(0, 0, 0)
    scale(1);

  filter:
    blur(0);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (min-width: 700px) {
  .main-tab-bar,
  .playlist-editor-bar {
    left: 50%;
    right: auto;

    width: min(
      560px,
      calc(100vw - 32px)
    );

    transform:
      translateX(-50%);
  }

  .floating-volume {
    right:
      max(
        14px,
        calc(
          (100vw - 560px) / 2 - 64px
        )
      );
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;

    transition-duration:
      0.01ms !important;

    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;
  }
}
</style>
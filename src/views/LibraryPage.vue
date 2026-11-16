<template>
  <ion-page>
    <ion-content>
      <div class="library">

        <!-- Ambient background -->
        <div class="ambient ambient-one"></div>
        <div class="ambient ambient-two"></div>
        <div class="ambient ambient-three"></div>
        <div class="ambient-noise"></div>

        <!-- ============================================================ -->
        <!-- LIBRARY HEADER                                               -->
        <!-- ============================================================ -->

        <div class="library-header glass-surface">
          <div class="header-shine"></div>

          <p class="eyebrow">YOUR COLLECTION</p>

          <h1>Library</h1>

          <p class="subtitle">
            {{ songs.length }}
            {{ songs.length === 1 ? 'song' : 'songs' }}
          </p>
        </div>

        <!-- ============================================================ -->
        <!-- TABS                                                         -->
        <!-- ============================================================ -->

        <div class="library-tabs">

          <ion-button
            :class="{ active: activeTab === 'songs' }"
            fill="clear"
            @click="showTab('songs')"
          >
            Songs
          </ion-button>

          <ion-button
            :class="{ active: activeTab === 'albums' }"
            fill="clear"
            @click="showTab('albums')"
          >
            Albums
          </ion-button>

          <ion-button
            :class="{ active: activeTab === 'artists' }"
            fill="clear"
            @click="showTab('artists')"
          >
            Artists
          </ion-button>

        </div>

        <!-- ============================================================ -->
        <!-- SONGS                                                        -->
        <!-- ============================================================ -->

        <div
          v-if="
            activeTab === 'songs' &&
            songs.length > 0
          "
          class="song-list"
        >

          <div
            v-for="song in songs"
            :key="song.id"
            class="song-item glass-card"
            @click="handlePlay(song)"
          >

            <div class="song-cover">

              <img
                v-if="song.coverUrl"
                :src="song.coverUrl"
                :alt="song.album"
              />

              <ion-icon
                v-else
                :icon="musicalNotesOutline"
              />

              <div class="cover-shine"></div>

            </div>

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

            <div class="play-button">
              <ion-icon
                :icon="playOutline"
              />
            </div>

          </div>

        </div>

        <!-- ============================================================ -->
        <!-- EMPTY SONGS                                                  -->
        <!-- ============================================================ -->

        <div
          v-else-if="
            activeTab === 'songs' &&
            songs.length === 0
          "
          class="empty-state glass-card"
        >

          <div class="empty-icon">
            <ion-icon
              :icon="musicalNotesOutline"
            />
          </div>

          <h2>Your library is empty</h2>

          <p>
            Add music from your PC and your songs
            will appear here.
          </p>

          <ion-button
            class="add-button"
            @click="selectMusic"
          >
            <ion-icon
              slot="start"
              :icon="addOutline"
            />

            Add Music
          </ion-button>

        </div>

        <!-- ============================================================ -->
        <!-- ALBUMS                                                       -->
        <!-- ============================================================ -->

        <div
          v-else-if="
            activeTab === 'albums' &&
            !selectedAlbum
          "
          class="collection-section"
        >

          <div
            v-if="albums.length === 0"
            class="empty-state glass-card"
          >

            <div class="empty-icon">
              <ion-icon
                :icon="albumsOutline"
              />
            </div>

            <h2>No albums yet</h2>

            <p>
              Albums will automatically appear here
              when you add music with album metadata.
            </p>

          </div>

          <div
            v-else
            class="album-grid"
          >

            <div
              v-for="album in albums"
              :key="album.id"
              class="album-card glass-card"
              @click="openAlbum(album)"
            >

              <div class="album-cover-large">

                <img
                  v-if="album.coverUrl"
                  :src="album.coverUrl"
                  :alt="album.name"
                />

                <div
                  v-else
                  class="album-cover-empty"
                >
                  <ion-icon
                    :icon="albumsOutline"
                  />
                </div>

                <div class="image-shine"></div>

                <button
                  class="card-play-button"
                  @click.stop="playAlbum(album)"
                >
                  <ion-icon
                    :icon="playOutline"
                  />
                </button>

              </div>

              <div class="album-card-info">

                <strong>
                  {{ album.name }}
                </strong>

                <span>
                  {{ album.artist }}
                </span>

                <small>
                  {{ album.songs.length }}
                  {{ album.songs.length === 1 ? 'song' : 'songs' }}

                  <template v-if="album.year">
                    · {{ album.year }}
                  </template>
                </small>

              </div>

            </div>

          </div>

        </div>

        <!-- ============================================================ -->
        <!-- ALBUM DETAIL                                                 -->
        <!-- ============================================================ -->

        <div
          v-else-if="
            activeTab === 'albums' &&
            selectedAlbum
          "
          class="detail-section"
        >

          <button
            class="detail-back"
            @click="selectedAlbum = null"
          >
            <ion-icon
              :icon="chevronBackOutline"
            />

            <span>Albums</span>
          </button>

          <div class="detail-card glass-card">

            <div class="detail-top">

              <div class="detail-cover">

                <img
                  v-if="selectedAlbum.coverUrl"
                  :src="selectedAlbum.coverUrl"
                  :alt="selectedAlbum.name"
                />

                <ion-icon
                  v-else
                  :icon="albumsOutline"
                />

              </div>

              <div class="detail-info">

                <p>ALBUM</p>

                <h2>
                  {{ selectedAlbum.name }}
                </h2>

                <span>
                  {{ selectedAlbum.artist }}
                </span>

                <small>
                  {{ selectedAlbum.songs.length }}
                  {{ selectedAlbum.songs.length === 1 ? 'song' : 'songs' }}

                  <template
                    v-if="selectedAlbum.year"
                  >
                    · {{ selectedAlbum.year }}
                  </template>
                </small>

              </div>

            </div>

            <button
              class="detail-play"
              @click="playAlbum(selectedAlbum)"
            >
              <ion-icon
                :icon="playOutline"
              />

              Play Album
            </button>

          </div>

          <div class="detail-song-list">

            <div
              v-for="song in selectedAlbum.songs"
              :key="song.id"
              class="detail-song glass-card"
              @click="handlePlay(
                song,
                selectedAlbum.songs
              )"
            >

              <div class="detail-song-number">
                {{
                  song.trackNumber ||
                  '—'
                }}
              </div>

              <div class="detail-song-cover">

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

              <div class="detail-song-info">

                <strong>
                  {{ song.title }}
                </strong>

                <span>
                  {{ song.artist }}
                </span>

              </div>

              <ion-icon
                class="detail-song-play"
                :icon="playOutline"
              />

            </div>

          </div>

        </div>

        <!-- ============================================================ -->
        <!-- ARTISTS                                                      -->
        <!-- ============================================================ -->

        <div
          v-else-if="
            activeTab === 'artists' &&
            !selectedArtist
          "
          class="collection-section"
        >

          <div
            v-if="artists.length === 0"
            class="empty-state glass-card"
          >

            <div class="empty-icon">
              <ion-icon
                :icon="peopleOutline"
              />
            </div>

            <h2>No artists yet</h2>

            <p>
              Artists will automatically appear here
              when you add music with artist metadata.
            </p>

          </div>

          <div
            v-else
            class="artist-grid"
          >

            <div
              v-for="artist in artists"
              :key="artist.id"
              class="artist-card glass-card"
              @click="openArtist(artist)"
            >

              <div class="artist-cover">

                <img
                  v-if="artist.coverUrl"
                  :src="artist.coverUrl"
                  :alt="artist.name"
                />

                <div
                  v-else
                  class="artist-cover-empty"
                >
                  <ion-icon
                    :icon="peopleOutline"
                  />
                </div>

                <div class="image-shine"></div>

                <button
                  class="card-play-button"
                  @click.stop="playArtist(artist)"
                >
                  <ion-icon
                    :icon="playOutline"
                  />
                </button>

              </div>

              <div class="artist-card-info">

                <strong>
                  {{ artist.name }}
                </strong>

                <span>
                  {{ artist.albums.length }}
                  {{ artist.albums.length === 1 ? 'album' : 'albums' }}
                  ·
                  {{ artist.songs.length }}
                  {{ artist.songs.length === 1 ? 'song' : 'songs' }}
                </span>

              </div>

            </div>

          </div>

        </div>

        <!-- ============================================================ -->
        <!-- ARTIST DETAIL                                                -->
        <!-- ============================================================ -->

        <div
          v-else-if="
            activeTab === 'artists' &&
            selectedArtist
          "
          class="detail-section"
        >

          <button
            class="detail-back"
            @click="selectedArtist = null"
          >
            <ion-icon
              :icon="chevronBackOutline"
            />

            <span>Artists</span>
          </button>

          <div class="detail-card glass-card">

            <div class="detail-top">

              <div class="detail-cover artist-detail-cover">

                <img
                  v-if="selectedArtist.coverUrl"
                  :src="selectedArtist.coverUrl"
                  :alt="selectedArtist.name"
                />

                <ion-icon
                  v-else
                  :icon="peopleOutline"
                />

              </div>

              <div class="detail-info">

                <p>ARTIST</p>

                <h2>
                  {{ selectedArtist.name }}
                </h2>

                <span>
                  {{ selectedArtist.albums.length }}
                  {{ selectedArtist.albums.length === 1 ? 'album' : 'albums' }}
                </span>

                <small>
                  {{ selectedArtist.songs.length }}
                  {{ selectedArtist.songs.length === 1 ? 'song' : 'songs' }}
                </small>

              </div>

            </div>

            <button
              class="detail-play"
              @click="playArtist(selectedArtist)"
            >
              <ion-icon
                :icon="playOutline"
              />

              Play Artist
            </button>

          </div>

          <div class="detail-heading">
            <span>ALBUMS</span>
          </div>

          <div class="artist-album-list">

            <div
              v-for="album in selectedArtist.albums"
              :key="album.id"
              class="artist-album-row glass-card"
              @click="openAlbumFromArtist(album)"
            >

              <div class="artist-album-cover">

                <img
                  v-if="album.coverUrl"
                  :src="album.coverUrl"
                  :alt="album.name"
                />

                <ion-icon
                  v-else
                  :icon="albumsOutline"
                />

              </div>

              <div class="artist-album-info">

                <strong>
                  {{ album.name }}
                </strong>

                <span>
                  {{ album.songs.length }}
                  {{ album.songs.length === 1 ? 'song' : 'songs' }}

                  <template
                    v-if="album.year"
                  >
                    · {{ album.year }}
                  </template>
                </span>

              </div>

              <button
                class="row-play-button"
                @click.stop="playAlbum(album)"
              >
                <ion-icon
                  :icon="playOutline"
                />
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- ============================================================ -->
      <!-- FILE PICKER                                                   -->
      <!-- ============================================================ -->

      <input
        ref="fileInput"
        type="file"
        accept=".mp3,.flac,.wav,.m4a,.aac,.ogg,.opus,audio/*"
        multiple
        hidden
        @change="handleFiles"
      />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref } from 'vue'

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
  musicalNotesOutline,
  addOutline,
  albumsOutline,
  peopleOutline,
  playOutline,
  chevronBackOutline
} from 'ionicons/icons'

import {
  songs,
  albums,
  artists,
  addMusicFiles
} from '../composables/UseMusicLibrary'

import type {
  MusicFile,
  Album,
  Artist
} from '../composables/UseMusicLibrary'

import {
  playSong
} from '../composables/UsePlayer'


type LibraryTab =
  | 'songs'
  | 'albums'
  | 'artists'


const router = useRouter()


const activeTab =
  ref<LibraryTab>('songs')


const selectedAlbum =
  ref<Album | null>(null)


const selectedArtist =
  ref<Artist | null>(null)


const fileInput =
  ref<HTMLInputElement | null>(null)


const showTab = (
  tab: LibraryTab
) => {
  activeTab.value = tab

  selectedAlbum.value = null
  selectedArtist.value = null
}


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

  input.value = ''
}


const handlePlay = async (
  song: MusicFile,
  queue?: MusicFile[]
) => {
  await playSong(
    song,
    queue || songs.value
  )

  await router.push('/now-playing')
}


const openAlbum = (
  album: Album
) => {
  selectedAlbum.value =
    album

  selectedArtist.value =
    null
}


const openAlbumFromArtist = (
  album: Album
) => {
  selectedAlbum.value =
    album

  activeTab.value =
    'albums'

  selectedArtist.value =
    null
}


const playAlbum = async (
  album: Album
) => {
  if (
    album.songs.length === 0
  ) {
    return
  }

  await playSong(
    album.songs[0],
    album.songs
  )

  await router.push('/now-playing')
}


const openArtist = (
  artist: Artist
) => {
  selectedArtist.value =
    artist

  selectedAlbum.value =
    null
}


const playArtist = async (
  artist: Artist
) => {
  if (
    artist.songs.length === 0
  ) {
    return
  }

  await playSong(
    artist.songs[0],
    artist.songs
  )

  await router.push('/now-playing')
}

</script>

<style scoped>

/* ========================================================================== */
/* DESIGN TOKENS                                                             */
/* ========================================================================== */

.library {
  --ease-smooth: var(--mk-glass-ease, cubic-bezier(0.22, 1, 0.36, 1));
  --ease-bounce: var(--mk-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
  --ease-soft: cubic-bezier(0.25, 0.8, 0.25, 1);

  --glass-bg:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.105),
      rgba(255, 255, 255, 0.032)
    );

  --glass-bg-active:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.145),
      rgba(255, 255, 255, 0.055)
    );

  --glass-border:
    rgba(255, 255, 255, 0.105);

  --glass-highlight:
    rgba(255, 255, 255, 0.16);

  --text-primary:
    rgba(255, 255, 255, 0.96);

  --text-secondary:
    rgba(255, 255, 255, 0.62);

  --text-tertiary:
    rgba(255, 255, 255, 0.40);
}


/* ========================================================================== */
/* BASE                                                                      */
/* ========================================================================== */

ion-content {
  --background: #09090b;
  --color: white;
}


.library {
  position: relative;

  min-height: 100%;

  overflow: hidden;

  padding:
    calc(22px + max(var(--mk-safe-top, 0px), env(safe-area-inset-top, 0px), 32px))
    clamp(16px, 5vw, 24px)
    calc(118px + var(--mk-safe-bottom, 0px));

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

  isolation: isolate;

  transform: translateZ(0);

  -webkit-tap-highlight-color: transparent;
}


/* ========================================================================== */
/* AMBIENT                                                                    */
/* ========================================================================== */

.ambient {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(72px);

  z-index: -1;

  will-change: transform;

  transform: translate3d(0, 0, 0);
}


.ambient-one {
  width: 240px;
  height: 240px;

  top: 140px;
  right: -125px;

  background: rgba(140, 100, 255, 0.21);

  opacity: 0.72;

  animation: ambient-drift-one 12s ease-in-out infinite alternate;
}


.ambient-two {
  width: 200px;
  height: 200px;

  top: 600px;
  left: -120px;

  background: rgba(70, 160, 255, 0.16);

  opacity: 0.65;

  animation: ambient-drift-two 15s ease-in-out infinite alternate;
}


.ambient-three {
  width: 150px;
  height: 150px;

  top: 900px;
  right: 10%;

  background: rgba(255, 100, 180, 0.09);

  opacity: 0.55;

  animation: ambient-drift-two 15s ease-in-out infinite alternate;
  animation-delay: -8s;
}


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

  background-size: 4px 4px;

  mix-blend-mode: soft-light;
}


@keyframes ambient-drift-one {

  0% {
    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

  50% {
    transform:
      translate3d(-22px, 20px, 0)
      scale(1.08);
  }

  100% {
    transform:
      translate3d(-8px, 42px, 0)
      scale(0.96);
  }

}


@keyframes ambient-drift-two {

  0% {
    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

  50% {
    transform:
      translate3d(20px, -25px, 0)
      scale(1.07);
  }

  100% {
    transform:
      translate3d(35px, 12px, 0)
      scale(0.94);
  }

}


/* ========================================================================== */
/* COMMON GLASS                                                               */
/* ========================================================================== */

.glass-card,
.glass-surface {
  position: relative;

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
    inset 0 1px 1px
      rgba(255,255,255,0.15),

    inset 0 -1px 1px
      rgba(0,0,0,0.05),

    0 12px 34px
      rgba(0,0,0,0.10);

  transform:
    translate3d(0, 0, 0);

  backface-visibility: hidden;
}


/* subtle glass reflection */

.glass-card::before,
.glass-surface::before {
  content: "";

  position: absolute;

  inset: 0;

  border-radius: inherit;

  pointer-events: none;

  background:
    linear-gradient(
      120deg,
      rgba(255,255,255,0.055),
      transparent 28%,
      transparent 70%,
      rgba(255,255,255,0.018)
    );

  opacity: 0.8;
}


/* ========================================================================== */
/* LIBRARY HEADER                                                             */
/* ========================================================================== */

.library-header {
  z-index: 2;

  margin-top: 8px;

  padding:
    24px
    22px;

  border-radius: 27px;

  overflow: hidden;

  animation:
    glass-enter 0.7s var(--ease-smooth) both;
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


.library-header::after {
  content: "";

  position: absolute;

  inset: 0;

  border-radius: inherit;

  background:
    linear-gradient(
      125deg,
      rgba(255,255,255,0.055),
      transparent 30%,
      transparent 72%,
      rgba(255,255,255,0.025)
    );

  pointer-events: none;
}


.eyebrow {
  position: relative;

  z-index: 2;

  margin:
    0
    0
    8px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 1.8px;

  color:
    rgba(255,255,255,0.55);
}


.library-header h1 {
  position: relative;

  z-index: 2;

  margin: 0;

  font-size:
    clamp(32px, 8vw, 38px);

  line-height: 1.06;

  font-weight: 800;

  letter-spacing: -1.15px;

  color: white;
}


.subtitle {
  position: relative;

  z-index: 2;

  margin:
    10px
    0
    0;

  font-size: 14px;

  color:
    rgba(255,255,255,0.48);
}


/* ========================================================================== */
/* TABS                                                                       */
/* ========================================================================== */

.library-tabs {
  position: relative;

  z-index: 4;

  display: flex;

  gap: 4px;

  margin-top: 15px;

  padding: 4px;

  border-radius: 18px;

  background:
    rgba(255,255,255,0.058);

  border:
    1px solid
    rgba(255,255,255,0.095);

  backdrop-filter:
    blur(25px)
    saturate(180%);

  -webkit-backdrop-filter:
    blur(25px)
    saturate(180%);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.12),

    0 7px 25px
      rgba(0,0,0,0.08);

  animation:
    glass-enter 0.7s 0.06s var(--ease-smooth) both;
}


.library-tabs ion-button {
  flex: 1;

  height: 38px;

  margin: 0;

  --padding-start: 10px;
  --padding-end: 10px;

  --border-radius: 14px;

  --box-shadow: none;

  --color:
    rgba(255,255,255,0.45);

  font-size: 13px;

  font-weight: 600;

  transition:
    transform 0.42s var(--ease-bounce),
    filter 0.3s ease;
}


.library-tabs ion-button::part(native) {
  transition:
    background 0.4s var(--ease-smooth),
    color 0.25s ease,
    box-shadow 0.4s ease;
}


.library-tabs ion-button:active {
  transform:
    scale(0.92);
}


.library-tabs ion-button.active {
  --background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.155),
      rgba(255,255,255,0.075)
    );

  --color: white;

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18),

    0 4px 18px
      rgba(0,0,0,0.09);
}


/* ========================================================================== */
/* SONG LIST                                                                  */
/* ========================================================================== */

.song-list {
  position: relative;

  z-index: 2;

  display: flex;

  flex-direction: column;

  gap: 8px;

  margin-top: 18px;

  animation:
    content-enter 0.55s 0.1s var(--ease-smooth) both;
}


.song-item {
  display: flex;

  align-items: center;

  min-width: 0;

  padding: 9px;

  border-radius: 19px;

  cursor: pointer;

  overflow: hidden;

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.4s ease;

  will-change: transform;

  user-select: none;
}


.song-item::after {
  content: "";

  position: absolute;

  inset: 0;

  border-radius: inherit;

  background:
    linear-gradient(
      120deg,
      rgba(255,255,255,0.075),
      transparent 38%
    );

  opacity: 0;

  transition:
    opacity 0.35s ease;

  pointer-events: none;
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


.song-item:active::after {
  opacity: 1;
}


/* ========================================================================== */
/* SONG COVER                                                                 */
/* ========================================================================== */

.song-cover {
  position: relative;

  width: 58px;
  height: 58px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-right: 13px;

  overflow: hidden;

  border-radius: 14px;

  background:
    rgba(255,255,255,0.065);

  border:
    1px solid
    rgba(255,255,255,0.12);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.16),

    0 5px 15px
      rgba(0,0,0,0.10);
}


.song-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transform:
    scale(1.001);

  transition:
    transform 0.6s var(--ease-smooth);
}


.song-item:active .song-cover img {
  transform:
    scale(1.055);
}


.cover-shine,
.image-shine {
  position: absolute;

  inset: 0;

  pointer-events: none;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.16),
      transparent 35%,
      transparent 70%,
      rgba(255,255,255,0.035)
    );

  mix-blend-mode: screen;

  opacity: 0.8;
}


.song-cover ion-icon {
  font-size: 25px;

  color:
    rgba(255,255,255,0.55);
}


/* ========================================================================== */
/* SONG INFO                                                                  */
/* ========================================================================== */

.song-info {
  min-width: 0;

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 3px;
}


.song-info strong {
  overflow: hidden;

  font-size: 15px;

  font-weight: 650;

  color: white;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.song-info span {
  overflow: hidden;

  font-size: 13px;

  color:
    rgba(255,255,255,0.62);

  text-overflow: ellipsis;

  white-space: nowrap;
}


.song-info small {
  overflow: hidden;

  font-size: 11px;

  color:
    rgba(255,255,255,0.38);

  text-overflow: ellipsis;

  white-space: nowrap;
}


/* ========================================================================== */
/* PLAY BUTTON                                                                */
/* ========================================================================== */

.play-button,
.row-play-button {
  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease,
    box-shadow 0.25s ease;
}


.play-button {
  width: 35px;
  height: 35px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-left: 8px;

  border-radius: 50%;

  background:
    rgba(255,255,255,0.085);

  border:
    1px solid
    rgba(255,255,255,0.11);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15);
}


.song-item:active .play-button {
  transform:
    scale(0.86);

  background:
    rgba(255,255,255,0.15);
}


.play-button ion-icon {
  font-size: 17px;

  color:
    rgba(255,255,255,0.82);
}


/* ========================================================================== */
/* COLLECTION                                                                 */
/* ========================================================================== */

.collection-section {
  position: relative;

  z-index: 2;

  margin-top: 18px;

  animation:
    content-enter 0.55s 0.1s var(--ease-smooth) both;
}


/* ========================================================================== */
/* GRID                                                                       */
/* ========================================================================== */

.album-grid,
.artist-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 13px;
}


.album-card,
.artist-card {
  min-width: 0;

  overflow: hidden;

  border-radius: 21px;

  cursor: pointer;

  transition:
    transform 0.5s var(--ease-bounce),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.4s ease;

  will-change: transform;
}


.album-card:active,
.artist-card:active {
  transform:
    scale(0.965)
    translateY(1px);

  background:
    var(--glass-bg-active);

  border-color:
    rgba(255,255,255,0.15);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18),

    0 7px 18px
      rgba(0,0,0,0.09);
}


/* ========================================================================== */
/* ALBUM COVER                                                                */
/* ========================================================================== */

.album-cover-large {
  position: relative;

  width: 100%;

  aspect-ratio: 1;

  overflow: hidden;
}


.album-cover-large > img,
.album-cover-empty {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


.album-cover-large > img {
  transition:
    transform 0.65s var(--ease-smooth);
}


.album-card:active .album-cover-large > img {
  transform:
    scale(1.045);
}


.album-cover-empty {
  display: flex;

  align-items: center;

  justify-content: center;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.04)
    );
}


.album-cover-empty ion-icon {
  font-size: 48px;

  color:
    rgba(255,255,255,0.35);
}


/* ========================================================================== */
/* ARTIST COVER                                                               */
/* ========================================================================== */

.artist-cover {
  position: relative;

  width: 100%;

  aspect-ratio: 1;

  overflow: hidden;
}


.artist-cover > img,
.artist-cover-empty {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


.artist-cover > img {
  transition:
    transform 0.65s var(--ease-smooth);
}


.artist-card:active .artist-cover > img {
  transform:
    scale(1.045);
}


.artist-cover-empty {
  display: flex;

  align-items: center;

  justify-content: center;

  background:
    radial-gradient(
      circle at 35% 25%,
      rgba(140,100,255,0.28),
      transparent 55%
    ),

    linear-gradient(
      145deg,
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.035)
    );
}


.artist-cover-empty ion-icon {
  font-size: 50px;

  color:
    rgba(255,255,255,0.35);
}


/* ========================================================================== */
/* CARD PLAY                                                                  */
/* ========================================================================== */

.card-play-button {
  position: absolute;

  right: 9px;
  bottom: 9px;

  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  border:
    1px solid
    rgba(255,255,255,0.18);

  border-radius: 50%;

  color: #111;

  background:
    rgba(255,255,255,0.88);

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);

  box-shadow:
    0 8px 20px
      rgba(0,0,0,0.22),

    inset 0 1px 1px
      rgba(255,255,255,0.55);

  cursor: pointer;

  transition:
    transform 0.44s var(--ease-bounce),
    background 0.25s ease,
    box-shadow 0.25s ease;
}


.card-play-button:active {
  transform:
    scale(0.80);

  background:
    rgba(255,255,255,0.72);

  box-shadow:
    0 4px 10px
      rgba(0,0,0,0.18);
}


.card-play-button ion-icon {
  font-size: 17px;
}


/* ========================================================================== */
/* CARD INFO                                                                  */
/* ========================================================================== */

.album-card-info,
.artist-card-info {
  min-width: 0;

  padding:
    12px
    12px
    14px;
}


.album-card-info strong,
.artist-card-info strong {
  display: block;

  overflow: hidden;

  font-size: 14px;

  font-weight: 650;

  color: white;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.album-card-info span,
.artist-card-info span {
  display: block;

  overflow: hidden;

  margin-top: 4px;

  font-size: 11px;

  color:
    rgba(255,255,255,0.52);

  text-overflow: ellipsis;

  white-space: nowrap;
}


.album-card-info small {
  display: block;

  margin-top: 4px;

  font-size: 10px;

  color:
    rgba(255,255,255,0.34);
}


/* ========================================================================== */
/* DETAIL SECTION                                                             */
/* ========================================================================== */

.detail-section {
  position: relative;

  z-index: 2;

  margin-top: 18px;

  animation:
    detail-in 0.48s var(--ease-smooth) both;
}


@keyframes detail-in {

  from {
    opacity: 0;

    transform:
      translate3d(0, 12px, 0)
      scale(0.985);
  }

  to {
    opacity: 1;

    transform:
      translate3d(0, 0, 0)
      scale(1);
  }

}


/* ========================================================================== */
/* DETAIL BACK                                                                */
/* ========================================================================== */

.detail-back {
  display: flex;

  align-items: center;

  gap: 4px;

  padding: 6px 5px;

  margin-bottom: 12px;

  border: none;

  color:
    rgba(255,255,255,0.65);

  background: transparent;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.42s var(--ease-bounce),
    color 0.2s ease;
}


.detail-back:active {
  transform:
    translateX(-4px)
    scale(0.95);

  color: white;
}


.detail-back ion-icon {
  font-size: 18px;
}


/* ========================================================================== */
/* DETAIL CARD                                                                */
/* ========================================================================== */

.detail-card {
  padding: 15px;

  border-radius: 23px;

  overflow: hidden;
}


.detail-top {
  display: flex;

  align-items: center;

  gap: 14px;
}


.detail-cover {
  width: 92px;
  height: 92px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 17px;

  background:
    rgba(255,255,255,0.07);

  border:
    1px solid
    rgba(255,255,255,0.12);

  box-shadow:
    0 10px 25px
      rgba(0,0,0,0.18);

  transform:
    translateZ(0);
}


.detail-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.7s var(--ease-smooth);
}


.detail-card:active .detail-cover img {
  transform:
    scale(1.035);
}


.detail-cover ion-icon {
  font-size: 38px;

  color:
    rgba(255,255,255,0.35);
}


.artist-detail-cover {
  border-radius: 50%;
}


.detail-info {
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 4px;
}


.detail-info p {
  margin: 0;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.5px;

  color:
    rgba(255,255,255,0.42);
}


.detail-info h2 {
  margin: 0;

  overflow: hidden;

  font-size: 20px;

  font-weight: 750;

  color: white;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.detail-info span {
  overflow: hidden;

  font-size: 13px;

  color:
    rgba(255,255,255,0.58);

  text-overflow: ellipsis;

  white-space: nowrap;
}


.detail-info small {
  font-size: 11px;

  color:
    rgba(255,255,255,0.36);
}


/* ========================================================================== */
/* DETAIL PLAY                                                                */
/* ========================================================================== */

.detail-play {
  width: 100%;

  height: 44px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  margin-top: 15px;

  padding: 0;

  border:
    1px solid
    rgba(255,255,255,0.14);

  border-radius: 14px;

  color: white;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.14),
      rgba(255,255,255,0.065)
    );

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15),

    0 7px 18px
      rgba(0,0,0,0.07);

  font-size: 13px;

  font-weight: 650;

  cursor: pointer;

  transition:
    transform 0.44s var(--ease-bounce),
    background 0.25s ease,
    box-shadow 0.3s ease;
}


.detail-play:active {
  transform:
    scale(0.975);

  background:
    rgba(255,255,255,0.18);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18);
}


.detail-play ion-icon {
  font-size: 18px;

  transition:
    transform 0.4s var(--ease-bounce);
}


.detail-play:active ion-icon {
  transform:
    scale(0.82);
}


/* ========================================================================== */
/* DETAIL SONGS                                                               */
/* ========================================================================== */

.detail-song-list {
  display: flex;

  flex-direction: column;

  gap: 7px;

  margin-top: 14px;
}


.detail-song {
  display: flex;

  align-items: center;

  gap: 10px;

  min-width: 0;

  padding: 8px;

  border-radius: 16px;

  cursor: pointer;

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease,
    border-color 0.25s ease;
}


.detail-song:active {
  transform:
    scale(0.975);

  background:
    rgba(255,255,255,0.11);

  border-color:
    rgba(255,255,255,0.14);
}


.detail-song-number {
  width: 18px;

  flex-shrink: 0;

  text-align: center;

  font-size: 10px;

  color:
    rgba(255,255,255,0.30);
}


.detail-song-cover {
  width: 45px;
  height: 45px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 10px;

  background:
    rgba(255,255,255,0.06);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.08);
}


.detail-song-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.5s var(--ease-smooth);
}


.detail-song:active .detail-song-cover img {
  transform:
    scale(1.06);
}


.detail-song-cover ion-icon {
  font-size: 20px;

  opacity: 0.35;
}


.detail-song-info {
  min-width: 0;

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 3px;
}


.detail-song-info strong {
  overflow: hidden;

  font-size: 13px;

  color: white;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.detail-song-info span {
  overflow: hidden;

  font-size: 10px;

  color:
    rgba(255,255,255,0.42);

  text-overflow: ellipsis;

  white-space: nowrap;
}


.detail-song-play {
  margin-right: 5px;

  font-size: 17px;

  color:
    rgba(255,255,255,0.48);

  transition:
    transform 0.42s var(--ease-bounce),
    color 0.2s ease;
}


.detail-song:active .detail-song-play {
  transform:
    scale(0.80);

  color: white;
}


/* ========================================================================== */
/* ARTIST ALBUMS                                                              */
/* ========================================================================== */

.detail-heading {
  margin:
    22px
    2px
    10px;
}


.detail-heading span {
  font-size: 10px;

  font-weight: 750;

  letter-spacing: 1.5px;

  color:
    rgba(255,255,255,0.42);
}


.artist-album-list {
  display: flex;

  flex-direction: column;

  gap: 8px;
}


.artist-album-row {
  display: flex;

  align-items: center;

  gap: 11px;

  padding: 8px;

  border-radius: 17px;

  cursor: pointer;

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease,
    border-color 0.25s ease;
}


.artist-album-row:active {
  transform:
    scale(0.975);

  background:
    rgba(255,255,255,0.11);

  border-color:
    rgba(255,255,255,0.14);
}


.artist-album-cover {
  width: 52px;
  height: 52px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 11px;

  background:
    rgba(255,255,255,0.07);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.10);
}


.artist-album-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.55s var(--ease-smooth);
}


.artist-album-row:active .artist-album-cover img {
  transform:
    scale(1.06);
}


.artist-album-cover ion-icon {
  font-size: 23px;

  opacity: 0.35;
}


.artist-album-info {
  min-width: 0;

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 4px;
}


.artist-album-info strong {
  overflow: hidden;

  font-size: 13px;

  color: white;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.artist-album-info span {
  font-size: 10px;

  color:
    rgba(255,255,255,0.40);
}


.row-play-button {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  border-radius: 50%;

  border:
    1px solid
    rgba(255,255,255,0.10);

  color:
    rgba(255,255,255,0.75);

  background:
    rgba(255,255,255,0.07);

  cursor: pointer;
}


.row-play-button:active {
  transform:
    scale(0.80);

  background:
    rgba(255,255,255,0.15);
}


.row-play-button ion-icon {
  font-size: 16px;
}


/* ========================================================================== */
/* EMPTY STATE                                                                */
/* ========================================================================== */

.empty-state {
  position: relative;

  z-index: 2;

  display: flex;

  flex-direction: column;

  align-items: center;

  margin-top: 18px;

  padding:
    45px
    22px;

  text-align: center;

  border-radius: 24px;

  overflow: hidden;

  animation:
    content-enter 0.55s 0.08s var(--ease-smooth) both;
}


.empty-state::before {
  content: "";

  position: absolute;

  width: 190px;
  height: 190px;

  top: -115px;
  left: 50%;

  transform:
    translateX(-50%);

  border-radius: 50%;

  background:
    rgba(140,100,255,0.10);

  filter: blur(35px);

  pointer-events: none;
}


.empty-icon {
  position: relative;

  width: 64px;
  height: 64px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 18px;

  border-radius: 20px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.15),
      rgba(255,255,255,0.05)
    );

  border:
    1px solid
    rgba(255,255,255,0.12);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18),

    0 8px 20px
      rgba(0,0,0,0.08);

  animation:
    empty-float 4s ease-in-out infinite;
}


@keyframes empty-float {

  0%,
  100% {
    transform:
      translate3d(0, 0, 0);
  }

  50% {
    transform:
      translate3d(0, -4px, 0);
  }

}


.empty-icon ion-icon {
  font-size: 29px;

  color:
    rgba(255,255,255,0.58);
}


.empty-state h2 {
  position: relative;

  margin:
    0
    0
    8px;

  font-size: 20px;

  font-weight: 700;

  color: white;
}


.empty-state p {
  position: relative;

  max-width: 280px;

  margin:
    0
    auto
    22px;

  font-size: 14px;

  line-height: 1.5;

  color:
    rgba(255,255,255,0.48);
}


.add-button {
  position: relative;

  height: 44px;

  margin: 0;

  --background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.16),
      rgba(255,255,255,0.07)
    );

  --background-hover: rgba(255, 255, 255, 0.14);
  --background-activated: rgba(255, 255, 255, 0.17);

  --color: white;

  --border-radius: 15px;

  --box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18),

    0 8px 20px
      rgba(0,0,0,0.10);

  font-size: 13px;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 15px;

  backdrop-filter: blur(24px) saturate(175%);
  -webkit-backdrop-filter: blur(24px) saturate(175%);

  overflow: hidden;

  transition:
    transform 0.44s var(--ease-bounce),
    filter 0.25s ease;
}


.add-button:active {
  transform:
    scale(0.94);
}


.add-button::after {
  content: '';

  position: absolute;

  top: 0;
  left: 12%;

  width: 76%;
  height: 1px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.25);

  pointer-events: none;
}


/* ========================================================================== */
/* DESKTOP HOVER                                                              */
/* ========================================================================== */

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


  .song-item:hover::after {
    opacity: 1;
  }


  .song-item:hover .song-cover img {
    transform:
      scale(1.035);
  }


  .song-item:hover .play-button {
    transform:
      scale(1.08);

    background:
      rgba(255,255,255,0.14);

    box-shadow:
      0 5px 14px
        rgba(0,0,0,0.10);
  }


  .album-card:hover,
  .artist-card:hover {
    transform:
      translateY(-4px);

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

      0 18px 38px
        rgba(0,0,0,0.15);
  }


  .album-card:hover .album-cover-large > img,
  .artist-card:hover .artist-cover > img {
    transform:
      scale(1.035);
  }


  .card-play-button:hover {
    transform:
      scale(1.10);

    background:
      rgba(255,255,255,0.96);

    box-shadow:
      0 10px 24px
        rgba(0,0,0,0.28),

      inset 0 1px 1px
        rgba(255,255,255,0.65);
  }


  .detail-back:hover {
    color: white;

    transform:
      translateX(-2px);
  }


  .detail-play:hover {
    background:
      linear-gradient(
        145deg,
        rgba(255,255,255,0.18),
        rgba(255,255,255,0.075)
      );

    box-shadow:
      inset 0 1px 1px
        rgba(255,255,255,0.20),

      0 10px 25px
        rgba(0,0,0,0.12);
  }


  .detail-song:hover {
    transform:
      translateY(-1px);

    background:
      rgba(255,255,255,0.075);

    border-color:
      rgba(255,255,255,0.13);
  }


  .detail-song:hover .detail-song-play {
    color: white;

    transform:
      scale(1.08);
  }


  .artist-album-row:hover {
    transform:
      translateY(-1px);

    background:
      rgba(255,255,255,0.075);

    border-color:
      rgba(255,255,255,0.13);
  }


  .artist-album-row:hover .row-play-button {
    transform:
      scale(1.08);

    background:
      rgba(255,255,255,0.12);
  }


  .add-button:hover {
    filter:
      brightness(1.12);

    transform:
      translateY(-2px)
      scale(1.015);
  }

}


/* ========================================================================== */
/* ENTRANCE ANIMATIONS                                                        */
/* ========================================================================== */

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


/* Staggered item entrance (backwards fill keeps :active press scale working) */

.song-item,
.album-card,
.artist-card {
  animation: item-in 520ms var(--ease-smooth) backwards;
}

.song-item:nth-child(2),
.album-card:nth-child(2),
.artist-card:nth-child(2) { animation-delay: 35ms; }

.song-item:nth-child(3),
.album-card:nth-child(3),
.artist-card:nth-child(3) { animation-delay: 70ms; }

.song-item:nth-child(4),
.album-card:nth-child(4),
.artist-card:nth-child(4) { animation-delay: 105ms; }

@keyframes item-in {
  from {
    opacity: 0;
    transform: translate3d(0, 8px, 0) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}


/* ========================================================================== */
/* RESPONSIVE                                                                 */
/* ========================================================================== */

@media (min-width: 600px) {

  .library {
    padding-left: 28px;
    padding-right: 28px;
  }


  .album-grid,
  .artist-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}


@media (min-width: 900px) {

  .library {
    max-width: 900px;

    margin:
      0
      auto;
  }


  .album-grid,
  .artist-grid {
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
  }

}


/* ========================================================================== */
/* REDUCED MOTION                                                             */
/* ========================================================================== */

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

</style>
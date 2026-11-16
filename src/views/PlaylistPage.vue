<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="playlist-page">

        <!-- AMBIENT -->
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
              {{ selectedPlaylist ? 'PLAYLIST' : 'YOUR COLLECTION' }}
            </span>

            <h1>
              {{ selectedPlaylist ? selectedPlaylist.name : 'Playlists' }}
            </h1>

            <p v-if="!selectedPlaylist">
              Your personal collections.
            </p>

            <p v-else>
              {{ playlistSongs.length }}
              {{ playlistSongs.length === 1 ? 'song' : 'songs' }}
            </p>
          </div>

          <button
            v-if="!selectedPlaylist"
            class="header-button glass-button"
            @click="openCreateModal"
          >
            <ion-icon :icon="addOutline" />
          </button>

          <button
            v-else
            class="header-button glass-button"
            @click="openEditModal"
          >
            <ion-icon :icon="createOutline" />
          </button>
        </div>


        <!-- =====================================================
             PLAYLIST LIST
             ===================================================== -->

        <div
          v-if="selectedPlaylist === null"
          class="playlist-list"
        >

          <!-- EMPTY -->
          <div
            v-if="playlists.length === 0"
            class="empty-state"
          >
            <div class="empty-orb">
              <div class="empty-icon">
                <ion-icon :icon="musicalNotesOutline" />
              </div>
            </div>

            <span class="empty-eyebrow">
              START SOMETHING NEW
            </span>

            <h2>
              No playlists yet
            </h2>

            <p>
              Create a playlist and start
              building your collection.
            </p>

            <button
              class="primary-button"
              @click="openCreateModal"
            >
              <ion-icon :icon="addOutline" />
              <span>Create Playlist</span>
            </button>
          </div>


          <!-- PLAYLISTS -->
          <div
            v-else
            class="playlists"
          >

            <div
              v-for="playlist in playlists"
              :key="playlist.id"
              class="playlist-item"
              @click="openPlaylist(playlist)"
            >

              <div class="playlist-cover-wrap">

                <div class="playlist-cover">
                  <img
                    v-if="playlist.coverUrl"
                    :src="playlist.coverUrl"
                    :alt="playlist.name"
                  />

                  <ion-icon
                    v-else
                    :icon="musicalNotesOutline"
                  />
                </div>

              </div>

              <div class="playlist-info">
                <strong>
                  {{ playlist.name }}
                </strong>

                <span>
                  {{ playlist.songIds.length }}
                  {{ playlist.songIds.length === 1 ? 'song' : 'songs' }}
                </span>

                <small v-if="playlist.description">
                  {{ playlist.description }}
                </small>
              </div>

              <button
                class="playlist-more glass-circle"
                @click.stop="openEditModalFor(playlist)"
              >
                <ion-icon :icon="ellipsisHorizontalOutline" />
              </button>

              <div class="arrow-button">
                <ion-icon :icon="chevronForwardOutline" />
              </div>

            </div>

          </div>

        </div>


        <!-- =====================================================
             PLAYLIST DETAIL
             ===================================================== -->

        <div
          v-else
          class="playlist-detail"
        >

          <!-- BACK -->
          <button
            class="back-button"
            @click="closePlaylist"
          >
            <span class="back-icon">
              <ion-icon :icon="arrowBackOutline" />
            </span>

            <span>Playlists</span>
          </button>


          <!-- DETAIL CARD -->
          <div class="detail-card">

            <div class="detail-cover">
              <img
                v-if="selectedPlaylist.coverUrl"
                :src="selectedPlaylist.coverUrl"
                :alt="selectedPlaylist.name"
              />

              <ion-icon
                v-else
                :icon="musicalNotesOutline"
              />

              <div class="cover-shine"></div>
            </div>

            <div class="detail-info">

              <h2>
                {{ selectedPlaylist.name }}
              </h2>

              <span>
                {{ playlistSongs.length }}
                {{ playlistSongs.length === 1 ? 'song' : 'songs' }}
              </span>

              <p
                v-if="selectedPlaylist.description"
              >
                {{ selectedPlaylist.description }}
              </p>

            </div>

            <button
              class="edit-detail-button glass-circle"
              @click="openEditModal"
            >
              <ion-icon :icon="createOutline" />
            </button>

          </div>


          <!-- ACTIONS -->
          <div class="playlist-actions">

            <button
              class="play-all-button action-button"
              :disabled="playlistSongs.length === 0"
              @click="playFirstSong"
            >
              <span class="action-icon">
                <ion-icon :icon="playOutline" />
              </span>

              <span>Play</span>
            </button>

            <button
              class="add-songs-button action-button"
              @click="openSongPicker"
            >
              <span class="action-icon">
                <ion-icon :icon="addOutline" />
              </span>

              <span>Add Songs</span>
            </button>

          </div>


          <!-- EMPTY PLAYLIST -->
          <div
            v-if="playlistSongs.length === 0"
            class="empty-state detail-empty"
          >
            <div class="empty-orb">
              <div class="empty-icon">
                <ion-icon :icon="musicalNotesOutline" />
              </div>
            </div>

            <span class="empty-eyebrow">
              NOTHING HERE YET
            </span>

            <h2>
              Playlist is empty
            </h2>

            <p>
              Add songs from your library.
            </p>

            <button
              class="primary-button"
              @click="openSongPicker"
            >
              <ion-icon :icon="addOutline" />
              <span>Add Songs</span>
            </button>
          </div>


          <!-- SONGS -->
          <div
            v-else
            class="song-list"
          >

            <div
              v-for="(song, index) in playlistSongs"
              :key="song.id"
              class="song-item"
              @click="playSongItem(song)"
            >

              <span class="song-index">
                {{ String(index + 1).padStart(2, '0') }}
              </span>

              <div class="song-cover">

                <img
                  v-if="song.coverUrl"
                  :src="song.coverUrl"
                  :alt="song.title"
                />

                <ion-icon
                  v-else
                  :icon="musicalNotesOutline"
                />

                <div class="song-cover-shine"></div>

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

              <button
                class="remove-button glass-circle"
                @click.stop="removePlaylistSong(song.id)"
              >
                <ion-icon :icon="trashOutline" />
              </button>

            </div>

          </div>

        </div>


        <!-- =====================================================
             CREATE / EDIT PLAYLIST MODAL
             ===================================================== -->

        <Transition name="sheet">
          <div
            v-if="showPlaylistEditor"
            class="modal-backdrop"
            @click.self="closePlaylistEditor"
          >

            <div class="glass-modal">

              <div class="sheet-handle"></div>

              <div class="modal-top">

                <div>
                  <span class="modal-eyebrow">
                    {{ editingPlaylist ? 'EDIT PLAYLIST' : 'NEW PLAYLIST' }}
                  </span>

                  <h2>
                    {{ editingPlaylist ? 'Edit Playlist' : 'Create Playlist' }}
                  </h2>
                </div>

                <button
                  class="modal-close glass-circle"
                  @click="closePlaylistEditor"
                >
                  <ion-icon :icon="closeOutline" />
                </button>

              </div>


              <!-- COVER -->
              <div class="cover-editor">

                <div class="cover-preview">

                  <img
                    v-if="editorCover"
                    :src="editorCover"
                    alt="Playlist cover"
                  />

                  <ion-icon
                    v-else
                    :icon="musicalNotesOutline"
                  />

                  <div class="preview-shine"></div>

                </div>

                <div class="cover-actions">

                  <strong>
                    Playlist Cover
                  </strong>

                  <span>
                    Add a custom cover for this playlist.
                  </span>

                  <div class="cover-buttons">

                    <button
                      class="secondary-button"
                      @click="coverInput?.click()"
                    >
                      <ion-icon :icon="imageOutline" />

                      {{
                        editorCover
                          ? 'Change Cover'
                          : 'Add Cover'
                      }}
                    </button>

                    <button
                      v-if="editorCover"
                      class="remove-cover-button"
                      @click="removeEditorCover"
                    >
                      Remove
                    </button>

                  </div>

                </div>

                <input
                  ref="coverInput"
                  class="hidden-input"
                  type="file"
                  accept="image/*"
                  @change="handleCoverChange"
                />

              </div>


              <!-- NAME -->
              <div class="field">

                <label>
                  Playlist Name
                </label>

                <input
                  v-model="editorName"
                  type="text"
                  maxlength="80"
                  placeholder="My Playlist"
                  @keydown.enter="savePlaylist"
                />

              </div>


              <!-- DESCRIPTION -->
              <div class="field">

                <label>
                  Description
                </label>

                <textarea
                  v-model="editorDescription"
                  maxlength="240"
                  rows="4"
                  placeholder="What's this playlist for?"
                ></textarea>

                <div class="character-count">
                  {{ editorDescription.length }}/240
                </div>

              </div>

            </div>

          </div>
        </Transition>


        <!-- =====================================================
             SONG PICKER
             ===================================================== -->

        <Transition name="sheet">
          <div
            v-if="showSongPicker"
            class="modal-backdrop"
            @click.self="closeSongPicker"
          >

            <div class="glass-modal song-picker-modal">

              <div class="sheet-handle"></div>

              <div class="modal-top">

                <div>
                  <span class="modal-eyebrow">
                    ADD MUSIC
                  </span>

                  <h2>
                    Add Songs
                  </h2>
                </div>

                <button
                  class="modal-close glass-circle"
                  @click="closeSongPicker"
                >
                  <ion-icon :icon="closeOutline" />
                </button>

              </div>


              <div class="picker-selection">

                <span>
                  <strong>{{ selectedSongIds.length }}</strong>
                  selected
                </span>

                <button
                  @click="toggleSelectAll"
                >
                  {{
                    selectedSongIds.length === availableSongs.length
                      ? 'Deselect All'
                      : 'Select All'
                  }}
                </button>

              </div>


              <div
                v-if="availableSongs.length === 0"
                class="picker-empty"
              >
                <div class="picker-empty-icon">
                  <ion-icon :icon="checkmarkCircleOutline" />
                </div>

                <strong>
                  All songs added
                </strong>

                <span>
                  Every song in your library is already in this playlist.
                </span>
              </div>


              <div
                v-else
                class="picker-list"
              >

                <div
                  v-for="song in availableSongs"
                  :key="song.id"
                  class="picker-item"
                  :class="{
                    selected: selectedSongIds.includes(song.id)
                  }"
                  @click="toggleSongSelection(song.id)"
                >

                  <div class="picker-cover">

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

                  <div class="picker-info">

                    <strong>
                      {{ song.title }}
                    </strong>

                    <span>
                      {{ song.artist }}
                    </span>

                  </div>

                  <div
                    class="check-circle"
                    :class="{
                      checked: selectedSongIds.includes(song.id)
                    }"
                  >
                    <ion-icon
                      v-if="selectedSongIds.includes(song.id)"
                      :icon="checkmarkOutline"
                    />
                  </div>

                </div>

              </div>

            </div>

          </div>
        </Transition>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  computed,
  ref,
  onMounted,
  onUnmounted
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  IonPage,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  addOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  chevronForwardOutline,
  closeOutline,
  createOutline,
  ellipsisHorizontalOutline,
  imageOutline,
  musicalNotesOutline,
  playOutline,
  trashOutline
} from 'ionicons/icons'

import {
  songs,
  playlists,
  createPlaylist,
  updatePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylistSongs
} from '../composables/UseMusicLibrary'

import type {
  Playlist,
  MusicFile
} from '../composables/UseMusicLibrary'

import {
  playSong
} from '../composables/UsePlayer'


const router = useRouter()


/* =========================================================
   PLAYLIST DETAIL
   ========================================================= */

const selectedPlaylist =
  ref<Playlist | null>(null)


/* =========================================================
   PLAYLIST EDITOR
   ========================================================= */

const showPlaylistEditor =
  ref(false)

const editingPlaylist =
  ref<Playlist | null>(null)

const editorName =
  ref('')

const editorDescription =
  ref('')

const editorCover =
  ref<string | null>(null)

const coverInput =
  ref<HTMLInputElement | null>(null)


/* =========================================================
   SONG PICKER
   ========================================================= */

const showSongPicker =
  ref(false)

const selectedSongIds =
  ref<string[]>([])


/* =========================================================
   COMPUTED
   ========================================================= */

const playlistSongs =
  computed<MusicFile[]>(() => {

    if (!selectedPlaylist.value) {
      return []
    }

    return getPlaylistSongs(
      selectedPlaylist.value
    )

  })


const availableSongs =
  computed<MusicFile[]>(() => {

    if (!selectedPlaylist.value) {
      return songs.value
    }

    return songs.value.filter(
      song =>
        !selectedPlaylist.value!.songIds.includes(
          song.id
        )
    )

  })


/* =========================================================
   CREATE PLAYLIST
   ========================================================= */

const openCreateModal = () => {

  editingPlaylist.value = null

  editorName.value = ''
  editorDescription.value = ''
  editorCover.value = null

  showPlaylistEditor.value = true

  window.dispatchEvent(
    new CustomEvent(
      'playlist-editor-open'
    )
  )

}


/* =========================================================
   EDIT PLAYLIST
   ========================================================= */

const openEditModal = () => {

  if (!selectedPlaylist.value) {
    return
  }

  openEditModalFor(
    selectedPlaylist.value
  )

}


const openEditModalFor = (
  playlist: Playlist
) => {

  editingPlaylist.value =
    playlist

  editorName.value =
    playlist.name

  editorDescription.value =
    playlist.description || ''

  editorCover.value =
    playlist.coverUrl

  showPlaylistEditor.value =
    true

  window.dispatchEvent(
    new CustomEvent(
      'playlist-editor-open'
    )
  )

}


/* =========================================================
   PLAYLIST EDITOR TASKBAR EVENTS
   ========================================================= */

const handlePlaylistEditorCancel = () => {

  if (!showPlaylistEditor.value) {
    return
  }

  closePlaylistEditor()

}


const handlePlaylistEditorDone = () => {

  if (!showPlaylistEditor.value) {
    return
  }

  savePlaylist()

}


/* =========================================================
   COVER
   ========================================================= */

const handleCoverChange = (
  event: Event
) => {

  const input =
    event.target as HTMLInputElement

  const file =
    input.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    return
  }

  if (editorCover.value) {
    URL.revokeObjectURL(
      editorCover.value
    )
  }

  editorCover.value =
    URL.createObjectURL(file)

  input.value = ''

}


const removeEditorCover = () => {

  if (editorCover.value) {
    URL.revokeObjectURL(
      editorCover.value
    )
  }

  editorCover.value = null

}


/* =========================================================
   SAVE PLAYLIST
   ========================================================= */

const savePlaylist = () => {

  const name =
    editorName.value.trim()

  if (!name) {
    return
  }


  if (editingPlaylist.value) {

    const updated =
      updatePlaylist(
        editingPlaylist.value.id,
        {
          name,
          description:
            editorDescription.value,
          coverUrl:
            editorCover.value
        }
      )

    if (updated) {

      if (
        selectedPlaylist.value?.id ===
        updated.id
      ) {
        selectedPlaylist.value =
          updated
      }

    }

  } else {

    const playlist =
      createPlaylist(
        name,
        editorDescription.value,
        editorCover.value
      )

    openPlaylist(
      playlist
    )

  }


  showPlaylistEditor.value =
    false

  editingPlaylist.value =
    null

  editorName.value = ''
  editorDescription.value = ''


  window.dispatchEvent(
    new CustomEvent(
      'playlist-editor-close'
    )
  )

}


/* =========================================================
   CLOSE PLAYLIST EDITOR
   ========================================================= */

const closePlaylistEditor = () => {

  if (editorCover.value) {
    URL.revokeObjectURL(
      editorCover.value
    )
  }

  showPlaylistEditor.value =
    false

  editingPlaylist.value =
    null

  editorName.value = ''
  editorDescription.value = ''
  editorCover.value = null

  window.dispatchEvent(
    new CustomEvent(
      'playlist-editor-close'
    )
  )

}


/* =========================================================
   OPEN / CLOSE PLAYLIST
   ========================================================= */

const openPlaylist = (
  playlist: Playlist
) => {

  selectedPlaylist.value =
    playlist

}


const closePlaylist = () => {

  selectedPlaylist.value =
    null

  showSongPicker.value =
    false

  selectedSongIds.value =
    []

}


/* =========================================================
   SONG PICKER
   ========================================================= */

const openSongPicker = () => {

  selectedSongIds.value = []

  showSongPicker.value = true

  window.dispatchEvent(
    new CustomEvent(
      'song-picker-open'
    )
  )

}


const closeSongPicker = () => {

  selectedSongIds.value = []

  showSongPicker.value = false

  window.dispatchEvent(
    new CustomEvent(
      'song-picker-close'
    )
  )

}


/* =========================================================
   SONG PICKER TASKBAR EVENTS
   ========================================================= */

const handleSongPickerCancel = () => {

  if (!showSongPicker.value) {
    return
  }

  closeSongPicker()

}


const handleSongPickerDone = () => {

  if (!showSongPicker.value) {
    return
  }

  addSelectedSongs()

}


/* =========================================================
   SONG SELECTION
   ========================================================= */

const toggleSongSelection = (
  songId: string
) => {

  const index =
    selectedSongIds.value.indexOf(
      songId
    )

  if (index === -1) {

    selectedSongIds.value.push(
      songId
    )

  } else {

    selectedSongIds.value.splice(
      index,
      1
    )

  }

}


const toggleSelectAll = () => {

  if (
    selectedSongIds.value.length ===
    availableSongs.value.length
  ) {

    selectedSongIds.value = []

    return
  }

  selectedSongIds.value =
    availableSongs.value.map(
      song => song.id
    )

}


/* =========================================================
   ADD SELECTED SONGS
   ========================================================= */

const addSelectedSongs = () => {

  if (!selectedPlaylist.value) {
    return
  }


  for (
    const songId of selectedSongIds.value
  ) {

    addSongToPlaylist(
      selectedPlaylist.value.id,
      songId
    )

  }


  selectedSongIds.value = []

  showSongPicker.value = false


  window.dispatchEvent(
    new CustomEvent(
      'song-picker-close'
    )
  )

}


/* =========================================================
   REMOVE SONG
   ========================================================= */

const removePlaylistSong = (
  songId: string
) => {

  if (!selectedPlaylist.value) {
    return
  }

  removeSongFromPlaylist(
    selectedPlaylist.value.id,
    songId
  )

}


/* =========================================================
   PLAY SONG
   ========================================================= */

const playSongItem = async (
  song: MusicFile
) => {

  await playSong(
    song,
    playlistSongs.value
  )

  await router.push(
    '/now-playing'
  )

}


const playFirstSong = async () => {

  if (
    playlistSongs.value.length === 0
  ) {
    return
  }

  const playlistQueue =
    [...playlistSongs.value]

  await playSong(
    playlistQueue[0],
    playlistQueue
  )

  await router.push(
    '/now-playing'
  )

}


/* =========================================================
   MOUNT / UNMOUNT
   ========================================================= */

onMounted(() => {

  window.addEventListener(
    'playlist-editor-cancel',
    handlePlaylistEditorCancel
  )

  window.addEventListener(
    'playlist-editor-done',
    handlePlaylistEditorDone
  )

  window.addEventListener(
    'song-picker-cancel',
    handleSongPickerCancel
  )

  window.addEventListener(
    'song-picker-done',
    handleSongPickerDone
  )

})


onUnmounted(() => {

  window.removeEventListener(
    'playlist-editor-cancel',
    handlePlaylistEditorCancel
  )

  window.removeEventListener(
    'playlist-editor-done',
    handlePlaylistEditorDone
  )

  window.removeEventListener(
    'song-picker-cancel',
    handleSongPickerCancel
  )

  window.removeEventListener(
    'song-picker-done',
    handleSongPickerDone
  )

})

</script>

<style scoped>

/* =========================================================
   PAGE
   ========================================================= */

ion-content {
  --background: #09090b;
  --color: white;
}

.playlist-page {
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

  isolation: isolate;

  -webkit-tap-highlight-color: transparent;
}


/* =========================================================
   AMBIENT
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
    ambient-float
    12s
    ease-in-out
    infinite;
}

.ambient-one {
  width: 250px;
  height: 250px;

  top: 110px;
  right: -150px;

  background:
    rgba(140,100,255,0.21);

  opacity: 0.72;
}

.ambient-two {
  width: 210px;
  height: 210px;

  top: 620px;
  left: -130px;

  background:
    rgba(70,160,255,0.16);

  opacity: 0.65;

  animation-delay: -4s;
}

.ambient-three {
  width: 160px;
  height: 160px;

  top: 360px;
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

  border: 1px solid
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

.eyebrow,
.modal-eyebrow,
.empty-eyebrow {
  display: block;

  font-size: 9px;
  font-weight: 750;

  letter-spacing: 1.8px;

  color:
    rgba(255,255,255,0.36);
}

.eyebrow {
  margin-bottom: 8px;

  font-size: 11px;
  font-weight: 700;

  color:
    rgba(255,255,255,0.55);
}

.page-header h1 {
  margin: 0;

  overflow: hidden;

  font-size:
    clamp(32px, 8vw, 38px);

  line-height: 1.06;
  font-weight: 800;

  letter-spacing: -1.15px;

  color: white;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-header p {
  margin:
    10px
    0
    0;

  font-size: 14px;

  color:
    rgba(255,255,255,0.48);
}

.header-button {
  position: relative;
  z-index: 2;

  width: 45px;
  height: 45px;

  min-width: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: 14px;

  border: 1px solid
    rgba(255,255,255,0.12);

  border-radius: 16px;

  color: white;

  overflow: hidden;

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.16),
    0 10px 28px
      rgba(0,0,0,0.15);

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease,
    box-shadow 0.3s ease;
}

.glass-button {
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.15),
      rgba(255,255,255,0.045)
    );

  backdrop-filter:
    blur(28px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(175%);
}

.page-header::before,
.header-button::before,
.detail-card::before,
.playlist-item::before,
.song-item::before,
.empty-state::before,
.glass-modal::before {
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

.header-button ion-icon {
  font-size: 21px;
}

.header-button:active {
  transform:
    scale(0.88)
    rotate(-3deg);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.10),
    0 5px 15px
      rgba(0,0,0,0.16);
}


/* =========================================================
   PLAYLISTS
   ========================================================= */

.playlists {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;

  gap: 9px;
}

.playlist-item {
  position: relative;

  display: flex;
  align-items: center;

  gap: 12px;

  min-width: 0;

  padding: 9px;

  border: 1px solid
    var(--glass-border);

  border-radius: 21px;

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

  cursor: pointer;

  overflow: hidden;

  transform: translateZ(0);

  will-change: transform;

  -webkit-tap-highlight-color:
    transparent;

  touch-action: manipulation;

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.4s ease;

  animation:
    item-in 520ms var(--ease-smooth)
    backwards;
}

.playlist-item:nth-child(2) {
  animation-delay: 35ms;
}

.playlist-item:nth-child(3) {
  animation-delay: 70ms;
}

.playlist-item:nth-child(4) {
  animation-delay: 105ms;
}

.playlist-item:active {
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


/* =========================================================
   PLAYLIST COVER
   ========================================================= */

.playlist-cover-wrap {
  position: relative;
}

.playlist-cover {
  position: relative;

  width: 60px;
  height: 60px;

  min-width: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 16px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.16),
      rgba(255,255,255,0.045)
    );

  border: 1px solid
    rgba(255,255,255,0.12);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15),
    0 7px 18px
      rgba(0,0,0,0.15);
}

.playlist-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.6s var(--ease-smooth);
}

.playlist-item:active .playlist-cover img {
  transform: scale(1.055);
}

.playlist-cover ion-icon {
  font-size: 27px;

  color:
    rgba(255,255,255,0.57);
}


/* =========================================================
   PLAYLIST INFO
   ========================================================= */

.playlist-info {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.playlist-info strong,
.playlist-info span,
.playlist-info small {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-info strong {
  font-size: 15px;
  font-weight: 680;

  letter-spacing: -0.15px;

  color: white;
}

.playlist-info span {
  font-size: 11px;

  color:
    rgba(255,255,255,0.45);
}

.playlist-info small {
  font-size: 10px;

  color:
    rgba(255,255,255,0.30);
}


/* =========================================================
   CIRCLE BUTTONS
   ========================================================= */

.glass-circle {
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    rgba(255,255,255,0.08);

  background:
    rgba(255,255,255,0.055);

  backdrop-filter:
    blur(20px);

  -webkit-backdrop-filter:
    blur(20px);

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease;
}

.glass-circle:active {
  transform: scale(0.84);
  background:
    rgba(255,255,255,0.12);
}

.playlist-more,
.arrow-button {
  width: 34px;
  height: 34px;

  min-width: 34px;

  border-radius: 50%;
}

.playlist-more {
  border: 0;

  color:
    rgba(255,255,255,0.50);
}

.playlist-more ion-icon {
  font-size: 17px;
}

.arrow-button {
  display: flex;
  align-items: center;
  justify-content: center;

  color:
    rgba(255,255,255,0.31);

  background:
    transparent;
  border: 0;
}

.arrow-button ion-icon {
  font-size: 16px;

  transition:
    transform 0.42s var(--ease-bounce);
}

.playlist-item:active .arrow-button ion-icon {
  transform:
    translateX(2px);
}


/* =========================================================
   DETAIL
   ========================================================= */

.playlist-detail {
  position: relative;
  z-index: 2;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 7px;

  margin:
    0
    0
    13px
    -5px;

  padding: 7px 9px;

  border: 0;

  background: transparent;

  color:
    rgba(255,255,255,0.55);

  font-size: 13px;

  transition:
    transform 0.42s var(--ease-bounce),
    color 0.2s ease;
}

.back-button:active {
  transform: translateX(-4px) scale(0.95);

  color: white;
}

.back-icon {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(255,255,255,0.055);

  border: 1px solid
    rgba(255,255,255,0.07);
}

.back-icon ion-icon {
  font-size: 15px;
}


/* =========================================================
   DETAIL CARD
   ========================================================= */

.detail-card {
  position: relative;

  display: flex;
  align-items: center;

  gap: 15px;

  padding: 15px;

  margin-bottom: 12px;

  border: 1px solid
    var(--glass-border);

  border-radius: 25px;

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

.detail-cover {
  position: relative;

  width: 78px;
  height: 78px;

  min-width: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 20px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.16),
      rgba(255,255,255,0.045)
    );

  border: 1px solid
    rgba(255,255,255,0.13);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15),
    0 8px 22px
      rgba(0,0,0,0.18);
}

.detail-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.7s var(--ease-smooth);
}

.detail-card:active .detail-cover img {
  transform: scale(1.035);
}

.detail-cover ion-icon {
  font-size: 30px;

  color:
    rgba(255,255,255,0.55);
}

.cover-shine,
.preview-shine,
.song-cover-shine {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.17),
      transparent 35%,
      transparent 70%,
      rgba(255,255,255,0.035)
    );

  pointer-events: none;
}

.detail-info {
  flex: 1;
  min-width: 0;
}

.detail-info h2 {
  margin: 0;

  overflow: hidden;

  font-size: 20px;
  line-height: 1.15;
  font-weight: 750;

  letter-spacing: -0.45px;

  color: white;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-info span {
  display: block;

  margin-top: 5px;

  font-size: 11px;

  color:
    rgba(255,255,255,0.43);
}

.detail-info p {
  display: -webkit-box;

  margin:
    7px
    0
    0;

  overflow: hidden;

  font-size: 10px;
  line-height: 1.4;

  color:
    rgba(255,255,255,0.36);

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.edit-detail-button {
  width: 35px;
  height: 35px;

  min-width: 35px;

  color:
    rgba(255,255,255,0.62);
}

.edit-detail-button ion-icon {
  font-size: 16px;
}


/* =========================================================
   ACTIONS
   ========================================================= */

.playlist-actions {
  display: flex;

  gap: 8px;

  margin-bottom: 13px;

  animation:
    content-enter 0.55s 0.06s var(--ease-smooth) both;
}

.action-button {
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 0 15px;

  border-radius: 15px;

  font-size: 12px;
  font-weight: 680;

  transition:
    transform 0.44s var(--ease-bounce),
    background 0.25s ease,
    opacity 0.2s ease;
}

.action-button:active {
  transform: scale(0.94);
}

.action-icon {
  width: 23px;
  height: 23px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
}

.play-all-button {
  border: 0;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.95),
      rgba(255,255,255,0.76)
    );

  color: #101012;

  box-shadow:
    0 8px 22px
      rgba(0,0,0,0.15);
}

.play-all-button .action-icon {
  background:
    rgba(0,0,0,0.08);
}

.play-all-button:disabled {
  opacity: 0.28;
}

.add-songs-button {
  border: 1px solid
    rgba(255,255,255,0.10);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.095),
      rgba(255,255,255,0.035)
    );

  color:
    rgba(255,255,255,0.74);

  backdrop-filter:
    blur(24px)
    saturate(165%);

  -webkit-backdrop-filter:
    blur(24px)
    saturate(165%);
}

.add-songs-button .action-icon {
  background:
    rgba(255,255,255,0.07);
}


/* =========================================================
   SONG LIST
   ========================================================= */

.song-list {
  display: flex;
  flex-direction: column;

  gap: 7px;

  animation:
    content-enter 0.55s 0.1s var(--ease-smooth) both;
}

.song-item {
  position: relative;

  display: flex;
  align-items: center;

  gap: 9px;

  min-width: 0;

  padding: 8px;

  border: 1px solid
    var(--glass-border);

  border-radius: 19px;

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

  cursor: pointer;

  overflow: hidden;

  -webkit-tap-highlight-color:
    transparent;

  touch-action: manipulation;

  transition:
    transform 0.48s var(--ease-bounce),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.4s ease;

  animation:
    item-in 520ms var(--ease-smooth)
    backwards;
}

.song-item:nth-child(2) {
  animation-delay: 35ms;
}

.song-item:nth-child(3) {
  animation-delay: 70ms;
}

.song-item:nth-child(4) {
  animation-delay: 105ms;
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

.song-index {
  width: 22px;

  min-width: 22px;

  text-align: center;

  font-size: 9px;
  font-weight: 650;

  color:
    rgba(255,255,255,0.24);
}

.song-cover {
  position: relative;

  width: 50px;
  height: 50px;

  min-width: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 13px;

  background:
    rgba(255,255,255,0.07);

  border: 1px solid
    rgba(255,255,255,0.08);

  box-shadow:
    0 5px 15px
      rgba(0,0,0,0.12);
}

.song-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 0.6s var(--ease-smooth);
}

.song-item:active .song-cover img {
  transform: scale(1.055);
}

.song-cover ion-icon {
  font-size: 22px;

  color:
    rgba(255,255,255,0.45);
}

.song-info {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.song-info strong,
.song-info span,
.song-info small {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-info strong {
  font-size: 13px;
  font-weight: 650;

  color: white;
}

.song-info span {
  font-size: 11px;

  color:
    rgba(255,255,255,0.53);
}

.song-info small {
  font-size: 9px;

  color:
    rgba(255,255,255,0.31);
}

.remove-button {
  width: 33px;
  height: 33px;

  min-width: 33px;

  color:
    rgba(255,255,255,0.36);
}

.remove-button ion-icon {
  font-size: 15px;
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

  margin-top: 8px;

  padding:
    48px
    24px;

  text-align: center;

  border: 1px solid
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
    content-enter 0.55s 0.08s var(--ease-smooth) both;
}

.detail-empty {
  margin-top: 7px;
}

.empty-orb {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 82px;
  height: 82px;

  margin-bottom: 17px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 30% 25%,
      rgba(255,255,255,0.16),
      rgba(255,255,255,0.035) 60%,
      transparent 72%
    );

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.13),
    0 12px 30px
      rgba(0,0,0,0.15);
}

.empty-icon {
  width: 57px;
  height: 57px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 19px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.13),
      rgba(255,255,255,0.045)
    );

  border: 1px solid
    rgba(255,255,255,0.09);

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
  font-size: 27px;

  color:
    rgba(255,255,255,0.53);
}

.empty-eyebrow {
  margin-bottom: 7px;

  font-size: 8px;

  color:
    rgba(255,255,255,0.29);
}

.empty-state h2 {
  margin:
    0
    0
    8px;

  font-size: 20px;
  font-weight: 720;

  letter-spacing: -0.35px;

  color: white;
}

.empty-state p {
  max-width: 280px;

  margin:
    0
    auto
    21px;

  font-size: 12px;
  line-height: 1.5;

  color:
    rgba(255,255,255,0.42);
}

.primary-button {
  position: relative;

  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 0 17px;

  border: 1px solid
    rgba(255,255,255,0.15);

  border-radius: 15px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.17),
      rgba(255,255,255,0.065)
    );

  color: white;

  font-size: 12px;
  font-weight: 680;

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.18),
    0 8px 22px
      rgba(0,0,0,0.12);

  backdrop-filter:
    blur(24px)
    saturate(175%);

  -webkit-backdrop-filter:
    blur(24px)
    saturate(175%);

  overflow: hidden;

  transition:
    transform 0.44s var(--ease-bounce),
    background 0.25s ease;
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
    rgba(255,255,255,0.25);

  pointer-events: none;
}

.primary-button:active {
  transform:
    scale(0.94);

  background:
    rgba(255,255,255,0.17);
}


/* =========================================================
   MODAL BACKDROP
   ========================================================= */

.modal-backdrop {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  padding:
    10px
    10px
    calc(10px + env(safe-area-inset-bottom));

  background:
    rgba(0,0,0,0.52);

  backdrop-filter:
    blur(18px)
    saturate(125%);

  -webkit-backdrop-filter:
    blur(18px)
    saturate(125%);
}


/* =========================================================
   GLASS MODAL
   ========================================================= */

.glass-modal {
  position: relative;

  width: 100%;
  max-width: 520px;

  max-height: 90vh;

  overflow-y: auto;

  padding:
    12px
    20px
    calc(20px + env(safe-area-inset-bottom));

  border: 1px solid
    rgba(255,255,255,0.13);

  border-radius: 30px;

  background:
    linear-gradient(
      145deg,
      rgba(37,37,43,0.93),
      rgba(15,15,18,0.91)
    );

  backdrop-filter:
    blur(45px)
    saturate(185%);

  -webkit-backdrop-filter:
    blur(45px)
    saturate(185%);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.17),
    0 -18px 60px
      rgba(0,0,0,0.35);

  overflow-x: hidden;
}

.sheet-handle {
  width: 38px;
  height: 4px;

  margin:
    0
    auto
    17px;

  border-radius: 99px;

  background:
    rgba(255,255,255,0.19);
}

.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity 0.28s ease;
}

.sheet-enter-active .glass-modal {
  transition:
    transform 0.5s var(--ease-bounce),
    opacity 0.25s ease;
}

.sheet-leave-active .glass-modal {
  transition:
    transform 0.32s var(--ease-smooth),
    opacity 0.25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .glass-modal,
.sheet-leave-to .glass-modal {
  opacity: 0;

  transform:
    translateY(55px)
    scale(0.97);
}


/* =========================================================
   MODAL HEADER
   ========================================================= */

.modal-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin-bottom: 22px;
}

.modal-eyebrow {
  margin-bottom: 4px;
}

.modal-top h2 {
  margin: 0;

  font-size: 24px;
  line-height: 1.05;
  font-weight: 750;

  letter-spacing: -0.65px;

  color: white;
}

.modal-close {
  width: 36px;
  height: 36px;

  min-width: 36px;

  color:
    rgba(255,255,255,0.65);
}

.modal-close ion-icon {
  font-size: 18px;
}


/* =========================================================
   COVER EDITOR
   ========================================================= */

.cover-editor {
  display: flex;
  align-items: center;

  gap: 15px;

  margin-bottom: 22px;
}

.cover-preview {
  position: relative;

  width: 94px;
  height: 94px;

  min-width: 94px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 23px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.15),
      rgba(255,255,255,0.045)
    );

  border: 1px solid
    rgba(255,255,255,0.12);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.15),
    0 9px 25px
      rgba(0,0,0,0.16);
}

.cover-preview img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.cover-preview ion-icon {
  font-size: 34px;

  color:
    rgba(255,255,255,0.45);
}

.cover-actions {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 5px;
}

.cover-actions strong {
  font-size: 14px;

  color: white;
}

.cover-actions span {
  font-size: 10px;
  line-height: 1.45;

  color:
    rgba(255,255,255,0.39);
}

.cover-buttons {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-top: 5px;
}

.secondary-button {
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 0 11px;

  border: 1px solid
    rgba(255,255,255,0.10);

  border-radius: 11px;

  background:
    rgba(255,255,255,0.07);

  color:
    rgba(255,255,255,0.78);

  font-size: 10px;
  font-weight: 620;

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease;
}

.secondary-button:active {
  transform: scale(0.93);
  background:
    rgba(255,255,255,0.12);
}

.remove-cover-button {
  border: 0;

  background: transparent;

  color:
    rgba(255,125,125,0.72);

  font-size: 10px;

  transition:
    transform 0.42s var(--ease-bounce);
}

.remove-cover-button:active {
  transform: scale(0.92);
}

.hidden-input {
  display: none;
}


/* =========================================================
   FORM
   ========================================================= */

.field {
  position: relative;

  margin-bottom: 17px;
}

.field label {
  display: block;

  margin-bottom: 7px;

  font-size: 10px;
  font-weight: 680;

  color:
    rgba(255,255,255,0.53);
}

.field input,
.field textarea {
  width: 100%;

  box-sizing: border-box;

  border: 1px solid
    rgba(255,255,255,0.095);

  border-radius: 16px;

  outline: none;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.065),
      rgba(255,255,255,0.035)
    );

  color: white;

  font-family: inherit;

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.055);

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.field input {
  height: 49px;

  padding:
    0
    14px;
}

.field textarea {
  resize: none;

  padding:
    12px
    14px;

  line-height: 1.45;
}

.field input:focus,
.field textarea:focus {
  border-color:
    rgba(255,255,255,0.23);

  background:
    rgba(255,255,255,0.075);

  box-shadow:
    0 0 0 3px
      rgba(255,255,255,0.035),
    inset 0 1px 1px
      rgba(255,255,255,0.08);
}

.field input::placeholder,
.field textarea::placeholder {
  color:
    rgba(255,255,255,0.23);
}

.character-count {
  position: absolute;

  right: 11px;
  bottom: 8px;

  font-size: 8px;

  color:
    rgba(255,255,255,0.23);
}


/* =========================================================
   SONG PICKER
   ========================================================= */

.song-picker-modal {
  max-height: 87vh;
}

.picker-selection {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;

  padding:
    9px
    11px;

  border: 1px solid
    rgba(255,255,255,0.07);

  border-radius: 15px;

  background:
    rgba(255,255,255,0.045);

  backdrop-filter:
    blur(20px);

  -webkit-backdrop-filter:
    blur(20px);
}

.picker-selection span {
  font-size: 10px;

  color:
    rgba(255,255,255,0.43);
}

.picker-selection span strong {
  color:
    rgba(255,255,255,0.78);
}

.picker-selection button {
  border: 0;

  background: transparent;

  color:
    rgba(255,255,255,0.73);

  font-size: 10px;
  font-weight: 650;

  transition:
    transform 0.42s var(--ease-bounce),
    opacity 0.18s ease;
}

.picker-selection button:active {
  transform: scale(0.92);
  opacity: 0.7;
}

.picker-list {
  display: flex;
  flex-direction: column;

  gap: 6px;

  max-height: 47vh;

  overflow-y: auto;

  padding-right: 2px;
}

.picker-item {
  position: relative;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 8px;

  border: 1px solid
    rgba(255,255,255,0.065);

  border-radius: 16px;

  background:
    rgba(255,255,255,0.035);

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease,
    border-color 0.25s ease;
}

.picker-item:active {
  transform: scale(0.975);
}

.picker-item.selected {
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.105),
      rgba(255,255,255,0.045)
    );

  border-color:
    rgba(255,255,255,0.16);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.10);
}

.picker-cover {
  width: 45px;
  height: 45px;

  min-width: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 11px;

  background:
    rgba(255,255,255,0.065);

  border: 1px solid
    rgba(255,255,255,0.065);
}

.picker-cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.picker-cover ion-icon {
  font-size: 19px;

  color:
    rgba(255,255,255,0.38);
}

.picker-info {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.picker-info strong,
.picker-info span {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.picker-info strong {
  font-size: 12px;
  font-weight: 620;

  color: white;
}

.picker-info span {
  font-size: 10px;

  color:
    rgba(255,255,255,0.39);
}

.check-circle {
  width: 24px;
  height: 24px;

  min-width: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  border: 1px solid
    rgba(255,255,255,0.19);

  background:
    rgba(255,255,255,0.025);

  color: #111;

  transition:
    transform 0.42s var(--ease-bounce),
    background 0.25s ease,
    border-color 0.25s ease;
}

.check-circle.checked {
  background:
    rgba(255,255,255,0.92);

  border-color:
    rgba(255,255,255,0.92);

  transform:
    scale(1.05);
}

.check-circle ion-icon {
  font-size: 14px;
}


/* =========================================================
   PICKER EMPTY
   ========================================================= */

.picker-empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding:
    42px
    20px;

  text-align: center;
}

.picker-empty-icon {
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 13px;

  border-radius: 20px;

  background:
    rgba(255,255,255,0.06);

  border: 1px solid
    rgba(255,255,255,0.08);

  box-shadow:
    inset 0 1px 1px
      rgba(255,255,255,0.10);
}

.picker-empty-icon ion-icon {
  font-size: 29px;

  color:
    rgba(255,255,255,0.43);
}

.picker-empty strong {
  margin-bottom: 6px;

  font-size: 15px;
  font-weight: 680;

  color: white;
}

.picker-empty span {
  max-width: 250px;

  font-size: 10px;
  line-height: 1.5;

  color:
    rgba(255,255,255,0.36);
}


/* =========================================================
   SCROLLBARS
   ========================================================= */

.playlist-page ::-webkit-scrollbar,
.glass-modal ::-webkit-scrollbar {
  width: 3px;
}

.playlist-page ::-webkit-scrollbar-track,
.glass-modal ::-webkit-scrollbar-track {
  background: transparent;
}

.playlist-page ::-webkit-scrollbar-thumb,
.glass-modal ::-webkit-scrollbar-thumb {
  border-radius: 99px;

  background:
    rgba(255,255,255,0.16);
}


/* =========================================================
   DESKTOP HOVER
   ========================================================= */

@media (hover: hover) and (pointer: fine) {

  .playlist-item:hover {
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

  .playlist-item:hover .playlist-cover img {
    transform: scale(1.035);
  }

  .playlist-item:hover .arrow-button ion-icon {
    transform: translateX(2px);
  }

  .detail-card:hover .detail-cover img {
    transform: scale(1.035);
  }

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
  }

  .song-item:hover .song-cover img {
    transform: scale(1.035);
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

/* backwards fill keeps the :active press scale working */

@keyframes item-in {

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
   REDUCED MOTION
   ========================================================= */

@media (
  prefers-reduced-motion: reduce
) {

  .ambient {
    animation: none;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }

}


/* =========================================================
   SMALL SCREENS
   ========================================================= */

@media (max-width: 360px) {

  .playlist-page {
    padding-left: 15px;
    padding-right: 15px;
  }

  .playlist-cover {
    width: 55px;
    height: 55px;
    min-width: 55px;
  }

  .song-index {
    display: none;
  }

  .detail-cover {
    width: 70px;
    height: 70px;
    min-width: 70px;
  }

  .cover-preview {
    width: 82px;
    height: 82px;
    min-width: 82px;
  }

}

</style>
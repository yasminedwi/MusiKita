import { ref, computed } from 'vue'

import {
  songs,
  addToRecentlyPlayed
} from './UseMusicLibrary'

import type {
  MusicFile
} from './UseMusicLibrary'

export type RepeatMode =
  | 'off'
  | 'all'
  | 'one'

export const currentSong =
  ref<MusicFile | null>(null)

export const isPlaying =
  ref(false)

export const currentTime =
  ref(0)

export const duration =
  ref(0)

export const queue =
  ref<MusicFile[]>([])

export const isShuffle =
  ref(false)

export const repeatMode =
  ref<RepeatMode>('off')

/*
|--------------------------------------------------------------------------
| APP VOLUME
|--------------------------------------------------------------------------
|
| Volume ini KHUSUS untuk MusiKita.
|
| 1   = 100%
| 0.5 = 50%
| 0   = mute
|
| Tidak mengubah volume Windows / Android.
|
*/

export const volume =
  ref(1)

export const setVolume = (
  value: number
) => {
  /*
   * Pastikan selalu berada di antara
   * 0 dan 1.
   */
  const nextVolume =
    Math.min(
      1,
      Math.max(
        0,
        Number(value)
      )
    )

  volume.value = nextVolume

  /*
   * Terapkan langsung ke audio
   * kalau audio sudah dibuat.
   */
  if (audio) {
    audio.volume =
      nextVolume
  }
}

let audio: HTMLAudioElement | null = null

const createAudio = () => {
  if (audio) return

  audio = new Audio()

  /*
   * Volume awal MusiKita.
   * Ini terpisah dari volume device.
   */
  audio.volume = volume.value

  /*
   * Jangan preload terlalu agresif.
   * Browser tetap akan mengambil file ketika
   * source diberikan.
   */
  audio.preload = 'auto'

  audio.addEventListener(
    'timeupdate',
    () => {
      currentTime.value =
        audio?.currentTime || 0
    }
  )

  audio.addEventListener(
    'loadedmetadata',
    () => {
      duration.value =
        audio?.duration ||
        currentSong.value?.duration ||
        0
    }
  )

  audio.addEventListener(
    'loadeddata',
    () => {
      if (
        audio &&
        Number.isFinite(audio.duration)
      ) {
        duration.value =
          audio.duration
      }
    }
  )

  audio.addEventListener(
    'play',
    () => {
      isPlaying.value = true
    }
  )

  audio.addEventListener(
    'pause',
    () => {
      isPlaying.value = false
    }
  )

  audio.addEventListener(
    'ended',
    () => {
      handleSongEnded()
    }
  )

  audio.addEventListener(
    'error',
    () => {
      console.error(
        'Audio element error:',
        audio?.error
      )

      isPlaying.value = false
    }
  )
}

/*
|--------------------------------------------------------------------------
| WAIT FOR AUDIO
|--------------------------------------------------------------------------
*/

const waitForAudioReady = (
  element: HTMLAudioElement
) => {
  return new Promise<void>(
    (resolve, reject) => {
      if (
        element.readyState >=
        HTMLMediaElement.HAVE_FUTURE_DATA
      ) {
        resolve()
        return
      }

      const onCanPlay = () => {
        cleanup()
        resolve()
      }

      const onError = () => {
        cleanup()

        reject(
          new Error(
            'Audio gagal dimuat.'
          )
        )
      }

      const cleanup = () => {
        element.removeEventListener(
          'canplay',
          onCanPlay
        )

        element.removeEventListener(
          'error',
          onError
        )
      }

      element.addEventListener(
        'canplay',
        onCanPlay,
        { once: true }
      )

      element.addEventListener(
        'error',
        onError,
        { once: true }
      )
    }
  )
}

/*
|--------------------------------------------------------------------------
| PLAY SONG
|--------------------------------------------------------------------------
*/

export const playSong = async (
  song: MusicFile,
  newQueue?: MusicFile[]
) => {
  createAudio()

  if (!audio) return

  /*
   * Pastikan volume MusiKita tetap
   * diterapkan sebelum playback.
   */
  audio.volume =
    volume.value

  if (newQueue) {
    queue.value = [...newQueue]
  }

  if (queue.value.length === 0) {
    queue.value = [...songs.value]
  }

  const songChanged =
    currentSong.value?.id !== song.id

  if (songChanged) {
    audio.pause()

    currentSong.value = song

    currentTime.value = 0

    duration.value =
      song.duration || 0

    audio.removeAttribute('src')

    audio.load()

    audio.src = song.url

    audio.load()

    /*
     * Source baru tidak boleh mengubah
     * volume MusiKita.
     */
    audio.volume =
      volume.value
  }

  try {
    await waitForAudioReady(audio)

    await audio.play()

    isPlaying.value = true

    addToRecentlyPlayed(song.id)
  } catch (error) {
    console.error(
      'Playback failed:',
      error
    )

    console.error(
      'Song:',
      song
    )

    console.error(
      'Audio URL:',
      song.url
    )

    console.error(
      'Audio readyState:',
      audio.readyState
    )

    console.error(
      'Audio networkState:',
      audio.networkState
    )

    console.error(
      'Audio error:',
      audio.error
    )

    isPlaying.value = false
  }
}

/*
|--------------------------------------------------------------------------
| PLAY / PAUSE
|--------------------------------------------------------------------------
*/

export const togglePlay = async () => {
  if (!audio || !currentSong.value) {
    return
  }

  if (isPlaying.value) {
    audio.pause()

    isPlaying.value = false

    return
  }

  try {
    /*
     * Pastikan volume masih sesuai
     * dengan volume MusiKita.
     */
    audio.volume =
      volume.value

    await waitForAudioReady(audio)

    await audio.play()

    isPlaying.value = true

    addToRecentlyPlayed(
      currentSong.value.id
    )
  } catch (error) {
    console.error(
      'Playback failed:',
      error
    )

    isPlaying.value = false
  }
}

/*
|--------------------------------------------------------------------------
| SEEK
|--------------------------------------------------------------------------
*/

export const seek = (
  time: number
) => {
  if (!audio) return

  audio.currentTime = time

  currentTime.value = time
}

/*
|--------------------------------------------------------------------------
| NEXT
|--------------------------------------------------------------------------
*/

export const nextSong = async () => {
  if (!currentSong.value) {
    return
  }

  if (queue.value.length === 0) {
    return
  }

  let nextIndex = 0

  if (isShuffle.value) {
    if (queue.value.length === 1) {
      nextIndex = 0
    } else {
      const currentIndex =
        queue.value.findIndex(
          song =>
            song.id ===
            currentSong.value?.id
        )

      do {
        nextIndex =
          Math.floor(
            Math.random() *
              queue.value.length
          )
      } while (
        nextIndex === currentIndex
      )
    }
  }

  else {
    const currentIndex =
      queue.value.findIndex(
        song =>
          song.id ===
          currentSong.value?.id
      )

    if (currentIndex === -1) {
      nextIndex = 0
    } else {
      nextIndex =
        currentIndex + 1
    }

    if (
      nextIndex >=
      queue.value.length
    ) {
      if (
        repeatMode.value === 'all'
      ) {
        nextIndex = 0
      }

      else {
        isPlaying.value = false
        return
      }
    }
  }

  await playSong(
    queue.value[nextIndex]
  )
}

/*
|--------------------------------------------------------------------------
| PREVIOUS
|--------------------------------------------------------------------------
*/

export const previousSong = async () => {
  if (!currentSong.value) {
    return
  }

  if (queue.value.length === 0) {
    return
  }

  if (currentTime.value > 3) {
    seek(0)
    return
  }

  const currentIndex =
    queue.value.findIndex(
      song =>
        song.id ===
        currentSong.value?.id
    )

  let previousIndex =
    currentIndex - 1

  if (previousIndex < 0) {
    if (
      repeatMode.value === 'all'
    ) {
      previousIndex =
        queue.value.length - 1
    } else {
      previousIndex = 0
    }
  }

  await playSong(
    queue.value[previousIndex]
  )
}

/*
|--------------------------------------------------------------------------
| SONG ENDED
|--------------------------------------------------------------------------
*/

const handleSongEnded = async () => {
  if (
    repeatMode.value === 'one'
  ) {
    if (!audio) return

    audio.currentTime = 0

    currentTime.value = 0

    try {
      await audio.play()

      isPlaying.value = true
    } catch (error) {
      console.error(
        'Repeat failed:',
        error
      )

      isPlaying.value = false
    }

    return
  }

  await nextSong()
}

/*
|--------------------------------------------------------------------------
| SHUFFLE
|--------------------------------------------------------------------------
*/

export const toggleShuffle = () => {
  isShuffle.value =
    !isShuffle.value
}

/*
|--------------------------------------------------------------------------
| REPEAT
|--------------------------------------------------------------------------
*/

export const toggleRepeat = () => {
  if (
    repeatMode.value === 'off'
  ) {
    repeatMode.value = 'all'
  }

  else if (
    repeatMode.value === 'all'
  ) {
    repeatMode.value = 'one'
  }

  else {
    repeatMode.value = 'off'
  }
}

/*
|--------------------------------------------------------------------------
| QUEUE
|--------------------------------------------------------------------------
*/

export const setQueue = (
  newQueue: MusicFile[]
) => {
  queue.value = [...newQueue]
}

export const addToQueue = (
  song: MusicFile
) => {
  const exists =
    queue.value.some(
      item =>
        item.id === song.id
    )

  if (!exists) {
    queue.value.push(song)
  }
}

export const removeFromQueue = (
  songId: string
) => {
  queue.value =
    queue.value.filter(
      song =>
        song.id !== songId
    )
}

export const clearQueue = () => {
  queue.value = []
}

/*
|--------------------------------------------------------------------------
| FORMATTED TIME
|--------------------------------------------------------------------------
*/

export const formattedCurrentTime =
  computed(() =>
    formatTime(
      currentTime.value
    )
  )

export const formattedDuration =
  computed(() =>
    formatTime(
      duration.value
    )
  )

const formatTime = (
  seconds: number
) => {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return '0:00'
  }

  const minutes =
    Math.floor(seconds / 60)

  const remainingSeconds =
    Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}
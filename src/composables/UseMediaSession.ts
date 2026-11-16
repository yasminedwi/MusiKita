import { watch } from 'vue'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { MediaSession } from '@capgo/capacitor-media-session'

import {
  currentSong,
  isPlaying,
  currentTime,
  duration,
  togglePlay,
  nextSong,
  previousSong,
  seek
} from './UsePlayer'


/* notification disappears after this long with nothing playing */
const IDLE_TIMEOUT_MS = 5 * 60 * 1000

let started = false
let dismissed = false
let idleTimer: ReturnType<typeof setTimeout> | undefined
let lastTime = 0


/* =========================================================
   PUBLISH TO THE SYSTEM
   ========================================================= */

const publishMetadata = async () => {
  const song = currentSong.value
  if (!song) return

  await MediaSession.setMetadata({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: song.coverUrl ? [{ src: song.coverUrl }] : []
  })
}

const publishState = async () => {
  await MediaSession.setPlaybackState({
    playbackState: isPlaying.value ? 'playing' : 'paused'
  })
}

const publishPosition = async () => {
  const total = duration.value

  if (!total || !Number.isFinite(total)) return

  await MediaSession.setPositionState({
    duration: total,
    position: Math.min(Math.max(currentTime.value, 0), total),
    playbackRate: 1
  })
}


/* =========================================================
   IDLE TIMER (removes notification + lockscreen card)
   ========================================================= */

const clearIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = undefined
  }
}

const dismiss = async () => {
  idleTimer = undefined
  dismissed = true

  try {
    await MediaSession.setPlaybackState({ playbackState: 'none' })

    await MediaSession.setMetadata({
      title: '',
      artist: '',
      album: '',
      artwork: []
    })
  } catch (error) {
    console.warn('Media session dismiss failed', error)
  }
}

const startIdleTimer = () => {
  if (idleTimer) return

  idleTimer = setTimeout(dismiss, IDLE_TIMEOUT_MS)
}


/* =========================================================
   PERMISSION (Android 13+)
   ========================================================= */

const ensureNotificationPermission = async () => {
  if (Capacitor.getPlatform() !== 'android') return

  try {
    const status = await LocalNotifications.checkPermissions()

    if (status.display !== 'granted') {
      await LocalNotifications.requestPermissions()
    }
  } catch (error) {
    console.warn('Notification permission check failed', error)
  }
}


/* =========================================================
   INIT
   ========================================================= */

export const initMediaSession = async () => {
  if (started) return
  started = true

  await ensureNotificationPermission()

    /* system buttons -> player */

  const register = async (
    name: string,
    task: () => Promise<unknown>
  ) => {
    try {
      await task()
    } catch (error) {
      console.warn(`Media action "${name}" not supported`, error)
    }
  }

  await register('play', () =>
    MediaSession.setActionHandler({ action: 'play' }, () => {
      if (!isPlaying.value) togglePlay()
    })
  )

  await register('pause', () =>
    MediaSession.setActionHandler({ action: 'pause' }, () => {
      if (isPlaying.value) togglePlay()
    })
  )

  await register('previoustrack', () =>
    MediaSession.setActionHandler({ action: 'previoustrack' }, () => {
      previousSong()
    })
  )

  await register('nexttrack', () =>
    MediaSession.setActionHandler({ action: 'nexttrack' }, () => {
      nextSong()
    })
  )

  await register('seekto', () =>
    MediaSession.setActionHandler({ action: 'seekto' }, (details) => {
      if (typeof details.seekTime === 'number') {
        seek(details.seekTime)
      }
    })
  )
  
  /* player -> system */

  watch(
    [currentSong, isPlaying],
    async () => {
      try {
        if (isPlaying.value) {
          clearIdleTimer()
          dismissed = false

          await publishMetadata()
          await publishState()
          await publishPosition()

          return
        }

        /* not playing: keep the card while paused, but start the countdown */
        if (!dismissed && currentSong.value) {
          await publishState()
          await publishPosition()
        }

        startIdleTimer()
      } catch (error) {
        console.warn('Media session sync failed', error)
      }
    },
    { immediate: true }
  )

  /* keep the system progress bar right after in-app seeking */

  watch(currentTime, (time) => {
    const jumped = Math.abs(time - lastTime) > 1.5

    lastTime = time

    if (jumped && isPlaying.value) {
      publishPosition().catch(() => {})
    }
  })
}
import { ref, computed } from 'vue'
import { parseBlob } from 'music-metadata'

/* =========================================================
   TYPES
   ========================================================= */

export interface MusicFile {
  id: string
  file: File
  url: string

  title: string
  artist: string
  album: string
  albumArtist: string
  genre: string
  year: number | null
  trackNumber: number | null

  duration: number
  bitrate: number | null
  sampleRate: number | null
  bitsPerSample: number | null

  codec: string
  format: string

  coverUrl: string | null
}

export interface Playlist {
  id: string
  name: string
  description: string
  coverUrl: string | null
  songIds: string[]
}

export interface Album {
  id: string
  name: string
  artist: string
  year: number | null
  coverUrl: string | null
  songs: MusicFile[]
}

export interface Artist {
  id: string
  name: string
  coverUrl: string | null
  albums: Album[]
  songs: MusicFile[]
}


/* =========================================================
   DATABASE
   Browser beta uses IndexedDB.
   Android can later be switched to SQLite.
   ========================================================= */

const DB_NAME = 'musikita-library'
const DB_VERSION = 1

const SONG_STORE = 'songs'
const PLAYLIST_STORE = 'playlists'
const RECENT_STORE = 'recentlyPlayed'

let database: IDBDatabase | null = null

let databaseReady:
  Promise<IDBDatabase> | null = null


const openDatabase = (): Promise<IDBDatabase> => {
  if (database) {
    return Promise.resolve(database)
  }

  if (databaseReady) {
    return databaseReady
  }

  databaseReady = new Promise(
    (resolve, reject) => {
      if (
        typeof window === 'undefined' ||
        !window.indexedDB
      ) {
        reject(
          new Error(
            'IndexedDB is not available.'
          )
        )

        return
      }

      const request =
        window.indexedDB.open(
          DB_NAME,
          DB_VERSION
        )

      request.onupgradeneeded = () => {
        const db =
          request.result

        if (
          !db.objectStoreNames.contains(
            SONG_STORE
          )
        ) {
          db.createObjectStore(
            SONG_STORE,
            {
              keyPath: 'id'
            }
          )
        }

        if (
          !db.objectStoreNames.contains(
            PLAYLIST_STORE
          )
        ) {
          db.createObjectStore(
            PLAYLIST_STORE,
            {
              keyPath: 'id'
            }
          )
        }

        if (
          !db.objectStoreNames.contains(
            RECENT_STORE
          )
        ) {
          db.createObjectStore(
            RECENT_STORE,
            {
              keyPath: 'id'
            }
          )
        }
      }

      request.onsuccess = () => {
        database =
          request.result

        database.onversionchange = () => {
          database?.close()
          database = null
          databaseReady = null
        }

        resolve(database)
      }

      request.onerror = () => {
        databaseReady = null

        reject(
          request.error ||
          new Error(
            'Failed to open MusiKita database.'
          )
        )
      }
    }
  )

  return databaseReady
}


/* =========================================================
   DATABASE HELPERS
   ========================================================= */

const dbPut = async (
  storeName: string,
  value: unknown
) => {
  const db =
    await openDatabase()

  return new Promise<void>(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          storeName,
          'readwrite'
        )

      const store =
        transaction.objectStore(
          storeName
        )

      const request =
        store.put(value)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(
          request.error
        )
      }
    }
  )
}


const dbDelete = async (
  storeName: string,
  id: string
) => {
  const db =
    await openDatabase()

  return new Promise<void>(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          storeName,
          'readwrite'
        )

      const store =
        transaction.objectStore(
          storeName
        )

      const request =
        store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(
          request.error
        )
      }
    }
  )
}


const dbGetAll = async <T>(
  storeName: string
): Promise<T[]> => {
  const db =
    await openDatabase()

  return new Promise<T[]>(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          storeName,
          'readonly'
        )

      const store =
        transaction.objectStore(
          storeName
        )

      const request =
        store.getAll()

      request.onsuccess = () => {
        resolve(
          (request.result || []) as T[]
        )
      }

      request.onerror = () => {
        reject(
          request.error
        )
      }
    }
  )
}


/* =========================================================
   STORED TYPES
   ========================================================= */

interface StoredSong {
  id: string

  file: Blob

  title: string
  artist: string
  album: string
  albumArtist: string
  genre: string
  year: number | null
  trackNumber: number | null

  duration: number
  bitrate: number | null
  sampleRate: number | null
  bitsPerSample: number | null

  codec: string
  format: string

  coverBlob: Blob | null
}


interface StoredPlaylist {
  id: string
  name: string
  description: string
  coverBlob: Blob | null
  songIds: string[]
}


interface StoredRecentlyPlayed {
  id: string
  songId: string
  playedAt: number
}


/* =========================================================
   OBJECT URL HELPERS
   ========================================================= */

const revokeSongUrls = (
  song: MusicFile
) => {
  if (song.url) {
    URL.revokeObjectURL(
      song.url
    )
  }

  if (song.coverUrl) {
    URL.revokeObjectURL(
      song.coverUrl
    )
  }
}


const revokePlaylistCover = (
  playlist: Playlist
) => {
  if (
    playlist.coverUrl &&
    playlist.coverUrl.startsWith(
      'blob:'
    )
  ) {
    URL.revokeObjectURL(
      playlist.coverUrl
    )
  }
}


/* =========================================================
   GLOBAL STATE
   ========================================================= */

export const songs =
  ref<MusicFile[]>([])

export const recentlyPlayed =
  ref<string[]>([])

export const playlists =
  ref<Playlist[]>([])


/* =========================================================
   PERSIST SONG
   ========================================================= */

const persistSong = async (
  song: MusicFile
) => {
  try {
    let coverBlob:
      Blob | null = null

    if (
      song.coverUrl &&
      song.coverUrl.startsWith(
        'blob:'
      )
    ) {
      try {
        const response =
          await fetch(
            song.coverUrl
          )

        coverBlob =
          await response.blob()
      } catch {
        coverBlob = null
      }
    }

    const storedSong:
      StoredSong = {
        id:
          song.id,

        file:
          song.file,

        title:
          song.title,

        artist:
          song.artist,

        album:
          song.album,

        albumArtist:
          song.albumArtist,

        genre:
          song.genre,

        year:
          song.year,

        trackNumber:
          song.trackNumber,

        duration:
          song.duration,

        bitrate:
          song.bitrate,

        sampleRate:
          song.sampleRate,

        bitsPerSample:
          song.bitsPerSample,

        codec:
          song.codec,

        format:
          song.format,

        coverBlob
      }

    await dbPut(
      SONG_STORE,
      storedSong
    )
  } catch (error) {
    console.error(
      '[MusiKita] Failed to save song:',
      error
    )
  }
}


/* =========================================================
   PERSIST PLAYLIST
   ========================================================= */

const persistPlaylist = async (
  playlist: Playlist
) => {
  try {
    let coverBlob:
      Blob | null = null

    if (
      playlist.coverUrl &&
      playlist.coverUrl.startsWith(
        'blob:'
      )
    ) {
      try {
        const response =
          await fetch(
            playlist.coverUrl
          )

        coverBlob =
          await response.blob()
      } catch {
        coverBlob = null
      }
    }

    const storedPlaylist:
      StoredPlaylist = {
        id:
          playlist.id,

        name:
          playlist.name,

        description:
          playlist.description,

        coverBlob,

        songIds:
          [...playlist.songIds]
      }

    await dbPut(
      PLAYLIST_STORE,
      storedPlaylist
    )
  } catch (error) {
    console.error(
      '[MusiKita] Failed to save playlist:',
      error
    )
  }
}


/* =========================================================
   PERSIST RECENTLY PLAYED
   ========================================================= */

const persistRecentlyPlayed =
  async () => {
    try {
      const db =
        await openDatabase()

      await new Promise<void>(
        (
          resolve,
          reject
        ) => {
          const transaction =
            db.transaction(
              RECENT_STORE,
              'readwrite'
            )

          const store =
            transaction.objectStore(
              RECENT_STORE
            )

          const clearRequest =
            store.clear()

          clearRequest.onsuccess =
            () => {
              for (
                let index = 0;
                index <
                recentlyPlayed.value.length;
                index++
              ) {
                const songId =
                  recentlyPlayed
                    .value[index]

                store.put({
                  id:
                    `${index}-${songId}`,

                  songId,

                  playedAt:
                    Date.now() -
                    index
                })
              }
            }

          transaction.oncomplete =
            () => {
              resolve()
            }

          transaction.onerror =
            () => {
              reject(
                transaction.error
              )
            }
        }
      )
    } catch (error) {
      console.error(
        '[MusiKita] Failed to save recently played:',
        error
      )
    }
  }


/* =========================================================
   RESTORE DATABASE
   ========================================================= */

const restoreLibrary =
  async () => {
    try {
      const storedSongs =
        await dbGetAll<StoredSong>(
          SONG_STORE
        )

      const restoredSongs:
        MusicFile[] = []

      for (
        const stored of storedSongs
      ) {
        const file =
          new File(
            [stored.file],
            getFileName(
              stored.file,
              stored.title
            ),
            {
              type:
                stored.file.type ||
                guessMimeType(
                  stored.format
                )
            }
          )

        const url =
          URL.createObjectURL(
            file
          )

        let coverUrl:
          string | null = null

        if (
          stored.coverBlob
        ) {
          coverUrl =
            URL.createObjectURL(
              stored.coverBlob
            )
        }

        restoredSongs.push({
          id:
            stored.id,

          file,

          url,

          title:
            stored.title,

          artist:
            stored.artist,

          album:
            stored.album,

          albumArtist:
            stored.albumArtist,

          genre:
            stored.genre,

          year:
            stored.year,

          trackNumber:
            stored.trackNumber,

          duration:
            stored.duration,

          bitrate:
            stored.bitrate,

          sampleRate:
            stored.sampleRate,

          bitsPerSample:
            stored.bitsPerSample,

          codec:
            stored.codec,

          format:
            stored.format,

          coverUrl
        })
      }

      songs.value =
        restoredSongs


      const storedPlaylists =
        await dbGetAll<StoredPlaylist>(
          PLAYLIST_STORE
        )

      playlists.value =
        storedPlaylists.map(
          playlist => {
            let coverUrl:
              string | null = null

            if (
              playlist.coverBlob
            ) {
              coverUrl =
                URL.createObjectURL(
                  playlist.coverBlob
                )
            }

            return {
              id:
                playlist.id,

              name:
                playlist.name,

              description:
                playlist.description,

              coverUrl,

              songIds:
                [...playlist.songIds]
            }
          }
        )


      const storedRecent =
        await dbGetAll<StoredRecentlyPlayed>(
          RECENT_STORE
        )

      storedRecent.sort(
        (
          a,
          b
        ) =>
          b.playedAt -
          a.playedAt
      )

      recentlyPlayed.value =
        storedRecent
          .map(
            item =>
              item.songId
          )
          .filter(
            songId =>
              songs.value.some(
                song =>
                  song.id ===
                  songId
              )
          )
          .slice(
            0,
            10
          )

      console.log(
        '[MusiKita] Library restored:',
        {
          songs:
            songs.value.length,

          playlists:
            playlists.value.length,

          recentlyPlayed:
            recentlyPlayed.value.length
        }
      )
    } catch (error) {
      console.error(
        '[MusiKita] Failed to restore library:',
        error
      )
    }
  }


/* =========================================================
   FILE HELPERS
   ========================================================= */

const getFileName = (
  blob: Blob,
  title: string
) => {
  if (
    blob instanceof File
  ) {
    return blob.name
  }

  const extension =
    guessExtension(
      blob.type
    )

  return `${title}${extension}`
}


const guessExtension = (
  mimeType: string
) => {
  switch (
    mimeType.toLowerCase()
  ) {
    case 'audio/mpeg':
      return '.mp3'

    case 'audio/flac':
      return '.flac'

    case 'audio/wav':
    case 'audio/x-wav':
      return '.wav'

    case 'audio/mp4':
    case 'audio/x-m4a':
      return '.m4a'

    case 'audio/aac':
      return '.aac'

    case 'audio/ogg':
      return '.ogg'

    case 'audio/opus':
      return '.opus'

    default:
      return '.audio'
  }
}


const guessMimeType = (
  format: string
) => {
  switch (
    format.toLowerCase()
  ) {
    case 'mp3':
      return 'audio/mpeg'

    case 'flac':
      return 'audio/flac'

    case 'wav':
      return 'audio/wav'

    case 'm4a':
    case 'mp4':
      return 'audio/mp4'

    case 'aac':
      return 'audio/aac'

    case 'ogg':
      return 'audio/ogg'

    case 'opus':
      return 'audio/opus'

    default:
      return 'audio/*'
  }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

let initializationStarted =
  false

export const initializeMusicLibrary =
  async () => {
    if (
      initializationStarted
    ) {
      return
    }

    initializationStarted =
      true

    try {
      await openDatabase()

      await restoreLibrary()
    } catch (error) {
      console.error(
        '[MusiKita] Library initialization failed:',
        error
      )
    }
  }


/* =========================================================
   ALBUMS
   ========================================================= */

export const albums =
  computed<Album[]>(() => {
    const albumMap =
      new Map<
        string,
        MusicFile[]
      >()

    for (
      const song of songs.value
    ) {
      const albumName =
        song.album.trim() ||
        'Unknown Album'

      const key =
        albumName.toLowerCase()

      if (
        !albumMap.has(key)
      ) {
        albumMap.set(
          key,
          []
        )
      }

      albumMap
        .get(key)!
        .push(song)
    }

    return Array.from(
      albumMap.entries()
    ).map(
      ([, albumSongs]) => {
        albumSongs.sort(
          (
            a,
            b
          ) => {
            if (
              a.trackNumber !== null &&
              b.trackNumber !== null
            ) {
              return (
                a.trackNumber -
                b.trackNumber
              )
            }

            if (
              a.trackNumber !== null
            ) {
              return -1
            }

            if (
              b.trackNumber !== null
            ) {
              return 1
            }

            return a.title.localeCompare(
              b.title
            )
          }
        )

        const firstSong =
          albumSongs[0]

        const coverSong =
          albumSongs.find(
            song =>
              song.coverUrl
          )

        return {
          id:
            `album-${albumSongs
              .map(
                song =>
                  song.album
              )
              .join('-')
              .toLowerCase()
              .replace(
                /[^a-z0-9]+/g,
                '-'
              )}`,

          name:
            firstSong?.album ||
            'Unknown Album',

          artist:
            firstSong?.albumArtist ||
            firstSong?.artist ||
            'Unknown Artist',

          year:
            firstSong?.year ||
            null,

          coverUrl:
            coverSong?.coverUrl ||
            null,

          songs:
            albumSongs
        }
      }
    )
  })


/* =========================================================
   ARTISTS
   ========================================================= */

export const artists =
  computed<Artist[]>(() => {
    const artistMap =
      new Map<
        string,
        MusicFile[]
      >()

    for (
      const song of songs.value
    ) {
      const artistName =
        song.albumArtist.trim() ||
        song.artist.trim() ||
        'Unknown Artist'

      const key =
        artistName.toLowerCase()

      if (
        !artistMap.has(key)
      ) {
        artistMap.set(
          key,
          []
        )
      }

      artistMap
        .get(key)!
        .push(song)
    }

    return Array.from(
      artistMap.entries()
    ).map(
      ([, artistSongs]) => {
        const albumMap =
          new Map<
            string,
            MusicFile[]
          >()

        for (
          const song of artistSongs
        ) {
          const albumName =
            song.album.trim() ||
            'Unknown Album'

          const key =
            albumName.toLowerCase()

          if (
            !albumMap.has(key)
          ) {
            albumMap.set(
              key,
              []
            )
          }

          albumMap
            .get(key)!
            .push(song)
        }

        const artistAlbums =
          Array.from(
            albumMap.entries()
          ).map(
            ([, albumSongs]) => {
              albumSongs.sort(
                (
                  a,
                  b
                ) => {
                  if (
                    a.trackNumber !== null &&
                    b.trackNumber !== null
                  ) {
                    return (
                      a.trackNumber -
                      b.trackNumber
                    )
                  }

                  if (
                    a.trackNumber !== null
                  ) {
                    return -1
                  }

                  if (
                    b.trackNumber !== null
                  ) {
                    return 1
                  }

                  return a.title.localeCompare(
                    b.title
                  )
                }
              )

              const firstSong =
                albumSongs[0]

              const coverSong =
                albumSongs.find(
                  song =>
                    song.coverUrl
                )

              return {
                id:
                  `album-${albumSongs
                    .map(
                      song =>
                        song.album
                    )
                    .join('-')
                    .toLowerCase()
                    .replace(
                      /[^a-z0-9]+/g,
                      '-'
                    )}`,

                name:
                  firstSong?.album ||
                  'Unknown Album',

                artist:
                  firstSong?.albumArtist ||
                  firstSong?.artist ||
                  'Unknown Artist',

                year:
                  firstSong?.year ||
                  null,

                coverUrl:
                  coverSong?.coverUrl ||
                  null,

                songs:
                  albumSongs
              }
            }
          )

        artistAlbums.sort(
          (
            a,
            b
          ) => {
            if (
              a.year !== null &&
              b.year !== null
            ) {
              return (
                a.year -
                b.year
              )
            }

            if (
              a.year !== null
            ) {
              return -1
            }

            if (
              b.year !== null
            ) {
              return 1
            }

            return a.name.localeCompare(
              b.name
            )
          }
        )

        const coverSong =
          artistSongs.find(
            song =>
              song.coverUrl
          )

        const firstSong =
          artistSongs[0]

        return {
          id:
            `artist-${(
              firstSong?.albumArtist ||
              firstSong?.artist ||
              'unknown'
            )
              .toLowerCase()
              .replace(
                /[^a-z0-9]+/g,
                '-'
              )}`,

          name:
            firstSong?.albumArtist ||
            firstSong?.artist ||
            'Unknown Artist',

          coverUrl:
            coverSong?.coverUrl ||
            null,

          albums:
            artistAlbums,

          songs:
            artistSongs
        }
      }
    )
  })


/* =========================================================
   ADD MUSIC
   ========================================================= */

export const addMusicFiles =
  async (
    files: File[]
  ) => {
    const supportedExtensions = [
      '.mp3',
      '.flac',
      '.wav',
      '.m4a',
      '.aac',
      '.ogg',
      '.opus'
    ]

    for (
      const file of files
    ) {
      const extension =
        '.' +
        (
          file.name
            .split('.')
            .pop() || ''
        ).toLowerCase()

      if (
        !supportedExtensions.includes(
          extension
        )
      ) {
        console.log(
          'Unsupported file:',
          file.name
        )

        continue
      }

      try {
        const metadata =
          await parseBlob(
            file
          )

        const common =
          metadata.common

        const format =
          metadata.format

        let coverUrl:
          string | null = null

        if (
          common.picture &&
          common.picture.length > 0
        ) {
          const picture =
            common.picture[0]

          const imageData =
            new Uint8Array(
              picture.data
            )

          const blob =
            new Blob(
              [imageData],
              {
                type:
                  picture.format
              }
            )

          coverUrl =
            URL.createObjectURL(
              blob
            )
        }

        const title =
          common.title ||
          file.name.replace(
            /\.[^/.]+$/,
            ''
          )

        const artist =
          common.artist ||
          common.artists?.join(
            ', '
          ) ||
          'Unknown Artist'

        const album =
          common.album ||
          'Unknown Album'

        const albumArtist =
          common.albumartist ||
          artist

        const genre =
          common.genre?.join(
            ', '
          ) ||
          'Unknown Genre'

        const year =
          common.year ||
          null

        const trackNumber =
          common.track?.no ||
          null

        const song: MusicFile = {
          id:
            `${file.name}-${file.lastModified}-${Math.random()}`,

          file,

          url:
            URL.createObjectURL(
              file
            ),

          title,
          artist,
          album,
          albumArtist,
          genre,
          year,
          trackNumber,

          duration:
            format.duration ||
            0,

          bitrate:
            format.bitrate ||
            null,

          sampleRate:
            format.sampleRate ||
            null,

          bitsPerSample:
            format.bitsPerSample ||
            null,

          codec:
            format.codec ||
            'Unknown',

          format:
            format.container ||
            extension
              .replace(
                '.',
                ''
              )
              .toUpperCase(),

          coverUrl
        }

        songs.value.push(
          song
        )

        await persistSong(
          song
        )

        console.log(
          'Added:',
          song
        )
      } catch (
        error
      ) {
        console.error(
          `Failed to read ${file.name}:`,
          error
        )
      }
    }
  }


/* =========================================================
   RECENTLY PLAYED
   ========================================================= */

export const addToRecentlyPlayed =
  (
    songId: string
  ) => {
    recentlyPlayed.value =
      recentlyPlayed.value.filter(
        id =>
          id !== songId
      )

    recentlyPlayed.value.unshift(
      songId
    )

    recentlyPlayed.value =
      recentlyPlayed.value.slice(
        0,
        10
      )

    void persistRecentlyPlayed()
  }


export const recentSongs =
  () => {
    return recentlyPlayed.value
      .map(
        id =>
          songs.value.find(
            song =>
              song.id === id
          )
      )
      .filter(
        (
          song
        ): song is MusicFile =>
          song !== undefined
      )
  }


/* =========================================================
   PLAYLIST
   ========================================================= */

export const createPlaylist =
  (
    name: string,
    description = '',
    coverUrl:
      string | null = null
  ) => {
    const playlist:
      Playlist = {
        id:
          `${Date.now()}-${Math.random()}`,

        name:
          name.trim(),

        description:
          description.trim(),

        coverUrl,

        songIds: []
      }

    playlists.value.push(
      playlist
    )

    void persistPlaylist(
      playlist
    )

    return playlist
  }


export const updatePlaylist =
  (
    playlistId: string,
    data: {
      name?: string
      description?: string
      coverUrl?: string | null
    }
  ) => {
    const playlist =
      playlists.value.find(
        item =>
          item.id ===
          playlistId
      )

    if (!playlist) {
      return null
    }

    const oldCover =
      playlist.coverUrl

    if (
      data.name !== undefined
    ) {
      playlist.name =
        data.name.trim()
    }

    if (
      data.description !== undefined
    ) {
      playlist.description =
        data.description.trim()
    }

    if (
      data.coverUrl !== undefined
    ) {
      playlist.coverUrl =
        data.coverUrl
    }

    if (
      oldCover &&
      oldCover !==
        playlist.coverUrl &&
      oldCover.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        oldCover
      )
    }

    void persistPlaylist(
      playlist
    )

    return playlist
  }


export const addSongToPlaylist =
  (
    playlistId: string,
    songId: string
  ) => {
    const playlist =
      playlists.value.find(
        item =>
          item.id ===
          playlistId
      )

    if (!playlist) {
      return
    }

    if (
      !playlist.songIds.includes(
        songId
      )
    ) {
      playlist.songIds.push(
        songId
      )

      void persistPlaylist(
        playlist
      )
    }
  }


export const removeSongFromPlaylist =
  (
    playlistId: string,
    songId: string
  ) => {
    const playlist =
      playlists.value.find(
        item =>
          item.id ===
          playlistId
      )

    if (!playlist) {
      return
    }

    playlist.songIds =
      playlist.songIds.filter(
        id =>
          id !== songId
      )

    void persistPlaylist(
      playlist
    )
  }


export const getPlaylistSongs =
  (
    playlist: Playlist
  ) => {
    return playlist.songIds
      .map(
        id =>
          songs.value.find(
            song =>
              song.id === id
          )
      )
      .filter(
        (
          song
        ): song is MusicFile =>
          song !== undefined
      )
  }


/* =========================================================
   REMOVE SONG
   ========================================================= */

export const removeSong =
  async (
    id: string
  ) => {
    const song =
      songs.value.find(
        item =>
          item.id === id
      )

    if (!song) {
      return
    }

    revokeSongUrls(
      song
    )

    songs.value =
      songs.value.filter(
        item =>
          item.id !== id
      )

    recentlyPlayed.value =
      recentlyPlayed.value.filter(
        songId =>
          songId !== id
      )

    playlists.value.forEach(
      playlist => {
        playlist.songIds =
          playlist.songIds.filter(
            songId =>
              songId !== id
          )

        void persistPlaylist(
          playlist
        )
      }
    )

    try {
      await dbDelete(
        SONG_STORE,
        id
      )

      await persistRecentlyPlayed()
    } catch (
      error
    ) {
      console.error(
        '[MusiKita] Failed to remove song from database:',
        error
      )
    }
  }


/* =========================================================
   REMOVE PLAYLIST
   ========================================================= */

export const removePlaylist =
  async (
    playlistId: string
  ) => {
    const playlist =
      playlists.value.find(
        item =>
          item.id ===
          playlistId
      )

    if (!playlist) {
      return
    }

    revokePlaylistCover(
      playlist
    )

    playlists.value =
      playlists.value.filter(
        item =>
          item.id !==
          playlistId
      )

    try {
      await dbDelete(
        PLAYLIST_STORE,
        playlistId
      )
    } catch (
      error
    ) {
      console.error(
        '[MusiKita] Failed to remove playlist:',
        error
      )
    }
  }


/* =========================================================
   AUTO INITIALIZATION
   ========================================================= */

if (
  typeof window !==
  'undefined'
) {
  void initializeMusicLibrary()
}
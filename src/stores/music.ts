import { ref } from 'vue'

export interface Song {
  id: number
  title: string
  artist: string
  file: File
  url: string
}

export const songs = ref<Song[]>([])

export const currentSong = ref<Song | null>(null)

export function addSongs(files: File[]) {
  const audioFiles = files.filter(file =>
    file.type.startsWith('audio/')
  )

  audioFiles.forEach(file => {
    songs.value.push({
      id: Date.now() + Math.random(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Unknown Artist',
      file,
      url: URL.createObjectURL(file)
    })
  })
}

export function playSong(song: Song) {
  currentSong.value = song
}
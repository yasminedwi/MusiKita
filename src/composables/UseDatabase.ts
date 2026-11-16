import { Capacitor } from '@capacitor/core'

import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection
} from '@capacitor-community/sqlite'


/* ==========================================================================
   SQLITE CONNECTION
   ========================================================================== */

const DATABASE_NAME = 'musikita'

const sqlite =
  new SQLiteConnection(CapacitorSQLite)

let db: SQLiteDBConnection | null = null

let initialized = false


/* ==========================================================================
   INITIALIZE DATABASE
   ========================================================================== */

export const initializeDatabase = async () => {

  if (initialized && db) {
    return db
  }


  /*
   * Browser / Web
   *
   * SQLite plugin uses jeep-sqlite + IndexedDB
   * for the browser version.
   */

  if (
    Capacitor.getPlatform() === 'web'
  ) {

    await sqlite.initWebStore()

  }


  /*
   * Check whether the connection
   * already exists.
   */

  const consistency =
    await sqlite.checkConnectionsConsistency()

  const connectionExists =
    (
      await sqlite.isConnection(
        DATABASE_NAME,
        false
      )
    ).result


  if (
    consistency.result &&
    connectionExists
  ) {

    db =
      await sqlite.retrieveConnection(
        DATABASE_NAME,
        false
      )

  } else {

    db =
      await sqlite.createConnection(
        DATABASE_NAME,
        false,
        'no-encryption',
        1,
        false
      )

  }


  await db.open()


  /* ------------------------------------------------------------------------
     SONGS
     ------------------------------------------------------------------------ */

  await db.execute(`
    CREATE TABLE IF NOT EXISTS songs (

      id TEXT PRIMARY KEY NOT NULL,

      uri TEXT NOT NULL UNIQUE,

      title TEXT NOT NULL,

      artist TEXT DEFAULT 'Unknown Artist',

      album TEXT DEFAULT 'Unknown Album',

      album_artist TEXT DEFAULT '',

      genre TEXT DEFAULT '',

      year INTEGER,

      track_number INTEGER,

      duration REAL DEFAULT 0,

      cover_uri TEXT,

      date_added INTEGER NOT NULL,

      last_played INTEGER

    );
  `)


  /* ------------------------------------------------------------------------
     PLAYLISTS
     ------------------------------------------------------------------------ */

  await db.execute(`
    CREATE TABLE IF NOT EXISTS playlists (

      id TEXT PRIMARY KEY NOT NULL,

      name TEXT NOT NULL,

      cover_uri TEXT,

      created_at INTEGER NOT NULL

    );
  `)


  /* ------------------------------------------------------------------------
     PLAYLIST SONGS
     ------------------------------------------------------------------------ */

  await db.execute(`
    CREATE TABLE IF NOT EXISTS playlist_songs (

      playlist_id TEXT NOT NULL,

      song_id TEXT NOT NULL,

      position INTEGER NOT NULL DEFAULT 0,

      PRIMARY KEY (
        playlist_id,
        song_id
      ),

      FOREIGN KEY (
        playlist_id
      )
      REFERENCES playlists(id)
      ON DELETE CASCADE,

      FOREIGN KEY (
        song_id
      )
      REFERENCES songs(id)
      ON DELETE CASCADE

    );
  `)


  /* ------------------------------------------------------------------------
     RECENTLY PLAYED
     ------------------------------------------------------------------------ */

  await db.execute(`
    CREATE TABLE IF NOT EXISTS recently_played (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      song_id TEXT NOT NULL,

      played_at INTEGER NOT NULL,

      FOREIGN KEY (
        song_id
      )
      REFERENCES songs(id)
      ON DELETE CASCADE

    );
  `)


  /* ------------------------------------------------------------------------
     INDEXES
     ------------------------------------------------------------------------ */

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_recently_played_time
    ON recently_played(played_at DESC);
  `)


  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist
    ON playlist_songs(playlist_id, position);
  `)


  initialized = true


  /*
   * Web database needs to be saved back
   * to the web store.
   */

  if (
    Capacitor.getPlatform() === 'web'
  ) {

    await sqlite.saveToStore(
      DATABASE_NAME
    )

  }


  console.log(
    '[MusiKita] Database initialized'
  )


  return db

}


/* ==========================================================================
   GET DATABASE
   ========================================================================== */

export const getDatabase =
  async (): Promise<SQLiteDBConnection> => {

    if (!db || !initialized) {

      return initializeDatabase()

    }

    return db

  }


/* ==========================================================================
   EXECUTE SQL
   ========================================================================== */

export const executeSQL =
  async (
    statement: string,
    values: unknown[] = []
  ) => {

    const database =
      await getDatabase()

    const result =
      await database.run(
        statement,
        values
      )


    if (
      Capacitor.getPlatform() === 'web'
    ) {

      await sqlite.saveToStore(
        DATABASE_NAME
      )

    }


    return result

  }


/* ==========================================================================
   QUERY SQL
   ========================================================================== */

export const querySQL =
  async (
    statement: string,
    values: unknown[] = []
  ) => {

    const database =
      await getDatabase()

    const result =
      await database.query(
        statement,
        values
      )

    return result.values || []

  }


/* ==========================================================================
   CLOSE DATABASE
   ========================================================================== */

export const closeDatabase =
  async () => {

    if (!db) {
      return
    }


    await sqlite.closeConnection(
      DATABASE_NAME,
      false
    )


    db = null

    initialized = false

  }


/* ==========================================================================
   DEBUG
   ========================================================================== */

export const getDatabaseName =
  () => DATABASE_NAME
// import { UUID } from 'mongodb'
import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  // password: '',
  database: 'moviesdb'
}

// Create the connection to database
const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      console.log('genero', genre)

      // get the genre
      const [genres] = await connection.query(
        'SELECT id, name FROM genre where LOWER(NAME) = ?;', [lowerCaseGenre]
      )
      console.log('id y genero', genres)

      // no genre found
      if (genres.length === 0) return []

      // get the id from the firts genre result
      const [{ id }] = genres
      console.log('id', id)

      // get all movies ids from database table
      const [moviesIds] = await connection.query(
        'SELECT BIN_TO_UUID(id) FROM movie'
      )

      console.log('moviesIds', moviesIds)
      const movieId = moviesIds.map(movie => movie['BIN_TO_UUID(id)'])
      console.log('movieId', movieId)

      // // la query a movie_genres
      // const [movie_genres] = await connection.query(
      //   'SELECT BIN_TO_UUID(movie_id), genre_id FROM movie_genres'
      // )
      // console.log('movie_genres', movie_genres)

      // //
      // const [movie_genres2] = await connection.query(
      //   'SELECT BIN_TO_UUID(movie_id) FROM movie_genres WHERE genre_id=?', [id]
      // )

      // console.log('movie_genres2', movie_genres2)
      // const uuidid = movie_genres2.map(peli => peli['BIN_TO_UUID(movie_id)'])
      // console.log(uuidid)

      // const [movie] = await connection.query(
      //   'SELECT title FROM movie WHERE BIN_TO_UUID(id)=?', [uuidid]
      // )
      // console.log(movie)

      // // join
      // const [dato] = await connection.query(
      //   `SELECT movie.title
      //   FROM movie
      //   INNER JOIN movie_genres
      //   ON BIN_TO_UUID(movie.id) = BIN_TO_UUID(movie_genres.movie_id)`

      // )
      // // 'SELECT title FROM movie WHERE BIN_TO_UUID(id)=?', [uuidid]
      // console.log('dato', dato)
      // // y devolver resultados

      // return movie
    }
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )

    return movies
  }

  static async getById ({ id }) {
    try {
      const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
      FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
      )

      if (movies.length === 0) return null

      return movies[0]
    } catch (error) {
      console.error('Error al obtener la película:', error)
      throw new Error('Error al buscar la película.')
    }
  }

  static async create ({ input }) {
    const {
      // genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // todo: crear la conexion de genre

    // desde aqui crear llamar a mysql para crear uuid
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')

    const [{ uuid }] = uuidResult

    // no pasarle la id por tenerelo por defecto uuid() en bbdd

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
        VALUES             (UUID_TO_BIN(?),?,?,?,?,?,?);`,
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // throw new Error('Error creating movie')

      // nomandar info a user porque en caso de error, manda mas info de la necesaria y sensible
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate , BIN_TO_UUID(id) id
      FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    console.log(movies)
    return movies[0]
  }

  static async delete ({ id }) {
    await connection.query(
      'DELETE FROM movie where BIN_TO_UUID(id) = ?;',
      [id]
    )
    return true
  }

  static async update ({ id, input }) {
    const updates = []
    const values = []

    const {
      // genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    if (title) {
      updates.push('title = ?')
      values.push(title)
    }
    if (year) {
      updates.push('year = ?')
      values.push(year)
    }
    if (duration) {
      updates.push('duration = ?')
      values.push(duration)
    }
    if (director) {
      updates.push('director = ?')
      values.push(director)
    }
    if (rate) {
      updates.push('rate = ?')
      values.push(rate)
    }
    if (poster) {
      updates.push('poster = ?')
      values.push(poster)
    }

    values.push(id)

    if (updates.length > 0) {
      // selecciona pelicula con id
      // ? cambia los datos y haz un create?

      const query = `UPDATE movie SET ${updates.join(', ')} WHERE id = UUID_TO_BIN(?);`
      const result = await connection.query(
        query,
        values
      )
      console.log(result)
      return title
    }
  }
}

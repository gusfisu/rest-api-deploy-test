import z from 'zod'

// validamos aqui por aprendizaje, lo suyo es tener
// una carpeta de validaciones/schema
const moviesSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title mus be a string',
    required_error: 'Movie title is required. Please, check url'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5), // nulable()
  // poster: z.string().url().endsWith('jpg')//muchas posibilidades
  // se puede añadrid cosas especificas dentro de los metodos
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  // genre: z.array(z.string()) //bien pero en este caso pueden poner cualquier cosa
  // un array de enums concretos.
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    { // se pueden poner opciones
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
  // lo mismo q el anterior pero el .array al final
  // genre: z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']).array())

})

export function validateMovie (object) {
  // return moviesSchema.parse(object)//es mas rollo por tene q mete try cath
  return moviesSchema.safeParse(object)// devuelve objeto resove si hay o no datos, con un if solo
  // return moviesSchema.safeParseAsync(object)// version async
}

export function validatePartialMovie (object) {
  // partial sirve para q cada propidad de esquema de validacion
  // sea opcional de forma q si no esta la propiedad no la valida ni modifica
  // pero si esta, valida solo las que llegan con la validacion q le corresponda sin
  // tener q validar el resto
  return moviesSchema.partial().safeParse(object)
}

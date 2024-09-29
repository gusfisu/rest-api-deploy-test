import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234'
]
// esta linea se pone {} para q no pete cuando se metas datos desde app principal
// esto es una funcion q devuelve la funcionalidad de cors
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  // valido el de abajo si paso las opciones
  // export const corsMiddleware = ({ options}) => cors({

  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowd by cors'))
  }

})

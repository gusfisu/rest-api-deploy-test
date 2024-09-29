import { Routes } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Routes()

moviesRouter.get('/', MovieController.getAll())

moviesRouter.get('/:id', MovieController.getById())

moviesRouter.post('/', MovieController.create())

moviesRouter.delete('/:id', MovieController.delete())

moviesRouter.patch('/:id', MovieController.update())

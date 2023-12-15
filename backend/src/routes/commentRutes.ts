import { Router } from 'express'
import commentController from '../controllers/commentController'

const commentRouter = Router()

commentRouter.get('/', commentController.getAll.bind(commentController))
commentRouter.post('/', commentController.create.bind(commentController))
commentRouter.delete('/:id', commentController.deleteById.bind(commentController))

export = commentRouter
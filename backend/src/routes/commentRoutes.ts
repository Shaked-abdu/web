import { Router } from 'express'
import commentController from '../controllers/commentController'

const commentRouter = Router()

commentRouter.get('/', commentController.getAll.bind(commentController))
commentRouter.post('/', commentController.post.bind(commentController))
commentRouter.put('/:id', commentController.updateById.bind(commentController))
commentRouter.delete('/:id', commentController.deleteById.bind(commentController))

export = commentRouter
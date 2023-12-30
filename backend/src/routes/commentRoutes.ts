import { Router } from 'express'
import commentController from '../controllers/commentController'
import authMiddleware from '../common/authMiddleware'

const commentRouter = Router()

commentRouter.get('/post/:id', authMiddleware, commentController.getByPostId.bind(commentController))
commentRouter.post('/', authMiddleware, commentController.post.bind(commentController))
commentRouter.delete('/:id', authMiddleware,commentController.deleteById.bind(commentController))

export = commentRouter
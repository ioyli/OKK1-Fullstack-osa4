const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// examine all entries
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

// examine single entry
blogsRouter.get('/:id', async (req, res, next) => {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

// create new entry
blogsRouter.post('/', async (req, res) => {
    const body = req.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  })

// remove single entry
blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

// edit single entry
blogsRouter.put('/:id', async (req, res, next) => {
    const body = req.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    }

    Blog.findByIdAndUpdate(req.params.id, blog, {new: true})
        .then(updatedBlog => {
            res.json(updatedBlog.json)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter
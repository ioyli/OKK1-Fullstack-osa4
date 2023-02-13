const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./testHelper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

describe('viewing specific blog', () => {

    test('succeed with valid id', async () => {
        const blogsInBeginning = await helper.blogsinDb()
        const blogToView = blogsInBeginning[0]

        const result = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual(blogToView)
    })

    test('fail with code 404 if blog does not exist', async () => {
        const validId = await helper.invalidId()
        console.log(validId)

        await api
        .get(`/api/blogs/${validId}`)
        .expect(404)
    })

    test('fail with code 400 if id is invalid', async () => {
        const invalidId = 'test'

        await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })

})

describe('adding new blogs', () => {
    test('succeed with valid data', async () => {
        const newBlog = {
            title: 'im trying my best',
            author: 'dev',
            url: '/api/blogs',
            likes: 0
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAfterAddition = await helper.blogsinDb()
        expect(blogsAfterAddition).toHaveLength(helper.initialBlogs.length + 1)

        const title = blogsAfterAddition.map(blog => blog.title)
        expect(title).toContain('im trying my best')
    })

    test('fail with code 400 if data is invalid', async () => {
        const newBlog = {
            url: 'peekaboo'
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

        const blogsAfterTest = await helper.blogsinDb()
        expect(blogsAfterTest).toHaveLength(helper.initialBlogs.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
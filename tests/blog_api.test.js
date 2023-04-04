const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./testHelper')
const app = require('../app')
const User = require('../models/user')
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
            likes: 10
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
            author: 'yippee',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAfterTest = await helper.blogsinDb()
        expect(blogsAfterTest).toHaveLength(helper.initialBlogs.length)
    })

    test('set likes to 0 if no specific value is given', async () => {
        const newBlog = {
            title: 'as fluttershy would say',
            author: 'yay',
            url: '/'
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAfterAddition = await helper.blogsinDb()
        expect(blogsAfterAddition).toHaveLength(helper.initialBlogs.length + 1)
        
        const likes = blogsAfterAddition.map(blog => blog.likes)
        expect(likes[blogsAfterAddition.length - 1]).toEqual(0)
    })
})

describe('editing existing blogs', () => {
    test('increase blog likes by 1', async () => {
        const existingBlogs = await helper.blogsinDb()
        const editedBlog = {
            title: existingBlogs[0].title,
            author: existingBlogs[0].author,
            url: existingBlogs[0].url,
            likes: existingBlogs[0].likes + 1
        }

        await api
        .put(`/api/blogs/${existingBlogs[0].id}`)
        .send(editedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const blogsAfterAddition = await helper.blogsinDb()
        expect(blogsAfterAddition[0].likes).toEqual(editedBlog.likes)
    })
})

describe('initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('soupysecret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('succeed with unique username', async () => {

        // bababooey

    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
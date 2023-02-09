const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0
    blogs.forEach(blog => {
        likes = likes + blog.likes
    })

    return likes
}

const favoriteBlog = (blogs) => {
    let favoriteIndex = 0
    let mostLikes = 0
    for (let i = 0; i < blogs.length; i++) {
        if (mostLikes < blogs[i].likes) {
            favoriteIndex = i
            mostLikes = blogs[i].likes
        }
    }

    let favorite = blogs[favoriteIndex]
    return favorite
}

const mostBlogs = (blogs) => {
    // return author with most blogs, and their blog count
}

const mostLikes = (blogs) => {
    // return author with most likes, and their total like count
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
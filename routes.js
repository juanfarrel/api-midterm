const { simpanBukuHandler, showBooksHandler, getBookByIdHandler, updateBook, deleteBook } = require("./handler")

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: simpanBukuHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: showBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBook,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBook,
    }
]

module.exports = routes
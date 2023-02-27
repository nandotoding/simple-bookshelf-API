const bookData = require("./books");
const {nanoid} = require("nanoid");

const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(10);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (name === undefined) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);
    }

    const newBook = {id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt};
    bookData.push(newBook);

    return h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
            bookId: id,
        },
    }).code(201);
};

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    if (reading !== undefined) {
        const books = bookData.filter(b => b.reading == reading).map(({id, name, publisher}) => ({id, name, publisher}));

        return h.response({
            status: "success",
            data: {books},
        }).code(200);
    }

    if (finished !== undefined) {
        const books = bookData.filter(b => b.finished == finished).map(({id, name, publisher}) => ({id, name, publisher}));

        return h.response({
            status: "success",
            data: {books},
        }).code(200);
    }

    if (name !== undefined) {
        const books = bookData.filter(b => b.name.toLowerCase().includes(name.toLowerCase())).map(({id, name, publisher}) => ({id, name, publisher}));

        return h.response({
            status: "success",
            data: {books},
        }).code(200);
    }

    const books = bookData.map(({id, name, publisher}) => ({id, name, publisher}));

    return h.response({
        status: "success",
        data: {books},
    }).code(200);
};

const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = bookData.filter(b => b.id === bookId)[0];

    if (book === undefined) {
        return h.response({
            status: "fail",
            message: "Buku tidak ditemukan",
        }).code(404);
    }

    return h.response({
        status: "success",
        data: {book},
    }).code(200);
};

const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();

    if (name === undefined) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);
    }

    const index = bookData.findIndex(book => book.id === bookId);

    if (index === -1) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
        }).code(404);
    }

    bookData[index] = {...bookData[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt};

    return h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
    }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const index = bookData.findIndex(b => b.id === bookId);

    if (index === -1) {
        return h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        }).code(404);
    }

    bookData.splice(index, 1);

    return h.response({
        status: "success",
        message: "Buku berhasil dihapus",
    }).code(200);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};

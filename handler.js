const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf");
const { request } = require("express");

const simpanBukuHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  // console.log(request.payload)
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished;

  if (pageCount == readPage) {
    finished = true;
  } else {
    finished = false;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;  
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } else {
    bookshelf.push(newBook);
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: `${id}`,
      },
    });
    response.code(201);
    return response;
  }
};

const showBooksHandler = (request, h) => {
  let list = [];

  const queryName = request.query.name;
  const queryReading = request.query.reading;
  const queryFinished = request.query.finished;

  if(queryName !== undefined){
    // console.log(queryName)
    for (let i = 0; i < bookshelf.length; i++) {
      if(bookshelf[i].name.toLowerCase().indexOf(queryName.toLowerCase()) !== -1){
        const schema = {
          id: bookshelf[i].id,
          name: bookshelf[i].name,
          publisher: bookshelf[i].publisher,
        };
        list.push(schema);
       }
    }
    // console.log(list)

    if(list == null){
      const response = h.response({
        status: "fail",
        message: "No books found",
      });
      response.code(404);
      return response;
    } else {
      const response = h.response({
        status: "success",
        data: {
          books: list,
        },
      });
      response.code(200);
      return response;
    }
  }

  if(queryReading !== undefined){
    // console.log(queryName)
    for (let i = 0; i < bookshelf.length; i++) {
      if(bookshelf[i].reading == queryReading){
        const schema = {
          id: bookshelf[i].id,
          name: bookshelf[i].name,
          publisher: bookshelf[i].publisher,
        };
        list.push(schema);  
       }
    }
    
    if(list == null){
      const response = h.response({
        status: "fail",
        message: "No books found",
      });
      response.code(404);
      return response;
    } else {
      const response = h.response({
        status: "success",
        data: {
          books: list,
        },
      });
      response.code(200);
      return response;
    }
  }

  if(queryFinished !== undefined){
    // console.log(queryName)
    for (let i = 0; i < bookshelf.length; i++) {
      if(bookshelf[i].finished == queryFinished){
        const schema = {
          id: bookshelf[i].id,
          name: bookshelf[i].name,
          publisher: bookshelf[i].publisher,
        };
        list.push(schema);  
       }
    }
    
    if(list == null){
      const response = h.response({
        status: "fail",
        message: "No books found",
      });
      response.code(404);
      return response;
    } else {
      const response = h.response({
        status: "success",
        data: {
          books: list,
        },
      });
      response.code(200);
      return response;
    }
  }

  // console.log(queryName, queryReading, queryFinished)
  if (queryName == undefined && queryReading == undefined && queryFinished == undefined){

    for (let i = 0; i < bookshelf.length; i++) {
      const schema = {
        id: bookshelf[i].id,
        name: bookshelf[i].name,
        publisher: bookshelf[i].publisher,
      };
      list.push(schema);
    }
  
    const response = h.response({
      status: "success",
      data: {
        books: list,
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  let tampung;
  for (let i = 0; i < bookshelf.length; i++) {
    if (bookshelf[i].id == request.params.id) {
      tampung = bookshelf[i];
    }
  }

  if (tampung == null) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  } else {
    const response = h.response({
      status: "success",
      data: {
        book: tampung,
      },
    });
    response.code(200);
    return response;
  }

};


const updateBook = (request, h) => {

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let indexBook = -1;
  
  let targetBook = {
    name : name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    reading: reading,
  }

  const newUpdated = new Date().toISOString();

  for (let i = 0; i < bookshelf.length; i++) {
    if (bookshelf[i].id == request.params.id) {
      indexBook = i;
    }
  }

  let finished;
  if (pageCount == readPage) {
    finished = true;
  } else {
    finished = false;
  }

  if(indexBook == -1) {
    const response = h.response(
      {
          "status": "fail",
          "message": "Gagal memperbarui buku. Id tidak ditemukan"
      }
    )
    response.code(404)
    return response
  }

  if (name == null){
    const response = h.response(
      {
        "status": "fail",
        "message": "Gagal memperbarui buku. Mohon isi nama buku"
      }
    )
    response.code(400)
    return response
  }

  if(readPage > pageCount){
    const response = h.response(
      {
        "status": "fail",
        "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
      }
    )
    response.code(400)
    return response
  }

  bookshelf[indexBook].name = targetBook.name
  bookshelf[indexBook].year = targetBook.year
  bookshelf[indexBook].author = targetBook.author
  bookshelf[indexBook].summary = targetBook.summary
  bookshelf[indexBook].publisher = targetBook.publisher
  bookshelf[indexBook].pageCount = targetBook.pageCount
  bookshelf[indexBook].readPage = targetBook.readPage
  bookshelf[indexBook].updatedAt = newUpdated
  
  const response = h.response(
    {
      "status": "success",
      "message": "Buku berhasil diperbarui"
    }
  )
  response.code(200)
  return response

};

const deleteBook = (request, h) => {
  let cek = 0;
  for (let i = 0; i < bookshelf.length; i++) {
    if (bookshelf[i].id == request.params.id) {
      cek = 0;
      bookshelf.splice(i, 1);
      const response = h.response(
        {
          "status": "success",
          "message": "Buku berhasil dihapus"
        }
      )
      response.code(200)
      return response
    }
  }

  if (cek == 0){
    const response = h.response(
      {
        "status": "fail",
        "message": "Buku gagal dihapus. Id tidak ditemukan"
    }
    )
    response.code(404)
    return response
  }

};



module.exports = { simpanBukuHandler, showBooksHandler, getBookByIdHandler, updateBook, deleteBook};

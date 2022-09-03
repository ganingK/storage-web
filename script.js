const kunciLocalStorage = "RAK_BUKU";

// untuk selector dom
const judul = document.getElementById("inputanJudulBuku");
const pengarangBuku = document.getElementById("inputPengarangBuku");
const terbitBuku = document.getElementById("inputTerbitBuku");

//inputan untuk rakbuku
const kelarBaca = document.getElementById("inputKelarBaca");
const tombolSubmit = document.getElementById("tombolSubmit");

//inputan pencarian
const pencarianJudulBuku = document.getElementById("inputPencarianJudul");
const tombolCariJudul = document.getElementById("tombolCariJudul");

//untuk deklarasi varibel checkin
let testInput = []
let testTitle = null
let testAuthor = null
let testYear = null

window.addEventListener("load", function(){
    if (localStorage.getItem(kunciLocalStorage) !== null) {    
        const dataBuku = ambilData()
        tampilkanData(dataBuku)
    }
})

tombolCariJudul.addEventListener("click", function(a) {
    a.preventDefault()
    if (localStorage.getItem(kunciLocalStorage) == null){
        return alert("Buku habis")
    } else {
        const getByJudul = ambilData().filter(n => n.judul == pencarianJudulBuku.value.trim());
        if(getByJudul.length == 0) {
            const getByPengarang = ambilData().filter(n => n.pengarangBuku == pencarianJudulBuku.value.trim());
            if(getByPengarang.length == 0) {
                const getByTahun = ambilData().filter(n=> n.terbitBuku == pencarianJudulBuku.value.trim());
                if(getByTahun.length == 0) {
                    alert ("Buku tidak ditembukan: ${pencarianJudulBuku.value}")
                }else{
                    showSearchResult(getByTahun);
                }
            }else {
                showSearchResult(getByPengarang);
            }
        }else {
            showSearchResult(getByJudul);
        }
    }
    pencarianJudulBuku.value = ""
})

tombolSubmit.addEventListener("click", function() {
    if(tombolSubmit == "") {
        testInput = []

        judul.classList.remove("error")
        pengarangBuku.classList.remove("error")
        terbitBuku.classList.remove("error")

        if (judul.value == "") {
            testTitle = false
        }else{
            testTitle = true
        }
        if (pengarangBuku.value == "") {
            testAuthor = false
        }else{
            testAuthor = true
        }

        if (terbitBuku.value == "") {
            testYear = false
        }else{
            testYear = true
        }
        testInput.push(testTitle,testAuthor,testYear)
        let resultCheck = validation(testInput)
        
        if (resultCheck.includes(false)) {
            return false
        }else{
            const newBook = {
                id: +new Date(),
                title: judul.value.trim(),
                author: pengarangBuku.value.trim(),
                year: terbitBuku.value,
                isCompleted: kelarBaca.checked
            }
            inputData(newBook)

            judul.value = ''
            pengarangBuku.value = ''
            terbitBuku.value = ''
            kelarBaca.checked = false
        }
    }else {
        const bookData = ambilData().filter(n => n.id != tombolSubmit.value);
        localStorage.setItem(kunciLocalStorage,JSON.stringify(bookData))

        const newBook = {
            id: tombolSubmit.value,
            title: judul.value.trim(),
            author: pengarangBuku.value.trim(),
            year: terbitBuku.value,
            isCompleted: kelarBaca.checked
        }
        inputData(newBook)
        tombolSubmit.innerHTML = "Masukkan Buku"
        tombolSubmit.value = ''
        judul.value = ''
        pengarangBuku.value = ''
        terbitBuku.value = ''
        kelarBaca.checked = false
        alert("Buku berhasil diedit")
    }
})

function validation(check) {
    let resultCheck = []
    
    check.forEach((n,t) => {
        if (n == false) {
            if (t == 0) {
                judul.classList.add("error")
                // errorTitle.classList.remove("error-display")
                resultCheck.push(false)
            }else if (t == 1) {
                pengarangBuku.classList.add("error")
                // errorAuthor.classList.remove("error-display")
                resultCheck.push(false)
            }else{
                terbitBuku.classList.add("error")
                // errorYear.classList.remove("error-display")
                resultCheck.push(false)
            }
        }
    });

    return resultCheck
}

function inputData(book) {
    let bookData = []

    if (localStorage.getItem(kunciLocalStorage) === null) {
        localStorage.setItem(kunciLocalStorage, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(kunciLocalStorage))
    }

    bookData.unshift(book)   
    localStorage.setItem(kunciLocalStorage,JSON.stringify(bookData))

    tampilkanData(ambilData())
}

function ambilData() {
    return JSON.parse(localStorage.getItem(kunciLocalStorage)) || []
}

function tampilkanData(books = []) {
    const inCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")

    inCompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false) {
            let el = `
            <article class="book_item">
                <h3>${book.judul}</h3>
                <p>Penulis: ${book.pengarangBuku}</p>
                <p>Tahun: ${book.terbitBuku}</p>

                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>`
            
            inCompleted.innerHTML += el
        }else{
            let il = `
            <article class="book_item">
                <h3>${book.judul}</h3>
                <p>Penulis: ${book.pengarangBuku}</p>
                <p>Tahun: ${book.terbitBuku}</p>

                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Belum selesai di Baca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `
            completed.innerHTML += il
        }
    });
}

function showSearchResult(books) {
    const searchResult = document.querySelector("#searchResult")

    searchResult.innerHTML = ''

    books.forEach(book => {
        let il = `
        <article class="book_item">
            <h3>${book.judul}</h3>
            <p>Penulis: ${book.pengarangBuku}</p>
            <p>Tahun: ${book.terbitBuku}</p>
            <p>${book.isCompleted ? 'Sudah dibaca' : 'Belum dibaca'}</p>
        </article>
        `

        searchResult.innerHTML += il
    });
}

function readedBook(id) {
    let confirmation = confirm("Pindahkan Buku yang selesai?")

    if (confirmation == true) {
        const bookDataDetail = ambilData().filter(n => n.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].judul,
            author: bookDataDetail[0].pengarangBuku,
            year: bookDataDetail[0].terbitBuku,
            isCompleted: true
        }

        const bookData = ambilData().filter(n => n.id != id);
        localStorage.setItem(kunciLocalStorage,JSON.stringify(bookData))

        inputData(newBook)
    }else{
        return 0
    }
}

function unreadedBook(id) {
    let confirmation = confirm("Pindahkan buku belum selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = ambilData().filter(n => n.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].judul,
            author: bookDataDetail[0].pengarangBuku,
            year: bookDataDetail[0].terbitBuku,
            isCompleted: false
        }

        const bookData = ambilData().filter(n => n.id != id);
        localStorage.setItem(kunciLocalStorage,JSON.stringify(bookData))

        inputData(newBook)
    }else{
        return 0
    }
}

function editBook(id) {
    const bookDataDetail = ambilData().filter(n => n.id == id);
    judul.value = bookDataDetail[0].judul
    pengarangBuku.value = bookDataDetail[0].pengarangBuku
    terbitBuku.value = bookDataDetail[0].terbitBuku
    bookDataDetail[0].isCompleted ? kelarBaca.checked = true:kelarBaca.checked = false

    tombolSubmit.innerHTML = "Edit buku"
    tombolSubmit.value = bookDataDetail[0].id
}

function deleteBook(id) {
    let confirmation = confirm("Yakin mau dihapus?")

    if (confirmation == true) {
        const bookDataDetail = ambilData().filter(n => n.id == id);
        const bookData = ambilData().filter(n => n.id != id);
        localStorage.setItem(kunciLocalStorage,JSON.stringify(bookData))
        tampilkanData(ambilData())
        alert(`Buku ${bookDataDetail[0].judul} telah terhapus`)
    }else{
        return 0
    }
}
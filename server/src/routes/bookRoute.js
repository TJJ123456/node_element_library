import { Books, BookShelf, Genres, BorrowList, Users } from '../providers'
import express from 'express'
const route = express.Router();

async function getByname(name) {
    return await Books.findOne({ name })
}

route.post('/create', async (req, res, next) => {
    try {
        const data = {
            name: req.body.name,
            desc: req.body.desc,
            author: req.body.author,
            publisher: req.body.publisher,
            genre: req.body.genre,
            filepath: req.body.filepath,
            lendTimes: req.body.lendTimes,
            maleClick: 0,
            femaleClick: 0,
            allClick: 0,
        }
        const newDoc = await Books.insert(data);
        res.json({ status: 'ok' })
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

route.get('/count', async (req, res, next) => {
    try {
        let data = await Books.count({});
        res.json({
            data: data
        });
    } catch (e) {
        res.status(405).send(e.message);
    }

})

route.post('/list', async (req, res, next) => {
    const limit = req.body.limit;
    const offset = req.body.offset;
    try {
        let data = await Books.find({}, { limit: limit, skip: offset });
        // for (let i = 0; i < data.length; ++i) {
        //     if (data[i].bookshelf !== '') {
        //         let shelf = await BookShelf.findOne({ _id: data[i].bookshelf });
        //         data[i].shelfname = shelf.name;
        //     }
        // }
        res.json({
            data: data
        });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.get('/list', async (req, res, next) => {
    try {
        let data = await Books.find({});
        for (let i = 0; i < data.length; ++i) {
            data[i].genreNames = [];
            for (let j = 0; j < data[i].genres.length; ++j) {
                let genre = Genres.findOne({ _id: data[i].genres[j] });
                data[i].genreNames.push(genre.name);
            }
        }
        res.json({
            data: data
        });
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

route.get('/malelist', async (req, res, next) => {
    try {
        let data = await Books.find({}, { limit: 5, sort: { maleClick: -1 } });
        for (let i = 0; i < data.length; ++i) {
            data[i].genreNames = [];
            for (let j = 0; j < data[i].genres.length; ++j) {
                let genre = Genres.findOne({ _id: data[i].genres[j] });
                data[i].genreNames.push(genre.name);
            }
        }
        res.json({
            data: data
        });
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

route.get('/femalelist', async (req, res, next) => {
    try {
        let data = await Books.find({}, { limit: 5, sort: { femaleClick: -1 } });
        for (let i = 0; i < data.length; ++i) {
            data[i].genreNames = [];
            for (let j = 0; j < data[i].genres.length; ++j) {
                let genre = Genres.findOne({ _id: data[i].genres[j] });
                data[i].genreNames.push(genre.name);
            }
        }
        res.json({
            data: data
        });
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

route.get('/clicklist', async (req, res, next) => {
    try {
        let data = await Books.find({}, { limit: 5, sort: { allClick: -1 } });
        for (let i = 0; i < data.length; ++i) {
            data[i].genreNames = [];
            for (let j = 0; j < data[i].genres.length; ++j) {
                let genre = Genres.findOne({ _id: data[i].genres[j] });
                data[i].genreNames.push(genre.name);
            }
        }
        res.json({
            data: data
        });
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

route.get('/newlist', async (req, res, next) => {
    try {
        let data = await Books.find({}, { limit: 5, sort: { time: -1 } });
        for (let i = 0; i < data.length; ++i) {
            data[i].genreNames = [];
            for (let j = 0; j < data[i].genres.length; ++j) {
                let genre = Genres.findOne({ _id: data[i].genres[j] });
                data[i].genreNames.push(genre.name);
            }
        }
        res.json({
            data: data
        });
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

route.post('/delete', async (req, res, next) => {
    const id = req.body.id;
    try {
        let data = await Books.removeOne({ _id: id });
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.post('/change', async (req, res, next) => {
    const id = req.body._id;
    try {
        const data = {
            name: req.body.name,
            desc: req.body.desc,
            author: req.body.author,
            publisher: req.body.publisher,
            genre: req.body.genre,
            filepath: req.body.filepath,
            lendTimes: req.body.lendTimes,
            maleClick: req.body.maleClick,
            femaleClick: req.body.femaleClick,
            allClick: req.body.allClick,
        }
        let doc = await Books.update({ _id: id }, data);
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.post('/detail', async (req, res, next) => {
    const id = req.body.id;
    try {
        let book = await Books.findOne({ _id: id });
        if (req.session.user) {
            if (req.session.user.sex === 0) {
                book.maleClick++;
            } else {
                book.femaleClick++;
            }
        }
        book.allClick++;
        await Books.updateOne({ _id: id }, book);
        book.genreNamelist = [];
        for (let i = 0; i < book.genres.length; ++i) {
            let doc = await Genres.findOne({ _id: book.genres[i] })
            book.genreNamelist.push(doc.name);
        }
        // let borrowInfo = await BorrowList.findOne({ book: id, backTime: 0 })
        let borrowInfo = {};
        let relateList = await Books.find({ $or: [{ genres: [book.genres[0]] }, { author: book.author }] }, { limit: 10 });
        console.log(relateList.length);
        res.json({ book: book, borrowInfo: borrowInfo, relateList: relateList });
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

// route.post('/borrow', async (req, res, next) => {
//     const bookId = req.body.id;
//     try {
//         if (!req.session.user) {
//             throw new Error('请登录');
//         }
//         let date = new Date();
//         const data = {
//             book: bookId,
//             reader: req.session.user._id,
//             borrowTime: date.getTime(),
//             backTime: 0,//没还书就是0
//         }
//         const doc = await BorrowList.insert(data);
//         let upbook = await Books.updateOne({ _id: bookId }, { $set: { 'state': "已借出" } });
//         res.json({ book: upbook, borrowInfo: doc });
//     } catch (e) {
//         res.status(405).send(e.message);
//     }
// })

// route.post('/backBook', async (req, res, next) => {
//     const bookId = req.body.id;
//     try {
//         if (!req.session.user) {
//             throw new Error('请登录');
//         }
//         let date = new Date();
//         const doc = await BorrowList.updateOne({ book: bookId, backTime: 0, reader: req.session.user._id }, { $set: { 'backTime': date.getTime() } });
//         console.log('还书情况', doc);
//         let upbook = await Books.updateOne({ _id: bookId }, { $set: { 'state': "可借阅" } });
//         let book = await Books.findOne({ _id: bookId });
//         if (book.bookshelf !== '') {
//             let shelf = await BookShelf.findOne({ _id: book.bookshelf });
//             book.shelfname = shelf.name;
//         }
//         book.genreNamelist = [];
//         for (let i = 0; i < book.genre.length; ++i) {
//             let doc = await Genres.findOne({ _id: book.genre[i] })
//             book.genreNamelist.push(doc.name);
//         }
//         res.json({ book: book, borrowInfo: doc });
//     } catch (e) {
//         res.status(405).send(e.message);
//     }
// })

route.post('/usersearch', async (req, res, next) => {
    const keyword = req.body.keyword;
    let regex = new RegExp(keyword);
    try {
        let data = await Books.find({ "name": regex });
        res.json({ data: data });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

// route.get('/borrowlist', async (req, res, next) => {
//     try {
//         if (!req.session.user) {
//             throw new Error('请登录');
//         }
//         let list = await BorrowList.find({ reader: req.session.user._id }, { sort: { backTime: 1 } });
//         for (let i in list) {
//             list[i].bookdetail = await Books.findOne({ _id: list[i].book });
//             if (list[i].bookdetail.bookshelf !== '') {
//                 let shelf = await BookShelf.findOne({ _id: list[i].bookdetail.bookshelf });
//                 list[i].bookdetail.shelfname = shelf.name;
//             }
//         }
//         res.json({ data: list });
//     } catch (e) {
//         res.status(405).send(e.message);
//     }
// })

// route.post('/managerborrowlist', async (req, res, next) => {
//     const limit = req.body.limit;
//     const offset = req.body.offset;
//     try {
//         let list = await BorrowList.find({}, { sort: { backTime: 1 }, limit: limit, skip: offset });
//         console.log('借书列表', list);
//         for (let i in list) {
//             list[i].bookname = (await Books.findOne({ _id: list[i].book })).name;
//             list[i].readername = (await Users.findOne({ _id: list[i].reader })).username;
//         }
//         res.json({ data: list });
//     } catch (e) {
//         res.status(405).send(e.message);
//     }
// })

export default route;
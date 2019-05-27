import { Books, BookShelf, Genres, BorrowList, Users, BookInstances } from '../providers'
import express from 'express'
const route = express.Router();

async function getByname(name) {
    return await Books.findOne({ name })
}

route.post('/create', async (req, res, next) => {
    try {
        const data = {
            bookid: req.body.bookid,
            state: req.body.state,
            borrowtime: req.body.borrowtime,
            backtime: req.body.backtime,
        }
        const newDoc = await BookInstances.insert(data);
        res.json({ status: 'ok' })
    } catch (e) {
        console.log(e.message);
        res.status(405).send(e.message);
    }
})

route.get('/count', async (req, res, next) => {
    try {
        let data = await BookInstances.count({});
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
        let data = await BookInstances.find({}, { limit: limit, skip: offset });
        for (let i = 0; i < data.length; ++i) {
            if (data[i].bookshelf !== '') {
                let shelf = await BookShelf.findOne({ _id: data[i].bookshelf });
                data[i].shelfname = shelf.name;
                let book = await Books.findOne({ _id: data[i].bookid });
                data[i].bookname = book.name;
            }
        }
        res.json({
            data: data
        });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.get('/list', async (req, res, next) => {
    try {
        let data = await BookInstances.find({});
        for (let i = 0; i < data.length; ++i) {
            let book = await Books.findOne({ _id: data[i].bookid });
            data[i].bookname = book.name;
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
        let data = await BookInstances.removeOne({ _id: id });
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.post('/change', async (req, res, next) => {
    const id = req.body._id;
    try {
        let state = req.body.state;
        let bookshelf = state === '维护' ? '' : req.body.bookshelf;
        const doc = {
            bookid: req.body.bookid,
            state: req.body.state,
            borrowtime: req.body.borrowtime,
            backtime: req.body.backtime,
        }
        let data = await BookInstances.update({ _id: id }, doc);
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

// route.post('/detail', async (req, res, next) => {
//     const id = req.body.id;
//     try {
//         let book = await Books.findOne({ _id: id });
//         if (book.bookshelf !== '') {
//             let shelf = await BookShelf.findOne({ _id: book.bookshelf });
//             book.shelfname = shelf.name;
//         }
//         book.genreNamelist = [];
//         for (let i = 0; i < book.genre.length; ++i) {
//             let doc = await Genres.findOne({ _id: book.genre[i] })
//             book.genreNamelist.push(doc.name);
//         }
//         let borrowInfo = await BorrowList.findOne({ book: id, backTime: 0 })
//         res.json({ book: book, borrowInfo: borrowInfo });
//     } catch (e) {
//         res.status(405).send(e.message);
//     }
// })

route.post('/borrow', async (req, res, next) => {
    const bookid = req.body.id;
    try {
        if (!req.session.user) {
            throw new Error('请登录');
        }
        let activeBook = await BookInstances.findOne({ bookid: bookid, state: 0 });
        if (!activeBook) {
            throw new Error('本书被借完啦');
        }
        console.log(activeBook);
        let doc = await BorrowList.findOne({ reader: req.session.user._id, bookid: bookid, backTime: 0 });
        if (doc) {
            throw new Error('您已借阅过了');
        }
        let date = new Date();
        const data = {
            bookid: bookid,
            bookinstanceid: activeBook._id,
            reader: req.session.user._id,
            borrowTime: date.getTime(),
            backTime: 0,//没还书就是0
        }
        const newdoc = await BorrowList.insert(data);
        console.log(newdoc);
        let upbook = await BookInstances.updateOne({ _id: activeBook._id }, { $set: { 'state': 1 } });
        res.json({ state: 'ok' });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.post('/backBook', async (req, res, next) => {
    const bookinstanceid = req.body.id;
    try {
        if (!req.session.user) {
            throw new Error('请登录');
        }
        let date = new Date();
        const doc = await BorrowList.updateOne({ bookinstanceid: bookinstanceid, backTime: 0, reader: req.session.user._id }, { $set: { 'backTime': date.getTime() } });
        console.log('还书情况', doc);
        let upbook = await BookInstances.updateOne({ _id: bookinstanceid }, { $set: { 'state': 0 } });
        res.json({ state: 'ok' });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

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

route.get('/borrowlist', async (req, res, next) => {
    try {
        if (!req.session.user) {
            throw new Error('请登录');
        }
        let list = await BorrowList.find({ reader: req.session.user._id }, { sort: { backTime: 1 } });
        for (let i in list) {
            list[i].bookdetail = await Books.findOne({ _id: list[i].book });
            if (list[i].bookdetail.bookshelf !== '') {
                let shelf = await BookShelf.findOne({ _id: list[i].bookdetail.bookshelf });
                list[i].bookdetail.shelfname = shelf.name;
            }
        }
        res.json({ data: list });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.post('/managerborrowlist', async (req, res, next) => {
    const limit = req.body.limit;
    const offset = req.body.offset;
    try {
        let list = await BorrowList.find({}, { sort: { backTime: 1 }, limit: limit, skip: offset });
        console.log('借书列表', list);
        for (let i in list) {
            list[i].bookname = (await Books.findOne({ _id: list[i].book })).name;
            list[i].readername = (await Users.findOne({ _id: list[i].reader })).username;
        }
        res.json({ data: list });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

export default route;
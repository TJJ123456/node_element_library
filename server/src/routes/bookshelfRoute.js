import { BookShelf, Books } from '../providers'
import express from 'express'
const route = express.Router();

async function getByname(name) {
    return await BookShelf.findOne({ name })
}

route.post('/create', async (req, res, next) => {
    try {
        const doc = await getByname(req.body.name);
        if (doc) {
            throw new Error('已有同名的书单');
        }
        const data = {
            name: req.body.name,
            desc: req.body.desc,
            booklist: [],
        }
        const newDoc = await BookShelf.insert(data);
        res.json({ status: 'ok' })
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.get('/count', async (req, res, next) => {
    try {
        let data = await BookShelf.count({});
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
        let data = await BookShelf.find({}, { limit: limit, skip: offset });
        res.json({
            data: data
        });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.get('/list', async (req, res, next) => {
    try {
        let data = await BookShelf.find({});
        for (let i = 0; i < data.length; ++i) {
            data[i].bookInfoList = [];
            for (let j = 0; j < data[i].booklist.length; ++j) {
                let doc = await Books.findOne({ _id: data[i].booklist[j] });
                if (doc) {
                    data[i].bookInfoList.push(doc);
                }
            }
        }
        res.json({
            data: data
        });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.post('/delete', async (req, res, next) => {
    const id = req.body.id;
    try {
        let data = await BookShelf.removeOne({ _id: id });
        let tmp = await Books.update({ 'bookshelf': id }, { $set: { 'bookshelf': "" } })
        res.json({ status: 'ok' })
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
            booklist: req.body.booklist,
        }
        let newDoc = await BookShelf.updateOne({ _id: id }, data);
        res.json({ status: 'ok' })
    } catch (e) {
        res.status(405).send(e.message);
    }
})

route.post('/transferBook', async (req, res, next) => {
    const bookshelfId = req.body.bookshelfId;
    const addShelfList = req.body.addShelfList;
    const removeShelfList = req.body.removeShelfList;
    console.log(removeShelfList);
    try {
        addShelfList.forEach(async (item) => {
            let data = await Books.updateOne({ _id: item }, { $set: { 'bookshelf': bookshelfId } });
        })
        removeShelfList.forEach(async (item) => {
            let data = await Books.updateOne({ _id: item }, { $set: { 'bookshelf': "" } });
        })
        let data = await BookShelf.findOne({ _id: bookshelfId });
        console.log('数据', data);
        if (data)
            data.bookList = await Books.find({ 'bookshelf': bookshelfId })
        res.json({
            data: data
        });
    } catch (e) {
        res.status(405).send(e.message);
    }
})

export default route;

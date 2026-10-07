const express = require('express');
const router = express.Router();

const {
    getReadDB,
    getWriteDB
} = require('../config/db');

const VAT = 15;
const MSSV_PREFIX = '119';

// GET /books → dùng tài khoản READ
router.get('/', async (req, res) => {
    try {
        const books = await getReadDB()
            .collection('books')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.render('index', {
            books,
            fullName: 'Lê Tuấn Khải',
            studentId: '23IT119',
            vat: VAT
        });
    } catch (error) {
        console.error('READ error:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu sách.');
    }
});

// POST /books → dùng tài khoản WRITE
router.post('/', async (req, res) => {
    try {
        const {
            productCode,
            title,
            author,
            price
        } = req.body;

        if (!productCode || !productCode.startsWith(MSSV_PREFIX)) {
            return res.status(400).send(
                'Mã sản phẩm phải bắt đầu bằng 119.'
            );
        }

        const originalPrice = Number(price);

        if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
            return res.status(400).send(
                'Giá sách phải là số lớn hơn 0.'
            );
        }

        const priceAfterTax =
            Math.round(originalPrice * (1 + VAT / 100) * 100) / 100;

        await getWriteDB()
            .collection('books')
            .insertOne({
                productCode,
                title,
                author,
                priceBeforeTax: originalPrice,
                priceAfterTax,
                vat: VAT,
                createdAt: new Date()
            });

        res.redirect('/books');
    } catch (error) {
        console.error('WRITE error:', error);
        res.status(500).send('Lỗi khi thêm sách.');
    }
});

module.exports = router;

const db = require('../models');
const crypto = require('crypto');
let querystring = require('qs');
const moment = require('moment');
require('dotenv').config();

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
	}
	return sorted;
}

const createPaymentUrl = async (amount, orderInfo, returnUrl) => {
	const tmnCode = process.env.VNP_TMNCODE;
	const secretKey = process.env.VNP_SECRET;
	let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

	let date = new Date();
	let createDate = moment(date).format('YYYYMMDDHHmmss');
	let vnpParams = {
		vnp_Version: '2.1.0',
		vnp_Command: 'pay',
		vnp_TmnCode: tmnCode,
		vnp_Locale: 'vn',
		vnp_CurrCode: 'VND',
		vnp_TxnRef: Date.now(),
		vnp_OrderInfo: orderInfo,
		vnp_OrderType: 'other',
		vnp_Amount: amount * 100,
		// vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
		vnp_ReturnUrl: returnUrl,
		vnp_IpAddr: '127.0.0.1',
		vnp_CreateDate: createDate,
	};

	vnpParams = sortObject(vnpParams);

	let signData = querystring.stringify(vnpParams, { encode: false });
	let hmac = crypto.createHmac('sha512', secretKey);
	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
	vnpParams['vnp_SecureHash'] = signed;
	vnpUrl += '?' + querystring.stringify(vnpParams, { encode: false });
	return { paymentUrl: vnpUrl };
};

const getIPNInfo = async (amount, orderInfo, returnUrl) => {
	let vnp_Params = req.query;
};

module.exports = {
	createPaymentUrl,
	getIPNInfo,
};

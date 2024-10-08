const db = require('../models');
const crypto = require('crypto');
let querystring = require('qs');
require('dotenv').config();

const sortObject = (obj) => {
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
};

const getIPNInfo = async (vnp_Params) => {
	const secureHash = vnp_Params['vnp_SecureHash'];

	delete vnp_Params['vnp_SecureHash'];
	delete vnp_Params['vnp_SecureHashType'];

	vnp_Params = sortObject(vnp_Params);
	let secretKey = process.env.VNP_SECRET;
	let signData = querystring.stringify(vnp_Params, { encode: false });
	let hmac = crypto.createHmac('sha512', secretKey);
	let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

	if (secureHash === signed) {
		const orderId = vnp_Params['vnp_TxnRef'];
		const paymentStatus = vnp_Params['vnp_TransactionStatus'];

		console.log('Transaction is valid, processing order...');
		//Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
		if (paymentStatus === '00') {
			// Giao dịch thành công
			try {
				const order = await db.Order.findOne({ where: { id: orderId } });
				if (order) {
					order.status = 'paid';
					await order.save();
				}
			} catch (error) {
				console.error('Error updating order status:', error);
			}
		}
		return { success: true, RspCode: '00', Message: 'success' };
	} else {
		return { success: true, RspCode: '97', Message: 'Fail checksum' };
	}
};

module.exports = {
	getIPNInfo,
};

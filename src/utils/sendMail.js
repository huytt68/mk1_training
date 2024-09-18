const nodemailer = require('nodemailer');
const db = require('../models');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com', // smtp gmail
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.PROJECT_MAIL,
		pass: process.env.APP_PASSWORD,
	},
});

const sendOrderConfirmationMail = async (to, orderDetail) => {
	try {
		// Email content
		const mailOptions = {
			from: '"NODEJS_API PROJECT" <huytt68.3@gmail.com>',
			to: `${orderDetail.user.username} < ${to}>`,
			subject: 'NODEJS_API PROJECT | XÁC NHẬN ĐƠN HÀNG',
			text: `Your order #${orderDetail.order_id} has been confirmed. Please check your order details.`,
			html: `
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>Đơn hàng #${orderDetail.order_id} của bạn đã được xác nhận và đang được xử lý.</p>
        <h2>Chi tiết đơn hàng:</h2>
        <ul>
          ${orderDetail.items
						.map(
							(item) => `
            <li>${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price}</li>
          `
						)
						.join('')}
        </ul>
        <p>Tổng cộng: ${orderDetail.total_amount}</p>
        <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi.</p>
      `,
		};
		await transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log('Lỗi khi gửi email:', error);
			} else {
				console.log('Email đã được gửi tới user:', info.response);
			}
		});
	} catch (error) {
		console.error('Lỗi khi gửi email:', error);
		throw error;
	}
};

const sendNewOrderNoti = async (orderDetail) => {
	try {
		const admins = await db.User.findAll({
			include: { model: db.Role, as: 'role', where: { name: 'admin' } },
		});
		if (admins.length > 0) {
			const adminEmails = admins.map((admin) => admin.email);
			const mailOptions = {
				from: '"NODEJS_API PROJECT" <huytt68.3@gmail.com>',
				to: adminEmails,
				subject: `NODEJS_API PROJECT | Đơn hàng mới được tạo bởi ${orderDetail.user.username} (Order #${orderDetail.order_id})`,
				text: `A new order has been successfully created by User ID: ${orderDetail.user.id}.`,
				html: `
        <h1>Một đơn hàng đã được tạo bởi ${orderDetail.user.username}.</h1>
        <p>Đơn hàng vừa được tạo và đang được xử lý.</p>
        <h2>Chi tiết đơn hàng:</h2>
        <ul>
          <li>Order ID: #${orderDetail.order_id}</li>
          <li>User: ${orderDetail.user.username}</li>
          <li>Total Amount: ${orderDetail.total_amount}</li>
          <li>Order Status: ${orderDetail.status}</li>
          <li>Created At: ${orderDetail.created_at}</li>
          <li> Chi tiết mặt hàng:
            <ul>
            ${orderDetail.items
							.map(
								(item) => `
                <li>${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price}</li>
            `
							)
							.join('')}
            </ul>
            </li>
        </ul>
        `,
			};
			await transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log('Lỗi khi gửi email:', error);
				} else {
					console.log('Email đã được gửi tới tất cả admin:', info.response);
				}
			});
		} else {
			console.log('Không có admin nào để gửi email.');
		}
	} catch (error) {
		console.error('Lỗi khi gửi email:', error);
		throw error;
	}
};

module.exports = {
	sendOrderConfirmationMail,
	sendNewOrderNoti,
};

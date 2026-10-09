const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// قاعدة بيانات مؤقتة في الذاكرة لتجربة المسار (MVP)
let orders = [
  { id: '101', status: 'بانتظار الدفع', trackingHistory: ['تم إنشاء الطلب'], itemsCount: 3, totalAmount: 150 },
  { id: '102', status: 'قيد الشحن', trackingHistory: ['تم إنشاء الطلب', 'تم تأكيد الدفع', 'تم الشحن'], itemsCount: 1, totalAmount: 85 }
];

let payments = [];

// 1. مسار جلب قائمة الطلبات (شاشة طلباتي)
app.get('/orders', (req, res) => {
  res.json({ success: true, orders });
});

// 2. مسار تتبع حالة طلب معين
app.get('/orders/:id/tracking', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  res.json({ success: true, status: order.status, trackingHistory: order.trackingHistory });
});

// 3. مسار جلب حالة الطلب
app.get('/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  res.json({ success: true, status: order.status });
});

// 4. مسار رفع وتسجيل الدفع
app.post('/payments', (req, res) => {
  const { orderId, amount, receiptUrl } = req.body;
  const payment = { id: Date.now().toString(), orderId, amount, receiptUrl, date: new Date() };
  payments.push(payment);
  
  // تحديث حالة الطلب تلقائياً إلى "تم الدفع"
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'تم الدفع - قيد التجهيز';
    order.trackingHistory.push('تم رفع الإيصال وتأكيد الدفع');
  }

  res.json({ success: true, message: 'تم إرسال الدفع بنجاح', payment });
});

// تشغيل السيرفر على المنفذ 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Track 2 Server is running on http://localhost:${PORT}`);
});
const API_URL = "http://localhost:5000";

async function submitPayment() {
    const orderId = document.getElementById("orderId").value;
    const amount = document.getElementById("amount").value;
    const resultDiv = document.getElementById("paymentResult");

    if (!orderId || !amount) {
        resultDiv.innerHTML = "<div class='status-box' style='color:red;'>يرجى تعبئة جميع الحقول</div>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, amount })
        });
        const data = await response.json();
        resultDiv.innerHTML = `<div class='status-box'>تم إرسال الدفع بنجاح! حالة الطلب: ${data.status || 'مكتمل'}</div>`;
    } catch (error) {
        resultDiv.innerHTML = "<div class='status-box' style='color:red;'>فشل الاتصال بالسيرفر</div>";
    }
}

async function trackOrder() {
    const orderId = document.getElementById("trackOrderId").value;
    const resultDiv = document.getElementById("trackResult");

    if (!orderId) {
        resultDiv.innerHTML = "<div class='status-box' style='color:red;'>يرجى إدخال رقم الطلب</div>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`);
        const data = await response.json();
        resultDiv.innerHTML = `<div class='status-box'>حالة الطلب الحالي: ${data.status || 'تحت المعالجة'}</div>`;
    } catch (error) {
        resultDiv.innerHTML = "<div class='status-box' style='color:red;'>لم يتم العثور على الطلب</div>";
    }
}
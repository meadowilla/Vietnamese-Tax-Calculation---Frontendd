import { useState } from "react";
import './ContactScreen.css';

function ContactScreen() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    date: "",
    content: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async () => {
    const { name, phoneNumber, email, date, content } = formData;

    if (!name || !phoneNumber || !email || !date) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/auth/contact/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          phoneNumber,
          email,
          date,
          content,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Đặt lịch thành công!");
        setMessageType("success");
        setFormData({
          name: "",
          phoneNumber: "",
          email: "",
          date: "",
          content: "",
        });
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 1000);
      } else {
        setMessage(data.message || "Gửi yêu cầu thất bại.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("Lỗi kết nối tới máy chủ.");
      setMessageType("error");
    }
  };

  const renderTextInput = (label, id, placeholder) => (
    <div className="form-group">
      <label className="label" htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        name={id}
        className="input-box"
        placeholder={placeholder}
        value={formData[id]}
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
      />
    </div>
  );

  const renderNumInput = (label, id, placeholder) => (
    <div className="form-group">
      <label className="label" htmlFor={id}>{label}</label>
      <input
        type="tel"
        id={id}
        name={id}
        className="input-box"
        placeholder={placeholder}
        value={formData[id]}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");
          setFormData({ ...formData, [id]: value });
        }}
      />
    </div>
  );

  const renderDateInput = (label, id) => (
    <div className="form-group">
      <label className="label" htmlFor={id}>{label}</label>
      <input
        type="date"
        name={id}
        id={id}
        className="input-box"
        value={formData[id]}
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
      />
    </div>
  );

  const renderTextAreaInput = (label, id, placeholder) => (
    <div className="form-group">
      <label className="label" htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={id}
        className="input-box"
        placeholder={placeholder}
        value={formData[id]}
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
      />
    </div>
  );

  const packages = [
    { name: "Gói Cơ Bản", price: "", description: "" },
    { name: "Gói Liên Hệ Nhanh", price: "", description: "" }
  ];

  if (!selectedPackage) {
    return (
      <div className="package-selection">
        <h2 className="heading">Chọn gói dịch vụ liên hệ</h2>
        <div className="package-list">
          {packages.map((pkg, idx) => (
            <div key={idx} className="packet-card">
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <p className="price">{pkg.price}</p>
              <button onClick={() => setSelectedPackage(pkg.name)}>Liên hệ ngay</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="form">
      <div className="background">
        <h2 className="heading">
          Liên hệ với chúng tôi
          <br />
          <span style={{ color: '#00754a' }}>{selectedPackage}</span>
        </h2>
        {renderTextInput("Họ và tên", "name", "Nhập họ và tên")}
        {renderNumInput("Số điện thoại", "phoneNumber", "Nhập số điện thoại")}
        {renderTextInput("Email", "email", "Nhập email")}
        {renderDateInput("Thời gian", "date")}
        {renderTextAreaInput("Nội dung tư vấn", "content", "Nhập nội dung tư vấn")}
      </div>

      <div className="button-container">
        <button className="button-layout" onClick={() => setSelectedPackage(null)}>Quay lại</button>
        <button className="button-layout" onClick={handleSubmit}>Đặt lịch</button>
      </div>

      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default ContactScreen;

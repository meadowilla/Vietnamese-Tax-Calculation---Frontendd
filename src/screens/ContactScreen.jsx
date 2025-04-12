import { useState } from "react";
import './ContactScreen.css';

function ContactScreen() {
  const[formData, setFormData] = useState({
    name:"",
    phoneNumber:"",
    email:"",
    date:"",
  });
  const renderInput = (label, id, placeholder) => (
    <div className="form-group">
      <div className="blabel">
        <label className="label" htmlFor={id}>{label}</label>
      </div>
      <input
        type="number"
        id={id}
        name={id}
        className="input-box"
        placeholder={placeholder}
        value={formData[id]}
        onchange={(e) => setFormData({...formData, [id]: e.target.value})}
      />
    </div> 
  );
  const renderDateInput = (label, id) =>(
    <div className="form-group">
      <label className="label" htmlFor="id">{label}</label>
      <input 
      type="date"
      name={id} 
      id={id}
      className="input-box"
      value={formData[id]}
      onChange={(e) => setFormData({...formData, [id]: e.target.value})} 
      />
    </div>
  );
  return (
    <div className="form">
      <div className="background">
        <h2 className="heading">Liên hệ với chúng tôi</h2>
        {renderInput("Họ và tên", "name", "Nhập họ và tên")}
        {renderInput("Số điện thoại", "phoneNumber", "Nhập số điện thoại")}
        {renderInput("Email", "email", "Nhập email")}
        {renderDateInput("Thời gian", "date")}
      </div>

      <div className="button-container">
        <button className ="button-layout">Đặt lịch</button>
      </div>
    </div>
  );
}

export default ContactScreen;
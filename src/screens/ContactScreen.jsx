import { useState } from "react";
import './ContactScreen.css';

function ContactScreen() {
  const[formData, setFormData] = useState({
    name:"",
    phoneNumber:"",
    email:"",
    date:"",
  });
  const renderDataInput = (label, id, placeholder) => (
    <div className="form-group">
      <div className="label">
        <label className="label" htmlFor={id}>{label}</label>
      </div>
      <input
        type="text"
        id={id}
        name={id}
        className="input-box"
        placeholder={placeholder}
        value={formData[id]}
        onChange={(e) => setFormData({...formData, [id]: e.target.value})}
      />
    </div> 
  );
  const renderNumInput = (label, id, placeholder) => (
    <div className="form-group">
      <div className="label">
        <label className="label" htmlFor={id}>{label}</label>
      </div>
      <input
        type="tel"
        id={id}
        name={id}
        className="input-box"
        placeholder={placeholder}
        value={formData[id]}
        onChange={(e) =>{
          let value = e.target.value;
          value = value.replace(/\D/g, "");
          setFormData({...formData, [id]:value});
        }}
      />
    </div> 
  );
  const renderDateInput = (label, id) =>(
    <div className="form-group">
      <label className="label" htmlFor={id}>{label}</label>
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
  //message
  const[message, setMessage] = useState("");
  const[messageType, setMessageType]= useState("");
  const handleSubmit = () => {
    const{name, phoneNumber, email, date} = formData;
    if(!name||!phoneNumber||!email||!date){
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      setMessageType("error");
    }else{
      setMessage("Đặt lịch thành công!");
      setMessageType("success");
    }
  };

  return (
    <div className="form">
      <div className="background">
        <h2 className="heading">Liên hệ với chúng tôi</h2>
        {renderDataInput("Họ và tên", "name", "Nhập họ và tên")}
        {renderNumInput("Số điện thoại", "phoneNumber", "Nhập số điện thoại")}
        {renderDataInput("Email", "email", "Nhập email")}
        {renderDateInput("Thời gian", "date")}
      </div>

      <div className="button-container">
        <button className ="button-layout" onClick={handleSubmit}>Đặt lịch</button>
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
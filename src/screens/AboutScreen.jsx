import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './AboutScreen.css';

function AboutScreen() {
  const navigate = useNavigate();

  // Function to handle navigation to TaxCalculationScreen at /tinhthuethang
  const handleNavigateToTaxCalculator = () => {
    navigate('/tinhthuethang'); // Updated to match your route
  };

  return (
    <div className="about-container">
      
      {/* Hero Section */}
      <motion.section
        className="section bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h1 className="heading">Đơn giản hoá việc tính thuế</h1>
        <p className="subheading">Công cụ tính thuế thu nhập cá nhân đơn giản, minh bạch, phù hợp với mọi người Việt.</p>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="section bg-gray-50 flex flex-col md:flex-row items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="image-container">
          <img src="/leaf-bg.jpg" alt="Sứ mệnh" className="rounded-xl shadow-lg" />
        </div>
        <div className="text-container">
          <h2 className="title">Sứ mệnh</h2>
          <p className="description">
            Chúng tôi mang đến giải pháp giúp bạn kê khai và tính thuế thu nhập cá nhân một cách dễ dàng, minh bạch, và tuân thủ đúng quy định thuế tại Việt Nam.
          </p>
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section
        className="section bg-white flex flex-col md:flex-row-reverse items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="image-container">
          <img src="/coffee-cup.jpg" alt="Tầm nhìn" className="rounded-xl shadow-lg" />
        </div>
        <div className="text-container">
          <h2 className="title">Tầm nhìn</h2>
          <p className="description">
            Chúng tôi hướng tới việc giúp mọi cá nhân tại Việt Nam quản lý thuế thu nhập dễ dàng hơn nhờ công nghệ hiện đại và trải nghiệm thân thiện.
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="section bg-gray-50 flex flex-col justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="title text-center mb-8">Tại sao bạn sẽ yêu thích công cụ của chúng tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          {[
            { heading: "Kết quả chính xác", description: "Đảm bảo tính toán chính xác theo quy định thuế mới nhất của Việt Nam, không lo sai sót." },
            { heading: "Giao diện thân thiện", description: "Thiết kế đơn giản, dễ hiểu, giúp bạn tính thuế chỉ trong vài bước." },
            { heading: "Tiết kiệm thời gian", description: "Tự động hóa quy trình, giúp bạn hoàn thành nghĩa vụ thuế nhanh chóng." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold mb-4">{feature.heading}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call To Action */}
      <motion.section
        className="section bg-white flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="heading mb-8">Bắt đầu tính thuế ngay!</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="cta-button"
          onClick={handleNavigateToTaxCalculator}
        >
          Tính thuế ngay
        </motion.button>
      </motion.section>

    </div>
  );
}

export default AboutScreen;
const getTax = async () => {
  try {
    const response = await fetch('http://localhost:8000/calculate-tax', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "year":2025,
            "month":1,
            "dependents": 1,
            "region": 1,

            "income_labor_contract": 20000000,
            "taxed_labor_contract": false,

            "income_no_contract": 5000000,
            "taxed_no_contract": true,

            "income_foreign_contract": 30000000,
            "deducted_tax_abroad": false,

            "use_flat_rate": true,
            "business_income_flat": {
              "distribution": 100000000,
              "service": 50000000
            },

            "once_off_income": {
              "real_estate": 300000000,
              "investment": 20000000,
              "capital_transfer": 0,
              "royalty":0,
              "lottery":0,
              "inheritance":0
              
            },
            "taxed_once_off": {
              "investment": true,
              "real_estate": false,
              "capital_transfer": false,
              "royalty":false,
              "lottery":false,
              "inheritance":false
            }
        }
),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json(); // Phản hồi từ API
    console.log(data); // Xử lý dữ liệu trả về
  } catch (error) {
    console.error('Error:', error);
  }
};

getTax();

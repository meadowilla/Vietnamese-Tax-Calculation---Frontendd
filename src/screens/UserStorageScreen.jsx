import React, { use, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/UserSlice';
import { useEffect } from 'react';
import "./UserStorageScreen.css";

function UserStorageScreen() {
  const user = useSelector(selectUser);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedYearRecord, setSelectedYearRecord] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showYearPopup, setShowYearPopup] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Mặc định là năm hiện tại
  const [taxRecords, setTaxRecords] = useState([]);
  
  useEffect(() => {
    if(user?.accessToken && user?.userId) {
      fetchTaxRecords();
    }
  }, [user]);

  const fetchTaxRecords = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tax/storage/?userId=${user.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        }
      });

      const res = await response.json();
      
      if (res.success) {
        const data = res.data;

        let records = data.map(record => ({
          id: record._id,
          month: record.input.month,
          year: record.input.year,
          totalIncome: record.output.total_income,
          taxDue: record.output.tax_need_to_pay.business + record.output.tax_need_to_pay.one_time,
          taxPaid: record.output.tax_paid.business + record.output.tax_paid.one_time,
          salaryIncomes: [
            { 
              name: 'HĐLĐ >3 tháng', 
              amount: record.input.income_labor_contract, 
              taxDue: 0.375, 
              taxPaid: 0.375 
            },
            { 
              name: 'HĐLĐ <3 tháng / Không có HĐLĐ', 
              amount: record.input.income_no_contract, 
              taxDue: 0.375, 
              taxPaid: 0.375 
            },
            { 
              name: 'HĐLĐ nước ngoài', 
              amount: record.input.income_foreign_contract, 
              taxDue: 0.375, 
              taxPaid: 0.375 
            }
          ],
          businessIncomes: [
            { 
              name: 'Phân phối hàng hóa', 
              amount: record.input.business_income_flat.distribution, 
              taxDue: 0.375, 
              taxPaid: 0.375 
            },
            { 
              name: 'Dịch vụ xây dựng', 
              amount: record.input.business_income_flat.service, 
              taxDue: 1.26, 
              taxPaid: 1 
            },
            { 
              name: 'Cho thuê tài sản', 
              amount: record.input.business_income_flat.rent, 
              taxDue: 1.2, 
              taxPaid: 0.6 
            },
            { 
              name: 'Đại lý xổ số, bảo hiểm, bán hàng đa cấp', 
              amount: record.input.business_income_flat.agent, 
              taxDue: 1.2, 
              taxPaid: 0.6 
            },
            { 
              name: 'Dịch vụ hàng hóa', 
              amount: record.input.business_income_flat.production, 
              taxDue: 1.2, 
              taxPaid: 0.6 
            },
            { 
              name: 'Kinh doanh khác', 
              amount: record.input.business_income_flat.others, 
              taxDue: 1.2, 
              taxPaid: 0.6 
            }
          ],
          otherIncomes: [
            { 
              name: 'Chuyển nhượng BĐS', 
              amount: record.input.once_off_income.real_estate, 
              taxDue: 0.3, 
              taxPaid: 0.3 
            },
            { 
              name: 'Đầu tư vốn', 
              amount: record.input.once_off_income.investment, 
              taxDue: 0.5, 
              taxPaid: 0.5 
            },
            { 
              name: 'Chuyển nhượng vốn', 
              amount: record.input.once_off_income.capital_transfer, 
              taxDue: 0.5, 
              taxPaid: 0.5 
            },
            { 
              name: 'Bản quyền, nhượng quyền thương mại', 
              amount: record.input.once_off_income.royalty, 
              taxDue: 0.5, 
              taxPaid: 0.5 
            },
            { 
              name: 'Trúng thưởng', 
              amount: record.input.once_off_income.lottery, 
              taxDue: 0.2, 
              taxPaid: 0.2 
            },
            { 
              name: 'Thừa kế, quà tặng', 
              amount: record.input.once_off_income.inheritance, 
              taxDue: 0.2, 
              taxPaid: 0.2 
            },
          ]
        }));
        
        setTaxRecords(records);
      } else {
        console.error('Failed to fetch tax records:', res.message);
        // Xử lý lỗi nếu cần
        setTaxRecords([]); // Đặt lại dữ liệu nếu không thành công
      }
    } catch (error) {
      console.error('Error fetching tax records:', error);
      // Xử lý lỗi nếu cần
      setTaxRecords([]); // Đặt lại dữ liệu nếu có lỗi
    }
  };

  console.log('taxRecords:', taxRecords);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Lấy danh sách các năm có trong records
  const availableYears = [...new Set(taxRecords.map(record => record.year))];

  // Lọc records theo năm được chọn
  const filteredRecords = taxRecords.filter(record => record.year === selectedYear);

  // Tính tổng theo nhóm
  const calculateGroupTotal = (items) => items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const calculateGroupTaxDue = (items) => items.reduce((sum, item) => sum + (item.taxDue || 0), 0);
  const calculateGroupTaxPaid = (items) => items.reduce((sum, item) => sum + (item.taxPaid || 0), 0);

  // Chuẩn bị dữ liệu biểu đồ
  const prepareIncomeData = (record) => [
    { name: 'Tiền lương', value: calculateGroupTotal(record.salaryIncomes) },
    { name: 'Kinh doanh', value: calculateGroupTotal(record.businessIncomes) },
    { name: 'Phát sinh', value: calculateGroupTotal(record.otherIncomes) }
  ];

  const prepareTaxData = (record) => [
    { name: 'Thuế lương', value: calculateGroupTaxDue(record.salaryIncomes) },
    { name: 'Thuế kinh doanh', value: calculateGroupTaxDue(record.businessIncomes) },
    { name: 'Thuế phát sinh', value: calculateGroupTaxDue(record.otherIncomes) }
  ];

  // Chuẩn bị dữ liệu biểu đồ năm
  const prepareYearlyData = () => {
    return filteredRecords.map(record => ({
      month: `Tháng ${record.month}`,
      totalIncome: record.totalIncome,
      taxDue: record.taxDue,
      taxPaid: record.taxPaid
    }));
  };

  // Tính tổng cả năm
  const calculateYearlyTotals = () => {
    return filteredRecords.reduce((totals, record) => {
      return {
        totalIncome: totals.totalIncome + record.totalIncome,
        taxDue: totals.taxDue + record.taxDue,
        taxPaid: totals.taxPaid + record.taxPaid,
        salaryIncomes: record.salaryIncomes.map((income, index) => {
          const existing = totals.salaryIncomes[index] || { amount: 0, taxDue: 0, taxPaid: 0 };
          return {
            name: income.name,
            amount: existing.amount + income.amount,
            taxDue: existing.taxDue + income.taxDue,
            taxPaid: existing.taxPaid + income.taxPaid
          };
        }),
        businessIncomes: record.businessIncomes.map((income, index) => {
          const existing = totals.businessIncomes[index] || { amount: 0, taxDue: 0, taxPaid: 0 };
          return {
            name: income.name,
            amount: existing.amount + income.amount,
            taxDue: existing.taxDue + income.taxDue,
            taxPaid: existing.taxPaid + income.taxPaid
          };
        }),
        otherIncomes: record.otherIncomes.map((income, index) => {
          const existing = totals.otherIncomes[index] || { amount: 0, taxDue: 0, taxPaid: 0 };
          return {
            name: income.name,
            amount: existing.amount + income.amount,
            taxDue: existing.taxDue + income.taxDue,
            taxPaid: existing.taxPaid + income.taxPaid
          };
        })
      };
    }, { 
      totalIncome: 0, 
      taxDue: 0, 
      taxPaid: 0,
      salaryIncomes: [],
      businessIncomes: [],
      otherIncomes: []
    });
  };

  const handleViewMore = (record) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  const handleViewYearReport = () => {
    setSelectedYearRecord(calculateYearlyTotals());
    setShowYearPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedRecord(null);
  };

  const handleCloseYearPopup = () => {
    setShowYearPopup(false);
    setSelectedYearRecord(null);
  };

  return (
    <div className="user-storage-container">
      <div className="storage-header">
        <h2 className="storage-title">Lưu trữ dữ liệu thuế</h2>
        <div className="year-selector">
          <label>Năm:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="year-select-input"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button 
            className="view-year-btn"
            onClick={handleViewYearReport}
            disabled={filteredRecords.length === 0}
          >
            Báo cáo năm
          </button>
        </div>
      </div>
      
      {filteredRecords.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có dữ liệu thuế được lưu trữ cho năm {selectedYear}</p>
        </div>
      ) : (
        <div className="user-records-list">
          {filteredRecords.map((record) => (
            <div key={record.id} className="user-record-card">
              <div className="record-header">
                <h3>Thuế tháng {record.month}/{record.year}</h3>
              </div>
              
              <div className="record-summary">
                <div className="summary-item">
                  <span>Tổng thu nhập:</span>
                  <span>{record.totalIncome.toLocaleString()} triệu VNĐ</span>
                </div>
                <div className="summary-item">
                  <span>Tổng thuế cần nộp:</span>
                  <span>{record.taxDue.toLocaleString()} triệu VNĐ</span>
                </div>
                <div className="summary-item">
                  <span>Tổng thuế đã nộp:</span>
                  <span>{record.taxPaid.toLocaleString()} triệu VNĐ</span>
                </div>
              </div>
              
              <button 
                className="view-more-btn"
                onClick={() => handleViewMore(record)}
              >
                Xem thêm
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup báo cáo tháng */}
      {showPopup && selectedRecord && (
        <div className="report-popup-overlay">
          <div className="report-popup">
            <button className="close-popup-btn" onClick={handleClosePopup}>×</button>
            
            <h2 className="report-title">Báo cáo thuế tháng {selectedRecord.month}/{selectedRecord.year}</h2>
            
            <div className="report-summary">
              <div className="summary-box">
                <h3>Tổng thu nhập</h3>
                <p>{selectedRecord.totalIncome.toLocaleString()} triệu VNĐ</p>
              </div>
              <div className="summary-box">
                <h3>Tổng thuế cần nộp</h3>
                <p>{selectedRecord.taxDue.toLocaleString()} triệu VNĐ</p>
              </div>
              <div className="summary-box">
                <h3>Tổng thuế đã nộp</h3>
                <p>{selectedRecord.taxPaid.toLocaleString()} triệu VNĐ</p>
              </div>
            </div>
            
            <div className="charts-container">
              <div className="chart">
                <h3>Phân bổ thu nhập</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={prepareIncomeData(selectedRecord)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareIncomeData(selectedRecord).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} triệu`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="chart">
                <h3>Phân bổ thuế cần nộp</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={prepareTaxData(selectedRecord)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareTaxData(selectedRecord).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} triệu`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="user-details">
              {/* Bảng thu nhập từ lương */}
              <div className="income-category">
                <h4>Thu nhập từ lương</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Loại thu nhập</th>
                      <th>Số tiền (triệu VNĐ)</th>
                      <th>Thuế cần nộp</th>
                      <th>Thuế đã nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.salaryIncomes.map((income, index) => (
                      <tr key={`salary-${index}`}>
                        <td>{income.name}</td>
                        <td>{income.amount.toLocaleString()}</td>
                        <td>{income.taxDue.toLocaleString()}</td>
                        <td>{income.taxPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Tổng cộng</td>
                      <td>{calculateGroupTotal(selectedRecord.salaryIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxDue(selectedRecord.salaryIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxPaid(selectedRecord.salaryIncomes).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Bảng thu nhập kinh doanh */}
              <div className="income-category">
                <h4>Thu nhập từ kinh doanh</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Loại thu nhập</th>
                      <th>Số tiền (triệu VNĐ)</th>
                      <th>Thuế cần nộp</th>
                      <th>Thuế đã nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.businessIncomes.map((income, index) => (
                      <tr key={`business-${index}`}>
                        <td>{income.name}</td>
                        {console.log("income:", income)}
                        {console.log("income.amount:", income.amount)}
                        <td>{income.amount.toLocaleString()}</td>
                        <td>{income.taxDue.toLocaleString()}</td>
                        <td>{income.taxPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Tổng cộng</td>
                      <td>{calculateGroupTotal(selectedRecord.businessIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxDue(selectedRecord.businessIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxPaid(selectedRecord.businessIncomes).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Bảng thu nhập phát sinh */}
              <div className="income-category">
                <h4>Thu nhập phát sinh</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Loại thu nhập</th>
                      <th>Số tiền (triệu VNĐ)</th>
                      <th>Thuế cần nộp</th>
                      <th>Thuế đã nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.otherIncomes.map((income, index) => (
                      <tr key={`other-${index}`}>
                        <td>{income.name}</td>
                        <td>{income.amount.toLocaleString()}</td>
                        <td>{income.taxDue.toLocaleString()}</td>
                        <td>{income.taxPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Tổng cộng</td>
                      <td>{calculateGroupTotal(selectedRecord.otherIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxDue(selectedRecord.otherIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxPaid(selectedRecord.otherIncomes).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup báo cáo năm */}
      {showYearPopup && selectedYearRecord && (
        <div className="report-popup-overlay">
          <div className="report-popup">
            <button className="close-popup-btn" onClick={handleCloseYearPopup}>×</button>
            
            <h2 className="report-title">Báo cáo thuế năm {selectedYear}</h2>
            
            <div className="report-summary">
              <div className="summary-box">
                <h3>Tổng thu nhập</h3>
                <p>{selectedYearRecord.totalIncome.toLocaleString()} triệu VNĐ</p>
              </div>
              <div className="summary-box">
                <h3>Tổng thuế cần nộp</h3>
                <p>{selectedYearRecord.taxDue.toLocaleString()} triệu VNĐ</p>
              </div>
              <div className="summary-box">
                <h3>Tổng thuế đã nộp</h3>
                <p>{selectedYearRecord.taxPaid.toLocaleString()} triệu VNĐ</p>
              </div>
            </div>
            
            <div className="charts-container">
              <div className="chart">
                <h3>Thu nhập các tháng trong năm</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareYearlyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} triệu`} />
                    <Legend />
                    <Bar dataKey="totalIncome" name="Thu nhập" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="chart">
                <h3>Thuế các tháng trong năm</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareYearlyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} triệu`} />
                    <Legend />
                    <Bar dataKey="taxDue" name="Thuế cần nộp" fill="#00C49F" />
                    <Bar dataKey="taxPaid" name="Thuế đã nộp" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="user-details">
              {/* Bảng thu nhập từ lương cả năm */}
              <div className="income-category">
                <h4>Thu nhập từ lương cả năm</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Loại thu nhập</th>
                      <th>Số tiền (triệu VNĐ)</th>
                      <th>Thuế cần nộp</th>
                      <th>Thuế đã nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedYearRecord.salaryIncomes.map((income, index) => (
                      <tr key={`year-salary-${index}`}>
                        <td>{income.name}</td>
                        <td>{income.amount.toLocaleString()}</td>
                        <td>{income.taxDue.toLocaleString()}</td>
                        <td>{income.taxPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Tổng cộng</td>
                      <td>{calculateGroupTotal(selectedYearRecord.salaryIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxDue(selectedYearRecord.salaryIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxPaid(selectedYearRecord.salaryIncomes).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Bảng thu nhập kinh doanh cả năm */}
              <div className="income-category">
                <h4>Thu nhập từ kinh doanh cả năm</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Loại thu nhập</th>
                      <th>Số tiền (triệu VNĐ)</th>
                      <th>Thuế cần nộp</th>
                      <th>Thuế đã nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedYearRecord.businessIncomes.map((income, index) => (
                      <tr key={`year-business-${index}`}>
                        <td>{income.name}</td>
                        <td>{income.amount.toLocaleString()}</td>
                        <td>{income.taxDue.toLocaleString()}</td>
                        <td>{income.taxPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Tổng cộng</td>
                      <td>{calculateGroupTotal(selectedYearRecord.businessIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxDue(selectedYearRecord.businessIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxPaid(selectedYearRecord.businessIncomes).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Bảng thu nhập phát sinh cả năm */}
              <div className="income-category">
                <h4>Thu nhập phát sinh cả năm</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Loại thu nhập</th>
                      <th>Số tiền (triệu VNĐ)</th>
                      <th>Thuế cần nộp</th>
                      <th>Thuế đã nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedYearRecord.otherIncomes.map((income, index) => (
                      <tr key={`year-other-${index}`}>
                        <td>{income.name}</td>
                        <td>{income.amount.toLocaleString()}</td>
                        <td>{income.taxDue.toLocaleString()}</td>
                        <td>{income.taxPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Tổng cộng</td>
                      <td>{calculateGroupTotal(selectedYearRecord.otherIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxDue(selectedYearRecord.otherIncomes).toLocaleString()}</td>
                      <td>{calculateGroupTaxPaid(selectedYearRecord.otherIncomes).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserStorageScreen;
import React, { useState, useRef } from 'react';
import "./TaxCalculationScreen.css";
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

function TaxCalculationScreen() {
  const [hasDeductedTax, setHasDeductedTax] = useState(false);
  const [formData, setFormData] = useState({
    paymentDate: '',
  });

  // State cho phần thu nhập kinh doanh
  const [businessIncomeType, setBusinessIncomeType] = useState('fixedRate');
  const [fixedRateIncomes, setFixedRateIncomes] = useState({
    goodsDistribution: '',
    serviceConstruction: '',
    propertyRental: '',
    agencyServices: '',
    productionTransport: '',
    otherBusiness: ''
  });
  const [netIncome, setNetIncome] = useState({
    totalRevenue: '',
    deductibleCost: ''
  });

  const [errors, setErrors] = useState({
    month: "",
    year: "",
    dependents: "",
    longTermIncome: "",
    shortTermIncome: "",
    foreignIncome: "",
    deductedTax: "",
    source1: "",
    source2: "",
    source3: "",
    source4: "",
    source5: "",
    source6: "",
    // Errors cho thuế khoán
    goodsDistribution: "",
    serviceConstruction: "",
    propertyRental: "",
    agencyServices: "",
    productionTransport: "",
    otherBusiness: "",
    // Errors cho thuế ròng
    totalRevenue: "",
    deductibleCost: "",
  });

  const inputRefs = {
    month: useRef(null),
    year: useRef(null),
    dependents: useRef(null),
    longTermIncome: useRef(null),
    shortTermIncome: useRef(null),
    foreignIncome: useRef(null),
    deductedTax: useRef(null),
    paymentDate: useRef(null),

    // once_off_income
    realEstate: useRef(null),
    investment: useRef(null),
    capitalTransfer: useRef(null),
    royalty: useRef(null),
    lottery: useRef(null),
    inheritance: useRef(null),
  };

  const [results, setResults] = useState({
    totalIncome: 0,
    taxOwed: 0,
    taxPaid: 0
  });

  const validateInput = (value, type, inputType) => {
    if (inputType === 'date') return "";

    const regex = /^[0-9]*$/;
    if (!value.match(regex)) {
      return `${type} chỉ được nhập số lớn hơn hoặc bằng 0`;
    }
    if (parseInt(value) < 0) {
      return `${type} phải lớn hơn hoặc bằng 0`;
    }
    return "";
  };

  const renderInput = (label, id, placeholder, tooltip, inputProps = {}, error = "", inputRef = null, articleId = null) => (
    <div className="form-group">
      <div className="label-with-tooltip">
        <label className="label" htmlFor={id}>{label}</label>
        <span className="tooltip-custom">
          ⓘ <span className="tooltip-text">{tooltip} <br />
            {articleId && (
              <a
                href={`/sotay/${articleId}`}
                className='tooltip-link'
                target='_blank'
                rel='noopener noreferrer'>
                Xem thêm
              </a>
            )}
          </span>
        </span>
      </div>
      <input
        type="text"
        id={id}
        name={id}
        className={`input-box ${error ? "input-error-border" : ""}`}
        placeholder={placeholder}
        {...inputProps}
        ref={inputRef}
        onInput={(e) => {
          const value = e.target.value;
          const errorMessage = validateInput(value, label, inputProps.type);
          setErrors(prev => ({ ...prev, [id]: errorMessage }));
          if (inputProps.onInput) inputProps.onInput(e);
        }}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  );

  const renderInputWithRadio = (label, id, placeholder, tooltip, radioName, inputProps = {}, error = "", inputRef = null, articleId = null) => (
    <div className="form-group">
      <div className="label-with-tooltip">
        <label className="label" htmlFor={id}>{label}</label>
        <span className="tooltip-custom">
          ⓘ <span className="tooltip-text">{tooltip} <br />
            {articleId && (
              <a
                href={`/sotay/${articleId}`}
                className='tooltip-link'
                target='_blank'
                rel='noopener noreferrer'>
                Xem thêm
              </a>
            )}
          </span>
        </span>
      </div>
      <div className="input-wrapper">
        <input
          type="text"
          id={id}
          name={id}
          className={`input-box ${error ? "input-error-border" : ""}`}
          placeholder={placeholder}
          {...inputProps}
          ref={inputRef}
          onInput={(e) => {
            const value = e.target.value;
            const errorMessage = validateInput(value, label);
            setErrors(prev => ({ ...prev, [id]: errorMessage }));
            if (inputProps.onInput) inputProps.onInput(e);
          }}
        />
      </div>
      {error && <p className="input-error">{error}</p>}
      <div className="radio-group">
        <label className="radio-label">
          <input type="radio" name={radioName} value="yes" />
          <span className="radio-text">Đã tính thuế</span>
        </label>
        <label className="radio-label">
          <input type="radio" name={radioName} value="no" />
          <span className="radio-text">Chưa tính thuế</span>
        </label>
      </div>
    </div>
  );

  const renderBusinessIncomeSection = () => (
    <div className="business-income-container">
      <div className="radio-group business-income-type">
        <label className="radio-label">
          <input
            type="radio"
            name="businessIncomeType"
            value="fixedRate"
            checked={businessIncomeType === 'fixedRate'}
            onChange={() => setBusinessIncomeType('fixedRate')}
          />
          <span className="radio-text">Theo doanh thu khoán
            <span className="tooltip-custom">ⓘ<span className="tooltip-text">Phù hợp với doanh thu nhỏ ổn định, áp dụng khi doanh thu trên 100 triệu/năm</span></span>
          </span>
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="businessIncomeType"
            value="netIncome"
            checked={businessIncomeType === 'netIncome'}
            onChange={() => setBusinessIncomeType('netIncome')}
          />
          <span className="radio-text">Theo thu nhập ròng
            <span className="tooltip-custom">ⓘ<span className="tooltip-text">Phù hợp với kinh doanh quy mô lớn, có đầy đủ sổ sách, chứng từ về doanh thu và chi phí</span></span>
          </span>
        </label>
      </div>

      {businessIncomeType === 'fixedRate' ? (
        <div className="fixed-rate-options">
          <h4 className="sub-heading">Khai báo doanh thu theo ngành nghề</h4>

          {renderInput(
            "1. Phân phối, cung cấp hàng hóa (1.5%)",
            "goodsDistribution",
            "Nhập thu nhập (đv triệu đồng)",
            "Áp dụng thuế suất 1.5% (1% GTGT + 0.5% TNCN)",
            {
              value: fixedRateIncomes.goodsDistribution,
              onChange: (e) => setFixedRateIncomes({ ...fixedRateIncomes, goodsDistribution: e.target.value })
            },
            errors.goodsDistribution,
            null,
            11
          )}

          {renderInput(
            "2. Dịch vụ, xây dựng không bao thầu nguyên vật liệu (7%)",
            "serviceConstruction",
            "Nhập thu nhập (đv triệu đồng)",
            "Áp dụng thuế suất 7% (5% GTGT + 2% TNCN)",
            {
              value: fixedRateIncomes.serviceConstruction,
              onChange: (e) => setFixedRateIncomes({ ...fixedRateIncomes, serviceConstruction: e.target.value })
            },
            errors.serviceConstruction,
            null,
            12
          )}

          {renderInput(
            "3. Cho thuê tài sản (10%)",
            "propertyRental",
            "Nhập thu nhập (đv triệu đồng)",
            "Áp dụng thuế suất 10% (5% GTGT + 5% TNCN)",
            {
              value: fixedRateIncomes.propertyRental,
              onChange: (e) => setFixedRateIncomes({ ...fixedRateIncomes, propertyRental: e.target.value })
            },
            errors.propertyRental,
            null,
            13
          )}

          {renderInput(
            "4. Đại lý xổ số, bảo hiểm, bán hàng đa cấp (5%)",
            "agencyServices",
            "Nhập thu nhập (đv triệu đồng)",
            "Áp dụng thuế suất 5% (0% GTGT + 5% TNCN)",
            {
              value: fixedRateIncomes.agencyServices,
              onChange: (e) => setFixedRateIncomes({ ...fixedRateIncomes, agencyServices: e.target.value })
            },
            errors.agencyServices,
            null,
            14
          )}

          {renderInput(
            "5. Sản xuất, vận tải, dịch vụ gắn với hàng hóa (4.5%)",
            "productionTransport",
            "Nhập thu nhập (đv triệu đồng)",
            "Áp dụng thuế suất 4.5% (3% GTGT + 1.5% TNCN)",
            {
              value: fixedRateIncomes.productionTransport,
              onChange: (e) => setFixedRateIncomes({ ...fixedRateIncomes, productionTransport: e.target.value })
            },
            errors.productionTransport,
            null,
            15
          )}

          {renderInput(
            "6. Hoạt động kinh doanh khác (3%)",
            "otherBusiness",
            "Nhập thu nhập (đv triệu đồng)",
            "Áp dụng thuế suất 3% (2% GTGT + 1% TNCN)",
            {
              value: fixedRateIncomes.otherBusiness,
              onChange: (e) => setFixedRateIncomes({ ...fixedRateIncomes, otherBusiness: e.target.value })
            },
            errors.otherBusiness,
            null,
            16
          )}
        </div>
      ) : (
        <div className="net-income-options">
          <h4 className="sub-heading">Khai báo thu nhập ròng</h4>
          {renderInput(
            "Tổng doanh thu",
            "totalRevenue",
            "Nhập tổng thu nhập (đv triệu đồng)",
            "Tổng doanh thu từ hoạt động kinh doanh",
            {
              value: netIncome.totalRevenue,
              onChange: (e) => setNetIncome({ ...netIncome, totalRevenue: e.target.value })
            },
            errors.totalRevenue,
            null,
            17
          )}

          {renderInput(
            "Chi phí hợp lệ",
            "deductibleCost",
            "Nhập chi phí (đv triệu đồng)",
            "Các chi phí hợp lệ được trừ khi tính thuế",
            {
              value: netIncome.deductibleCost,
              onChange: (e) => setNetIncome({ ...netIncome, deductibleCost: e.target.value })
            },
            errors.deductibleCost,
            null,
            18
          )}
        </div>
      )}
    </div>
  );

  const incomeSources = [
    {
      label: "Thu nhập từ chuyển nhượng bất động sản",
      tooltip: "Thuế áp dụng là 2% trên giá chuyển nhượng. Thông thường khi công chứng, cơ quan thuế đã yêu cầu nộp thuế trước khi làm thủ tục sang tên.",
      articleId: 5
    },
    {
      label: "Thu nhập từ đầu tư vốn",
      tooltip: "Góp vốn, lợi tức, cổ tức… Thuế áp dụng là 5% trên phần thu nhập được chia. Thông thường công ty đã khấu trừ thuế trước khi tả cho nhà đầu tư.",
      articleId: 6
    },
    {
      label: "Thu nhập từ chuyển nhượng vốn",
      tooltip: "Thuế áp dụng là 0.1% trên giá chuyển nhượng. Thông thường đã khấu từ thuế trước khi chuyển nhượng.",
      articleId: 7
    },
    {
      label: "Thu nhập từ bản quyền, nhượng quyền thương mại",
      tooltip: "Thuế áp dụng là 5% trên phần giá trị chuyển nhượng vượt 10 triệu đồng/lần. Thông thường bên nhận quyền sử dụng đã khấu trừ thuế.",
      articleId: 8
    },
    {
      label: "Thu nhập từ trúng thưởng",
      tooltip: "Bao gồm: Xổ số, trúng thưởng game show, cá cược thể thao (hợp pháp), khuyến mại lớn... Thuế áp dụng là 10% trên phần giá trị trúng vượt 10 triệu đồng/lần. Thông thường bên tổ chức đã khấu trừ thuế.",
      articleId: 9
    },
    {
      label: "Thu nhập từ thừa kế, quà tặng là tài sản có đăng ký (nhà, xe, cổ phiếu...)",
      tooltip: "Thuế áp dụng là 10% trên phần giá trị thừa kế, quà tặng vượt 10 triệu đồng/lần.",
      articleId: 10
    },
  ];

  const toFloat = (value) => parseFloat(parseFloat(value || '0').toFixed(2));
  const handleTaxCalculation = async () => {
    const payload = {
    // Thuế thu nhập
    month: parseInt(inputRefs.month.current?.value || '1', 10),
    year: parseInt(inputRefs.year.current?.value || '2025', 10),

    // Thông tin người dùng
    residency: (document.querySelector('input[name="residency"]:checked')?.value === 'resident'),
    dependents: toFloat(inputRefs.dependents.current?.value),
    region: parseInt(document.querySelector('select[name="region"]').value || '0', 10),

    // Thu nhập tính thuế theo biểu thuế lũy tiến từng phần
    income_labor_contract: toFloat(inputRefs.longTermIncome.current?.value),
    taxed_labor_contract: (document.querySelector('input[name="longTermTaxed"]:checked')?.value === 'yes'),
    income_no_contract: toFloat(inputRefs.shortTermIncome.current?.value),
    taxed_no_contract: (document.querySelector('input[name="shortTermIncome"]:checked')?.value === 'yes'),
    income_foreign_contract: toFloat(inputRefs.foreignIncome.current?.value),
    deducted_tax_abroad: toFloat(inputRefs.deductedTax.current?.value),

    // Thu nhập từ kinh doanh
    use_flat_rate: (businessIncomeType === 'fixedRate'),
    business_income_flat: {
      distribution: toFloat(fixedRateIncomes.goodsDistribution),
      service: toFloat(fixedRateIncomes.serviceConstruction),
      rent: toFloat(fixedRateIncomes.propertyRental),
      agent: toFloat(fixedRateIncomes.agencyServices),
      production: toFloat(fixedRateIncomes.productionTransport),
      others: toFloat(fixedRateIncomes.otherBusiness),
    },
    net_income: {
      total_revenue: toFloat(netIncome.totalRevenue),
      deductible_cost: toFloat(netIncome.deductibleCost),
    },

    // Thu nhập chịu thuế theo từng lần phát sinh
    payment_date: inputRefs.paymentDate.current?.value || '',
    once_off_income: {
      real_estate: toFloat(inputRefs.realEstate.current?.value),
      investment: toFloat(inputRefs.investment.current?.value),
      capital_transfer: toFloat(inputRefs.capitalTransfer.current?.value),
      royalty: toFloat(inputRefs.royalty.current?.value),
      lottery: toFloat(inputRefs.lottery.current?.value),
      inheritance: toFloat(inputRefs.inheritance.current?.value),
    },
    taxed_once_off: {
      real_estate: (document.querySelector('input[name="source1Taxed"]:checked')?.value === 'yes'),
      investment: (document.querySelector('input[name="source2Taxed"]:checked')?.value === 'yes'),
      capital_transfer: (document.querySelector('input[name="source3Taxed"]:checked')?.value === 'yes'),
      royalty: (document.querySelector('input[name="source4Taxed"]:checked')?.value === 'yes'),
      lottery: (document.querySelector('input[name="source5Taxed"]:checked')?.value === 'yes'),
      inheritance: (document.querySelector('input[name="source6Taxed"]:checked')?.value === 'yes'),
    },
  };
    console.log("payload:", payload);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/calculate-tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setResults({
        totalIncome: result.total_income,
        taxOwed: result.tax_need_to_pay,
        taxPaid: result.tax_paid
      });
      console.log("result:", result);
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };


  return (
    <div className="form">
      <div className="section_infotax">
        <h2 className="heading">Thuế thu nhập</h2>
      

        {renderInput("Tháng", "month", "Nhập tháng (1 - 12)", "Tháng áp dụng thuế", {
          min: 1,
          max: 12,
          onInput: (e) => {
            const value = e.target.value;
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 12) {
              setErrors(prev => ({ ...prev, month: "Tháng phải từ 1 đến 12" }));
            } else {
              setErrors(prev => ({ ...prev, month: "" }));
            }
          }
        }, errors.month, inputRefs.month, 1)}
        
        {renderInput(
          "Năm",
          "year",
          "Nhập năm (VD: 2025)",
          `Đến ${new Date().getFullYear()}`,
          {
            min: 0,
            max: new Date().getFullYear(),
            onInput: (e) => {
              const value = e.target.value;
              const num = parseInt(value);
              const max = new Date().getFullYear();

              if (isNaN(num) || num < 0 || num > max) {
                setErrors(prev => ({ ...prev, year: `Năm phải từ 0 đến ${max}` }));
              } else {
                setErrors(prev => ({ ...prev, year: "" }));
              }
            },
          },
          errors.year, inputRefs.year, 2
        )}
      </div>

      <div className="section_infouser">
        <h2 className="heading">Thông tin người dùng</h2>
        <div className="residency_options">
          <label className="radio-label">
            <input type="radio" name="residency" value="resident" />
            <span className="radio-text">Người cư trú
              <span className="tooltip-custom">ⓘ<span className="tooltip-text">Người cư trú là cá nhân sống tại Việt Nam từ 183 ngày trở lên trong năm.</span></span>
            </span>
          </label>
          <label className="radio-label">
            <input type="radio" name="residency" value="non-resident" />
            <span className="radio-text">Người không cư trú
              <span className="tooltip-custom">ⓘ<span className="tooltip-text">Người không cư trú là cá nhân không đáp ứng điều kiện cư trú tại Việt Nam.</span></span>
            </span>
          </label>
        </div>
        {renderInput(
          "Số người phụ thuộc",
          "dependents",
          "Nhập số người",
          "Người phụ thuộc như con, cha mẹ... đang được bạn nuôi dưỡng.",
          {
            min: 0,
            onInput: (e) => {
              const value = e.target.value;
              const num = parseInt(value);

              if (isNaN(num) || num < 0) {
                setErrors(prev => ({ ...prev, dependents: "Số người phụ thuộc phải từ 0 trở lên" }));
              } else {
                setErrors(prev => ({ ...prev, dependents: "" }));
              }
            }
          },
          errors.dependents, inputRefs.dependents, 3
        )}

        <div className="form-group">
          <div className="label-with-tooltip">
            <label className="label" htmlFor="region">Vùng</label>
            <span className="tooltip-custom">ⓘ<span className="tooltip-text">Vùng được quy định theo khu vực địa lý, ảnh hưởng đến mức giảm trừ.</span></span>
          </div>
          <select id="region" name="region" className="input-box">
            <option value="">Chọn vùng</option>
            {[1, 2, 3, 4].map(val => <option key={val} value={val}>Vùng {val}</option>)}
          </select>
        </div>
      </div>

      <div className="section_income">
        <h2 className="heading">Thu nhập tính thuế theo biểu thuế lũy tiến từng phần</h2>
        {renderInputWithRadio(
          "Thu nhập có hợp đồng lao động trên ba tháng",
          "longTermIncome",
          "Nhập thu nhập (đv triệu đồng)",
          "Thu nhập đã trừ các khoản miễn giảm",
          "longTermTaxed",
          {},
          errors.longTermIncome,
          inputRefs.longTermIncome,
          14
        )}
        {renderInputWithRadio(
          "Thu nhập không có hợp đồng lao động hoặc hợp đồng dưới 3 tháng",
          "shortTermIncome",
          "Nhập thu nhập (đv triệu đồng)",
          "Thu nhập áp dụng 10% thuế nếu lớn hơn 132 triệu/năm.",
          "shortTermTaxed",
          {},
          errors.shortTermIncome,
          inputRefs.shortTermIncome,
          15
        )}

        <div className="form-group">
          <div className="label-with-tooltip">
            <label className="label" htmlFor="foreignIncome">Thu nhập có hợp đồng lao động ở nước ngoài</label>
            <span className="tooltip-custom">ⓘ<span className="tooltip-text">Thu nhập bạn nhận được từ hợp đồng làm việc tại nước ngoài.</span></span>
          </div>
          <input
            type="text"
            id="foreignIncome"
            name="foreignIncome"
            className={`input-box ${errors.foreignIncome ? "input-error-border" : ""}`}
            placeholder="Nhập thu nhập (đv triệu đồng)"
            ref={inputRefs.foreignIncome}
            onInput={(e) => {
              const value = e.target.value;
              const errorMessage = validateInput(value, "Thu nhập có hợp đồng lao động ở nước ngoài");
              setErrors(prev => ({ ...prev, foreignIncome: errorMessage }));
            }}
          />
          {errors.foreignIncome && <p className="input-error">{errors.foreignIncome}</p>}
          <div className="checkbox-wrapper">
            <label className="checkbox-label">
              <input type="checkbox" checked={hasDeductedTax} onChange={() => setHasDeductedTax(!hasDeductedTax)} />
              <span className="checkbox-text">Đã khấu trừ thuế ở nước ngoài</span>
            </label>
            {hasDeductedTax && (
              <input
                type="text"
                id="deductedTax"
                name="deductedTax"
                className={`input-box ${errors.deductedTax ? "input-error-border" : ""}`}
                placeholder="Nhập số tiền đã khấu trừ (đv triệu đồng)"
                ref={inputRefs.deductedTax}
                onInput={(e) => {
                  const value = e.target.value;
                  const errorMessage = validateInput(value, "Số tiền đã khấu trừ");
                  setErrors(prev => ({ ...prev, deductedTax: errorMessage }));
                }}
              />
            )}
            {errors.deductedTax && hasDeductedTax && <p className="input-error">{errors.deductedTax}</p>}
          </div>
        </div>
      </div>

      {/* Phần thu nhập từ kinh doanh - tách riêng thành box mới */}
      <div className="section_business_income">
        <h2 className="heading">Thu nhập từ kinh doanh</h2>
        {renderBusinessIncomeSection()}
      </div>

      <div className="section_income_reduced">
        <h2 className="heading">Thu nhập chịu thuế theo từng lần phát sinh</h2>
        {renderInput("Ngày nhận tiền", "paymentDate", "Ngày bạn nhận được tiền", "Ngày bạn nhận được tiền", {
          type: "date",
          value: formData.paymentDate,
          onChange: (e) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, paymentDate: value }));
          }
        }, errors.paymentDate, inputRefs.paymentDate, 5)}

        {renderInputWithRadio(
          incomeSources[0].label,
          "source1",
          "Nhập thu nhập (đv triệu đồng)",
          incomeSources[0].tooltip,
          "source1Taxed",
          {},
          errors.source1,
          inputRefs.realEstate,
          incomeSources[0].articleId
        )}
        {renderInputWithRadio(
          incomeSources[1].label,
          "source2",
          "Nhập thu nhập (đv triệu đồng)",
          incomeSources[1].tooltip,
          "source2Taxed",
          {},
          errors.source2,
          inputRefs.investment,
          incomeSources[1].articleId
        )}
        {renderInputWithRadio(
          incomeSources[2].label,
          "source3",
          "Nhập thu nhập (đv triệu đồng)",
          incomeSources[2].tooltip,
          "source3Taxed",
          {},
          errors.source3,
          inputRefs.capitalTransfer,
          incomeSources[2].articleId
        )}
        {renderInputWithRadio(
          incomeSources[3].label,
          "source4",
          "Nhập thu nhập (đv triệu đồng)",
          incomeSources[3].tooltip,
          "source4Taxed",
          {},
          errors.source4,
          inputRefs.royalty,
          incomeSources[3].articleId
        )}
        {renderInputWithRadio(
          incomeSources[4].label,
          "source5",
          "Nhập thu nhập (đv triệu đồng)",
          incomeSources[4].tooltip,
          "source5Taxed",
          {},
          errors.source5,
          inputRefs.lottery,
          incomeSources[4].articleId
        )}
        {renderInputWithRadio(
          incomeSources[5].label,
          "source6",
          "Nhập thu nhập (đv triệu đồng)",
          incomeSources[5].tooltip,
          "source6Taxed",
          {},
          errors.source6,
          inputRefs.inheritance,
          incomeSources[5].articleId
        )}
      </div>

      <div className="result-section">
        <Accordion.Root type="single" collapsible className="accordion-root">
          <Accordion.Item value="taxResult">
            <Accordion.Header>
              <Accordion.Trigger
                className="calculate-btn"
                onClick={handleTaxCalculation}
              >
                Tính thuế
                <ChevronDownIcon className="chevron" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="accordion-content">
              <div className="result">
                <h2 className="heading">Kết quả</h2>
                <div className="result-grid">
                  <div className="result-box">
                    <p className="result-label">Tổng thu nhập</p>
                    <p className="result-value">{results.totalIncome} triệu VNĐ</p>
                  </div>
                  <div className="result-box">
                    <p className="result-label">Số thuế phải nộp</p>
                    <p className="result-value">{results.taxOwed.business + results.taxOwed.one_time} triệu VNĐ</p>
                  </div>
                  <div className="result-box">
                    <p className="result-label">Số thuế đã nộp</p>
                    <p className="result-value">{results.taxPaid.business + results.taxPaid.one_time} triệu VNĐ</p>
                  </div>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}

export default TaxCalculationScreen;
import React, { useState, useRef } from 'react';
import "./TaxCalculationScreen.css";
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

function TaxCalculationScreen() {
  const [hasDeductedTax, setHasDeductedTax] = useState(false);

  const [errors, setErrors] = useState({
    month: "",
    year: "",
    dependents: "",
    longTermIncome: "",
    shortTermIncome: "",
    foreignIncome: "",
    deductedTax: "",
    source0: "",
    source1: "",
    source2: "",
    source3: "",
    source4: "",
    source5: "",
    source6: "",
    biz0: "",
    biz1: "",
    biz2: "",
  });

  const inputRefs = {
    month: useRef(null),
    year: useRef(null),
    dependents: useRef(null),
    longTermIncome: useRef(null),
    shortTermIncome: useRef(null),
    foreignIncome: useRef(null),
    deductedTax: useRef(null),
  };

  const validateInput = (value, type) => {
    const regex = /^[0-9]*$/; // Chỉ cho phép số
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
          ⓘ
          <span className="tooltip-text">{tooltip}
          <br/>
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
          const errorMessage = validateInput(value, label);
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
          ⓘ
          <span className="tooltip-text">{tooltip}
            <br/>
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

  const incomeSources = [
    {
      label: "Thu nhập từ cho thuê tài sản",
      tooltip: "Bao gồm: Nhà, xe, máy móc, cửa hàng, mặt bằng… Thuế áp dụng là 10% (5% thuế GTGT, 5% thuế TNCN) nếu tổng thu nhập lớn hơn 100 triệu/năm.",
      articleId: 4
    },
    {
      label: "Thu nhập từ chuyển nhượng bất động sản",
      tooltip: "Bán nhà đất. Thuế áp dụng là 2% trên giá chuyển nhượng",
      articleId: 5
    },
    {
      label: "Thu nhập từ đầu tư vốn",
      tooltip: "Góp vốn, lợi tức, cổ tức…  Thuế áp dụng là 5% trên phần thu nhập được chia.",
      articleId: 6
    },
    {
      label: "Thu nhập từ chuyển nhượng chứng khoán",
      tooltip: "Thuế áp dụng là 0.1% trên giá chuyển nhượng",
      articleId: 7
    },
    {
      label: "Thu nhập từ bản quyền, nhượng quyền thương mại",
      tooltip: "Nếu doanh thu lớn hơn 100 triệu/năm, thuế áp dụng là 10% (5% thuế GTGT, 5% thuế TNCN)",
      articleId: 8
    },
    {
      label: "Thu nhập từ trúng thưởng",
      tooltip: "Bao gồm: Xổ số, trúng thưởng game show, cá cược thể thao (hợp pháp), khuyến mại lớn... Thuế áp dụng là 10% trên phần giá trị trúng vượt 10 triệu đồng/lần.",
      articleId: 9
    },
    {
      label: "Thu nhập từ thừa kế, quà tặng là tài sản có đăng ký (nhà, xe, cổ phiếu...)",
      tooltip: "Thuế áp dụng là 10% trên phần giá trị thừa kế, quà tặng vượt 10 triệu đồng/lần.",
      articleId: 10
    },
  ];

  const businessIncomes = [
    {
      label: "Bán hàng hoá",
      tooltip: "Thuế áp dụng là 1,5%(1% thuế GTGT, 0,5% thuế TNCN).",
      articleId: 11
    },
    {
      label: "Dịch vụ, tư vấn, ăn uống",
      tooltip: "Thuế áp dụng là 7%(5% thuế GTGT,2% thuế TNCN).",
      articleId: 12
    },
    {
      label: "Vận tải, xây dựng không vật tư",
      tooltip: "Thuế áp dụng là 2%(1.5% thuế GTGT, 0.5% thuế TNCN).",
      articleId: 13
    },
  ];

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
        <h2 className="heading">Thông tin thu nhập</h2>
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

      <div className="section_income_reduced">
        <h2 className="heading">Thông tin thu nhập khấu trừ tại nguồn</h2>
        {incomeSources.map((item, index) => renderInput(
          item.label,
          `source${index}`,
          "Nhập thu nhập (đv triệu đồng)",
          item.tooltip,
          {},
          errors[`source${index}`],
          null,
          item.articleId
        ))}
        <div className="form-group">
          <div className="label-with-tooltip">
            <label className="label">Thu nhập từ kinh doanh</label>
            <span className="tooltip-custom">ⓘ<span className="tooltip-text">Nếu không đăng kí doanh nghiệp</span></span>
          </div>
          <div className="business-income-group">
            {businessIncomes.map((item, index) => (
              <div key={index} className="business-item">
                {renderInput(
                  item.label,
                  `biz${index}`,
                  "Nhập thu nhập (đv triệu đồng)",
                  item.tooltip,
                  {},
                  errors[`biz${index}`],
                  null,
                  item.articleId
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="result-section">
        <Accordion.Root type="single" collapsible className="accordion-root">
          <Accordion.Item value="taxResult">
            <Accordion.Header>
              <Accordion.Trigger className="calculate-btn">
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
                    <p className="result-value">0 triệu VNĐ</p>
                  </div>
                  <div className="result-box">
                    <p className="result-label">Số thuế phải nộp</p>
                    <p className="result-value">0 triệu VNĐ</p>
                  </div>
                  <div className="result-box">
                    <p className="result-label">Số thuế đã nộp</p>
                    <p className="result-value">0 triệu VNĐ</p>
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
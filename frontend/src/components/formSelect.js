import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBriefcase, FiMapPin, FiSearch } from "../assets/icons/vander";
import Select from "react-select";

export default function FormSelect({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Định nghĩa các loại công việc
  const typeOptions = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "INTERNSHIP", label: "Internship" },
  ];

  // Lấy dữ liệu các tỉnh/thành phố từ API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=2"
        );
        const options = response.data.map((province) => ({
          value: province.code,
          label: province.name,
        }));
        setLocationOptions(options);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // Kích hoạt tìm kiếm khi có thay đổi ở các trường
  useEffect(() => {
    onSearch({
      keyword,
      location: selectedLocation ? selectedLocation.value : "",
      type: selectedType ? selectedType.value : "",
    });
  }, [keyword, selectedLocation, selectedType, onSearch]);

  // Tùy chỉnh giao diện cho React-Select
  const customStyles = {
    control: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      height: "48px",
      paddingLeft: "36px",
    }),
    singleValue: (base) => ({
      ...base,
      marginLeft: "8px",
      display: "flex",
      alignItems: "center",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#6c757d",
      padding: "0 8px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: (base) => ({
      ...base,
      cursor: "pointer",
      color: "#dc3545",
    }),
    placeholder: (base) => ({
      ...base,
      marginLeft: "8px",
      color: "#6c757d",
    }),
  };

  return (
    <form className="card-body text-start">
  <div className="registration-form text-dark text-start">
    <div className="row g-3 align-items-center"> {/* Gắn `g-3` để tạo khoảng cách */}
      {/* Input từ khóa */}
      <div className="col-lg-4 col-md-6 col-12">
        <div className="mb-3 mb-sm-0">
          <div className="filter-search-form position-relative filter-border d-flex align-items-center">
            <FiSearch className="fea icon-20 icons me-2" />
            <input
              name="name"
              type="text"
              id="job-keyword"
              className="form-control filter-input-box bg-light border-0"
              placeholder="Search your keywords"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Select tỉnh/thành phố */}
      <div className="col-lg-4 col-md-6 col-12">
        <div className="mb-3 mb-sm-0">
          <div className="filter-search-form position-relative filter-border d-flex align-items-center">
            <FiMapPin className="fea icon-20 icons me-2" />
            <div style={{ flex: 1 }}>
              <Select
                options={locationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                styles={customStyles}
                placeholder="Select location"
                isClearable
              />
            </div>
          </div>
        </div>
      </div>

      {/* Select loại công việc */}
      <div className="col-lg-4 col-md-6 col-12">
        <div className="mb-3 mb-sm-0">
          <div className="filter-search-form position-relative filter-border d-flex align-items-center">
            <FiBriefcase className="fea icon-20 icons me-2" />
            <div style={{ flex: 1 }}>
              <Select
                options={typeOptions}
                value={selectedType}
                onChange={setSelectedType}
                styles={customStyles}
                placeholder="Select type"
                isClearable
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

  );
}

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function FormCreateJob({ jobData, onSubmit }) {
  const [formData, setFormData] = useState({
    title: jobData?.title || "",
    description: jobData?.description || "",
    requirement: jobData?.requirement || "",
    benefit: jobData?.benefit || "",
    salary_start: jobData?.salary_start || 0,
    salary_end: jobData?.salary_end || 0,
    currency: jobData?.currency || "USD",
    deadline: jobData?.deadline ? new Date(jobData.deadline) : null,
    experience: jobData?.experience || "",
    level: jobData?.level || "",
    position: jobData?.position || "",
    slots: jobData?.slots || 1,
    type: jobData?.type || "FULL_TIME",
    categories: jobData?.categories || [],
    skills: jobData?.skills || [],
    addresses: jobData?.addresses?.length > 0
      ? jobData.addresses
      : [{ city: "", district: "", street: "", districts: [] }], 
    status: jobData?.status || "PENDING",
  });

  const [provinceData, setProvinceData] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/?depth=2");
      setProvinceData(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, deadline: date }));
  };

  const handleAddressChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index][key] = value;

      // Update districts when city changes
      if (key === "city") {
        const selectedCity = provinceData.find((province) => province.name === value);
        updatedAddresses[index].districts = selectedCity ? selectedCity.districts : [];
        updatedAddresses[index].district = ""; // Reset district
      }

      return { ...prev, addresses: updatedAddresses };
    });
  };

  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { city: "", district: "", street: "", districts: [] }],
    }));
  };

  const removeAddress = (index) => {
    if (formData.addresses.length > 1) {
      setFormData((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    // Check if deadline is not null
    if (!formData.deadline) {
        toast.error("Please select a deadline!");
      return false;
    }
  
    // Validate addresses
    for (const address of formData.addresses) {
      if (!address.city || !address.district || !address.street) {
        toast.error("Please fill out all address fields (City, District, Street)!");
        return false;
      }
    }
  
    return true;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
      }
    onSubmit(formData);
    
    console.log(formData)
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light rounded shadow-sm" style={{ padding: "50px 120px" }}>
  <h3 className="mb-4">{jobData ? "Edit Job" : "Create Job"}</h3>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Title</label>
      <input
        type="text"
        name="title"
        className="form-control"
        value={formData.title}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Type</label>
      <select
        name="type"
        className="form-select"
        value={formData.type}
        onChange={handleChange}
      >
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="INTERNSHIP">Internship</option>
      </select>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Salary Range</label>
      <div className="d-flex gap-2">
        <input
          type="number"
          name="salary_start"
          className="form-control"
          placeholder="From"
          value={formData.salary_start}
          onChange={handleChange}
        />
        <input
          type="number"
          name="salary_end"
          className="form-control"
          placeholder="To"
          value={formData.salary_end}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="col-md-3">
      <label className="form-label">Currency</label>
      <select
        name="currency"
        className="form-select"
        value={formData.currency}
        onChange={handleChange}
      >
        <option value="USD">USD</option>
        <option value="VND">VND</option>
      </select>
    </div>
  </div>

  <div className="mb-3">
    <label className="form-label">Description</label>
    <textarea
      name="description"
      className="form-control"
      rows="5"
      value={formData.description}
      onChange={handleChange}
      required
    ></textarea>
  </div>

  <div className="mb-3">
    <label className="form-label">Requirement</label>
    <textarea
      name="requirement"
      className="form-control"
      rows="5"
      value={formData.requirement}
      onChange={handleChange}
    ></textarea>
  </div>

  <div className="mb-3">
    <label className="form-label">Benefit</label>
    <textarea
      name="benefit"
      className="form-control"
      rows="4"
      value={formData.benefit}
      onChange={handleChange}
    ></textarea>
  </div>

   {/* Skills and Categories */}
<div className="row mb-3">
  {/* Skills */}
  <div className="col-md-6">
    <div className="d-flex align-items-center gap-2 mb-2">
      <label className="form-label mb-0">Skills</label>
      <FaPlusCircle
        className="text-success cursor-pointer"
        size={24}
        title="Add Skill"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, ""],
          }))
        }
      />
    </div>
    {formData.skills.map((skill, index) => (
      <div key={index} className="d-flex align-items-center gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Skill name"
          value={skill.name}
          onChange={(e) =>
            setFormData((prev) => {
              const updatedSkills = [...prev.skills];
              updatedSkills[index] = e.target.value;
              return { ...prev, skills: updatedSkills };
            })
          }
        />
        <FaMinusCircle
          className="text-danger cursor-pointer"
          size={24}
          title="Remove Skill"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              skills: prev.skills.filter((_, i) => i !== index),
            }))
          }
        />
      </div>
    ))}
  </div>

  {/* Categories */}
  <div className="col-md-6">
    <div className="d-flex align-items-center gap-2 mb-2">
      <label className="form-label mb-0">Categories</label>
      <FaPlusCircle
        className="text-success cursor-pointer"
        size={24}
        title="Add Category"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            categories: [...prev.categories, ""],
          }))
        }
      />
    </div>
    {formData.categories.map((category, index) => (
      <div key={index} className="d-flex align-items-center gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Category name"
          value={category}
          onChange={(e) =>
            setFormData((prev) => {
              const updatedCategories = [...prev.categories];
              updatedCategories[index] = e.target.value;
              return { ...prev, categories: updatedCategories };
            })
          }
        />
        <FaMinusCircle
          className="text-danger cursor-pointer"
          size={24}
          title="Remove Category"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              categories: prev.categories.filter((_, i) => i !== index),
            }))
          }
        />
      </div>
    ))}
  </div>
</div>


 

  <div className="row mb-3">
    <div className="col-md-3">
      <label className="form-label">Position</label>
      <input
        type="text"
        name="position"
        className="form-control"
        value={formData.position}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-3">
      <label className="form-label">Experience</label>
      <input
        type="text"
        name="experience"
        className="form-control"
        value={formData.experience}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-3">
      <label className="form-label">Level</label>
      <input
        type="text"
        name="level"
        className="form-control"
        value={formData.level}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  <div className="row mb-3">
  
  <div className="col-md-3">
    <label className="form-label">Slots</label>
    <input
      type="number"
      name="slots"
      className="form-control"
      value={formData.slots}
      onChange={handleChange}
      required
    />
  </div>
  <div className="col-md-3">
    <label className="form-label">Deadline</label>
    <DatePicker
      selected={formData.deadline}
      onChange={handleDateChange}
      className="form-control"
      dateFormat="yyyy-MM-dd"
      placeholderText="Select a deadline"
      minDate={new Date()}
    />
  </div>
</div>
{/* Address Section */}
<div className="mb-3">
        <label className="form-label">Addresses</label>
        {formData.addresses.map((addr, index) => (
          <div key={index} className="row align-items-center mb-3">
            {/* City */}
            <div className="col-md-4">
              <label className="form-label">City</label>
              <select
                className="form-select"
                value={addr.city}
                onChange={(e) => handleAddressChange(index, "city", e.target.value)}
              >
                <option value="">Select City</option>
                {provinceData.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="col-md-4">
              <label className="form-label">District</label>
              <select
                className="form-select"
                value={addr.district}
                onChange={(e) => handleAddressChange(index, "district", e.target.value)}
                disabled={!addr.districts.length}
              >
                <option value="">Select District</option>
                {addr.districts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Street */}
            <div className="col-md-4">
              <label className="form-label">Street</label>
              <input
                type="text"
                className="form-control"
                placeholder="Street address"
                value={addr.street}
                onChange={(e) => handleAddressChange(index, "street", e.target.value)}
              />
            </div>

            {/* Add/Remove Buttons */}
            <div className="col-12 text-end mt-2">
              <FaMinusCircle
                className={`text-danger cursor-pointer me-2 ${formData.addresses.length === 1 ? "d-none" : ""}`}
                size={24}
                title="Remove Address"
                onClick={() => removeAddress(index)}
              />
              {index === formData.addresses.length - 1 && (
                <FaPlusCircle className="text-success cursor-pointer" size={24} title="Add Address" onClick={addAddress} />
              )}
            </div>
          </div>
        ))}
      </div>

  <button type="submit" className="btn btn-primary">
    {jobData ? "Update Job" : "Create Job"}
  </button>
</form>

  );
}

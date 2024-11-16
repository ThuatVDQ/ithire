import React, { useState } from "react";
import Select from 'react-select';
import { FiBriefcase, FiMapPin, FiSearch } from "../assets/icons/vander";
import ToggleSelect from "./ToggleSelect";

export default function FormSelect({ onSearch }) {
    const [keyword, setKeyword] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const locationOptions = [
        { value: 'Afghanistan', label: 'Afghanistan' },
        { value: 'Azerbaijan', label: 'Azerbaijan' },
        { value: 'Australia', label: 'Australia' },   
        { value: 'Bahrain', label: 'Bahrain' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Cape Verde', label: 'Cape Verde' },
        { value: 'Denmark', label: 'Denmark' },
        { value: 'Djibouti', label: 'Djibouti' },
        { value: 'Eritrea', label: 'Eritrea' },
        { value: 'Estonia', label: 'Estonia' },
        { value: 'Gambia', label: 'Gambia' },
        { value: 'Germany', label: 'Germany' },
        { value: 'Italy', label: 'Italy' },
        { value: 'Russia', label: 'Russia' },
    ];

    const typeOptions = [
        { value: 'Full Time', label: 'Full Time' },
        { value: 'Part Time', label: 'Part Time' },
        { value: 'Freelancer', label: 'Freelancer' },
        { value: 'Remote Work', label: 'Remote Work' },
        { value: 'Office Work', label: 'Office Work' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({
            keyword,
            location: selectedLocation ? selectedLocation.value : null,
            type: selectedType ? selectedType.value : null
        });
    };

    return (
        <form className="card-body text-start" onSubmit={handleSubmit}>
            <div className="registration-form text-dark text-start">
                <div className="row g-lg-0">
                    <div className="col-lg-3 col-md-6 col-12">
                        <div className="mb-3 mb-sm-0">
                            <label className="form-label d-none fs-6">Search :</label>
                            <div className="filter-search-form position-relative filter-border">
                                <FiSearch className="fea icon-20 icons" />
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

                    <div className="col-lg-3 col-md-6 col-12">
                        <div className="mb-3 mb-sm-0">
                            <label className="form-label d-none fs-6">Location:</label>
                            <div className="filter-search-form position-relative filter-border">
                                <FiMapPin className="fea icon-20 icons" />
                                <ToggleSelect
                                    options={locationOptions}
                                    value={selectedLocation}
                                    onChange={setSelectedLocation}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 col-12">
                        <div className="mb-3 mb-sm-0">
                            <label className="form-label d-none fs-6">Type :</label>
                            <div className="filter-search-form relative filter-border">
                                <FiBriefcase className="fea icon-20 icons" />
                                <ToggleSelect
                                    options={typeOptions}
                                    value={selectedType}
                                    onChange={setSelectedType}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 col-12">
                        <input
                            type="submit"
                            id="search"
                            name="search"
                            style={{ height: '60px' }}
                            className="btn btn-primary searchbtn w-100"
                            value="Search"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

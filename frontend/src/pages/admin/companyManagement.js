import React, { useState, useEffect } from "react";
import { Table, Pagination, Form, Button } from "react-bootstrap";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({
    totalCompanies: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
  });
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [pagination.currentPage]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/api/companies", {
        params: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          name: searchName, 
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCompanies(response.data.companies);
      setPagination({
        totalCompanies: response.data.pagination.totalCompanies,
        totalPages: response.data.pagination.totalPages,
        currentPage: response.data.pagination.currentPage,
        pageSize: response.data.pagination.pageSize,
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 })); 
    console.log(searchName);
    fetchCompanies();
  };

  return (
    <div className="container mt-4">
  <h2 className="mb-4">Manage Companies</h2>

  {/* Form Tìm kiếm */}
  <Form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
    <Form.Control
      type="text"
      placeholder="Search by company name"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
      style={{ maxWidth: "300px" }} // Giới hạn chiều rộng của trường nhập
    />
    <Button type="submit" variant="primary" style={{ height: "100%" }}>
      <FaSearch /> Search
    </Button>
  </Form>

  {loading ? (
    <div className="text-center">Loading...</div>
  ) : (
    <>
      {/* Bảng danh sách công ty */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Company Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total Jobs</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, index) => (
            <tr key={company._id}>
              <td>
                {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
              </td>
              <td>
                {company.logo ? (
                  <img
                    src={`http://localhost:8090${company.logo}`}
                    alt={`Logo`}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                ) : (
                  "N/A"
                )}
                <span>{company.name}</span> {/* Logo và tên công ty đều nằm trong cột này */}
              </td>
              <td>{company.email || "N/A"}</td>
              <td>{company.phone || "N/A"}</td>
              <td>{company.address || "N/A"}</td>
              <td>{company.totalJobs || 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Phân trang */}
      <div className="d-flex justify-content-center">
        <Pagination>
          {[...Array(pagination.totalPages)].map((_, page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === pagination.currentPage}
              onClick={() =>
                setPagination((prev) => ({ ...prev, currentPage: page + 1 }))
              }
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </>
  )}
</div>

  );
}

import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './services/api';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ employeeId: '', fullName: '', email: '', position: '', department: '', salary: 0 });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchEmployees = async (query = '') => {
    try {
      const res = await getEmployees(query);
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchEmployees(search); };
  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEmployee(editingId, formData);
        setMessage('Cập nhật thành công!');
      } else {
        await createEmployee(formData);
        setMessage('Thêm nhân viên thành công!');
      }
      setFormData({ employeeId: '', fullName: '', email: '', position: '', department: '', salary: 0 });
      setEditingId(null);
      fetchEmployees(search);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({ employeeId: emp.employeeId, fullName: emp.fullName, email: emp.email, position: emp.position || '', department: emp.department || '', salary: emp.salary || 0 });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await deleteEmployee(id);
        setMessage('Xóa thành công!');
        fetchEmployees(search);
      } catch (err) { setMessage('Lỗi khi xóa!'); }
    }
  };

  return (
    <div className="container">
      <h1>QUẢN LÝ NHÂN VIÊN - MSSV: 237337_buiducthuan</h1>
      {message && <div className="alert">{message}</div>}
      <div className="card">
        <h2>{editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input name="employeeId" placeholder="Mã NV (*)" value={formData.employeeId} onChange={handleChange} required disabled={!!editingId} />
          <input name="fullName" placeholder="Họ và tên (*)" value={formData.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email (*)" value={formData.email} onChange={handleChange} required />
          <input name="position" placeholder="Chức vụ" value={formData.position} onChange={handleChange} />
          <input name="department" placeholder="Phòng ban" value={formData.department} onChange={handleChange} />
          <input name="salary" type="number" placeholder="Lương" value={formData.salary} onChange={handleChange} />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ employeeId: '', fullName: '', email: '', position: '', department: '', salary: 0 }); }}>Hủy</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <h2>Danh sách nhân viên</h2>
        <form onSubmit={handleSearch} className="search-box">
          <input placeholder="Tìm theo Mã NV hoặc Họ tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-search">Tìm kiếm</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); fetchEmployees(''); }}>Làm mới</button>
        </form>
        <table>
          <thead><tr><th>Mã NV</th><th>Họ tên</th><th>Email</th><th>Chức vụ</th><th>Phòng ban</th><th>Lương</th><th>Thao tác</th></tr></thead>
          <tbody>
            {employees.length > 0 ? (employees.map((emp) => (
              <tr key={emp._id}>
                <td><strong>{emp.employeeId}</strong></td>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.salary ? emp.salary.toLocaleString() + ' VNĐ' : '0 VNĐ'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(emp)}>Sửa</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(emp._id)}>Xóa</button>
                </td>
              </tr>
            ))) : (<tr><td colSpan="7" style={{ textAlign: 'center' }}>Không tìm thấy nhân viên nào</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;
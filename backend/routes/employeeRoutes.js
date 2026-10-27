const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = search ? { $or: [{ employeeId: { $regex: search, $options: 'i' } }, { fullName: { $regex: search, $options: 'i' } }] } : {};
    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    let emp = await Employee.findById(req.params.id).catch(() => null) || await Employee.findOne({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: 'Khong tim thay' });
    res.json(emp);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email, position, department, salary } = req.body;
    if (!employeeId || !fullName || !email) return res.status(400).json({ message: 'Thieu thong tin bat buoc' });
    const exist = await Employee.findOne({ employeeId });
    if (exist) return res.status(400).json({ message: 'Ma NV da ton tai' });
    const newEmp = new Employee({ employeeId, fullName, email, position, department, salary });
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    let emp = await Employee.findById(req.params.id).catch(() => null) || await Employee.findOne({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: 'Khong tim thay' });
    Object.assign(emp, req.body);
    const updated = await emp.save();
    res.json(updated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    let emp = await Employee.findByIdAndDelete(req.params.id).catch(() => null) || await Employee.findOneAndDelete({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: 'Khong tim thay' });
    res.json({ message: 'Xoa thanh cong' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
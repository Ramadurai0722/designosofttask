const Employee = require('../model/employee');

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, gender, age, role, phoneNumber, joiningDate } = req.body;
    const adminId = req.userId; 

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already in use. Please use a different email.' });
    }

    const employee = new Employee({
      name,
      email,
      gender,
      age,
      role,
      phoneNumber,
      joiningDate,
      adminId,
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ adminId: req.userId }); 
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

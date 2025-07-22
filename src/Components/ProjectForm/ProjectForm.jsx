import React, { useState } from 'react';
import './ProjectForm.css';
import { useNavigate } from 'react-router-dom';

const ProjectForm = () => {
  const navigate = useNavigate();

  const STORAGE_KEY = 'savedProjects';
  const loadSavedProjects = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return {};
    }
  };
  const saveProjectsToStorage = (projects) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  const userProjects = [
    { acc: 'Acc1', projectName: 'Smart Irrigation', startDate: '2024-01-01', endDate: '2024-06-30', revenue: '100000', exp: '50000', frequency: 'Stage1', notNew: true },
    { acc: 'Acc1', projectName: 'Water Management', startDate: '2024-02-10', endDate: '2024-07-15', revenue: '', exp: '', frequency: '', notNew: false },
    { acc: 'Acc2', projectName: 'AI Pipeline', startDate: '2024-03-15', endDate: '2024-09-30', revenue: '200000', exp: '45000', frequency: 'Stage3', notNew: true },
    { acc: 'Acc2', projectName: 'Agri Data Lake', startDate: '2024-02-01', endDate: '2024-12-31', revenue: '', exp: '', frequency: '', notNew: false }
  ];

  const [formData, setFormData] = useState({ acc: '', projectName: '', startDate: '', endDate: '', revenue: '', exp: '', frequency: '', notNew: false });
  const [availableProjects, setAvailableProjects] = useState([]);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [paymentStages, setPaymentStages] = useState(0);
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (name === 'frequency') {
      const stageMatch = value.match(/\d+/);
      const stageCount = stageMatch ? parseInt(stageMatch[0], 10) : 0;
      setPaymentStages(stageCount);
      setTableData(Array.from({ length: stageCount }, (_, i) => ({
        id: i + 1,
        phaseName: '',
        actualAccrual: '',
        periodExpected: '',
        periodSlot: '',
        signedOff: false,
        signOffType: '',
        billed: false,
        received: false,
        potentialRevLoss: false,
        reasonForLoss: '',
        invoiceNo: '',
        invoiceDate: '',
        split: '',
        clear: ''
      })));
    }
  };

  const handleAccChange = (e) => {
    const selectedAcc = e.target.value;
    const filtered = userProjects.filter(p => p.acc === selectedAcc);
    setAvailableProjects(filtered);
    setFormData({ acc: selectedAcc, projectName: '', startDate: '', endDate: '', revenue: '', exp: '', frequency: '', notNew: false });
    setIsFormEnabled(false);
    setPaymentStages(0);
    setTableData([]);
  };

  const handleProjectChange = (e) => {
    const selectedProjectName = e.target.value;
    const project = availableProjects.find(p => p.projectName === selectedProjectName);
    if (project) {
      const key = `${project.acc}::${project.projectName}`;
      const savedProjects = loadSavedProjects();
      if (savedProjects[key]) {
        const { formData: savedForm, tableData: savedTable } = savedProjects[key];
        setFormData(savedForm);
        setIsFormEnabled(true);
        setPaymentStages(savedTable.length);
        setTableData(savedTable);
      } else {
        setFormData({ ...project });
        setIsFormEnabled(true);
        if (project.frequency) {
          const stageMatch = project.frequency.match(/\d+/);
          const stageCount = stageMatch ? parseInt(stageMatch[0], 10) : 0;
          setPaymentStages(stageCount);
          setTableData(Array.from({ length: stageCount }, (_, i) => ({
            id: i + 1,
            phaseName: '',
            actualAccrual: '',
            periodExpected: '',
            periodSlot: '',
            signedOff: false,
            signOffType: '',
            billed: false,
            received: false,
            potentialRevLoss: false,
            reasonForLoss: '',
            invoiceNo: '',
            invoiceDate: '',
            split: '',
            clear: ''
          })));
        } else {
          setPaymentStages(0);
          setTableData([]);
        }
      }
    } else {
      setFormData({ ...formData, projectName: selectedProjectName });
      setIsFormEnabled(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = `${formData.acc}::${formData.projectName}`;
    const savedProjects = loadSavedProjects();
    savedProjects[key] = { formData, tableData };
    saveProjectsToStorage(savedProjects);
    alert('Data saved successfully!');
  };

  const updateTableData = (index, field, value) => {
    setTableData(prevData => prevData.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSplitRow = (index) => {
    setTableData(prev => {
      const original = prev[index];
      const accrual = parseFloat(original.actualAccrual) || 0;
      const half = accrual / 2;

      const updatedRow = { ...original, actualAccrual: half.toString() };
      const newRow = { ...original, id: prev.length + 1, actualAccrual: half.toString() };

      const newData = [...prev];
      newData.splice(index + 1, 0, newRow);
      newData[index] = updatedRow;

      return newData;
    });
  };

  const handleClearRow = (index) => {
    setTableData(prev =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              phaseName: '',
              actualAccrual: '',
              periodExpected: '',
              periodSlot: '',
              signedOff: false,
              signOffType: '',
              billed: false,
              received: false,
              potentialRevLoss: false,
              reasonForLoss: '',
              invoiceNo: '',
              invoiceDate: ''
            }
          : row
      )
    );
  };

  const handleViewHistory = () => {
    const savedProjects = loadSavedProjects();
    const entries = Object.entries(savedProjects);

    if (!entries.length) {
      alert('No saved history.');
      return;
    }

    let message = 'Saved Projects:\n\n';
    entries.forEach(([key, { formData }], i) => {
      message += `${i + 1}. ${key} (Project: ${formData.projectName})\n`;
    });
    alert(message);
  }

  return (
    <div className="project-form-page">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-title">Create and Manage Revenue</div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="project-form-container">
        <form onSubmit={handleSubmit} className="project-form">
          <h2>Create and Manage Revenue</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Account Name</label>
              <select name="acc" value={formData.acc} onChange={handleAccChange} required>
                <option value="">Select Account</option>
                <option value="Acc1">Bharti Airtel Ltd</option>
                <option value="Acc2">Filix Consulting Ltd</option>
              </select>
            </div>

            <div className="form-group">
              <label>Project Name</label>
              <select name="projectName" value={formData.projectName} onChange={handleProjectChange} required disabled={!availableProjects.length}>
                <option value="">Select Project</option>
                {availableProjects.map((project, index) => (
                  <option key={index} value={project.projectName}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Project Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required disabled={!isFormEnabled} />
            </div>
            <div className="form-group">
              <label>Project End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required disabled={!isFormEnabled} />
            </div>
          </div>

          <div className="form-row revenue-row">
            <div className="form-group short-input">
              <label>Revenue (Lacs)</label>
              <input type="text" name="revenue" value={formData.revenue} onChange={handleChange} disabled={!isFormEnabled} />
            </div>
            <div className="form-group short-input">
              <label>Exp. Spread</label>
              <input type="text" name="exp" value={formData.exp} onChange={handleChange} disabled={!isFormEnabled} />
            </div>
            <div className="form-group checkbox-group">
              <label>Not New</label>
              <input type="checkbox" name="notNew" checked={formData.notNew} onChange={handleChange} disabled={!isFormEnabled} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Payment Plan Template</label>
              <select name="frequency" value={formData.frequency} onChange={handleChange} required disabled={!isFormEnabled}>
                <option value="">Select Payment Stages</option>
                <option value="Stage1">Stage 1</option>
                <option value="Stage2">Stage 2</option>
                <option value="Stage3">Stage 3</option>
                <option value="Stage4">Stage 4</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {paymentStages > 0 && (
        <div className="table-container">
          <h3>Payment Plan Details</h3>
          <div className="table-wrapper">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Phase Name</th>
                  <th>Actual Accrual (%)</th>
                  <th>Period Expected</th>
                  <th>Period Slot</th>
                  <th>Signed Off?</th>
                  <th>Sign Off Type</th>
                  <th>Billed?</th>
                  <th>Received?</th>
                  <th>Potential Rev. Loss</th>
                  <th>Reason for Loss</th>
                  <th>Invoice No.</th>
                  <th>Invoice Date</th>
                  <th>Split</th>
                  <th>Clear</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{row.id}</td>
                    <td><input type="text" value={row.phaseName} onChange={(e) => updateTableData(idx, 'phaseName', e.target.value)} /></td>
                    <td><input type="text" value={row.actualAccrual} onChange={(e) => updateTableData(idx, 'actualAccrual', e.target.value)} /></td>
                    <td>
                      <select value={row.periodExpected} onChange={(e) => updateTableData(idx, 'periodExpected', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                      </select>
                    </td>
                    <td>
                      <select value={row.periodSlot} onChange={(e) => updateTableData(idx, 'periodSlot', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Slot1">Slot 1</option>
                        <option value="Slot2">Slot 2</option>
                      </select>
                    </td>
                    <td><input type="checkbox" checked={row.signedOff} onChange={(e) => updateTableData(idx, 'signedOff', e.target.checked)} /></td>
                    <td>
                      <select value={row.signOffType} onChange={(e) => updateTableData(idx, 'signOffType', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Internal">Internal</option>
                        <option value="Client">Client</option>
                      </select>
                    </td>
                    <td><input type="checkbox" checked={row.billed} onChange={(e) => updateTableData(idx, 'billed', e.target.checked)} /></td>
                    <td><input type="checkbox" checked={row.received} onChange={(e) => updateTableData(idx, 'received', e.target.checked)} /></td>
                    <td><input type="checkbox" checked={row.potentialRevLoss} onChange={(e) => updateTableData(idx, 'potentialRevLoss', e.target.checked)} /></td>
                    <td>
                      <select value={row.reasonForLoss} onChange={(e) => updateTableData(idx, 'reasonForLoss', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Delay">Delay</option>
                        <option value="Scope Change">Scope Change</option>
                      </select>
                    </td>
                    <td>
                      <select value={row.invoiceNo} onChange={(e) => updateTableData(idx, 'invoiceNo', e.target.value)}>
                        <option value="">Select</option>
                        <option value="INV001">INV001</option>
                        <option value="INV002">INV002</option>
                      </select>
                    </td>
                    <td>
                      <select value={row.invoiceDate} onChange={(e) => updateTableData(idx, 'invoiceDate', e.target.value)}>
                        <option value="">Select</option>
                        <option value="2024-01-01">2024-01-01</option>
                        <option value="2024-02-01">2024-02-01</option>
                      </select>
                    </td>
                    <td>
                      <button type="button" className="table-action-btn" onClick={() => handleSplitRow(idx)}>Split</button>
                    </td>
                    <td>
                      <button type="button" className="table-action-btn" onClick={() => handleClearRow(idx)}>Clear</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="button-row">
            <button type="button" className="submit-btn" onClick={handleSubmit} disabled={!isFormEnabled}>Save</button>
            <button type="button" className="view-history-btn" onClick={handleViewHistory}>View History</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
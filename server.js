const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'hireflow-backend', version: '1.0.0' });
});
app.get('/api/domain/summary', (req, res) => {
  res.json({
    modules: ['offers', 'agencies', 'support', 'sla'],
    message: 'HireFlow backend domain services'
  });
});
app.listen(PORT, '0.0.0.0', () => {
  console.log('HireFlow backend on http://localhost:' + PORT);
});

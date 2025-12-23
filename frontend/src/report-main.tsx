import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WeeklyTemplate from './components/reports/templates/WeeklyTemplate';
import MonthlyTemplate from './components/reports/templates/MonthlyTemplate';
import QuarterlyTemplate from './components/reports/templates/QuarterlyTemplate';
import YearlyTemplate from './components/reports/templates/YearlyTemplate';

// 关键：读取全局注入的数据，实现离线自持
// @ts-ignore
const data = window.__REPORT_DATA__;

const ReportApp = () => {
  if (!data) return <div style={{padding: '20px', color: 'red'}}>ERROR: DATA_LOAD_FAILED</div>;

  const renderTemplate = () => {
    const props = { report: data.report, onDrillDown: () => {} };
    switch (data.report.type) {
      case 'WEEKLY': return <WeeklyTemplate {...props} />;
      case 'MONTHLY': return <MonthlyTemplate {...props} />;
      case 'QUARTERLY': return <QuarterlyTemplate {...props} />;
      case 'YEARLY': return <YearlyTemplate {...props} />;
      default: return <MonthlyTemplate {...props} />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto py-12">
        {renderTemplate()}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('report-root') as HTMLElement).render(
  <React.StrictMode>
    <ReportApp />
  </React.StrictMode>
);
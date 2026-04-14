import { useNavigate } from 'react-router-dom';
import ReportForm from '../../components/report/ReportForm';

const ReportPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 max-w-lg mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>📋</span> Report an Issue
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Help fellow drivers by reporting road hazards and incidents.
        </p>
      </div>
      <div className="card">
        <ReportForm onSuccess={() => navigate('/driver/history')} />
      </div>
    </div>
  );
};

export default ReportPage;

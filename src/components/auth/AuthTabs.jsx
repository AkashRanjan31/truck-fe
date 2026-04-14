const AuthTabs = ({ activeTab, onTabChange }) => (
  <div className="flex bg-slate-900 rounded-xl p-1 mb-6 border border-slate-700">
    {['register', 'login'].map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`flex-1 py-2.5 text-sm font-semibold capitalize rounded-lg transition-all duration-200 ${
          activeTab === tab
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default AuthTabs;

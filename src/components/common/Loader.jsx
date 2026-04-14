const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={text || 'Loading'}>
      <div className={`${sizes[size]} border-slate-700 border-t-orange-500 rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
};

export default Loader;

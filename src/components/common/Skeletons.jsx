// Reusable skeleton components for loading states

const shimmer = 'animate-pulse bg-slate-700 rounded-xl';

export const SkeletonLine = ({ w = 'w-full', h = 'h-4' }) => (
  <div className={`${shimmer} ${w} ${h}`} />
);

export const SkeletonCard = ({ rows = 3 }) => (
  <div className="card space-y-3">
    <div className="flex items-center gap-3">
      <div className={`${shimmer} w-10 h-10 rounded-xl shrink-0`} />
      <div className="flex-1 space-y-2">
        <SkeletonLine w="w-2/3" h="h-4" />
        <SkeletonLine w="w-1/3" h="h-3" />
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonLine key={i} w={i % 2 === 0 ? 'w-full' : 'w-3/4'} h="h-3" />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex gap-4 pb-2 border-b border-slate-700">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className={`${shimmer} h-3 flex-1`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 py-2">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className={`${shimmer} h-4 flex-1`} style={{ opacity: 1 - r * 0.1 }} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonStats = ({ count = 4 }) => (
  <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(count, 4)} gap-4`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card flex items-center gap-4">
        <div className={`${shimmer} w-12 h-12 rounded-xl shrink-0`} />
        <div className="flex-1 space-y-2">
          <SkeletonLine w="w-1/2" h="h-6" />
          <SkeletonLine w="w-3/4" h="h-3" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div className="card space-y-4">
    <div className="flex items-center gap-4">
      <div className={`${shimmer} w-20 h-20 rounded-2xl shrink-0`} />
      <div className="flex-1 space-y-2">
        <SkeletonLine w="w-1/2" h="h-5" />
        <SkeletonLine w="w-1/3" h="h-4" />
        <SkeletonLine w="w-1/4" h="h-3" />
      </div>
    </div>
    <div className="bg-slate-900 rounded-xl p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <SkeletonLine w="w-1/4" h="h-3" />
          <SkeletonLine w="w-1/3" h="h-3" />
        </div>
      ))}
    </div>
  </div>
);

export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-10 h-10 border-2 border-slate-700 border-t-orange-500 rounded-full animate-spin" />
    <p className="text-slate-400 text-sm">{text}</p>
  </div>
);

export const EmptyState = ({ icon = '📋', title = 'Nothing here', message = '', action }) => (
  <div className="card text-center py-14 space-y-3">
    <p className="text-5xl">{icon}</p>
    <p className="text-white font-bold text-base">{title}</p>
    {message && <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">{message}</p>}
    {action && (
      <div className="pt-2">
        <button onClick={action.onClick} className="btn-primary text-sm">
          {action.label}
        </button>
      </div>
    )}
  </div>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="card text-center py-12 space-y-3 border-red-500/20">
    <p className="text-4xl">⚠️</p>
    <p className="text-red-400 font-semibold text-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-sm mx-auto">
        Try Again
      </button>
    )}
  </div>
);

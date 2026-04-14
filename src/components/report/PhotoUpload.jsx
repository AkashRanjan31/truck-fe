import { useRef } from 'react';

const PhotoUpload = ({ files, onChange }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    const merged = [...files, ...selected].slice(0, 5);
    onChange(merged);
    e.target.value = '';
  };

  const removeFile = (i) => {
    // Revoke object URL to prevent memory leak
    URL.revokeObjectURL(URL.createObjectURL(files[i]));
    onChange(files.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {files.map((file, i) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-600">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-lg"
              >
                ×
              </button>
            </div>
          );
        })}
        {files.length < 5 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-orange-500 hover:text-orange-400 transition-all"
          >
            <span className="text-2xl">+</span>
            <span className="text-xs mt-0.5">Photo</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
      <p className="text-xs text-slate-600 mt-2">{files.length}/5 photos selected</p>
    </div>
  );
};

export default PhotoUpload;

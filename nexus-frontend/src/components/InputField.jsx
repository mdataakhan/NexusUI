export default function InputField({ label, type = "text", value, onChange }) {
    return (
      <div className="mb-5">
        <label className="block text-gray-600 mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>
    );
  }
  
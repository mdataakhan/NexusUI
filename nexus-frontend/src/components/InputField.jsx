export default function InputField({ label, type = "text", value, onChange }) {
    return (
      <div className="mb-5">
        <label className="block text-gray-600 dark:text-gray-300 mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-600"
        />
      </div>
    );
  }
  
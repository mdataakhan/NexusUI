export default function RoleSelector({ selected, onSelect }) {
    const roles = ["SUPPLIER", "FUNDER", "INVESTOR"];
  
    return (
      <div className="grid grid-cols-3 gap-3">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => onSelect(r)}
            className={`p-3 rounded-lg border text-sm ${
              selected === r
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-white"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    );
  }
  
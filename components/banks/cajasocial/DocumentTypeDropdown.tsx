
interface DocumentType {
  code: string;
  name: string;
}

interface Props {
  value: DocumentType | null;
  onChange: (doc: DocumentType | null) => void;
  error?: boolean;
}

const documentTypes: DocumentType[] = [
  { code: "CC", name: "Cédula de Ciudadanía" },
  { code: "CE", name: "Cédula de Extranjería" },
  { code: "NIT", name: "Número de Identificación Tributaria" },
  { code: "TI", name: "Tarjeta de Identidad" },
  { code: "PEP", name: "Permiso especial de permanencia" },
  { code: "US", name: "Usuario" },
];

const DocumentTypeDropdown: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <div className="bcs-form-group">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        (*) Tipo de identificación
      </label>
      <select
        className={`w-full border rounded-md p-2 bg-white ${error ? "border-red-500" : "border-gray-300"}`}
        value={value?.code || ""}
        onChange={(e) => {
          const selected = documentTypes.find(dt => dt.code === e.target.value);
          onChange(selected || null);
        }}
      >
        <option value="" disabled>Seleccionar</option>
        {documentTypes.map(dt => (
          <option key={dt.code} value={dt.code}>{dt.name}</option>
        ))}
      </select>
    </div>
  );
};

export default DocumentTypeDropdown;
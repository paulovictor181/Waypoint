import { faPen, faQrcode, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TableData {
  id: string;
  city: string;
  followers: string;
  status: string;
  comission: string;
  valor: string;
  actions: string;
}

// Mockup lines for user grid.
const TABLE_HEADER = [
  { id: "ID", city: "Cidade", followers: "Followers", status: "Status Atual", comission: "Comissão", valor: "Valor", actions: "Ações" }
]
const TABLE_CONTENT = [
  { id: "1", city: "Mossoró", followers: "10030", status: "Ativo", comission: "10%", valor: "R$432,00", actions: [<FontAwesomeIcon icon={faQrcode} />, <FontAwesomeIcon icon={faTrashCan} />, <FontAwesomeIcon icon={faPen} />] },
  { id: "2", city: "Natal", followers: "420230", status: "Suspenso", comission: "15%", valor: "R$3201,00", actions: [<FontAwesomeIcon icon={faQrcode} />, <FontAwesomeIcon icon={faTrashCan} />, <FontAwesomeIcon icon={faPen} />] },
  { id: "3", city: "Natal", followers: "58290", status: "Ativo", comission: "10%", valor: "R$1342,00", actions: [<FontAwesomeIcon icon={faQrcode} />, <FontAwesomeIcon icon={faTrashCan} />, <FontAwesomeIcon icon={faPen} />] },
  { id: "4", city: "Mossoró", followers: "82010", status: "Ativo", comission: "10%", valor: "R$1564,00", actions: [<FontAwesomeIcon icon={faQrcode} />, <FontAwesomeIcon icon={faTrashCan} />, <FontAwesomeIcon icon={faPen} />] },
];


const UserGrid = () => {
    const headerLabels = TABLE_HEADER[0];

    // Create a strict list of keys to ensure Header and Body align perfectly
    const columnKeys = Object.keys(headerLabels) as Array<keyof TableData>;

    return(
        <div className="border border-slate-400 rounded-lg">
            <table className="w-full h-max">
                {/* HEAD */}
                <thead>
                    <tr className="border-b border-gray-300">
                        {columnKeys.map((key) => (
                            <th key={key} className="p-2 text-left font-semibold">
                                {headerLabels[key]}
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* BODY */}
                <tbody>
                {TABLE_CONTENT.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                    {columnKeys.map((key) => (
                        <td key={`${row.id}-${key}`} className="p-2">
                            {row[key]}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};


export default UserGrid;
import axios from "axios";
import { useEffect, useState } from "react";

interface IIsraelData {
  _id: number;
  סמל_ישוב: number;
  שם_ישוב: string;
  סמל_נפה: number;
  נפה: string;
  קוד_לשכת_מנא: number;
  לשכת_מנא: string;
  קוד_מועצה_אזורית: number;
  מועצה_אזורית: string;
  סהכ: number;
  גיל_0_5: number;
  גיל_6_18: number;
  גיל_19_45: number;
  גיל_46_55: number;
  גיל_56_64: number;
  גיל_65_פלוס: number;
}

const Extra: React.FC = () => {
  const [data, setData] = useState<IIsraelData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const israelData = `https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=100`;
    axios
      .get(israelData)
      .then((response) => {
        setData(response.data.result.records);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div dir="rtl" className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">ישוב</th>
            <th scope="col">כמות תושבים</th>
            <th scope="col">מועצה אזורית</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.שם_ישוב}</td>
              <td>{item.סהכ}</td>
              <td>{item.מועצה_אזורית}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Extra;

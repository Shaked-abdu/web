import { useEffect } from "react";
import { useParams } from "react-router-dom";

interface IProps {
  onSubmit: (email: string, password: string) => void;
}
const Google: React.FC<IProps> = ({ onSubmit }) => {
  const { email, password } = useParams();

  useEffect(() => {
    if (email && password) {
      onSubmit(email, password);
    }
  }, []);

  return <div></div>;
};

export default Google;

import React from "react";
import { useParams } from "react-router-dom";

const Dictionary: React.FC = () => {
  let { dictionaryId } = useParams();
  return <h3>Dictionary ID: {dictionaryId}</h3>;
};

export default Dictionary;

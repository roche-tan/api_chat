const Alert = ({ message }) => {
  if (!message) return null;

  return <div style={{ color: "red", margin: "10px 0" }}>{message}</div>;
};

export default Alert;

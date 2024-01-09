import { useState, createContext } from "react";
import EmailSending from "./EmailSending";
import CodeAuth from "./CodeAuth";
import ResetPass from "./ResetPass";

export const RecoveryContext = createContext();
function Reset() {
  const [page, setPage] = useState("login");
  const [KOD, setKOD] = useState(null);
  const [universalEmail, setUniversalEmail] = useState("");

  function NavigatePages() {
    if (page === "login") return <EmailSending />;
    if (page === "code") return <CodeAuth />;
    if (page === "reset") return <ResetPass />;
  }

  return (
    <RecoveryContext.Provider
      value={{ page, setPage, KOD, setKOD, universalEmail, setUniversalEmail }}
    >
      <div>
        <NavigatePages />
      </div>
    </RecoveryContext.Provider>
  );
}

export default Reset;

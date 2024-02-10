import { useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import Search from "../components/Search";
import CardGrid from "../components/General/CardGrid";
const Network = () => {
  const { memberships, pendingTx } = useContext(AppContext) as AppContextType;
  return (
    <div className=" pt-6 flex flex-col w-full max-w-[94vw] bg-cover">
      <div className="flex flex-col items-center">
        <div className="text-transparent font-kenia bg-clip-text bg-velvetSun text-[44px] sm:text-[52px] text-center md:text-[60px] font-bold">
          Your Network
        </div>
        <Search />
      </div>
      <CardGrid memberships={memberships} isFilter={true} pendingTx={pendingTx} />
    </div>
  );
};

export default Network;

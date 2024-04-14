
import AccountsTable from "../components/AccountsTable/AccountsTable";
import Loading from "../components/Loading/Loading";

import { useCommonState } from "../data/commonState";

const Accounts = () => {
  const {isPageLoading, toggleModal} = useCommonState();

  return (
    <section className="accounts">
      <div className="accounts__container container">
        <div className="accounts__header">
          <h1 className="accounts__title">Accounts</h1>
          <button className="accounts__button btn" onClick={() => toggleModal('signup')}>Add Account</button>
        </div>
        {isPageLoading ? (
          <Loading />
        ) : (
          <AccountsTable />
        )}
      </div>
    </section>
  );
};

export default Accounts;

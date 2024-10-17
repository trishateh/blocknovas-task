import TransactionsTable from "../views/transactionsTable";


function Transactions() {
    return (
      <div id="transactions" className="h-screen md:flex">
        <TransactionsTable />
      </div>
    );
  }
  
  export default Transactions;
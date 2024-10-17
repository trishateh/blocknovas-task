const axios = require("axios");

const BITQUERY_URL = "https://streaming.bitquery.io/graphql";

const getWhaleAccounts = async () => {
  let data = JSON.stringify({
    query: `
   query {
  EVM(network: bsc) {
    Transfers(
      where: {Transfer: {Amount: {ge: "100"}, Currency: {Native: true}}}
      limit: {count: 10}
      orderBy: {descending: Transfer_Amount}
    ) {
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Name
          Native
          Fungible
        }
      }
      Transaction {
        From
        Hash
      }
    }
  }
}
  `,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://streaming.bitquery.io/graphql",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "BQYe034ppE6n67ldgLRpRKtgbvaavYmB",
      Authorization: `Bearer ${process.env.BITQUERY_API_KEY}`,
    },
    data: data,
  };

  try {
    let response = await axios.request(config);
    return response.data.data.EVM.Transfers;
  } catch (error) {
    console.error("Error fetching whale accounts:", error);
    return [];
  }
};

module.exports = {
  getWhaleAccounts,
};

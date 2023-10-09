const formatExpenses = (data) => {
  const categories = data.map((data) => data.category);
  const tabs = [...new Set(categories)]; 

    const transactions = tabs.map((category) => {
      const total = data.reduce((sum, object) => {
        if ((object['category'] === category)) {
          return Number(sum) + Number(object['amount'])
        } else {
          return Number(sum)
        }
      }, 0)
      return {
        category: category,
        amount: total,
      }
    })

    const filterTransactions = transactions.filter(transaction => transaction.amount > 0);

    return filterTransactions
}

module.exports = {formatExpenses}
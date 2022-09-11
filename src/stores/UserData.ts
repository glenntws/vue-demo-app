import { defineStore } from "pinia";
import {v4 as uuidv4} from 'uuid';
import DummyFinanceData from "../assets/dummyInitFinanceData.json";

// Note: All financial data will just be stored in cents (euros) in order to make it simple for this demo...

export enum TransactionType {
  FOOD = "food",
  HOUSING = "housing",
  LOAN = "loan",
  INCOME = "income",
  OTHER = "other"
}

export type TransactionData = {
    id: string,
    date: number, // UNIX timestamp
    amount: number,
    title: string,
    type: TransactionType
}

export type UserDataType = {
    firstName: string,
    lastName: string,
    profilePic: string,
    currentBalance: number, // Note: all financial data will be stored in cents in order to avoid floating-point errors.
    transactions: TransactionData[]
}

// Translator to get display name of a transaction type
export function getNameOfTransactionType(type: TransactionType): string {
  // This for should could have been made more compact (with a map or so) but it's good enough for the demo
  switch (type) {
    case TransactionType.FOOD:
      return "Food";
    case TransactionType.HOUSING:
      return "Housing";
    case TransactionType.INCOME:
      return "Income";
    case TransactionType.LOAN:
      return "Loan";
    default:
      return "Other";
  }
}

// Helper function to make string out of money amount
export function amountToString(amount: number, plusPrefix: boolean = false): string {
  return ( ((plusPrefix && amount > 0) ? "+" : "") + (amount / 100).toFixed(2) + " €" );
}

export const useUserDataStore = defineStore({
  id: "userData",
  state: () => (DummyFinanceData as UserDataType),
  getters: {
    fullName: (state) => { return (state.firstName + " " + state.lastName); },
    balance: (state) => 
      (atDate: number): number => {
        let balanceAtTime: number = state.currentBalance;

        // filter out all transactions that we have to remove from the current balance
        const removeTransactions: TransactionData[] = state.transactions.filter((transaction) => (transaction.date >= atDate));
        removeTransactions.forEach((transaction) => {
          balanceAtTime -= transaction.amount;
        });
        
        return balanceAtTime;
      },
    summarizedExpenditures: (state) => 
      (startDate: number, endDate: number, type: TransactionType | null = null): number => {
        // make sure that endDate is after startDate. Otherwise, we just return 0 as fallback.
        if(startDate > endDate)
        {
          return 0;
        }
        else
        {
          // filter out the relevant transactions
          const expenditures: TransactionData[] = state.transactions.filter((transaction) =>
          ((transaction.date >= startDate) && (transaction.date <= endDate) && (transaction.amount < 0) && (type === null || transaction.type === type)));

          let expendituresSum = 0;

          // Summarize the relevant expenditures (we could do that during the filtering for better performance) but let's make it readable)
          expenditures.forEach((expenditure) => {
            expendituresSum -= expenditure.amount;
          });

          return expendituresSum;
        }
      },
    summarizedEarnings: (state) => 
      (startDate: number, endDate: number, type: TransactionType | null = null): number => {
        // make sure that endDate is after startDate. Otherwise, we just return 0 as fallback.
        if(startDate > endDate)
        {
          return 0;
        }
        else
        {
          // filter out the relevant transactions
          const earnings: TransactionData[] = state.transactions.filter((transaction) =>
          ((transaction.date >= startDate) && (transaction.date <= endDate) && (transaction.amount > 0) && (type === null || transaction.type === type)));

          let earningsSum = 0;

          // Summarize the relevant earnings (we could do that during the filtering for better performance) but let's make it readable)
          earnings.forEach((earning) => {
            earningsSum += earning.amount;
          });

          return earningsSum;
        }
      },
    summarizedCashflow: (state) => 
      (startDate: number, endDate: number, type: TransactionType | null = null): number => {
        // make sure that endDate is after startDate. Otherwise, we just return 0 as fallback.
        if(startDate > endDate)
        {
          return 0;
        }
        else
        {
          // filter out the relevant transactions
          const transactions: TransactionData[] = state.transactions.filter((transaction) =>
          ((transaction.date >= startDate) && (transaction.date <= endDate) && (type === null || transaction.type === type)));

          let cashflowSum = 0;

          // Summarize the relevant earnings (we could do that during the filtering for better performance) but let's make it readable)
          transactions.forEach((transaction) => {
            if(transaction.amount < 0)
            {
              cashflowSum -= transaction.amount;
            }
            else
            {
              cashflowSum += transaction.amount;
            }
          });

          return cashflowSum;
        }
      }
    },
  actions: {
    updateTransaction(newData: TransactionData) {
      // Find the index of the old transaction
      let itemIndex: number = this.transactions.findIndex((data) => {
        return (data.id === newData.id);
      });

      if(itemIndex !== -1)
      {
        // Update account balance to remove old transaction amount
        this.currentBalance -= this.transactions[itemIndex].amount;

        // Store new data
        this.transactions[itemIndex] = newData;

        // Update account balance to add new transaction amount
        this.currentBalance += newData.amount;
      }
    },
    addTransaction(data: TransactionData) {
      // Update the ID to a unique one
      data.id = uuidv4();

      // Add new transaction
      this.transactions.push(data);
      
      // Update account balance
      this.currentBalance += data.amount;
    },
    deleteTransaction(id: string) {
      // Find the index of the transaction
      let itemIndex: number = this.transactions.findIndex((data) => {
        return (data.id === id);
      });

      // Update account balance
      this.currentBalance -= this.transactions[itemIndex].amount;

      // Delete transaction
      this.transactions.splice(itemIndex, 1);
    }
  },
});

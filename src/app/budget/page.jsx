"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lightbulb, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Budget() {
  const [budget, setBudget] = useState({ amount: 0, currency: "USD" });
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: 0,
    currency: "USD",
  });
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = "79a938ee-ed68-4c2c-8ab8-38b71114503e";

  useEffect(() => {
    fetchBudgetSummary();
  }, []);

  const fetchBudgetSummary = async () => {
    try {
      const response = await fetch(`/api/budget/summary?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch budget summary");
      const data = await response.json();
      if (data.length > 0) {
        setBudget(data[0]);
        setExpenses(data[0].expenses || []);
      }
    } catch (error) {
      console.error("Error fetching budget summary:", error);
      setError("Failed to fetch budget summary");
    }
  };

  const handleSetBudget = async () => {
    try {
      const response = await fetch("/api/budget/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: budget.amount,
          currency: budget.currency,
        }),
      });
      if (!response.ok) throw new Error("Failed to set budget");
      fetchBudgetSummary(); // Refresh budget summary
    } catch (error) {
      console.error("Error setting budget:", error);
      setError("Failed to set budget");
    }
  };

  const handleAddExpense = async () => {
    try {
      const response = await fetch("/api/budget/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetId: budget.id, ...newExpense }),
      });
      if (!response.ok) throw new Error("Failed to add expense");
      setNewExpense({ category: "", amount: 0, currency: "USD" }); // Reset form
      fetchBudgetSummary(); // Refresh budget summary
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense");
    }
  };

  const handleGetTips = async () => {
    try {
      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const response = await fetch(`/api/budget/tips?amount=${totalExpenses}`);
      if (!response.ok) throw new Error("Failed to fetch tips");
      const data = await response.json();
      setTips(data.tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
      setError("Failed to fetch tips");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen p-8 bg-gray-50 mt-8">
      <h1 className="text-2xl text-center font-bold mb-6 justify-center">Budget Management💸</h1>

      {/* Set Budget Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Set Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="number"
              value={budget.amount}
              onChange={(e) =>
                setBudget({ ...budget, amount: parseFloat(e.target.value) })
              }
              placeholder="Budget Amount"
            />
            <select
              value={budget.currency}
              onChange={(e) =>
                setBudget({ ...budget, currency: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
            <Button onClick={handleSetBudget}>Set Budget</Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Add Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              placeholder="Expense Category"
            />
            <Input
              type="number"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  amount: parseFloat(e.target.value),
                })
              }
              placeholder="Expense Amount"
            />
            <select
              value={newExpense.currency}
              onChange={(e) =>
                setNewExpense({ ...newExpense, currency: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Summary Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Budget Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Total Budget:</strong> {budget.currency} {budget.amount}
            </p>
            <p className="text-lg">
              <strong>Total Expenses:</strong> {budget.currency}{" "}
              {expenses.reduce((sum, expense) => sum + expense.amount, 0)}
            </p>
            <div>
              <h3 className="text-xl font-semibold mb-2">Expenses Breakdown</h3>
              {expenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 p-4 rounded-lg mb-2"
                >
                  <p>
                    <strong>Category:</strong> {expense.category}
                  </p>
                  <p>
                    <strong>Amount:</strong> {expense.currency} {expense.amount}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost-Saving Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            Cost-Saving Tips
          </CardTitle>
          <CardDescription>
            Get personalized tips to save money and optimize your budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetTips} className="mb-4">
            Get Tips
          </Button>
          {tips.length > 0 && (
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-blue-100 p-4 rounded-lg flex items-center gap-2"
                >
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <p>{tip}</p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </motion.div>
      )}
    </div>
    </>
  );
}
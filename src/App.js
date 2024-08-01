import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const GroceryExpenseTracker = () => {
  const [groceries, setGroceries] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    discount: "",
    store: "",
    weight: "",
    quantity: "",
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const savedGroceries = localStorage.getItem("groceries");
    if (savedGroceries) {
      setGroceries(JSON.parse(savedGroceries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("groceries", JSON.stringify(groceries));
  }, [groceries]);

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setGroceries([
        ...groceries,
        { ...newItem, date: new Date().toISOString(), id: Date.now() },
      ]);
      setNewItem({
        name: "",
        price: "",
        discount: "",
        store: "",
        weight: "",
        quantity: "",
      });
    }
  };

  const filteredGroceries = groceries.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear
    );
  });

  const totalExpense = filteredGroceries.reduce(
    (sum, item) =>
      sum + parseFloat(item.price) * parseFloat(item.quantity || 1),
    0
  );
  const totalSavings = filteredGroceries.reduce(
    (sum, item) =>
      sum + parseFloat(item.discount || 0) * parseFloat(item.quantity || 1),
    0
  );

  const storeData = filteredGroceries.reduce((acc, item) => {
    if (!acc[item.store]) {
      acc[item.store] = 0;
    }
    acc[item.store] += parseFloat(item.price) * parseFloat(item.quantity || 1);
    return acc;
  }, {});

  const pieChartData = Object.entries(storeData).map(([name, value]) => ({
    name,
    value,
  }));

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "#f5f5f5",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    },
    header: {
      fontSize: "28px",
      marginBottom: "30px",
      color: "#333",
      textAlign: "center",
    },
    section: {
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    subHeader: {
      fontSize: "22px",
      marginBottom: "15px",
      color: "#444",
    },
    inputGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "14px",
      width: "100%",
      boxSizing: "border-box",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#0070f3",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    th: {
      backgroundColor: "#f0f0f0",
      padding: "12px",
      borderBottom: "2px solid #ddd",
      textAlign: "left",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #ddd",
    },
    chartContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      marginBottom: "30px",
    },
    chartSection: {
      flex: 1,
      minHeight: "300px",
    },
    "@media (min-width: 768px)": {
      chartContainer: {
        flexDirection: "row",
      },
    },
    responsiveTable: {
      overflowX: "auto",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Grocery Expense Tracker List</h1>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Add New Item</h2>
        <div style={styles.inputGrid}>
          <input
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Item name"
            style={styles.input}
          />
          <input
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            placeholder="Price"
            type="number"
            style={styles.input}
          />
          <input
            name="discount"
            value={newItem.discount}
            onChange={handleInputChange}
            placeholder="Discount"
            type="number"
            style={styles.input}
          />
          <input
            name="store"
            value={newItem.store}
            onChange={handleInputChange}
            placeholder="Store"
            style={styles.input}
          />
          <input
            name="weight"
            value={newItem.weight}
            onChange={handleInputChange}
            placeholder="Weight (e.g., 500g)"
            style={styles.input}
          />
          <input
            name="quantity"
            value={newItem.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            type="number"
            style={styles.input}
          />
        </div>
        <button
          onClick={handleAddItem}
          style={{ ...styles.button, marginTop: "15px" }}
        >
          Add Item
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Grocery List</h2>
        <div style={styles.responsiveTable}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Discount</th>
                <th style={styles.th}>Store</th>
                <th style={styles.th}>Weight</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroceries.map((item, index) => (
                <tr key={item.id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    ${parseFloat(item.discount || 0).toFixed(2)}
                  </td>
                  <td style={styles.td}>{item.store}</td>
                  <td style={styles.td}>{item.weight}</td>
                  <td style={styles.td}>{item.quantity || 1}</td>
                  <td style={styles.td}>
                    $
                    {(
                      parseFloat(item.price) * parseFloat(item.quantity || 1)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.subHeader}>
          Monthly Overview - {monthNames[currentMonth]} {currentYear}
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setCurrentMonth((prev) => (prev - 1 + 12) % 12)}
            style={styles.button}
          >
            Previous Month
          </button>
          <button
            onClick={() => setCurrentMonth((prev) => (prev + 1) % 12)}
            style={styles.button}
          >
            Next Month
          </button>
        </div>
        <p style={{ fontSize: "18px" }}>
          Total Expense: ${totalExpense.toFixed(2)}
        </p>
        <p style={{ fontSize: "18px" }}>
          Total Savings: ${totalSavings.toFixed(2)}
        </p>
      </div>

      <div style={styles.chartContainer}>
        <div style={{ ...styles.section, ...styles.chartSection }}>
          <h2 style={styles.subHeader}>Expenses by Store</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...styles.section, ...styles.chartSection }}>
          <h2 style={styles.subHeader}>Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pieChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GroceryExpenseTracker;

<script setup>
import { ref, computed } from "vue";

const columns = ref([
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "action", label: "Action" },
]);

const data = ref([
  {
    title: "Breakfast",
    category: "Food & Beverage",
    date: "2024-08-01",
    amount: 150,
  },
  {
    title: "Lunch",
    category: "Food & Beverage",
    date: "2024-08-02",
    amount: 200,
  },
  { title: "Transport", category: "Travel", date: "2024-08-03", amount: 100 },
  {
    title: "Gym Membership",
    category: "Fitness",
    date: "2024-08-04",
    amount: 50,
  },
  {
    title: "Groceries",
    category: "Food & Beverage",
    date: "2024-08-05",
    amount: 300,
  },
  {
    title: "Movie Tickets",
    category: "Entertainment",
    date: "2024-08-06",
    amount: 40,
  },
  {
    title: "Dinner Out",
    category: "Food & Beverage",
    date: "2024-08-07",
    amount: 80,
  },
  {
    title: "Book Purchase",
    category: "Education",
    date: "2024-08-08",
    amount: 25,
  },
  {
    title: "Subscription Service",
    category: "Entertainment",
    date: "2024-08-09",
    amount: 15,
  },
  { title: "Utilities", category: "Bills", date: "2024-08-10", amount: 120 },
]);

const sortColumn = ref("");
const sortOrder = ref("asc");

const sortedData = computed(() => {
  if (!sortColumn.value) return data.value;

  const sorted = [...data.value].sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sorted;
});

const sortData = (key) => {
  if (sortColumn.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = key;
    sortOrder.value = "asc";
  }
};

const editItem = (index) => {
  // Implement edit functionality here
  console.log(`Edit item with index: ${index}`);
};

const deleteItem = (index) => {
  // Implement delete functionality here
  console.log(`Delete item with index: ${index}`);
};

const searchTerm = ref("");
const filteredData = computed(() => {
  if (!searchTerm.value) return sortedData.value;
  return sortedData.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  );
});
</script>

<template>
  <main class="flex flex-col mt-24 p-5 w-full">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">Expense Information Table</h1>
      <div class="flex gap-4 items-center">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search..."
          class="border p-2 rounded"
        />
        <button
          @click="() => console.log('Add Expense')"
          class="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </div>
    </div>
    <div class="w-full lg:px-28 px-5 overflow-x-auto flex lg:justify-center">
      <table class="w-full min-w-[700px] max-w-[1240px]">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="sortData(column.key)"
              class="bg-black text-white cursor-pointer"
            >
              {{ column.label }}
              <span v-if="sortColumn === column.key">
                {{ sortOrder === "asc" ? "↑" : "↓" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredData.length === 0">
            <td :colspan="columns.length" class="text-center h-20">
              There is no record to display
            </td>
          </tr>
          <tr v-for="(item, index) in filteredData" :key="index">
            <td>{{ item.title }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.amount }}</td>
            <td>
              <button
                @click="editItem(index)"
                class="bg-indigo-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                @click="deleteItem(index)"
                class="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
/* Add any custom styles here */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

button {
  margin-right: 5px;
}

input {
  outline: none;
}
</style>

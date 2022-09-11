<script setup lang="ts">
import { computed, reactive, ref, type Ref } from 'vue';
import InfoBox from '../components/InfoBox.vue';
import { getNameOfTransactionType, TransactionType, useUserDataStore, type TransactionData } from '../stores/UserData';
import dayjs from 'dayjs';

const userDataStore = useUserDataStore();

const search = ref('')

const filterTableData = computed(() =>
  {
    const filteredData: TransactionData[] = userDataStore.transactions.filter(
      (data) =>
        !search.value ||
        data.title.toLowerCase().includes(search.value.toLowerCase())
      );

    return filteredData;
}
)

// Edit dialog data
let editAddDialogItemIndex: Ref<number> = ref(-1);

const editAddDialogVisible = ref(false)
const formLabelWidth = '140px'

const editAddForm = reactive({
  date: dayjs().format(),
  title: "",
  amount: 0,
  type: ""
});


// Table CRUD handlers

function handleUpdate(id: string)
{
  const itemIndex = filterTableData.value.findIndex((data) => (data.id === id));

  editAddDialogItemIndex.value = itemIndex;

  editAddForm.title = filterTableData.value[itemIndex].title;
  editAddForm.amount = ((filterTableData.value[itemIndex].amount) / 100);
  editAddForm.date = dayjs.unix(filterTableData.value[itemIndex].date).format();
  editAddForm.type = filterTableData.value[itemIndex].type;

  editAddDialogVisible.value = true;
}

function handleDelete(id: string)
{
  const itemIndex = filterTableData.value.findIndex((data) => (data.id === id));

  userDataStore.deleteTransaction(filterTableData.value[itemIndex].id);
}

function handleCreate()
{
  editAddDialogItemIndex.value = -1;
  editAddDialogVisible.value = true;
}


function handleDialogClose()
{
  // Call the respective handler on the store for the data change
  if(editAddDialogItemIndex.value == -1)
  {
    userDataStore.addTransaction({
      id: "",
      date: dayjs(editAddForm.date).unix(),
      title: editAddForm.title,
      amount: Math.round(editAddForm.amount * 100),
      type: editAddForm.type
    } as TransactionData);
  }
  else {
    userDataStore.updateTransaction({
      id: filterTableData.value[editAddDialogItemIndex.value].id,
      date: dayjs(editAddForm.date).unix(),
      title: editAddForm.title,
      amount: Math.round(editAddForm.amount * 100),
      type: editAddForm.type
    } as TransactionData);
  }

  // Close the dialog
  editAddDialogVisible.value = false;
}
</script>

<template>
  <el-container>
    <el-header>
      <h1>Transactions</h1>
    </el-header>
    <el-main>
      <div class="custom-grid">
        <InfoBox full-width content-align="right">
          <el-input class="table-filter-search" v-model="search" placeholder="Type to search" />
          <el-button @click="handleCreate()" type="primary">Add Transaction</el-button>
          <el-table :data="filterTableData" :default-sort="{ prop: 'date', order: 'descending' }">
            <el-table-column prop="date" label="Date" width="150" sortable>
              <template #default="scope">
                {{ dayjs.unix(scope.row.date).format("YYYY-MM-DD HH:mm")}}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="Title" sortable />
            <el-table-column prop="amount" label="Amount" width="200" sortable>
              <template #default="scope">
              {{ (scope.row.amount / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="type" label="Type" width="120" sortable>
              <template #default="scope">
                {{
                  getNameOfTransactionType(scope.row.type)
                }}
              </template>
            </el-table-column>
            <el-table-column prop="edit" width="140">
              <template #default="scope">
                <el-button size="small" @click="handleUpdate(scope.row.id)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </InfoBox>
      </div>
    </el-main>
  
    <!-- Add/Edit dialog -->
    <el-dialog v-model="editAddDialogVisible">
      <el-form :model="editAddForm">
        <el-form-item label="Date" :label-width="formLabelWidth">
          <el-date-picker v-model="editAddForm.date" type="datetime" placeholder="Select date and time" />
        </el-form-item>
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-input v-model="editAddForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Amount" :label-width="formLabelWidth">
          <el-input v-model="editAddForm.amount" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-select v-model="editAddForm.type" placeholder="Select the type of the transaction">
            <el-option label="Food" value="food" />
            <el-option label="Housing" value="housing" />
            <el-option label="Loan" value="loan" />
            <el-option label="Income" value="income" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editAddDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleDialogClose()">
            <template v-if="editAddDialogItemIndex !== -1">Update</template>
            <template v-else>Add</template>
          </el-button>
        </span>
      </template>
    </el-dialog>

  </el-container>

</template>


<style>
  .custom-grid .el-input {
    display: inline-block;
    width: 200px;
    margin: 1rem;
  }

  .el-dialog {
    width: fit-content;
  }
</style>
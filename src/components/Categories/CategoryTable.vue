<template>
    <div class="container">
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedCategories || !selectedCategories.length" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedCategories"
                :value="categories"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Categories</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column field="description" header="Description" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategory(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="categoryDialog" :style="{ width: '450px' }" header="Category Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="category.name" required="true" autofocus :invalid="submitted && !category.name" fluid />
                    <small v-if="submitted && !category.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="category.description" required="true" rows="3" cols="20" fluid />
                </div>

            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="category"
                    >Are you sure you want to delete <b>{{ category.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoryDialog = false" severity="secondary" variant="text" />
                <Button label="Yes" icon="pi pi-check" @click="deleteCategory" severity="danger" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="category">Are you sure you want to delete the selected categories?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoriesDialog = false" severity="secondary" variant="text" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedCategories" severity="danger" />
            </template>
        </Dialog>
	</div>
</template>

<script setup lang="ts">
import '@/assets/tailwind.css'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'

// get with axios => localhost:3000/categories
interface Category {
  id: number;
  name: string;
  description: string;
}

const env = import.meta.env
const categories = ref<Category[]>([])

const getCategories = async () => {
  try {
    const response = await axios.get(`${env.VITE_API_URL}/categories`)
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}


onMounted(() => {
  getCategories()
})

const toast = useToast();
const dt = ref();
const categoryDialog = ref(false);
const deleteCategoryDialog = ref(false);
const deleteCategoriesDialog = ref(false);
const category = ref<Category | any>({})
const selectedCategories = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);
const openNew = () => {
    category.value = {};
    submitted.value = false;
    categoryDialog.value = true;
};
const hideDialog = () => {
    categoryDialog.value = false;
    submitted.value = false;
};
const saveCategory = async () => {
    submitted.value = true;

    if (category.value?.name?.trim()) {
        try {
            if (category.value.id) {
                // Update existing category
                await axios.put(`${env.VITE_API_URL}/categories/${category.value.id}`, category.value);
                toast.add({severity:'success', summary: 'Successful', detail: 'Category Updated', life: 3000});
            } else {
                // Create new category
                const response = await axios.post(`${env.VITE_API_URL}/categories`, category.value);
                toast.add({severity:'success', summary: 'Successful', detail: 'Category Created', life: 3000});
            }
            categoryDialog.value = false;
            category.value = {};
            getCategories();
        } catch (error) {
            toast.add({severity:'error', summary: 'Error', detail: 'Failed to save category', life: 3000});
        }
    }
};

const editCategory = (cat: any) => {
    category.value = { ...cat };
    categoryDialog.value = true;
};

const confirmDeleteCategory = (cat: any) => {
    category.value = cat;
    deleteCategoryDialog.value = true;
};

const deleteCategory = async () => {
    try {
        await axios.delete(`${env.VITE_API_URL}/categories/${category.value.id}`);
        toast.add({severity:'success', summary: 'Successful', detail: 'Category Deleted', life: 3000});
        getCategories();
    } catch (error) {
        toast.add({severity:'error', summary: 'Error', detail: 'Failed to delete category', life: 3000});
    }
    deleteCategoryDialog.value = false;
    category.value = {};
};

const confirmDeleteSelected = () => {
    deleteCategoriesDialog.value = true;
};

const deleteSelectedCategories = async () => {
    try {
        await Promise.all(selectedCategories.value.map((cat: any) =>
            axios.delete(`${env.VITE_API_URL}/categories/${cat.id}`)
        ));
        toast.add({severity:'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000});
        getCategories();
    } catch (error) {
        toast.add({severity:'error', summary: 'Error', detail: 'Failed to delete categories', life: 3000});
    }
    deleteCategoriesDialog.value = false;
    selectedCategories.value = null;
};

</script>

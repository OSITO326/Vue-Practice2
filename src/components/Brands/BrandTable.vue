<template>
    <div class="container">
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedBrands || !selectedBrands.length" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedBrands"
                :value="brands"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} brands"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Brands</h4>
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
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editBrand(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteBrand(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialog: Form -->
        <Dialog v-model:visible="brandDialog" :style="{ width: '450px' }" header="Brand Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="brand.name" required="true" autofocus :invalid="submitted && !brand.name" fluid />
                    <small v-if="submitted && !brand.name" class="text-red-500">Name is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveBrand" />
            </template>
        </Dialog>

        <!-- Dialog: Delete single -->
        <Dialog v-model:visible="deleteBrandDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="brand">Are you sure you want to delete <b>{{ brand.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBrandDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteBrand" severity="danger" />
            </template>
        </Dialog>

        <!-- Dialog: Delete multiple -->
        <Dialog v-model:visible="deleteBrandsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span>Are you sure you want to delete the selected brands?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBrandsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedBrands" severity="danger" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import '@/assets/tailwind.css'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'

// Interfaces
interface Brand {
    id: number
    name: string
}

const env = import.meta.env
const brands = ref<Brand[]>([])
const brand = ref<Brand | any>({})
const selectedBrands = ref()
const brandDialog = ref(false)
const deleteBrandDialog = ref(false)
const deleteBrandsDialog = ref(false)
const dt = ref()
const submitted = ref(false)

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const toast = useToast()

const getBrands = async () => {
    try {
        const response = await axios.get(`${env.VITE_API_URL}/brands`)
        brands.value = response.data
    } catch (error) {
        console.error('Error fetching brands:', error)
    }
}

onMounted(() => {
    getBrands()
})

const openNew = () => {
    brand.value = {}
    submitted.value = false
    brandDialog.value = true
}

const hideDialog = () => {
    brandDialog.value = false
    submitted.value = false
}

const saveBrand = async () => {
    submitted.value = true

    if (brand.value?.name?.trim()) {
        try {
            if (brand.value.id) {
                await axios.put(`${env.VITE_API_URL}/brands/${brand.value.id}`, brand.value)
                toast.add({ severity: 'success', summary: 'Updated', detail: 'Brand updated successfully', life: 3000 })
            } else {
                await axios.post(`${env.VITE_API_URL}/brands`, brand.value)
                toast.add({ severity: 'success', summary: 'Created', detail: 'Brand created successfully', life: 3000 })
            }
            brandDialog.value = false
            brand.value = {}
            getBrands()
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save brand', life: 3000 })
        }
    }
}

const editBrand = (b: Brand) => {
    brand.value = { ...b }
    brandDialog.value = true
}

const confirmDeleteBrand = (b: Brand) => {
    brand.value = b
    deleteBrandDialog.value = true
}

const deleteBrand = async () => {
    try {
        await axios.delete(`${env.VITE_API_URL}/brands/${brand.value.id}`)
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Brand deleted successfully', life: 3000 })
        getBrands()
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete brand', life: 3000 })
    }
    deleteBrandDialog.value = false
    brand.value = {}
}

const confirmDeleteSelected = () => {
    deleteBrandsDialog.value = true
}

const deleteSelectedBrands = async () => {
    try {
        await Promise.all(selectedBrands.value.map((b: Brand) =>
            axios.delete(`${env.VITE_API_URL}/brands/${b.id}`)
        ))
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Selected brands deleted', life: 3000 })
        getBrands()
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete brands', life: 3000 })
    }
    deleteBrandsDialog.value = false
    selectedBrands.value = null
}
</script>

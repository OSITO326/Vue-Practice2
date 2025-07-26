<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="products"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Products</h4>
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
                <Column header="Image">
                    <template #body="slot">
                        <img :src="slot.data.image" :alt="slot.data.image" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                <Column field="price" header="Price" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
                    </template>
                </Column>
                <Column field="available" header="Available" sortable style="min-width: 12rem">
                    <template #body="slot">
                        <!-- <Tag :value="slot.data.available" :severity="getStatusLabel(slot.data.available)" /> -->
                         <Tag :value="slot.data.available ? 'Available' : 'Unavailable'" :severity="getStatusLabel(slot.data.available)" />
                    </template>
                </Column>
                <Column field="categoryName" header="Category" sortable style="min-width: 10rem"></Column>
                <Column field="brandName" header="Brand" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="image" class="block font-bold mb-3">Image URL</label>
                    <InputText id="image" v-model.trim="product.image" required="true" />
                </div>
                <div>
                    <label for="available" class="block font-bold mb-3">Available</label>
                    <Checkbox v-model="product.available" :binary="true" inputId="available" />
                </div>

                <div>
                    <span class="block font-bold mb-4">Category</span>
                    <Dropdown v-model="product.categoryId" :options="categories" optionLabel="name" optionValue="id" placeholder="Select a Category" fluid />
                </div>

                <div>
                    <span class="block font-bold mb-4">Brand</span>
                    <Dropdown v-model="product.brandId" :options="brands" optionLabel="name" optionValue="id" placeholder="Select a Brand" fluid />
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Price</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="stock" class="block font-bold mb-3">Stock</label>
                        <InputNumber id="stock" v-model="product.stock" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"
                    >Are you sure you want to delete <b>{{ product.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" severity="secondary" variant="text" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" severity="danger" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" severity="secondary" variant="text" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" severity="danger" />
            </template>
        </Dialog>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const env = import.meta.env;
const products = ref([]);
const categories = ref([]);
const brands = ref([]);


const getCategories = async () => {
    try {
        const res = await axios.get(`${env.VITE_API_URL}/categories`);
        categories.value = res.data;
    } catch (error) {
        console.error("Error loading categories:", error);
    }
};

const getProduct = async () => {
    try {
        const [productRes, categoryRes] = await Promise.all([
            axios.get(`${env.VITE_API_URL}/products`),
            axios.get(`${env.VITE_API_URL}/categories`)
        ]);

        categories.value = categoryRes.data;

        products.value = productRes.data.map(p => {
            const category = categoryRes.data.find(c => String(c.id) === String(p.categoryId));
            const brand = brandRes.data.find(b => String(b.id) === String(p.brandId));
            return {
                ...p,
                categoryName: category?.name || 'Unknown',
                brandName: brand?.name || 'Unknown',
            };
        });
    } catch (error) {
        console.error('Error fetching products or categories:', error);
    }
}

onMounted(async () => {
    await getProduct();
    await getCategories();
    const [productsData, categoriesData, brandsData] = await Promise.all([
        axios.get(`${env.VITE_API_URL}/products`),
        axios.get(`${env.VITE_API_URL}/categories`),
        axios.get(`${env.VITE_API_URL}/brands`),
    ]);

    products.value = productsData.data;
    categories.value = categoriesData.data;
    brands.value = brandsData.data;

    // Agrega los nombres relacionados al producto
    products.value = products.value.map((p) => {
        const category = categories.value.find(c => String(c.id) === String(p.categoryId));
        const brand = brands.value.find(b => String(b.id) === String(p.brandId));

        return {
        ...p,
        categoryName: category?.name || 'Unknown',
        brandName: brand?.name || 'Unknown',
        };
    });
});

const toast = useToast();
const dt = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);

const formatCurrency = (value) => {
    if(value)
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    return;
};
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};
const saveProduct = () => {
    submitted.value = true;

    if (product?.value.name?.trim()) {
        // Obtener los nombres por ID
        const category = categories.value.find(c => String(c.id) === String(product.value.categoryId));
        const brand = brands.value.find(b => String(b.id) === String(product.value.brandId));

        product.value.categoryName = category?.name || 'Unknown';
        product.value.brandName = brand?.name || 'Unknown';

        if (product.value.id) {
            // Editar
            const index = findIndexById(product.value.id);
            products.value[index] = { ...product.value };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            // Crear
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = product.value.image || 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus || 'INSTOCK';

            products.value.push({ ...product.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

        productDialog.value = false;
        product.value = {};
    }
};
const editProduct = (prod) => {
    product.value = {
        ...prod,
        categoryId: String(prod.categoryId),
        brandId: String(prod.brandId),
    };
    productDialog.value = true;
};
const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};
const deleteProduct = () => {
    products.value = products.value.filter(val => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter(val => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
};

const getStatusLabel = (status) => {
    return status === true ? 'success' : 'danger';
};

</script>

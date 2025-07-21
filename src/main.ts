import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import { router } from './router';
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tag from 'primevue/tag';
import Select from 'primevue/select';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
    }
  }
})
app.use(ToastService)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('Toolbar', Toolbar)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('Toast', Toast)
app.component('Tag', Tag)
app.component('Select', Select)
app.component('Dropdown', Dropdown)
app.component('InputNumber', InputNumber)
app.component('Checkbox', Checkbox)
app.component('Card', Card)
app.use(router)
app.mount('#app')
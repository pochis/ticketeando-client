<template>
 <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-flex xs3>
        <v-text-field
          append-icon="search"
          label="Buscar en la lista"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-flex>
    </v-card-title>
      <v-data-table
        :headers="titles"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :rows-per-page-items="[5,10,25,100]"
        :search="search"
        no-data-text="No hay datos disponibles"
        no-results-text="No se encontraron registros"
        rows-per-page-text="Mostrando por pagina"
        class="elevation-1">
           
        <template slot="items" slot-scope="props">
          <td><nuxt-link :to="{name: 'projects-show-id', params: { id: props.item.id }}">{{ props.item.id }}</nuxt-link></td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">
            <a v-if="!!props.item.website" :href="props.item.website" :title=" props.item.name" target="_blank">{{ props.item.website }}</a>
          </td>
          <td class="text-xs-left">{{ props.item.address }}</td>
          <td class="text-xs-left">{{ props.item.contact_phone }}</td>
          <td class="text-xs-left">{{ props.item.contact_cellphone }}</td>
          <td class="text-xs-left">{{ (props.item.status==1) ?"Activo":"Inactivo" }}</td>
          <td class="text-xs-left">{{ props.item.created_at | date}}</td>
          <td class="text-xs-left">{{ props.item.updated_at | date}}</td>
          <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" :to="{name: 'projects-show-id', params: { id: props.item.id }}">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
        </template>
        <template slot="pageText" slot-scope="props">
          {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
      <v-snackbar
          bottom
          left
          v-model="snackbar">
          {{ message }}
      </v-snackbar>
  </v-card>
</template>
<script>
    export default {
        data:()=>({
          search: '',
          message:'',
          totalItems: 0,
          offset: 0,
          limit: 5,
          items: [],
          snackbar: false,
          loading: true,
          pagination: {},
          titles: [
                { text: 'ID', value: 'id' },
                { text: 'Nombre',align: 'left',value: 'name'},
                { text: 'Correo', value: 'email' },
                { text: 'Sitio web', value: 'website' },
                { text: 'Dirección', value: 'address' },
                { text: 'Telefono contacto', value: 'contact_phone' },
                { text: 'Celular contacto', value: 'contact_cellphone' },
                { text: 'Estado', value: 'status' },
                { text: 'Creado', value: 'created_at' },
                { text: 'Actualizado', value: 'updated_at' },
                { text: 'Acciones', value: 'action', sortable: false }
          ],
        }),
        computed:{
          user() {
            return this.$store.getters.loggedUser;  
          },
           headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
          }
        },
        watch: {
          pagination: {
            handler () {
              this.getData()
                .then(data => {
                  this.items = data.items
                  this.totalItems = data.total
                })
            },
            deep: true
          }
        },
        mounted(){
            this.getData()
            .then(data => {
              this.items = data.items
              this.totalItems = data.total
            })
        },
        methods: {
          getData () {
            const { sortBy, descending, page, rowsPerPage } = this.pagination
            this.loading = true;
            this.offset=(page - 1) * rowsPerPage;
            this.limit = rowsPerPage;
            let endpoint='projects/'+this.offset+"/"+this.limit;
            
            /*sorting*/
            if (descending) {
                if(sortBy){
                  this.headers.params={sortBy:sortBy,sortType:'asc'}
                }
             } else {
               if(sortBy){
                 this.headers.params={sortBy:sortBy,sortType:'desc'}
                }
             }
             
            /*add search as parameter*/
            if(!!this.search){
              this.headers.params.search=this.search
            }else{
              delete this.headers.params.search;
            }
            
            return this.$axios.get(endpoint,this.headers).then((res)=>{
                      
                let items = res.data.projects;
                const total = res.data.total;
                
                this.loading = false
                return {items,total}
                
                }).catch((error)=>{
                    console.log(error.response.message);
                });
          },
          deleteItem(item){
            const index = this.items.indexOf(item)
            let conf = confirm('¿Esta seguro de aplicar esta acción?');
            if(conf){
              this.loading =true;
              this.$axios.delete('project/'+item.id,this.headers).then((res)=>{
                this.message = res.data.message;
                this.snackbar=true;
                this.loading =false;
                this.items.splice(index, 1);
              }).catch((error)=>{
                this.message = error.response.data.message;
                this.snackbar=true;
                this.loading =false;
              });
            }
          }
        }
    }
</script>
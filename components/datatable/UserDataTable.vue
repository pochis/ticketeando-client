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
          <td><nuxt-link :to="{name: 'user-show-id', params: { id: props.item.id }}">{{ props.item.id }}</nuxt-link></td>
          <td class="text-xs-left">{{ props.item.name+' '+ props.item.lastname }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">{{ props.item.role.name }}</td>
          <td class="text-xs-left">{{ (props.item.status==1) ?"Activo":"Inactivo" }}</td>
          <td class="text-xs-left">{{ props.item.created_at | date}}</td>
          <td class="text-xs-left">{{ props.item.updated_at | date}}</td>
          <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" :to="{name: 'user-show-id', params: { id: props.item.id }}">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteUser(props.item.id)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
        </template>
        <template slot="pageText" slot-scope="props">
          {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
  </v-card>
</template>
<script>
    export default {
        data:()=>({
          search: '',
          totalItems: 0,
          offset: 0,
          limit: 5,
          items: [],
          loading: true,
          pagination: {},
          titles: [
                { text: 'ID', value: 'id' },
                { text: 'Nombres',align: 'left',value: 'names'},
                { text: 'Correo', value: 'email' },
                { text: 'Tipo', value: 'role' },
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
            let endpoint='users/'+this.offset+"/"+this.limit;
            
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
                      
                let items = res.data.users;
                const total = res.data.total;
                
                this.loading = false
                return {items,total}
                
                }).catch((error)=>{
                    console.log(error.response.message);
                });
          },
          deleteUser(id){
            console.log("borrando ususario")
          }
        }
    }
</script>
<template>
     <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="search"
            label="Buscar en la lista"
            single-line
            hide-details
            v-model="search"
          ></v-text-field>
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
                  <td>{{ props.item.title }}</td>
                  <td class="text-xs-left">{{ props.item.submitter.name +' '+props.item.submitter.lastname }}</td>
                  <td class="text-xs-left">{{ props.item.status.name }}</td>
                  <td class="text-xs-left">{{ (props.item.owner[0]) ? props.item.owner[0].name +' '+props.item.owner[0].lastname : 'no asignado'  }}</td>
                  <td class="text-xs-left">{{ props.item.category.name }}</td>
                  <td class="text-xs-left">{{ props.item.created_at }}</td>
                  <td class="text-xs-left">{{ props.item.priority.name }}</td>
                  <td class="text-xs-left">TICK:{{ props.item.id }}</td>
                  <td class="text-xs-left">{{ props.item.updated_at }}</td>
                </template>
              </v-data-table>
    </v-card>
    
</template>
<script>
    export default {
        
        props:['urlSource'],
        data:()=>({
            search: '',
            totalItems: 0,
            items: [],
            loading: true,
            pagination: {},
            offset:0,
            limit:5,
            titles: [
                  {
                    text: 'Titulo',
                    align: 'left',
                    sortable: false,
                    value: 'title'
                  },
                  { text: 'Solicitante', value: 'submitter' },
                  { text: 'Estado', value: 'status' },
                  { text: 'Responsable', value: 'owner' },
                  { text: 'Categoria', value: 'category' },
                  { text: 'Creado', value: 'created_at' },
                  { text: 'Prioridad', value: 'priority' },
                  { text: 'Numero', value: 'number' },
                  { text: 'Actualizado', value: 'updated_at' },
            ],
          
        }),
        computed:{
            headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        watch: {
          pagination: {
            handler () {
              this.getDataFromApi()
                .then(data => {
                  this.items = data.items
                  this.totalItems = data.total
                })
            },
            deep: true
          }
        },
        mounted(){
            this.getDataFromApi()
            .then(data => {
              this.items = data.items
              this.totalItems = data.total
            })
        },
        methods: {
          getDataFromApi () {
            this.loading = true
            const { sortBy, descending, page, rowsPerPage } = this.pagination
            this.offset=(page - 1) * rowsPerPage;
            this.limit=rowsPerPage;
            let endpoint=this.urlSource+'/'+this.offset+"/"+this.limit;
            console.log(this.search);
        
            return this.$axios.get(endpoint,this.headers).then((res)=>{
                  
                      
                let items = res.data.tickets;
                const total = res.data.total;
                
                this.loading = false
                return {items,total}
                
                }).catch((error)=>{
                    //console.log(error.response.message)
                });
          }
        }
    }
</script>
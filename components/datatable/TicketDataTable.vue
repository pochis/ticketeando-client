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
          <td><nuxt-link :to="{name: 'tickets-show-id', params: { id: props.item.id }}">TICK:{{ props.item.id }}</nuxt-link></td>
          <td class="text-xs-left">{{ props.item.title }}</td>
          <td class="text-xs-left">{{ props.item.submitter.name +' '+props.item.submitter.lastname }}</td>
          <td class="text-xs-left">{{ props.item.status.name }}</td>
          <td class="text-xs-left">{{ (props.item.owner[0]) ? props.item.owner[0].name +' '+props.item.owner[0].lastname : 'No asignado'  }}</td>
          <td class="text-xs-left">{{ props.item.category.name }}</td>
          <td class="text-xs-left">{{ props.item.created_at | date}}</td>
          <td class="text-xs-left" :class="{ 'red white--text': (props.item.priority_id==3), 'yellow': (props.item.priority_id==4) }">{{ props.item.priority.name }}</td>
          <td class="text-xs-left">{{ props.item.updated_at | date}}</td>
        </template>
        <template slot="pageText" slot-scope="props">
          {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
  </v-card>
</template>
<script>

import moment from 'moment'

    export default {
      
        props:{
          filters:{
            type:Object,
          }
        },
        
        filters:{
          date(value) {
            if (value) {
              return moment(String(value)).format('MM/DD/YYYY hh:mm')
            }
          }
        },
        data:()=>({
          search: '',
          totalItems: 0,
          offset: 0,
          limit: 5,
          items: [],
          loading: true,
          pagination: {},
          titles: [
                { text: 'Numero', value: 'id' },
                { text: 'Titulo',align: 'left',value: 'title'},
                { text: 'Solicitante', value: 'submitter' },
                { text: 'Estado', value: 'status' },
                { text: 'Responsable', value: 'owner' },
                { text: 'Categoria', value: 'category' },
                { text: 'Creado', value: 'created_at' },
                { text: 'Prioridad', value: 'priority' },
                { text: 'Actualizado', value: 'updated_at' },
          ],
        }),
        computed:{
           headers(){
                return {
                  headers:{'Authorization': 'Bearer '+this.$store.state.auth.token},
                  params:this.filters || {}
                }
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
            let endpoint='tickets/'+this.offset+"/"+this.limit;
            
            
            /*sorting*/
            if (descending) {
                if(sortBy){
                   Object.assign(this.headers.params, {sortBy:sortBy,sortType:'asc'}); 
                }
             } else {
               if(sortBy){
                   Object.assign(this.headers.params, {sortBy:sortBy,sortType:'desc'}); 
                 
                }
             }
             
            /*add search as parameter*/
            if(!!this.search){
               Object.assign(this.headers.params, {search:this.search}); 
            }else{
              delete this.headers.params.search;
            }
            
            return this.$axios.get(endpoint,this.headers).then((res)=>{
                      
                let items = res.data.tickets;
                const total = res.data.total;
                
                this.loading = false
                return {items,total}
                
                }).catch((error)=>{
                    console.log(error.response.message);
                });
          }
        }
    }
</script>
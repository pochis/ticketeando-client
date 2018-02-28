<template>
    <v-container  grid-list-md>
        <v-layout column>
            <v-toolbar color="accent" tabs height="45px">
              <v-toolbar-title class="title_toolbar">Tickets</v-toolbar-title>
              <v-tabs
                color="accent"
                slot="extension"
                v-model="tab"
                left>
                <v-tabs-slider color="red"></v-tabs-slider>
                <v-tab class="title_toolbar">Tickets</v-tab>
                <v-tab class="title_toolbar">Nuevo</v-tab>
              </v-tabs>
            </v-toolbar>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                    <v-data-table
                    :headers="titles"
                    :items="items"
                    class="elevation-1">
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.name }}</td>
                      <td class="text-xs-right">{{ props.item.calories }}</td>
                      <td class="text-xs-right">{{ props.item.fat }}</td>
                      <td class="text-xs-right">{{ props.item.carbs }}</td>
                      <td class="text-xs-right">{{ props.item.protein }}</td>
                      <td class="text-xs-right">{{ props.item.iron }}</td>
                    </template>
                  </v-data-table>
              </v-tab-item>
              <v-tab-item>
                  <v-card flat>
                      <v-card-text>
                        <v-form v-model="valid" ref="ticketForm" lazy-validation>
                          <v-text-field
                          label="Titulo"
                          v-model="ticket.title"
                          :rules="[v => !!v || 'Titulo es requerido']"
                          required
                        ></v-text-field>
                          <v-text-field
                          label="Asunto"
                          v-model="ticket.subject"
                          :rules="[v => !!v || 'Asunto es requerido']"
                          required
                        ></v-text-field>
                          <v-text-field
                          label="Descripcion"
                          v-model="ticket.description"
                          :rules="[v => !!v || 'Decsripción es requerida']"
                          required
                          multi-line
                        ></v-text-field>
                        <v-layout row wrap>
                            <v-flex xs12 md6>
                                <v-select
                                :items="categories"
                                v-model="ticket.category_id"
                                item-text="name"
                                item-value="id"
                                label="--Categorias--"
                                :rules="[v => !!v || 'Categoria es requerida']"
                                required
                                autocomplete
                              ></v-select>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-select
                                :items="projects"
                                v-model="ticket.project_id"
                                item-text="name"
                                item-value="id"
                                label="--Proyecto--"
                                :rules="[v => !!v || 'Proyecto es requerido']"
                                required
                                autocomplete
                              ></v-select>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-select
                                :items="priorities"
                                v-model="ticket.priority_id"
                                item-text="name"
                                item-value="id"
                                label="--Prioridad--"
                                :rules="[v => !!v || 'Prioridad es requerida']"
                                required
                                autocomplete
                              ></v-select>
                            </v-flex>
                        </v-layout>
                        <p v-if="filesInfo.length">
                            <v-chip v-for="att in filesInfo" :key="att.name">{{att.name}}</v-chip>
                        </p>
                        <p @click="$refs.attaching.click()" class="pointer">
                            <v-icon>attachment</v-icon> Adjuntar imagen/pdf 
                            <input type="file" ref="attaching" v-show="false" @change="attach"  multiple accept="application/pdf,image/x-png,image/gif,image/jpeg" />
                        </p>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                         color="primary"
                         @click="createTicket"
                         :disabled="!valid" >
                        Crear
                      </v-btn>
                      <v-progress-circular indeterminate color="primary" v-if="creating"></v-progress-circular>
                      </v-card-actions>
                  </v-card>
              </v-tab-item>
            </v-tabs-items>
            <v-snackbar
              bottom
              left
              v-model="snackbar">
              {{ message }}
          </v-snackbar>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
         data:()=>({
            tab: null,
            valid: true,
            creating: false,
            snackbar: false,
            message: null,
            ticket:{},
            filesInfo:[],
            titles: [
                  {
                    text: 'Dessert (100g serving)',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                  },
                  { text: 'Calories', value: 'calories' },
                  { text: 'Fat (g)', value: 'fat' },
                  { text: 'Carbs (g)', value: 'carbs' },
                  { text: 'Protein (g)', value: 'protein' },
                  { text: 'Iron (%)', value: 'iron' }
                ],
                items: [
                  {
                    value: false,
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: '1%'
                  },
                  {
                    value: false,
                    name: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: '1%'
                  }
                ]
         }),
         async asyncData ({ store,$axios }, callback) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
          
          $axios.get('type/group/2',config).then((res) => {
             $axios.get('categories',config).then((res1) => {
                $axios.get('projects',config).then((res2) => {
                   callback(null, { 
                      priorities: res.data.types,
                      categories: res1.data.categories,
                      projects: res2.data.projects,
                    });
                 })
             })
          })
        },
        computed:{
            user(){
                return this.$store.getters.loggedUser;
            },
            headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
         methods:{
             createTicket(){
                 if(this.$refs.ticketForm.validate()){
                    this.creating=true;
                    let data = this.ticket;
                    data.user_id =this.user.id;
                    const fd = new FormData();
                    if(!!this.ticket.attachment){
                        Array
                          .from(Array(this.ticket.attachment.length).keys())
                          .map(i => {
                            fd.append('attachment[]', this.ticket.attachment[i], this.ticket.attachment[i].name);
                          });
                        
                        fd.append('title',this.ticket.title);
                        fd.append('subject',this.ticket.subject);
                        fd.append('description',this.ticket.description);
                        fd.append('category_id',this.ticket.category_id);
                        fd.append('priority_id',this.ticket.priority_id);
                        fd.append('user_id',this.user.id);
                        data=fd;
                    }
                    
                    this.$axios.post('ticket',data,this.headers).then((res)=>{
                      this.creating=false;
                      this.snackbar=true;
                      this.message=res.data.message;
                      this.$refs.ticketForm.reset();
                      this.filesInfo=[];
                    }).catch((error)=>{
                      this.snackbar=true;
                      this.message=error.response.message
                    })
                 }
             },
             attach(event){
                this.ticket.attachment = event.target.files ;
                for(var i=0 ;i<event.target.files.length;i++){
                    this.filesInfo.push({name:event.target.files[i].name});
                }
             }
         },
         head () {
          return {
            title:  'Tickets',
            meta: [
              { hid: 'description', name: 'description', content: 'Lista de tockets y formulario para la creacion de tickets' }
            ]
          }
        }
    }
</script>
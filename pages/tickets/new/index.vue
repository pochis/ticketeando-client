<template>
    <v-container>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Nuevo Ticket</v-toolbar-title>
          <v-spacer></v-spacer>
          <BackButton/>
      </v-toolbar>
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
                    no-data-text="No se pudo encontrar"
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
                    no-data-text="No se pudo encontrar"
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
                    no-data-text="No se pudo encontrar"
                    :rules="[v => !!v || 'Prioridad es requerida']"
                    required
                    autocomplete
                  ></v-select>
                </v-flex>
            </v-layout>
            <p v-if="filesInfo.length">
                <v-chip v-for="att in filesInfo" :key="att.name">{{att.name}}</v-chip>
            </p>
            <span @click="$refs.attaching.click()" class="pointer">
                <v-icon>attachment</v-icon> Adjuntar imagenes
                <input type="file" ref="attaching" v-show="false" @change="attach"  multiple accept="image/x-png,image/gif,image/jpeg" />
            </span>
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
    </v-flex>
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
         }),
         async asyncData ({ store,$axios }, callback) {
         
         let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
         let user_id =store.getters.loggedUser.id;
         
         $axios.get('type/group/2',config).then((res) => {
             $axios.get('categories/0/200?sortBy=id&sortType=desc',config).then((res1) => {
                $axios.get('user/'+user_id+'/projects/0/200',config).then((res2) => {
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
                    if(!!this.ticket.attachment){
                        const fd = new FormData();
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
                        fd.append('project_id',this.ticket.project_id);
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
                      this.message=error.response.data.message
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
            title:  'Nuevo ticket',
            meta: [
              { hid: 'description', name: 'description', content: 'Nuevo ticket' }
            ]
          }
        }
    }
</script>
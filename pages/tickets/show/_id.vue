<template>
    <v-container grid-list-md>
        <v-layout column>
            <v-toolbar color="accent" tabs height="45px">
              <v-toolbar-title class="title_toolbar">Ticket {{ticket.title}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <BackButton/>
            </v-toolbar>
            <v-card>
                <v-card flat v-if="$store.getters.loggedUser.role_id==1">
                    <v-card-text>
                        <div v-if="ticket.owner[0] && ticket.owner[0].id!==$store.getters.loggedUser.id && ticket.current_status!==6 && ticket.current_status!==8">
                            <v-chip small label outline color="red">Responsable: {{ticket.owner[0].name+' '+ticket.owner[0].lastname}}</v-chip>
                        </div>
                        <div v-else>
                            <v-btn outline small color="info"  @click.stop="openTicketStatus=true">{{ticket.status.name}}</v-btn>
                        </div>
                    </v-card-text>
                    <TicketStatus
                      :title="ticket.title" 
                      :ticketID="ticket.id" 
                      :open="openTicketStatus"
                      @ticket="ticket = $event"
                      @cancelState="openTicketStatus = $event"/>
                </v-card>
                <v-card-text>
                    <h2 class="title" >Asunto:</h2>
                    <p>{{ticket.subject}}</p>
                    <h3 class="title" >Descripción:</h3>
                    <p>{{ticket.description}}</p>
                    <v-divider></v-divider>
                   <v-layout row wrap>
                    <v-flex md4>
                        <h4 class="subheading">Categoria:</h4>
                        <p>{{ticket.category.name}}</p>
                        <h4 class="subheading">Estado:</h4>
                        <p> <v-chip small color="primary" text-color="white">{{ticket.status.name}}</v-chip></p>
                        <h4 class="subheading">Responsable:</h4>
                        <p>{{(ticket.owner[0]) ? ticket.owner[0].name+' '+ticket.owner[0].lastname:'No asignado'}}</p>
                        
                    </v-flex>
                    <v-flex md4>
                        <h4 class="subheading">Proyecto:</h4>
                        <p>{{ticket.project.name}}</p>
                        <h4 class="subheading">Prioridad:</h4>
                        <v-menu offset-y v-if="$store.getters.loggedUser.role_id==1">
                          <p slot="activator">
                            {{ticket.priority.name}} 
                            <v-icon small>edit</v-icon>
                          </p>
                          <v-list>
                            <v-list-tile v-for="priorityList in priorities" :key="priorityList.id" @click="changePriority(priorityList.id,priorityList.name)">
                              <v-list-tile-title>{{ priorityList.name }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                        <p v-else>{{ ticket.priority.name }}</p>
                    </v-flex>
                    <v-flex md4>
                        <h4 class="subheading">Solicitante:</h4>
                        <p>{{ticket.submitter.name+' '+ticket.submitter.lastname}}</p>
                        <h4 class="subheading">Resolución:</h4>
                        <p>{{ticket.resolution.name}}</p>
                    </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                    <v-container grid-list-md text-xs-center v-if="ticket.files.length">
                    <h4 class="subheading">Archivos adjuntos</h4>
                       <v-layout row wrap>
                        <v-flex xs12 md2 v-for="file in ticket.files" :key="file.id">
                            <v-card>
                              <v-card-text class="px-0">
                                  <img v-img="{ group:'attachDetail',src:$store.state.assetUrl+'static/ticket/'+ticket.id+'/'+file.file }" :src="$store.state.assetUrl+'static/ticket/'+ticket.id+'/small/'+file.file"/>
                              </v-card-text>
                            </v-card>
                        </v-flex>
                       </v-layout>
                    </v-container>
                    <v-divider></v-divider>
                    <TicketComments :relatedId="ticket.id"/>
                </v-card-text>
            </v-card>
        </v-layout>
        <v-snackbar
              bottom
              left
              v-model="snackbar">
              {{ message }}
          </v-snackbar>
    </v-container>
</template>
<script>
    import TicketComments from '~/components/controls/TicketComments';
    import TicketStatus from '~/components/controls/TicketStatus';

    export default {
        
        validate ({ params }) {
          return /^\d+$/.test(params.id)
        },
        data:()=>({
            loading:false,
            snackbar:false,
            openTicketStatus:false,
            message:'',
        }), 
        async asyncData ({params,store,$axios,error }) {
         
         let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
           return $axios.get('ticket/'+params.id,config).then((res) => {
             return $axios.get('type/group/2',config).then((res1) => {
                 return {ticket: res.data.ticket,priorities: res1.data.types}
             })
           }).catch((e) => {
              error({ statusCode: 404, message: 'Ticket no encontrado' })
          })
        },
        computed:{
            headers(){
              return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        methods:{
            changePriority(priority_id,priority_name){
                this.ticket.priority_id =priority_id;
                this.ticket.priority.name = priority_name
                this.$axios.put('ticket/'+this.ticket.id,this.ticket,this.headers).then((res)=>{
                    this.message=res.data.message
                    this.snackbar=true;      
                }).catch((error)=>{
                    this.message=error.response.data.message
                    this.snackbar=true;
                })
            }
        },
        
        components:{
            TicketComments,
            TicketStatus
        },
        head () {
          return {
            title:  this.ticket.title,
            meta: [
              { hid: 'description', name: 'description', content: 'Contenido del ticket '+this.ticket.title }
            ]
          }
        }
    }
</script>

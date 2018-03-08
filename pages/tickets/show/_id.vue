<template>
    <v-container  grid-list-md>
        <v-layout column>
            <v-toolbar color="accent" tabs height="45px">
              <v-toolbar-title class="title_toolbar">Ticket {{ticket.title}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon to="/tickets/list" title="volver a tickets">
                 <v-icon>keyboard_backspace</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card>
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
                        <p>{{ticket.status.name}}</p>
                        <h4 class="subheading">Responsable:</h4>
                        <p>{{(ticket.owner[0])?ticket.owner[0].name:'No asignado'}}</p>
                        
                    </v-flex>
                    <v-flex md4>
                        <h4 class="subheading">Proyecto:</h4>
                        <p>{{ticket.project.name}}</p>
                        <h4 class="subheading">Prioridad:</h4>
                        <p>{{ticket.priority.name}}</p>
                        
                    </v-flex>
                    <v-flex md4>
                        <h4 class="subheading">Solicitante:</h4>
                        <p>{{ticket.submitter.name+' '+ticket.submitter.lastname}}</p>
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
    </v-container>
</template>
<script>
    import TicketComments from '~/components/controls/TicketComments';

    export default {
        
        validate ({ params }) {
          return /^\d+$/.test(params.id)
        },
        data:()=>({}), 
        async asyncData ({params, store,$axios,app }, callback) {
         
         let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
         
         $axios.get('ticket/'+params.id,config).then((res) => {
             callback(null, { ticket: res.data.ticket});
          })
        },
        methods:{
            group(event){
                console.log(event)
            }
        },
        components:{
            TicketComments
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

<template>
    <div>
      <v-dialog v-model="open" max-width="500px" persistent>
        <v-card>
          <v-card-title>{{title}}</v-card-title>
          <v-card-text>
           <v-form v-model="valid" ref="formTicketStatus" lazy-validation>
                <v-select
                  :items="status"
                  label="--Estado--"
                  v-model="state"
                  item-text="name"
                  item-value="id"
                  :loading="loading"
                  :rules="[v => !!v || 'El estado es requerido']"
                  required
                ></v-select>
                <v-select
                  :items="resolutions"
                  label="--Resolución--"
                  v-model="resolution"
                  item-text="name"
                  item-value="id"
                  :loading="loading"
                  :rules="[v => !!v || 'La resolución es requerida']"
                  required
                ></v-select>
                <v-btn
                 color="primary"
                 @click="changeStatus"
                 :disabled="!valid" >
                  Guardar
                </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-progress-circular indeterminate color="primary" v-if="changing"></v-progress-circular>
            <v-btn color="primary" flat @click.stop="cancel">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
     <v-snackbar
          bottom
          left
          v-model="snackbar">
          {{ message }}
     </v-snackbar>
    </div>
</template>
<script>
    export default {
        props:{
            title:{
                type:String,
                required: true
            },
            open:{
                type: Boolean,
                default: false
            },
            ticketID:{
                type:Number,
                required: true
            }
        },
        mounted(){
            this.getTicketStatus();
            this.getTicketResolution();
        },
        data:()=>({
            valid: true,
            loading: true,
            changing :false,
            snackbar:false,
            state:0,
            resolution:0,
            message:'',
            status:[],
            resolutions:[]
        }),
        computed:{
          headers(){
              return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
          }  
        },
        methods:{
          getTicketStatus(){
              this.$axios.get('type/group/3',this.headers).then((res)=>{
                  this.loading=false,
                  this.status = res.data.types;
              }).catch((e)=>{
                 this.message=e.response.message
                 this.snackbar=true;
              })
          },
          getTicketResolution(){
              this.$axios.get('type/group/4',this.headers).then((res)=>{
                  this.loading=false,
                  this.resolutions = res.data.types
              }).catch((e)=>{
                  this.message=e.response.message
                  this.snackbar=true;
              })
          },
          changeStatus(){
            if(this.$refs.formTicketStatus.validate()){
                this.changing=true
                const data={
                    ticket_id:this.ticketID,
                    status_id:this.state,
                    resolution_id:this.resolution,
                    user_id:this.$store.getters.loggedUser.id
                }
                this.$axios.post('ticket/state',data,this.headers).then((res)=>{
                    this.ticket=res.data.ticket;
                    this.changing=false;
                    this.message=res.data.message
                    this.snackbar=true;
                    this.$emit('ticket',res.data.ticket);
                    this.$emit('cancelState',false);
                }).catch((error)=>{
                    this.changing=false;
                    this.message=error.response.message
                    this.snackbar=true;
                })
            }
          },
          cancel(){
              this.$emit('cancelState',false);
          }
        }
    }
</script>
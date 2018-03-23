<template>
     <v-container>
      <v-layout row wrap justify-center align-center>
          <v-flex md12 xs12>
          <v-card>
              <v-toolbar color="accent" height="45px" flat>
                <v-toolbar-title class="title_toolbar">API {{api.secret}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <BackButton/>
              </v-toolbar>
              
              <v-card-text>
                  <v-form v-model="valid" ref="formProject" lazy-validation>
                          <v-text-field
                            label="Dominio"
                            v-model="api.domain"
                            :rules="[ v => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(v) || 'Dominio no es una url valida' ]"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Correo electronico"
                            v-model="api.email"
                            :rules="emailRules"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Clave secreta"
                            v-model="api.secret"
                            :rules="[v => !!v || 'Clave secreta es requerida']"
                            disabled
                            required
                          ></v-text-field>
                          <v-switch
                              color="error"
                              label="Activo"
                              v-model="api.status"
                              :value="1"
                              :disabled="api.id == 1"
                            ></v-switch>
                        </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                 v-if="api.id!=1"
                 color="primary"
                 @click="generateKey">
                Generar clave
                </v-btn>
                <v-btn
                 color="primary"
                 @click="update"
                 :disabled="!valid" >
                Guardar
              </v-btn>
              <v-progress-circular indeterminate color="primary" v-if="saving"></v-progress-circular>
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
        middleware: 'granted',
        data:()=>({
          valid: true,
          saving: false,
          snackbar: false,
          message: null,
          imagePreview: null,
          emailRules: [
            v => !!v || 'Correo electronico es requerido',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El correo electronico no es valido'
          ]      
        }),
        async asyncData ({params,store,$axios,error}) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
          
          return $axios.get('api/'+params.id,config)
                .then((res) => {
                  return {api: res.data.api}
                })
                .catch((e) => {
                  error({ statusCode: 404, message: 'Api no encontrado' })
                })
        },
        computed:{
            headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        methods:{
            
            update(){
                if (this.$refs.formProject.validate()) {
                    
                    this.saving=true;
                    this.$axios.put('api/'+this.api.id,this.api,this.headers).then((res)=>{
                       this.saving=false;
                       this.snackbar=true;
                       this.message=res.data.message;
                   }).catch((error)=>{
                       this.saving=false;
                       this.snackbar=true;
                       if(error.response.status==422){
                        this.message=error.response.data.email[0];
                        return;
                       }
                       this.message=error.response.data.message
                   })
                          
                }
            },
            generateKey(){
                this.saving=true;
                this.$axios.get('api/generate/key',this.headers).then((res)=>{
                    this.saving=false;
                    this.api.secret=res.data.key;
                }).catch((error)=>{
                    this.saving=false;
                    this.snackbar=true;
                    this.message=error.response.data.message
                })
            }
         },
         head(){
             return {
                title:  'Api '+this.api.secret ,
                meta: [
                  { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
                ]
             }
         }
    }
</script>
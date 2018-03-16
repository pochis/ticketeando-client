<template>
     <v-container>
      <v-layout row wrap justify-center align-center>
          <v-flex md12 xs12>
          <v-card>
              <v-toolbar color="accent" height="45px" flat>
                <v-toolbar-title class="title_toolbar">{{ project.name }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <BackButton/>
              </v-toolbar>
              <v-card-title>
                  <div @click="$refs.projectImage.click()" class="pointer">
                      <v-badge bottom overlap color="blue-grey lighten-5 " >
                        <span slot="badge"><v-icon>mode_edit</v-icon></span>
                        <v-avatar size="80px"class="grey lighten-4" >
                          <img :src="(project.image) ? $store.state.assetUrl+'static/project/'+project.id+'/medium/'+project.image: $store.state.assetUrl+'static/project/default.png'" :alt="project.name" :title="project.name">
                        </v-avatar>
                      </v-badge>
                      <input type="file"
                            ref="projectImage"
                            v-show="false"
                            @change="uploadImage"
                            accept="image/x-png,image/gif,image/jpeg" />
                      <v-progress-circular indeterminate color="primary" v-if="uploading"></v-progress-circular>
                  </div>
              </v-card-title>
              <v-card-text>
                  <v-form v-model="valid" ref="formProject" lazy-validation>
                          <v-text-field
                            label="Nombre"
                            v-model="project.name"
                            :rules="[v => !!v || 'Nombre es requerido']"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Sitio web"
                            v-model="project.website"
                            :rules="[ v => (v) ? /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(v) || 'sitio web no es una url valida' : true]"
                          ></v-text-field>
                          <v-text-field
                            label="Correo electronico"
                            v-model="project.email"
                            :rules="emailRules"
                            disabled
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Dirección"
                            v-model="project.address"
                            :rules="[v => !!v || 'Dirección es requerido']"
                            multi-line
                          ></v-text-field>
                          <v-text-field
                            label="Telefono de contacto"
                            v-model="project.contact_phone"
                            :rules="[v  =>  /^\d+$/.test(v) || 'Telefono solo permite numeros']"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Celular de contacto"
                            v-model="project.contact_cellphone"
                            :rules="[v => (v) ? /^\d+$/.test(v) || 'Celular solo permite numeros' : true]"
                          ></v-text-field>
                          <v-switch
                              color="error"
                              label="Activo"
                              v-model="project.status"
                              :value="1"
                            ></v-switch>
                        </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                 color="primary"
                 @click="save"
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
          uploading: false,
          image: null,
          snackbar: false,
          message: null,
          emailRules: [
            v => !!v || 'Correo electronico es requerido',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El correo electronico no es valido'
          ]      
        }),
        async asyncData ({params,store,$axios,error}) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
          
          return $axios.get('project/'+params.id,config)
                .then((res) => {
                  return {project: res.data.project}
                })
                .catch((e) => {
                  error({ statusCode: 404, message: 'Proyecto no encontrado' })
                })
        },
        computed:{
            headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        methods:{
            
            save(){
                if (this.$refs.formProject.validate()) {
                    this.saving=true;
                    this.$axios.put('project/'+this.project.id,this.project,this.headers).then((res)=>{
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
            uploadImage(event){
              this.image=event.target.files[0];
              const fd = new FormData();
              if(!!this.image.name){
                this.uploading=true;
                fd.append('image',this.image,this.image.name);
                fd.append('id',this.project.id);
                this.$axios.post('project/image/upload',fd,this.headers).then((res)=>{
                  this.uploading=false;
                  this.project.image = res.data.image;
                }).catch((error)=>{
                  this.message=error.response.data.message
                  this.snackbar=true;
                })
              }
            },
         },
         head(){
            return {
                title:  this.project.name,
                meta: [
                  { hid: 'description', name: 'description', content: 'Edicion de proyecto' }
                ]
            }
         }
    }
</script>
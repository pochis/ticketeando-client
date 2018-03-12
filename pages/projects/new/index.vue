<template>
     <v-container>
      <v-layout row wrap justify-center align-center>
          <v-flex md12 xs12>
          <v-card>
              <v-toolbar color="accent" height="45px" flat>
                <v-toolbar-title class="title_toolbar">Nuevo proyecto</v-toolbar-title>
                <v-spacer></v-spacer>
                <BackButton/>
              </v-toolbar>
              <v-card-title>
                  <div @click="$refs.projectImage.click()" class="pointer">
                      <v-badge bottom overlap color="blue-grey lighten-5 " >
                        <span slot="badge"><v-icon>mode_edit</v-icon></span>
                        <v-avatar size="80px"class="grey lighten-4" >
                          <img :src="(imagePreview) ? imagePreview : $store.state.assetUrl+'static/project/default.png'" alt="Imagen de proyecto" title="Imagen de proyecto">
                        </v-avatar>
                      </v-badge>
                     <input type="file"
                            ref="projectImage"
                            v-show="false"
                            @change="addProjectImage"
                            accept="image/x-png,image/gif,image/jpeg" />
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
                              value="1"
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
          snackbar: false,
          message: null,
          imagePreview: null,
          project:{status:0,address:''},
          emailRules: [
            v => !!v || 'Correo electronico es requerido',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El correo electronico no es valido'
          ]      
        }),
        
        computed:{
            headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        methods:{
            
            save(){
                if (this.$refs.formProject.validate()) {
                    let data = this.project;
                    this.saving=true;
                   if(!!this.project.image){
                        const fd = new FormData();
                        fd.append('image', this.project.image, this.project.image.name);
                        fd.append('name', this.project.name);
                        fd.append('website',  this.project.website);
                        fd.append('address',  this.project.address);
                        fd.append('email', this.project.email);
                        fd.append('contact_phone', this.project.contact_phone);
                        fd.append('status', this.project.status);
                        if(!!this.project.cellphone){
                            fd.append('contact_cellphone', this.project.contact_cellphone);
                        }
                        data = fd;
                   }
                   this.$axios.post('project',data,this.headers).then((res)=>{
                       this.saving=false;
                       this.snackbar=true;
                       this.message=res.data.message;
                       this.imagePreview=null;
                       this.$refs.formProject.reset();
                   }).catch((error)=>{
                       this.saving=false;
                       this.snackbar=true;
                       if(error.response.status==422){
                        this.message=error.response.data.email[0];
                        return;
                       }
                       this.message=error.response.message
                   })
                          
                }
            },
            addProjectImage(event){
                let input = event.target;
                
                if (input.files && input.files[0]) {
                    
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.project.image= input.files[0];
                        this.imagePreview = e.target.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
         },
         head:()=>({
            title:  'Nuevo Proyecto',
            meta: [
              { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
            ]
         })
    }
</script>
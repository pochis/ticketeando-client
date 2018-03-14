<template>
     <v-container>
      <v-layout row wrap justify-center align-center>
          <v-flex md12 xs12>
          <v-card>
              <v-toolbar color="accent" height="45px" flat>
                <v-toolbar-title class="title_toolbar">{{user.name+' '+user.lastname}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <BackButton/>
              </v-toolbar>
              <v-card-title>
                  <div @click="$refs.userImage.click()" class="pointer">
                      <v-badge bottom overlap color="blue-grey lighten-5 " >
                        <span slot="badge"><v-icon>mode_edit</v-icon></span>
                        <v-avatar size="80px"class="grey lighten-4" >
                          <img :src="(user.image) ? $store.state.assetUrl+'static/user/'+user.id+'/medium/'+user.image: $store.state.assetUrl+'static/user/default.png'" :alt="user.name" :title="user.name">
                        </v-avatar>
                      </v-badge>
                      <input type="file"
                            ref="userImage"
                            v-show="false"
                            @change="uploadImage"
                            accept="image/x-png,image/gif,image/jpeg" />
                      <v-progress-circular indeterminate color="primary" v-if="uploading"></v-progress-circular>
                  </div>
              </v-card-title>
              <v-card-text>
                  <v-form v-model="valid" ref="formUser" lazy-validation>
                          <v-text-field
                            label="Nombre"
                            v-model="user.name"
                            :rules="[v => !!v || 'Nombre es requerido']"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Apellido"
                            v-model="user.lastname"
                            :rules="[v => !!v || 'Apellido es requerido']"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Telefono"
                            v-model="user.phone"
                            :rules="[v => (v) ? /^\d+$/.test(v) || 'Telefono solo permite numeros' : true]"
                          ></v-text-field>
                          <v-text-field
                            label="Celular"
                            v-model="user.cellphone"
                            :rules="[v => (v) ? /^\d+$/.test(v) || 'Telefono solo permite numeros' : true]"
                          ></v-text-field>
                          <v-text-field
                            label="Correo electronico"
                            v-model="user.email"
                            :rules="emailRules"
                            disabled
                            required
                          ></v-text-field>
                          <v-radio-group   v-model="user.genre" column>
                            <v-radio color="error" label="Maculino" :value="1"></v-radio>
                            <v-radio color="error" label="Femenino" :value="2"></v-radio>
                          </v-radio-group>
                          <v-select
                            :items="countries"
                            v-model="user.country_id"
                            item-text="name"
                            item-value="id"
                            label="--Pais--"
                            :rules="[v => !!v || 'El pais es requerido']"
                            @change="getStates($event)"
                            autocomplete
                          ></v-select>
                          <v-select
                            :items="states"
                            v-model="user.state_id"
                            item-text="name"
                            item-value="id"
                            label="--Departamento--"
                            @change="getCities($event)"
                            autocomplete
                          ></v-select>
                          <v-select
                            :items="cities"
                            v-model="user.city_id"
                            item-text="name"
                            item-value="id"
                            label="--Ciudad--"
                            autocomplete
                          ></v-select>
                          <v-select
                            :items="roles"
                            v-model="user.role_id"
                            item-text="name"
                            item-value="id"
                            label="--Tipo de usuario--"
                            :rules="[v => !!v || 'El tipo de usuario es requerido']"
                            autocomplete
                          ></v-select>
                          <v-select
                            :items="projects"
                            v-model="user.projects"
                            item-text="name"
                            item-value="id"
                            label="--Proyectos--"
                            no-data-text="No se pudo encontrar"
                            chips
                            multiple
                            autocomplete
                          ></v-select>
                          <v-switch
                              color="error"
                              label="Activo"
                              v-model="user.status"
                              :value="1"
                            ></v-switch>
                          <v-menu
                            ref="pickermenu"
                            lazy
                            :close-on-content-click="false"
                            v-model="pickermenu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            min-width="290px"
                            :return-value.sync="user.birthday">
                            <v-text-field
                              slot="activator"
                              label="Fecha de nacimiento"
                              v-model="user.birthday"
                              append-icon="event"
                              readonly
                            ></v-text-field>
                            <v-date-picker
                                v-model="user.birthday" 
                                min="1950-01-01"
                                :max="new Date().toISOString().substr(0, 10)"
                                locale="es-Es"
                                no-title 
                                scrollable>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="pickermenu = false">cancelar</v-btn>
                              <v-btn flat color="primary" @click="$refs.pickermenu.save(user.birthday)">Listo</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                 color="primary"
                 @click="save"
                 :disabled="!valid" >
                Actualizar
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
          pickermenu: false,
          uploading: false,
          saving: false,
          image: null,
          snackbar: false,
          message: null,
          emailRules: [
            v => !!v || 'Correo electronico es requerido',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El correo electronico no es valido'
          ],
          confirm_validate:(pass)=>{
             return [v => !!v || 'Confirmación de contraseña es requerida',
              v => pass===v || 'las contraseñas no coinciden']
          }
        }),
        async asyncData ({params, store, $axios }, callback) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
             
          $axios.get('user/'+params.id,config).then((res)=>{
              $axios.get('region/countries',config).then((res1) => {
                 $axios.get('region/country/states/'+res.data.user.country_id,config).then((res2) => {
                    $axios.get('region/states/cities/'+res.data.user.state_id,config).then((res3) => {
                        $axios.get('type/group/1',config).then((res4)=>{
                          $axios.get('projects/0/200?sortBy=id&sortType=desc',config).then((res5)=>{
                            callback(null, { 
                              user: res.data.user,
                              countries: res1.data.countries,
                              states: res2.data.states,
                              cities: res3.data.cities,
                              roles: res4.data.types,
                              projects: res5.data.projects,
                            });
                          })
                        })
                     })
                 })
              })
          }).catch((e) => {
            callback({ statusCode: 404, message: 'Usuario no encontrado' })
          })
        },
        computed:{
            headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        methods:{
            getStates(countryId){
              this.$axios.get('region/country/states/'+countryId,this.headers).then((res)=>{
                  this.states = res.data.states
              });
            },
            getCities(stateId){
              this.$axios.get('region/states/cities/'+stateId,this.headers).then((res)=>{
                  this.cities = res.data.cities
              });
            },
            save(){
                if (this.$refs.formUser.validate()) {
                    this.saving=true;
                   this.$axios.put('user/'+this.user.id,this.user,this.headers).then((res)=>{
                       this.saving=false;
                       this.snackbar=true;
                       this.message=res.data.message
                   }).catch((error)=>{
                       this.saving=false;
                       this.snackbar=true;
                       this.message=error.response.message
                   })
                          
                }
            },
            uploadImage(event){
              this.image=event.target.files[0];
              const fd = new FormData();
              if(!!this.image.name){
                this.uploading=true;
                fd.append('image',this.image,this.image.name);
                fd.append('id',this.user.id);
                this.$axios.post('user/image/upload',fd,this.headers).then((res)=>{
                  this.uploading=false;
                  this.user.image = res.data.image;
                }).catch((error)=>{
                  console.log(error)
                })
              }
                
            },
        },
         head () {
          return {
            title:  this.user.name+' '+this.user.lastname,
            meta: [
              { hid: 'description', name: 'description', content: 'Edicion de usuario ticketeando' }
            ]
          }
        }
    }
</script>
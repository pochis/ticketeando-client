<template>
     <v-container>
      <v-layout row wrap justify-center align-center>
          <v-flex md12 xs12>
          <v-card>
              <v-toolbar color="accent" height="45px" flat>
                <v-toolbar-title class="title_toolbar">Nuevo usuario</v-toolbar-title>
                <v-spacer></v-spacer>
                <BackButton/>
              </v-toolbar>
              <v-card-title>
                  <div @click="$refs.userImage.click()" class="pointer">
                      <v-badge bottom overlap color="blue-grey lighten-5 " >
                        <span slot="badge"><v-icon>mode_edit</v-icon></span>
                        <v-avatar size="80px"class="grey lighten-4" >
                          <img :src="(imagePreview) ? imagePreview : $store.state.assetUrl+'static/user/default.png'" alt="Imagen de usuario" title="Imagen de usuario">
                        </v-avatar>
                      </v-badge>
                     <input type="file"
                            ref="userImage"
                            v-show="false"
                            @change="addUserImage"
                            accept="image/x-png,image/gif,image/jpeg" />
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
                            label="Contraseña"
                            v-model="user.password"
                            type="password"
                            :rules="[v => !!v || 'Contraseña es requerida']"
                            required
                          ></v-text-field>
                          <v-text-field
                            label="Confirmar contraseña"
                            v-model="user.password_confirmation"
                            type="password"
                            :rules="confirm_validate(user.password)"
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
                            no-data-text="No se pudo encontrar"
                            :rules="[v => !!v || 'El pais es requerido']"
                            @change="getStates"
                            autocomplete
                          ></v-select>
                          <v-select
                            :items="states"
                            v-model="user.state_id"
                            item-text="name"
                            item-value="id"
                            label="--Departamento--"
                            no-data-text="No se pudo encontrar"
                            @change="getCities"
                            autocomplete
                          ></v-select>
                          <v-select
                            :items="cities"
                            v-model="user.city_id"
                            item-text="name"
                            item-value="id"
                            label="--Ciudad--"
                            no-data-text="No se pudo encontrar"
                            autocomplete
                          ></v-select>
                          <v-select
                            :items="roles"
                            v-model="user.role_id"
                            item-text="name"
                            item-value="id"
                            label="--Tipo de usuario--"
                            no-data-text="No se pudo encontrar"
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
                              value="1"
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
          pickermenu: false,
          saving: false,
          snackbar: false,
          message: null,
          imagePreview: null,
          user:{country_id:47,status:0,genre:1,project_ids:[]},
          emailRules: [
            v => !!v || 'Correo electronico es requerido',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El correo electronico no es valido'
          ],
          confirm_validate:(pass)=>{
             return [v => !!v || 'Confirmación de contraseña es requerida',
              v => pass===v || 'las contraseñas no coinciden']
          }
        }),
        async asyncData ({store, $axios }, callback) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}},
              countryId =  47,
              stateId =  776;
          
          $axios.get('region/countries',config).then((res) => {
             $axios.get('region/country/states/'+countryId,config).then((res1) => {
                $axios.get('region/states/cities/'+stateId,config).then((res2) => {
                    $axios.get('type/group/1',config).then((res3)=>{
                      $axios.get('projects/0/200?sortBy=id&sortType=desc',config).then((res4)=>{
                        callback(null, { 
                          countries: res.data.countries,
                          states: res1.data.states,
                          cities: res2.data.cities,
                          roles: res3.data.types,
                          projects: res4.data.projects,
                        });
                      })
                    })
                })
             })
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
                    let data = this.user;
                    this.saving=true;
                   if(!!this.user.image){
                        const fd = new FormData();
                        fd.append('image', this.user.image, this.user.image.name);
                        fd.append('name', this.user.name);
                        fd.append('lastname',  this.user.lastname);
                        fd.append('email', this.user.email);
                        fd.append('password',  this.user.password);
                        fd.append('password_confirmation', this.user.password_confirmation);
                        if(!!this.user.phone){
                            fd.append('phone', this.user.phone);
                        }
                        if(!!this.user.cellphone){
                            fd.append('cellphone', this.user.cellphone);
                        }
                        if(!!this.user.birthday){
                            fd.append('birthday', this.user.birthday);
                        }
                        fd.append('country_id', this.user.country_id);
                        fd.append('city_id', this.user.city_id);
                        fd.append('state_id', this.user.state_id);
                        fd.append('genre', this.user.genre);
                        fd.append('role_id', this.user.role_id);
                        fd.append('status', this.user.status);
                        data = fd;
                   }
                   this.$axios.post('user',data,this.headers).then((res)=>{
                       this.saving=false;
                       this.snackbar=true;
                       this.message=res.data.message
                       this.imagePreview=null;
                       this.$refs.formUser.reset();
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
            addUserImage(event){
                let input = event.target;
                
                if (input.files && input.files[0]) {
                    
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.user.image= input.files[0];
                        this.imagePreview = e.target.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
        },
         head () {
          return {
            title:  'Nuevo Usuario',
            meta: [
              { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
            ]
          }
        }
    }
</script>
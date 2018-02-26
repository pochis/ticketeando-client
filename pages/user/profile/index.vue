<template>
    <v-layout row wrap justify-center align-center>
        <v-flex md12 xs12>
        <v-card>
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>{{user.name+' '+user.lastname}}</v-toolbar-title>
              <v-spacer></v-spacer>
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
                 
              <div class="ml-3 hidden-sm-and-down">
                  <h3>{{user.email}}</h3>
              </div>
            </v-card-title>
            <v-card-text>
                <v-form v-model="valid" ref="form" lazy-validation>
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
                        <v-radio-group v-model="user.genre" column>
                          <v-radio label="Maculino" :value="1"></v-radio>
                          <v-radio label="Femenino" :value="2"></v-radio>
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
                              locale="es-Es"
                              no-title 
                              scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="pickermenu = false">cancelar</v-btn>
                            <v-btn flat color="primary" @click="$refs.pickermenu.save(date)">Listo</v-btn>
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
</template>
<script>

import { setSession } from '~/utils/auth';

    export default{
        middleware:'guard',
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
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
          ],
        }),
       async asyncData ({ store,$axios }, callback) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}},
              countryId = store.getters.loggedUser.country_id || 47,
              stateId = store.getters.loggedUser.state_id || 776;
          
          $axios.get('region/countries',config).then((res) => {
             $axios.get('region/country/states/'+countryId,config).then((res1) => {
                $axios.get('region/states/cities/'+stateId,config).then((res2) => {
                   callback(null, { 
                      countries: res.data.countries,
                      states: res1.data.states,
                      cities: res2.data.cities,
                    });
                 })
             })
          })
        },
        computed:{
            user(){
                return this.$store.getters.loggedUser || {};
            },
            axiosConfig(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        
        methods:{
            uploadImage(event){
              this.image=event.target.files[0];
              const fd = new FormData();
              if(!!this.image.name){
                this.uploading=true;
                fd.append('image',this.image,this.image.name);
                fd.append('id',this.user.id);
                this.$axios.post('user/image/upload',fd,this.axiosConfig).then((res)=>{
                  this.uploading=false;
                  this.user.image = res.data.image;
                  this.$store.commit('SET_USER', this.user);
                  setSession({
                    token:this.user.api_token,
                    user:btoa(JSON.stringify(this.user))
                  })
                  
                }).catch((error)=>{
                  console.log(error)
                })
              }
                
            },
            getStates(countryId){
              this.$axios.get('region/country/states/'+countryId,this.axiosConfig).then((res)=>{
                  this.states = res.data.states
              });
            },
            getCities(stateId){
              this.$axios.get('region/states/cities/'+stateId,this.axiosConfig).then((res)=>{
                  this.cities = res.data.cities
              });
            },
            save(){
                if (this.$refs.form.validate()) {
                   this.saving=true;
                   this.$axios.put('user/'+this.user.id,this.user,this.axiosConfig).then((res)=>{
                      this.saving=false;
                      this.$store.commit('SET_USER', this.user);
                      setSession({
                        token:this.user.api_token,
                        user:btoa(JSON.stringify(this.user))
                      });
                      this.snackbar=true;
                      this.message=res.data.message
                   }).catch((error)=>{
                      this.snackbar=true;
                      this.message=error
                   })
                }
            },
        },
        head () {
          return {
            title:  this.user.name,
            meta: [
              { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
            ]
          }
        }
    }
</script>
<style scoped>
    .pointer{
        cursor:pointer;
    }
</style>
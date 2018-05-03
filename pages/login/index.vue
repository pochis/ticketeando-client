<template>
    <v-layout row justify-center align-center>
      <v-flex md6 xs12>
        <v-card class="mt-5">
          <v-alert type="error" :value="showErrorAlert">
            {{errorMsg}}
          </v-alert>
          <v-alert type="success" :value="showSuccesAlert">
            {{successMsg}}
          </v-alert>
              <div class="text-xs-center pt-3">
                  <v-avatar :tile="false" size="75px" class="grey lighten-4">
                      <img src="/v.png" alt="Ticketeando" title="Ticketeando">
                  </v-avatar>
              </div>
            <v-card-text>
              <v-form v-model="valid" ref="accessAndForgotform" lazy-validation>
                 <v-text-field
                    label="Correo electronico"
                    v-model="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="loginForm"
                    label="Contraseña"
                    v-model="password"
                    :rules="[v => !!v || 'Contraseña es requerida']"
                    type="password"
                    required
                  ></v-text-field>
                <div class="text-md-right text-xs-right">
                    <v-btn
                        @click="loginForm = !loginForm"
                        flat
                        small
                        color="primary">
                        {{(loginForm) ? 'Recuperar contraseña':'Acceder'}}
                    </v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  @click="actionForm"
                  :disabled="!valid" 
                  color="primary">
                  Ingresar
              </v-btn>
              <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
            </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
</template>
<script>


    export default{
        middleware:'anonymus',
        layout: 'login',
        data:()=>({
          
            title:"Acceso a ticketeando",
            loading:false,
            loginForm:true,
            valid: true,
            showErrorAlert: false,
            showSuccesAlert: false,
            errorMsg: null,
            successMsg: null,
            email: '',
            emailRules: [
                v => !!v || 'Correo electronico  es requerido',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El correo no es valido'
            ],
            password: '',
            
        }),
        methods: {
          actionForm() {
            if (this.$refs.accessAndForgotform.validate()) {
               
                if(this.loginForm){
                  this.login();
                }else{
                  this.forgot();
                }
            }
          },
          async login(){
             try {
                this.loading=true;   
                await this.$store.dispatch('login', {
                  email: this.email,
                  password: this.password
                });
                
                this.loading=false;
                this.$router.push('/dashboard')
                
              } catch (e) {
              
                this.errorMsg = 'La dirección de correo electrónico o contraseña ingresada es incorrecta. Inténtalo nuevamente.';
                this.showErrorAlert = true;
                this.loading=false
              }
          },
          forgot() {
             if (this.$refs.accessAndForgotform.validate()) {
               this.loading= true;
                this.$axios.post('recovery', {
                    recoveryemail: this.email,
                }).then((res)=>{
                  this.successMsg = res.data.message;
                  this.loading=false
                  this.showSuccesAlert = true;
                }).catch((error)=>{
                  this.errorMsg = error.response.data.message;
                  this.loading=false
                  this.showErrorAlert = true;
                });
              }
          },
          
          async logout() {
            try {
              await this.$store.dispatch('logout')
            } catch (e) {
              this.formError = e.message
            }
          }
        },
        head () {
          return {
            title: this.title,
            meta: [
              { hid: 'description', name: 'description', content: 'Acceso a ticketeando software de mesa de ayuda' }
            ]
          }
        }
    }
</script>

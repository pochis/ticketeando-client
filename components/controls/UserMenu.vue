<template>
<div>
    <v-menu
      offset-x
      :close-on-content-click="false"
      :nudge-width="200"
      v-model="menu">
    <v-avatar :tile=false size="35px"class="grey lighten-4" slot="activator">
        <img :src="(user.image) ? $store.state.assetUrl+'static/user/'+user.id+'/medium/'+user.image: $store.state.assetUrl+'static/user/default.png'" :alt="user.name" :title="user.name">
    </v-avatar>
     <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="(user.image) ? $store.state.assetUrl+'static/user/'+user.id+'/medium/'+user.image: $store.state.assetUrl+'static/user/default.png'" :alt="user.name" :title="user.name">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{user.name +' '+user.lastname}}</v-list-tile-title>
              <v-list-tile-sub-title>{{user.role.name}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile to="/user/profile">
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Perfil</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="dialog = true" >
            <v-list-tile-action>
              <v-icon>lock</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Cambiar contraseña</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>description</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Documentación</v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile @click="logout()">
            <v-list-tile-action>
              <v-icon>power_settings_new</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Cerrar sesión</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
    <!--dialog-->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-alert type="success" :value="showSuccessAlert">
        {{successMsg}}
      </v-alert>
      <v-alert type="error" :value="showErrorAlert">
        {{errorMsg}}
      </v-alert>
    <v-card>
      <v-card-title>
        <span class="headline">Cambiar contraseña</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
           <v-form v-model="valid" ref="formChangePassword" lazy-validation>
            <v-flex md12>
              <v-text-field label="Contraseña actual" type="password" v-model="passwordData.current_password" :rules="[v => !!v || 'Contraseña actual es requerida']" required></v-text-field>
            </v-flex>
            <v-flex md12>
              <v-text-field label="Nueva contraseña" type="password" v-model="passwordData.password"  :rules="[v => !!v || 'Contraseña nueva es requerida']" required></v-text-field>
            </v-flex>
            <v-flex md12>
              <v-text-field label="Confirmar contraseña" type="password" v-model="passwordData.password_confirmation" :rules="confirm_validate(passwordData.password)" required></v-text-field>
            </v-flex>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-progress-circular indeterminate color="primary" v-if="changing"></v-progress-circular>
        <v-btn color="primary" flat @click.native="dialog = false">Cerrar</v-btn>
        <v-btn color="primary" flat @click.native="changePassword" :disabled="!valid">Cambiar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--end dialog-->
</div>
</template>
<script>
    export default {
      data: () => ({
        valid: true,
        menu: false,
        dialog: false,
        changing: false,
        showSuccessAlert: false,
        showErrorAlert: false,
        successMsg: null,
        errorMsg: null,
        passwordData:{},
        confirm_validate:(pass)=>{
           return [v => !!v || 'Confirmación de contraseña es requerida',
            v => pass===v || 'las contraseñas no coinciden']
        }
      }),
      computed:{
        user(){
          return this.$store.getters.loggedUser;
        },
        headers(){
          return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
        }
      },
      methods:{
        changePassword(){
          if (this.$refs.formChangePassword.validate()) {
            this.changing=true;
            this.$axios.put('user/password/update/'+this.user.id,this.passwordData,this.headers).then((res)=>{
              this.changing=false;
              this.showSuccessAlert=true;
              this.successMsg=res.data.message;
              this.$refs.formChangePassword.reset();
              this.clearAlerts();
            }).catch((error)=>{
              this.changing=false;
              this.showErrorAlert=true;
              this.errorMsg=error.response.data.message;
            })
          }
        },
        clearAlerts(){
          setTimeout(()=>{
            this.showErrorAlert=false;
            this.showSuccessAlert=false;
          },3000)
        },
        async logout(){
          try{
            await  this.$store.dispatch('logout',this.user.id);
            this.$router.push('/login')
          }catch(e){
            console.log(e);
          }
        }
      }
    }
</script>
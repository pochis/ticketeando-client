<template>
     <v-container>
      <v-layout row wrap justify-center align-center>
          <v-flex md12 xs12>
          <v-card>
              <v-toolbar color="accent" height="45px" flat>
                <v-toolbar-title class="title_toolbar">{{category.name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <BackButton/>
              </v-toolbar>
              <v-card-text>
                  <v-form v-model="valid" ref="formCategory" lazy-validation>
                          <v-text-field
                            label="Nombre"
                            v-model="category.name"
                            :rules="[v => !!v || 'Nombre es requerido']"
                            required
                          ></v-text-field>
                         <v-select
                            :items="categories"
                            v-model="category.parent"
                            item-text="name"
                            item-value="id"
                            label="--Categoria padre--"
                            no-data-text="No se pudo encontrar"
                            autocomplete
                          ></v-select>
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
        }),
        async asyncData ({params, store, $axios }, callback) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
             
          $axios.get('category/'+params.id,config).then((res)=>{
              $axios.get('categories/0/200?sortBy=id&sortType=desc',config).then((res1)=>{
                    callback(null, {category:res.data.category,categories: res1.data.categories});
              })
          }).catch((e) => {
             callback({ statusCode: 404, message: 'Categoria no encontrada' })
          })
          
        },
        computed:{
            headers(){
                return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
            }
        },
        methods:{
            
            save(){
                if (this.$refs.formCategory.validate()) {
                    this.saving=true;
                    this.$axios.put('category/'+this.category.id,this.category,this.headers).then((res)=>{
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
                       this.message=error.response.message
                   })
                }
            },
         },
         head(){
            return{
                title:  this.category.name,
                meta: [
                  { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
                ]
            }
         }
    }
</script>
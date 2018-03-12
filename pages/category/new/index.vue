<template>
     <v-container>
      <v-layout row wrap justify-center align-center>
          <v-flex md12 xs12>
          <v-card>
              <v-toolbar color="accent" height="45px" flat>
                <v-toolbar-title class="title_toolbar">Nueva categoria</v-toolbar-title>
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
          category:{parent:0},
        }),
        async asyncData ({store, $axios }, callback) {
          let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}};
             
          $axios.get('categories/0/200?sortBy=id&sortType=desc',config).then((res)=>{
                callback(null, {categories: res.data.categories});
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
                    this.$axios.post('category',this.category,this.headers).then((res)=>{
                       this.saving=false;
                       this.snackbar=true;
                       this.message=res.data.message;
                       this.$refs.formCategory.reset();
                       this.category.parent=0
                       this.categories.unshift(res.data.category);
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
         head:()=>({
            title:  'Nueva categoria',
            meta: [
              { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
            ]
         })
    }
</script>
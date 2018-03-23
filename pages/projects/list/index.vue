<template>
    <v-container grid-list-md>
         <v-toolbar color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Proyectos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-flex xs3>
            <v-text-field label="Buscar" v-model="search"></v-text-field>
          </v-flex>
        </v-toolbar>
        <v-card v-if="!!search">
          <v-card-text>
            {{searchIndicator}}
          </v-card-text>
        </v-card>
    <v-layout row wrap>
      <v-flex md3 xs12 v-for="project in projects" :key="project.id">
        <v-card>
            <v-card-media :src="(project.image) ? $store.state.assetUrl+'static/project/'+project.id+'/medium/'+project.image : $store.state.assetUrl+'static/project/default.png'" :alt="project.name" :title="project.name" height="200px">
            </v-card-media>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{project.name}}</h3>
                <div>
                  <span class="grey--text">Teléfono: {{project.contact_phone}}</span><br>
                  <span v-if="!!project.website">Sitio web : <a :href="project.website" :title="project.name" target="_blank">{{ project.website | truncate(20, '...')}}</a></span><br>
                  <span>{{project.address | truncate(37, '...')}}</span>
                </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat color="orange" :to="{name: 'projects-detail-id', params: { id: project.id}}">Ver proyecto</v-btn>
            </v-card-actions>
          </v-card>
      </v-flex>
      <v-flex xs3 md12 text-md-center>
        <v-btn 
          color="primary" 
          v-if="projects.length < totalProjects" 
          @click="getMoreProjects">
          Cargar mas
        </v-btn>
        <v-progress-circular indeterminate color="primary" v-if="loadMore"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-snackbar
        bottom
        left
        v-model="snackbar">
        {{ message }}
    </v-snackbar>
  </v-container>
</template>
<script>

    export default {
      
        data:()=>({
          loadMore:true,
          snackbar: false,
          perPage:20,
          page:1,
          totalProjects:0,
          search:'',
          searching: false,
          isSearching: false,
          message: '',
          projects:[]
        }),
        computed:{
            user(){
                return this.$store.getters.loggedUser;
            },
            projectPaths(){
              return (this.user.role_id==1) ? 'projects':'user/'+this.user.id+'/projects'
            },
            headers(){
              return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token},params:{status:1}}
            },
            searchIndicator() {
              if (this.isSearching) {
                return '⟳  Buscando....'
              } else if (this.searching) {
                return '...Escribiendo'
              }else{
                if(!!this.search){
                  return "Resultados para '"+this.search+"'"
                }
              }
            }
        },
        watch: {
          search() {
            this.searching = true;
            this.searched();
          }
        },
        mounted(){
          if(this.projects.length==0){
             this.getProjects();
          }
        },
        methods:{
            getProjects(){
              this.loadMore=true
              this.$axios.get(this.projectPaths+'/0/'+this.perPage,this.headers).then((res)=>{
                this.projects = res.data.projects;
                this.totalProjects =res.data.total;
                this.loadMore=false;
                this.isSearching = false;
                this.searching =false;
              }).catch((error)=>{
                this.loadMore=false;
                this.message=error.response.message
              })
            },
            getMoreProjects(){
              let offset = (this.page * this.perPage);
              this.loadMore=true
              this.$axios.get(this.projectPaths+'/'+offset+'/'+this.perPage,this.headers).then((res)=>{
                this.projects = this.projects.concat(res.data.projects);
                this.totalProjects =res.data.total;
                this.loadMore=false;
                this.page++;
              }).catch((error)=>{
                this.loadMore=false;
                this.message=error.response.message
              })
          },
          searched: _.debounce(function () {
            this.isSearching = true
            this.loadMore = true;
            if(!!this.search){
              this.headers.params={search:this.search}
            }else{
              delete this.headers.params.search;
            }
            this.getProjects();
          }, 500)
        }
    }
    
</script>

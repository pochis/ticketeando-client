<template>
    <v-container grid-list-md>
       <v-layout row wrap>
           <v-toolbar color="accent" height="45px" flat>
                  <v-toolbar-title class="title_toolbar">{{ project.name }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                 <BackButton/>
            </v-toolbar>
           <v-flex xs12 md4>
            <v-card>
                <v-card-media
                  :src="(project.image) ? $store.state.assetUrl+'static/project/'+project.id+'/'+project.image : $store.state.assetUrl+'static/project/default.png'"
                  :alt="project.name"
                  :title="project.name" height="350px">
                  <v-container fill-height fluid>
                    <v-layout fill-height>
                      <v-flex xs12 align-end flexbox>
                        <span class="headline white--text" v-text="project.title"/>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
                <v-card-actions>
                      <v-btn outline small color="primary">
                          <v-icon>phone</v-icon>
                          {{project.contact_phone}}
                      </v-btn>
                      <v-btn outline small color="primary" v-if="!!project.contact_cellphone">
                          <v-icon>smartphone</v-icon>
                          {{project.contact_phone}}
                      </v-btn>
                </v-card-actions>
              </v-card>
          </v-flex>
           <v-flex xs12 md8>
            <v-card>
              <v-card-text>
                  <h1 class="headline">{{project.name}}</h1>
                  <h2 class="title" v-if="!!project.website">Sitio web: <a :href="project.website" :title="project.name" target="_blank">{{project.website}}</a></h2>
                  <h3 class="title">Dirección:</h3>
                  <p>{{project.address}}</p>
              </v-card-text>
            </v-card>
          </v-flex>
      </v-layout>
  </v-container>
</template>
<script>
    export default {
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
    }
</script>
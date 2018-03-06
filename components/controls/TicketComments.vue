<template>
    <v-container grid-list-md>
      <v-layout column>
        <v-form v-model="valid" ref="formComment" lazy-validation>
          <v-text-field
            label="Agregar comentario"
            multi-line
            v-model="comment"
            :rules="[v => !!v || 'El comentario es equerido']"
          ></v-text-field>
          <v-progress-circular indeterminate color="primary" v-if="saving"></v-progress-circular>
          <v-btn
             color="primary"
             @click="addComment"
             :disabled="!valid">
            Agregar comentario
          </v-btn>
          <span @click="$refs.attaching.click()" class="pointer">
              <v-icon>attachment</v-icon> Adjuntar imagenes
              <input type="file" ref="attaching" v-show="false" @change="attach"  multiple accept="image/x-png,image/gif,image/jpeg" />
          </span>
          <p v-if="filesInfo.length">
              <v-chip v-for="att in filesInfo" :key="att.name">{{att.name}}</v-chip>
          </p>
        </v-form>
        <h3 class="titlefont mt-5">Comentarios</h3>
        <v-divider></v-divider>
        <ul class="list">
          <li v-for="(comment, index) in commentList" :key="comment.id">
            <p>
              <v-avatar>
                <img :src="(comment.user.image) ? $store.state.assetUrl+'static/user/'+comment.user.id+'/medium/'+comment.user.image: $store.state.assetUrl+'static/user/default.png'" :alt="comment.user.namer" :title="comment.user.name">
              </v-avatar>
              <v-chip small label outline color="red">{{comment.user.name+' '+comment.user.lastname}} {{comment.created_at | date}}</v-chip>
            </p>
             <p>{{comment.comment}}</p>
            <p>
               <v-avatar
                  v-for="file in comment.files" :key="file.id"
                  :tile="true"
                  size="50px"
                  class="grey lighten-4 ml-3">
                   <img v-img="{ group:'commet_'+index,src:$store.state.assetUrl+'static/comment/'+comment.id+'/'+file.file }" :src="$store.state.assetUrl+'static/comment/'+comment.id+'/small/'+file.file"/>
                </v-avatar>
            </p>
            <v-divider></v-divider>
          </li>
        </ul>
        <v-flex xs3 md12 text-md-center>
          <v-btn 
            color="primary" 
            v-if="commentList.length < totalComments" 
            @click="getMoreComments">
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
import moment from 'moment'
    export default {
        props:['relatedId'],
        filters:{
          date(value) {
            if (value) {
              return moment(String(value)).format('MM/DD/YYYY hh:mm')
            }
          }
        },
        data:()=>({
            valid: true,
            snackbar: false,
            saving: false,
            loadMore: true,
            message: '',
            comment:'',
            perPage:10,
            page:1,
            commentList:[],
            filesInfo:[],
            attachment:[],
            totalComments:0
        }),
        computed:{
          user(){
            return this.$store.getters.loggedUser;
          },
          headers(){
            return {headers:{'Authorization': 'Bearer '+this.$store.state.auth.token}}
          }
        },
        mounted(){
          if(this.commentList.length==0){
            this.getComments();
          }
        },
        methods:{
          getComments(){
            this.loadMore=true;
            this.$axios.get('comments/'+this.relatedId+'/0'+'/'+this.perPage,this.headers).then((res)=>{
              
              this.commentList=res.data.comments;
              this.totalComments =res.data.total;
              this.loadMore=false;
              
            }).catch((error)=>{
              this.loadMore=false;
              this.message=error.response.message
            })
          },
          getMoreComments(){
            let offset = (this.page * this.perPage);
            this.loadMore=true;
            this.$axios.get('comments/'+this.relatedId+'/'+offset+'/'+this.perPage,this.headers).then((res)=>{
              
              this.commentList = this.commentList.concat(res.data.comments);
              this.totalComments =res.data.total;
              this.loadMore=false;
              this.page++;
            }).catch((error)=>{
              this.loadMore=false;
              this.message=error.response.message
            })
          },
          addComment(){
            if (this.$refs.formComment.validate()) {
                this.saving=true;
                let data ={comment:this.comment,ticket_id:this.relatedId,user_id:this.user.id}
                
                if(!!this.attachment){
                  const fd = new FormData();
                  Array
                    .from(Array(this.attachment.length).keys())
                    .map(i => fd.append('attachment[]', this.attachment[i], this.attachment[i].name));
                    fd.append('comment',this.comment);
                    fd.append('ticket_id',this.relatedId);
                    fd.append('user_id',this.user.id);
                    data=fd
                }
                
                this.$axios.post('comment',data,this.headers).then((res)=>{
                  this.saving=false;
                  this.snackbar=true;
                  this.message=res.data.message
                  this.commentList.unshift(res.data.comment);
                  this.$refs.formComment.reset();
                  this.filesInfo=[];
                }).catch((error)=>{
                  this.saving=false;
                  this.snackbar=true;
                  this.message=error.response.message
                })
            }
          },
          attach(event){
            this.attachment = event.target.files ;
            for(var i=0 ;i<event.target.files.length;i++){
                this.filesInfo.push({name:event.target.files[i].name});
            }
          }
        }
    }
</script>
<style scoped>
  .list{
    list-style: none;
  }
  
</style>
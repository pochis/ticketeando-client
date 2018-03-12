<template>
    <v-btn icon @click="back" title="Volver">
       <v-icon>keyboard_backspace</v-icon>
    </v-btn>
</template>
<script>
    export default {
        methods:{
            back(){
                this.$router.go(-1);
            }
        }
    }
</script>
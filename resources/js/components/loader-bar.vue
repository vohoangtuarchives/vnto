<template>
    <div v-if="isLoading" class="loading-overlay">
        Loading...asasasas
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
       
        computed: {
            ...mapGetters('layout', ['isLoading'])
        },
        mounted() {}
    };
</script>

<style scoped="scoped">
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
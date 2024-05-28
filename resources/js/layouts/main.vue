<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./vertical";

export default {
    components: {
        Vertical
    },
    data() {
        return {};
    },
    computed: {
        ...layoutComputed,
    },
    mounted(){
        
    }
};

</script>

<template>
    <div>
        <Vertical v-if="layoutType === 'vertical' || layoutType === 'semibox'" :layout="layoutType">
            
                <slot />
           
        </Vertical>
    </div>
</template>
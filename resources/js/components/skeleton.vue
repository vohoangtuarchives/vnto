<template>
  <template v-if="this.parseBoolean(isTable)">
    <tbody v-if="wrap">
      <tr v-for="i in parseInt(rows)" :key="i" :class="getClass">
        <td v-for="j in parseInt(cols)" :key="j">
          <PuSkeleton :height="height + 'px'" />
        </td>
      </tr>
    </tbody>
    <template v-else>
      <tr v-for="i in parseInt(rows)" :key="i">
        <td v-for="j in parseInt(cols)" :key="j">
          <PuSkeleton :height="height + 'px'" />
        </td>
      </tr>
    </template>
  </template>
  <template v-else>
    <div v-for="i in parseInt(rows)" :key="i" :class="getClass">
      
        <PuSkeleton :height="height + 'px'" />
    
    </div>
  </template>
</template>

<script>
export default {
  mounted() {
    console.log(typeof(this.parseBoolean(this.isTable)));
  },
  computed: {
    getClass() {
      return this.class;
    }
  },
  props: {
    class:{
      type:String,
      required:false,
    },
    rows: {
      type: Number,
      required: false,
      default:1
    },
    cols: {
      type: Number,
      required: false,
      default:1
    },
    height: {
      type: String,
      required: true,
    },
    isTable:{
      type:Boolean,
      default:true
    },
    wrap:{
      type:Boolean,
      default:true
    }
  },
};
</script>

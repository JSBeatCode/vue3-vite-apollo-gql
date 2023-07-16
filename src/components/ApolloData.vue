<script>
import { computed, onMounted, onUpdated, ref, reactive } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ApolloDataMutationAdd from './ApolloDataMutationAdd.vue';

export default {
  name: 'ApolloData',
  components: {
    ApolloDataMutationAdd
  },
  setup () {
    // const customersRef = ref([]);
    const customersReactive = reactive([]);
    const QUERY = gql`
      query GetCustomers {
              getCustomers {
                  age
                  email
                  id
                  name
              }
        }
  `
    // const { result, loading, error } = useQuery(QUERY)

    onUpdated(() => {
      console.log("state의 변화가 있을 때마다 updated")
    })

    onMounted(() => {
      useQuery(QUERY).onResult((res) => {
        if (res.data?.getCustomers) {
          console.log('res: ', res.data.getCustomers);
          // customersRef.value = res.data.getCustomers;
          customersReactive.push(...res.data.getCustomers);
          // console.log('jsdno0 debug6-1', typeof customersRef.value)
          // console.log('jsdno0 debug6-2', customersRef.value)
        }
      })
    })

    const funcAdd = (val) => {
      // const refList = customersRef.value;
      // refList.push(val);
      // customersRef.value = refList;

      customersReactive.push(val);
    }

    return {
        // customersRef,
        customersReactive,
        // result,
        // loading,
        onMounted,
        onUpdated,
        funcAdd
    }
  },
}
</script>

<template>

  <div v-if="loading">Loading...</div>

  <div v-else-if="error">Error: {{ error.message }}</div>

  <ul v-else-if="customersRef">
        <li v-for="user of customersRef" :key="user.id">
            {{ user.id }} {{ user.name }}
        </li>
    </ul>

    <div v-if="customersReactive">
      <ul>
        <li v-for="user of customersReactive" :key="user.id">
          {{ user.id }} {{ user.name }}
        </li>
      </ul>
    </div>

    <ApolloDataMutationAdd 
      @funcAdd="funcAdd"
    />
</template>
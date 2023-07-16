<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

export default {
  setup() {
    const { result, loading, error, subscribeToMore } = useQuery(gql`
      query GetCustomers {
        getCustomers {
          age
          email
          id
          name
        }
      }
    `);

    const customers = ref([]);

    const handleSubscription = () => {
        console.log('jsdno0 debug1-1')
      subscribeToMore({
        document: gql`
          subscription OnCustomerAdded {
            customerAdded {
              age
              email
              id
              name
            }
          }
        `,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const newCustomer = subscriptionData.data.customerAdded;
          customers.value = [...customers.value, newCustomer];
        },
      });
    };

    onUpdated(() => {
      console.log('jsdno0 debug3-1', 'onupdated')
    })

    onMounted(() => {
      console.log('jsdno0 debug1-1')
      customers.value = result.value?.getCustomers ?? [];
      handleSubscription();
    });

    onUnmounted(() => {
      // Unsubscribe from the subscription
      subscription.unsubscribe();
    });

    return {
      customers,
      result,
      loading,
      error,
    };
  },
};
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <!-- <ul v-else>
      <li v-for="customer in customers" :key="customer.id">
        {{ customer.id }} {{ customer.name }}
      </li>
    </ul> -->
    <ul v-else-if="result && result.getCustomers">
        <li v-for="user of result.getCustomers" :key="user.id">
            {{ user.id }} {{ user.name }}
        </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  setup () {
    const text = ref('')

    const { mutate: sendMessage } = useMutation(gql`
      mutation sendMessage ($text: String!) {
        sendMessage (text: $text) {
          id
        }
      }
    `, () => ({
      variables: {
        text: text.value,
      },
    }))

    return {
      text,
      sendMessage,
    }
  },
}
</script>

<template>
  <div>
    <input v-model="text" placeholder="Enter a message">

    <button @click="sendMessage()">
      Send message
    </button>
  </div>
</template>
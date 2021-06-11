<template>
  <div class='chat-container'>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showEdition="true"
      :showDeletion="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage" />
  </div>
</template>

<script>
export default {
  name: 'ChatHub',
  data() {
    return {
      websocket: null,

      participants: [
        {
          id: 'user1',
          name: 'Matteo',
          imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
        },
        {
          id: 'user2',
          name: 'Support',
          imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
        { type: 'text', author: 'me', data: { text: 'Say yes!' } },
        { type: 'text', author: 'user1', data: { text: 'No.' } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  created() {
    this.initWebSocket()
  },
  destroyed() {
    if (this.websocket) {
      this.websocket.close();
    }
  },
  methods: {
    initWebSocket () {
      const wsuri = 'ws://127.0.0.1:8080'
      this.websocket = new WebSocket(wsuri)

      this.websocket.onmessage = this.onReceiveMessage
      this.websocket.onopen = this.onWebsocketOpen
      this.websocket.onerror = this.onWebsocketError
      this.websocket.onclose = this.onWebsocketClose
    },
    onWebsocketOpen (event) {
      // TODO web socket open
    },
    onWebsocketError (event) {
      // TODO web socket error
    },
    onWebsocketClose (event) {
      // TODO web socket close
    },
    onReceiveMessage (event) {
      // If the chat windows is shut
      // assert that there comes a new message
      this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
      const msg = JSON.parse(event.data)
      this.messageList.push(msg)
    },
    // sendMessage (text) {
    //   if (text.length > 0) {
    //     this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
    //     this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
    //   }
    // },
    onMessageWasSent (message) {
      // TODO Handle message send
    },
    openChat () {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      this.isChatOpen = false
    },
    handleScrollToTop () {
    },
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  }
}
</script>

<style type='scss' scoped>
.chat-container {
}
</style>

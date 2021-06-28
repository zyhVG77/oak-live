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
      :messageStyling="messageStyling" />
  </div>
</template>

<script>
/* eslint-disable dot-notation */

// eslint-disable-next-line no-unused-vars
import { Client, Message } from '@stomp/stompjs';

export default {
  name: 'ChatHub',
  data() {
    return {
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [],
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
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
      },
      alwaysScrollToBottom: false,
      messageStyling: true,

      // STOMP
      stompClient: null
    }
  },
  computed: {
    participants() {
      const tmp = []
      tmp.push({
        id: 'System',
        name: 'System'
      })
      const parts = this.$store.getters['participants']
      parts.forEach(p => {
        tmp.push({
          id: p.uid,
          name: p.account.username,
          imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        })
      });
      return tmp
    },
    currentUser() {
      return this.$store.getters['user/currentUser']
    },
    currentMeeting() {
      return this.$store.getters['meeting']
    }
  },
  created() {
    this.initStompClient()
  },
  destroyed() {
    this.stompClient.deactivate();
  },
  methods: {
    initStompClient () {
      const token = this.$store.state.user.token

      const client = new Client({
        brokerURL: 'ws://localhost:8803/ws',
        connectHeaders: {
          Authentication: token
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });
      client.onConnect = this.onStompConnect
      client.onStompError = this.onStompError
      client.activate()
      this.stompClient = client
    },
    onStompConnect (frame) {
      this.stompClient.subscribe('/topic/broadcast', this.onMessageReceived)
    },
    onStompError (frame) {
      console.log(frame)
    },
    onMessageReceived (message) {
      const body = JSON.parse(message.body);
      console.log(body)

      this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1

      const type = body.type
      var displayWrapper = null
      // Handle Special Messages
      if (type === 'system-message') {
        displayWrapper = {
          type: 'text',
          author: 'System',
          data: { text: '【系统消息】' + body.content }
        }
        // Update Partipants List
        this.$store.dispatch('updateParticipants')
          .then(() => console.log('Update Participants List Successfully!'))
      } else {
        displayWrapper = {
          type: 'text',
          author: body.sender.name,
          data: { text: '【' + body.sender.account.username + '】' + body.content }
        }
      }

      if (body.sender && body.sender.name === this.currentUser.name) {
        displayWrapper.author = 'me'
      }
      this.messageList.push(displayWrapper)
    },
    onMessageWasSent (message) {
      const messageWrapper = {
        type: message.type,
        content: message.data.text,
        meetingId: this.currentMeeting.uid,
        sender: this.currentUser
      }
      this.stompClient.publish({ destination: '/app/chat', body: JSON.stringify(messageWrapper) });
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
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  }
}
</script>

<style type='scss' scoped>
</style>

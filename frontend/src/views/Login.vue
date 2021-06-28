<template>
  <div class="login-card">
    <md-dialog-alert
      :md-active.sync="hint.show"
      :md-content="hint.message"
      md-confirm-text="确认" />

    <form novalidate class="md-layout md-alignment-center-center" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">会议直播平台</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('username')">
                <label for="username">用户名</label>
                <md-input name="username" id="username" autocomplete="given-name" v-model="form.username" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.username.required">请输入用户名</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getValidationClass('password')">
            <label for="password">密码</label>
            <md-input v-model="form.password" type="password" id="password" autocomplete="password" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.password.required">请输入密码</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">登录</md-button>
          <router-link to='/register'>去注册</router-link>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength
  // email,
  // maxLength
} from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  mixins: [validationMixin],
  data: () => ({
    form: {
      username: null,
      password: null
    },
    sending: false,
    hint: {
      show: false,
      message: ''
    }
  }),
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    clearForm () {
      this.$v.$reset()
      this.form.password = null
    },
    login () {
      this.sending = true
      this.$store.dispatch('user/login', this.form)
        .then(() => {
          this.sending = false
          this.$router.push({ path: '/navigation' })
        })
        .catch(err => {
          this.sending = false
          this.hint.message = err
          this.hint.show = true
          this.form.password = null
        })
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.login()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-card {
  margin-top: 4rem;
}
</style>

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
                <md-input name="username" id="username" v-model="form.username" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.username.required">请输入用户名</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getValidationClass('password')">
            <label for="password">密码</label>
            <md-input v-model="form.password" type="password" id="password" autocomplete="password" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.password.required">请输入密码</span>
          </md-field>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('firstName')">
                <label for="name">姓名</label>
                <md-input name="name" id="name" autocomplete="name" v-model="form.name" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.name.required">请输入姓名</span>
                <span class="md-error" v-else-if="!$v.form.name.minlength">姓名不符合规范</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('gender')">
                <label for="gender">Gender</label>
                <md-select name="gender" id="gender" v-model="form.gender" md-dense :disabled="sending">
                  <md-option></md-option>
                  <md-option value="M">男</md-option>
                  <md-option value="F">女</md-option>
                </md-select>
                <span class="md-error">请选择性别</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('email')">
                <label for="email">Email</label>
                <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.email.required">请输入邮件地址</span>
                <span class="md-error" v-else-if="!$v.form.email.email">邮件不符合规范</span>
              </md-field>
            </div>
          </div>

        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">注册</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  email
  // maxLength
} from 'vuelidate/lib/validators'

export default {
  name: 'Register',
  mixins: [validationMixin],
  data: () => ({
    form: {
      username: null,
      name: null,
      password: null,
      gender: 'M'
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
      },
      gender: {
        required
      },
      email: {
        required,
        email
      },
      name: {
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
    register () {
      this.sending = true
      setTimeout(() => {
        this.$router.push({ path: '/login '})
      }, 800);
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.register()
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

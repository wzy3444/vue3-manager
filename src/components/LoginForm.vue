<template>
 <!-- ref属性，标记表单用于提交的时候识别表单整体 -->
 <el-form 
        ref="loginForm"
        label-width="100px"
        class="loginForm sign-in-form"
        :model='loginUser'
        :rules="rules"
        :label-position="left"
    >
        <el-form-item label="邮箱"  prop="email">
            <el-input 
                v-model="loginUser.email"
            placeholder="请输入邮箱" 
            ></el-input>
        </el-form-item>
        
        <el-form-item label="密码"  prop="password">
            <el-input 
                v-model="loginUser.password"
                type = "password"
            placeholder="请输入密码" 
            ></el-input>
        </el-form-item>

        <!-- 提交表单这里写表名，不带引号，在下面通过实例化FormInstance将整个登陆表变成表单的形式，
        再自动传递给提交方法 -->
        <el-form-item>
            <el-button type="primary" class="submit-btn" 
                @click="handleLogin(loginForm)"
                >提交</el-button
            >
        </el-form-item>

        <div class="tiparea">
            <p>忘记密码？  <a>立即找回</a> </p>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import {ref} from "vue";
import { useLogin } from "@/composables/UseLogin"
import { left } from "@popperjs/core";
import type { FormInstance } from 'element-plus'

const {loginUser,rules,handleLogin } = useLogin();
const loginForm = ref<FormInstance>()
</script>

<style scoped>
.submit-btn {
  width: 100%;
}

/*初始登录样式*/
.loginForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
} 

.tiparea{
    text-align: right;
    font-size: 12px;
    color: #333;
}

.tiparea p a {
    color: #409eff;
}
</style>
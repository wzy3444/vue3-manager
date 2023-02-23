<template>
 <el-form 
        ref="registerForm"
        label-width="100px"
        class="registerForm sign-up-form"
        :model='registerUser'
        :rules="rules"
        :label-position="left"
    >
        <el-form-item label="用户名"  prop="username">
            <el-input 
                v-model="registerUser.username"
            placeholder="请输入用户名" 
            ></el-input>
        </el-form-item>

        <el-form-item label="邮箱"  prop="email">
            <el-input 
                v-model="registerUser.email"
            placeholder="请输入邮箱" 
            ></el-input>
        </el-form-item>
        
        <el-form-item label="密码"  prop="password">
            <el-input 
                v-model="registerUser.password"
                type = "password"
            placeholder="请输入密码" 
            ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="check">
            <el-input 
                v-model="registerUser.check"
                type = "password"
            placeholder="请再次输入密码" 
            ></el-input>
        </el-form-item>
       
        <el-form-item label="选择身份">
            <el-select
                v-model="registerUser.role"
                placeholder="请选择身份"
            >
                <el-option label="管理员" value="admin"></el-option>
                <el-option label="用户" value="user"></el-option>
                 <el-option label="游客" value="visitor"></el-option>
            </el-select>
        </el-form-item>

        <!-- 提交表单这里写表名，不带引号，在下面通过实例化FormInstance将整个登陆表变成表单的形式，
        再自动传递给提交方法 -->
        <el-form-item>
            <el-button type="primary" class="submit-btn" 
                @click="handleRegister(registerForm)"
                >提交</el-button
            >
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import {  ref } from 'vue'
import { useRegister } from "@/composables/UseRegister"
import type { FormInstance } from 'element-plus'
import { left } from "@popperjs/core";

const {registerUser,handleRegister,rules} = useRegister();
const registerForm = ref<FormInstance>()
console.log(registerForm)

</script>

<style scoped>
.submit-btn {
  width: 100%;
}

/*初始登录样式*/
.registerForm {
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
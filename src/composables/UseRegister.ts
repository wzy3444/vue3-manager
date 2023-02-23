import { checkCompatEnabled } from "@vue/compiler-core";
import { ref } from "vue";
import { ElMessage, FormInstance } from 'element-plus'


const registerUser = ref<User>({
    role:"",
    email: "",
    password: "",
    check:"",
  })

export const useRegister =() => {
    
    //这个写法是固定的，用value映射绑定组件的值
    const validateCheck = (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('Please input the password'))
        } else {
          if(value.length<6 || value.length>30){
            callback(new Error('密码长度必须在6-30之间'))
          }  
          if ( value != registerUser.value.password ) {
            callback(new Error('两次输入的密码不一致'))
          }

        }
        callback()
      }

    const rules =ref({
        name: [
            {
              message: "用户名不能为空...",
              required: true,
              trigger: "blur",
            },
            {
              min: 2,
              max: 30,
              message: "长度在2到30个字符",
              trigger: "blur",
            },
          ],

        email: [{ 
        type:"email", //要求为email格式
        message:"Email is incorrect!", //提示信息
        required:true, //要求是否必填
        trigger: 'blur' //触发时间，这里为离开输入框
        }],
       
        password: [
            { 
            required:true, 
            message:"Password could not be empty...",
            trigger: 'blur'
           },
           {
            min:6,
            max:30,
            message:"Password's length has to be 6 to 30 characters",
            trigger:'blur'
           }//定义第二个规则
       
       ],
       
       check: [
        //这里的验证存在优先级的问题，比如当密码少于六位且与输入的密码不一致时，如果采用分开定义两个规则
        // 验证的话，会只提示密码不一致，存在逻辑交集的时候，要用验证器写到一起
        { 
        required:true, 
        message:"Password could not be empty...",
        trigger: 'blur'
       },
       {
        validator:validateCheck,
        trigger:'blur'
       },//定义第二个规则
       ]


    });

    const handleRegister = async (formEl:FormInstance | undefined) =>{
        if (!formEl) return
        formEl.validate((valid) => {
          if (valid) {
            ElMessage('注册成功!')
          } else {
            ElMessage('注册失败，请检查填写内容!')
            return false
          }
        })
    }


        return { 
          registerUser,
          rules,
          handleRegister,
        };
}
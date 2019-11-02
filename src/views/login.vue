<template>
    <div id="b" >
    <div id="a" class="login">
        <el-form style="width: 500px;" :model="form" :rules="rules" ref="form">
            <el-form-item label="用户名" prop="names">
                <el-input v-model="form.names"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitHandle">立即登录</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    </div>
</template>

<script>
    import {SUCCESS,FAIL,HOSTNAME} from "../config/base";

    export default {
        name: "Login",
        data() {
            return {
                form: {
                    names: '',
                    password: ''
                },
                rules: {
                    names: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ],
                    password:[
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            submitHandle(){
                fetch(HOSTNAME+'/admin/login/index',{
                    method:"POST",
                    body:JSON.stringify(this.form),
                    headers:{
                        'Content-type':"application/json"
                    }
                })
                    .then(res=>res.json())
                    .then(data=>{
                       if(data.code==SUCCESS){
                           let redirect=this.$route.query.redirect||'mains';
                           this.$message.success(data.msg);
                           sessionStorage.token=data.data.token;
                           sessionStorage.names=data.data.names;

                           this.$router.push({name:redirect})
                       }else if(data.code==FAIL) {
                           this.$message.error(data.msg)
                       }

                    })
            }
        }
    }
</script>
<style>
    /*#app{*/
    /*position: absolute;*/
    /*top: 50%;*/
    /*left: 50%;*/
    /*transform: translate(-50%,-50%);*/
    /*}*/
    /*.el-input__inner{*/
    /*width: 300px;*/
    /*}*/
</style>
<style scoped lang="scss">
    body{
        background-image: url(../public/img/2.jpg);
    }

    $width:500px;
    $background:#ff6700;
    @mixin centerMid{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .login{
        width: $width;
        height: auto;
        @include centerMid;
    }
    #a{
        width: 500px;
        height: 300px;
        border-radius: 10px;
        padding: 25px;
        background:rgba(128,118,105,0.4) ;
    }
    #b{
        background-image: url(../public/img/1.jpg) ;

        background-repeat: no-repeat;
        background-size: cover;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

    }


</style>
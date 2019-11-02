<template>
    <div>
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>添加分类</el-breadcrumb-item>

            </el-breadcrumb>
            <el-divider></el-divider>
        </div>
        <el-form :model="form" ref="form" label-width="80px" :rules="rules" >
            <el-form-item label="分类名字"  prop="cname">
                <el-input prefix-icon="el-icon-user-solid
"  v-model="form.cname" placeholder="cname" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="分类图片"  prop="thumb">
              <el-upload :action="uploadurl" :on-success="uploadSuccess"
            v-model="form.thumb"

              >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="分类排序" prop="sort">
                <el-input prefix-icon="el-icon-loading
" v-model="form.sort" placeholder="sort" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submit">提交</el-button>

            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {SUCCESS,FAIL,TOKENFAIL,IMGHOSTNAME} from "../../config/base";

    export default {

        name: "insert",
        data: function () {
            return {
                uploadurl:'http://localhost/fruit-end/public/index.php/api/upload',
                imageUrl:'',

                form: {

                    cname: "",
                    thumb: "",
                   sort:"",


                },

                rules: {
                    cname: [
                        {required: true, message: '请输入分类名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    thumb: [
                        {required: true, message: '请输入图片', trigger: 'blur'},

                    ],
                    sort: [
                        {required: true, message: '请输入排序', trigger: 'change'}

                    ],



                }

            }
        },
        methods: {
            uploadSuccess(res){
                this.imageUrl=IMGHOSTNAME+res.src;
                this.form.thumb=res.src;
                console.log(res);


            },

            submit() {
                let token =sessionStorage.getItem('token');
                fetch('http://localhost/fruit-end/public/index.php/api/category',{
                    method:"POST",
                    body:JSON.stringify(this.form),
                    headers:{
                        'Content-type':"application/json",
                        'token':token,
                    }
                })
                    .then(res=>res.json())
                    .then(data=>{
                        let{code,msg}=data;
                        if(code==TOKENFAIL){
                            this.$message({
                                type:"waring",
                                message:msg
                            })
                        }
                        if(data.code==SUCCESS){
                            this.$message.success(data.msg);
                            this.$refs['form'].resetFields();
                        }else if(data.code==FAIL) {

                            this.$message.error(data.msg)
                        }

                    })
            },

        }
    }
</script>

<style >
     .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-form{
        width: 500px;
    }
</style>
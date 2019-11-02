<template>
    <div>

        <!--面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>编辑分类</el-breadcrumb-item>

        </el-breadcrumb>

        <!--横线-->
        <el-divider></el-divider>

        <!--主体内容-->
        <el-form label-width="80px" v-model="form">


            <el-form-item label="分类名称">
                <el-input placeholder="分类名称" v-model="form.cname">
                    <i slot="prefix" class="el-icon-user-solid"></i>
                </el-input>
            </el-form-item>

            <el-form-item label="缩略图">

                <el-upload :action="uploadurl" :on-success="uploadSuccess">

                    <img width="150" v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                </el-upload>


            </el-form-item>

            <el-form-item label="分类排序">
                <el-input placeholder="分类排序" v-model="form.sort">
                    <i slot="prefix" class="el-icon-s-check"></i>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit('form')">提交</el-button>
            </el-form-item>

        </el-form>


    </div>

</template>

<script>
    import {SUCCESS, FAIL, HOSTNAME, IMGHOSTNAME} from "../../config/base";

    export default {
        name: "categoryedit",
        data() {
            return {
                uploadurl: HOSTNAME + '/api/upload',
                imageUrl: '',
                form: {
                    cname: '',
                    thumb: '',
                    sort: '',
                },

            }
        },
        methods: {
            uploadSuccess(res) {
                this.imageUrl = IMGHOSTNAME + res.src;
                this.form.thumb = res.src;
            },
            updateForm(id) {
                fetch(HOSTNAME + '/api/category/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code == SUCCESS) {
                            this.$message.success(data.msg);
                            this.form = data.data;
                            this.imageUrl = IMGHOSTNAME + data.data.thumb;
                        } else if (data.code == FAIL) {
                            this.$message.error(data.msg)
                        }
                    })

            },
            submit() {
                console.log(this.form);
                let id = this.$route.query.id;
                let formdata = this.form;
                console.log(formdata);
                fetch(HOSTNAME + '/api/category/' + id,{
                    method:'PUT',
                    body: JSON.stringify(formdata),
                    headers:{
                        'Content-Type':'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }).then(res=>res.json()).then(data=>{
                    if (data.code == 200){
                        this.$message.success(data.msg)
                    } else {
                        this.$message.error(data.msg)

                    }
                })
            }

        },
        beforeMount() {
            this.id = this.$route.query.id;
            this.updateForm(this.id);
        }
    }
</script>

<style scoped>

</style>
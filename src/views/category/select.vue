<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看分类</el-breadcrumb-item>
        <el-table :data="form" style="width: 100%">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="cname" label="姓名"></el-table-column>
            <el-table-column prop="thumb" label="缩略图">
                <template slot-scope="scope"
                >
                    <img :src="imgHost+scope.row.thumb" alt="" :title="scope.row.cname" width="150">
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column prop="update_time" label="更新时间"></el-table-column>
            <el-table-column width="200" label="操作">
                <template slot-scope="scope"
                >
                <router-link :to="{name:'cateedit',query:{id:scope.row.id}}" tag="el-button">编辑</router-link>
                <el-button @click="deleteCate(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>


        </el-table>
    </el-breadcrumb>
</template>

<script>
    import {HOSTNAME,IMGHOSTNAME} from "../../config/base";

    export default {
        name: "query",
        data() {
            return {
                form: [],
                imgHost:IMGHOSTNAME
            }
        },
        methods: {
         deleteCate(id){
             let token=sessionStorage.getItem('token');
             fetch(HOSTNAME + '/api/category/'+id,{
                 method:"DELETE",
                 headers:{
                     'token':token
                 }
             }).then(res=>res.json())
                 .then(data=>{
                     if(data.code==200) {
                         this.$message.success(data.msg);
                         this.form = this.form.filter(ele=>ele.id!=id);
                     }
                 })


         },
            getForm() {
                fetch(HOSTNAME + '/api/category', {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }).then(res => res.json())
                    .then(data => {
                        if (data.code == 200) {

                            this.form = data.data
                        } else if (data.code == 404) {
                            this.$message.error(data.msg)
                        }
                    })
            }
        },
        beforeMount() {
            this.getForm()
        }

    }
</script>

<style scoped>

</style>